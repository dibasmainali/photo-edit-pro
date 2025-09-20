import { useState, useCallback, useRef, useEffect } from "react";

export interface ImageSettings {
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface ProcessedImageData {
  originalFile: File;
  originalSize: number;
  processedSize?: number;
  originalDataUrl: string;
  processedDataUrl?: string;
  settings: ImageSettings;
}

const defaultSettings: ImageSettings = {
  quality: 80,
  format: 'jpeg',
  brightness: 0,
  contrast: 0,
  saturation: 0,
};

export function useImageProcessing() {
  const [imageData, setImageData] = useState<ProcessedImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check WebP support
  const checkWebPSupport = useCallback((): boolean => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, []);

  // Initialize canvases
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    if (!originalCanvasRef.current) {
      originalCanvasRef.current = document.createElement('canvas');
    }
  }, []);

  const loadImage = useCallback(async (file: File): Promise<ProcessedImageData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const originalDataUrl = e.target?.result as string;
          
          // Store original image in canvas for processing
          if (originalCanvasRef.current) {
            const ctx = originalCanvasRef.current.getContext('2d');
            if (ctx) {
              originalCanvasRef.current.width = img.width;
              originalCanvasRef.current.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
          }
          
          resolve({
            originalFile: file,
            originalSize: file.size,
            originalDataUrl,
            settings: { ...defaultSettings },
          });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const applyFilters = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, settings: ImageSettings) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const brightnessValue = settings.brightness * 2.55; // Convert to 0-255 range
    const contrastValue = (settings.contrast + 100) / 100; // Convert to multiplier
    const saturationValue = (settings.saturation + 100) / 100; // Convert to multiplier

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Apply brightness
      let newR = r + brightnessValue;
      let newG = g + brightnessValue;
      let newB = b + brightnessValue;

      // Apply contrast
      newR = ((newR - 128) * contrastValue) + 128;
      newG = ((newG - 128) * contrastValue) + 128;
      newB = ((newB - 128) * contrastValue) + 128;

      // Apply saturation
      const gray = 0.299 * newR + 0.587 * newG + 0.114 * newB;
      newR = gray + (newR - gray) * saturationValue;
      newG = gray + (newG - gray) * saturationValue;
      newB = gray + (newB - gray) * saturationValue;

      // Clamp values to 0-255 range
      data[i] = Math.max(0, Math.min(255, newR));
      data[i + 1] = Math.max(0, Math.min(255, newG));
      data[i + 2] = Math.max(0, Math.min(255, newB));
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const processImage = useCallback(async (settings: ImageSettings) => {
    if (!imageData || !canvasRef.current || !originalCanvasRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const originalCanvas = originalCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const originalCtx = originalCanvas.getContext('2d');

      if (!ctx || !originalCtx) return;

      // Copy original image to processing canvas
      canvas.width = originalCanvas.width;
      canvas.height = originalCanvas.height;
      ctx.drawImage(originalCanvas, 0, 0);

      // Apply filters
      applyFilters(canvas, ctx, settings);

      // Convert to desired format with smart compression
      const mimeType = `image/${settings.format}`;

      const encodeWithQuality = (q?: number): { url: string; size: number } => {
        try {
          const url = canvas.toDataURL(mimeType, q);
          // Check if the browser actually supports the format
          if (url.startsWith('data:image/png') && settings.format !== 'png') {
            // Browser doesn't support the format, fallback to PNG
            console.warn(`Browser doesn't support ${settings.format}, falling back to PNG`);
            const fallbackUrl = canvas.toDataURL('image/png');
            const base64 = fallbackUrl.split(',')[1] || '';
            const size = Math.round((base64.length * 3) / 4);
            return { url: fallbackUrl, size };
          }
          const base64 = url.split(',')[1] || '';
          const size = Math.round((base64.length * 3) / 4);
          return { url, size };
        } catch (error) {
          console.error('Error encoding image:', error);
          // Fallback to PNG if there's an error
          const fallbackUrl = canvas.toDataURL('image/png');
          const base64 = fallbackUrl.split(',')[1] || '';
          const size = Math.round((base64.length * 3) / 4);
          return { url: fallbackUrl, size };
        }
      };

      let targetUrl = '';
      let targetSize = 0;

      if (settings.format === 'jpeg') {
        // JPEG compression with quality control
        const quality = settings.quality / 100;
        const result = encodeWithQuality(quality);
        targetUrl = result.url;
        targetSize = result.size;
      } else if (settings.format === 'webp') {
        // WebP compression with quality control
        if (checkWebPSupport()) {
          const quality = settings.quality / 100;
          const result = encodeWithQuality(quality);
          targetUrl = result.url;
          targetSize = result.size;
        } else {
          // Fallback to JPEG if WebP is not supported
          console.warn('WebP not supported, falling back to JPEG');
          const quality = settings.quality / 100;
          const result = encodeWithQuality(quality);
          targetUrl = result.url;
          targetSize = result.size;
        }
      } else if (settings.format === 'png') {
        // PNG compression through optimization and potential resizing
        // PNG is lossless, so we use quality as a compression factor (0-100)
        const compressionFactor = settings.quality / 100;
        console.log('PNG compression - Quality:', settings.quality, 'Factor:', compressionFactor);
        
        // Use a more aggressive compression formula for PNG
        const scaleFactor = Math.max(0.3, compressionFactor * 0.8); // Ensure minimum 30% of original size
        
        if (compressionFactor < 0.95) { // More aggressive threshold for PNG compression
          // Create a smaller canvas for compression
          const originalWidth = canvas.width;
          const originalHeight = canvas.height;
          const newWidth = Math.round(originalWidth * scaleFactor);
          const newHeight = Math.round(originalHeight * scaleFactor);
          
          // Create temporary canvas for resizing
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            
            // Use high-quality scaling
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            
            // Draw resized image
            tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
            
            const result = {
              url: tempCanvas.toDataURL('image/png'),
              size: Math.round((tempCanvas.toDataURL('image/png').split(',')[1] || '').length * 3 / 4)
            };
            
            console.log('PNG compression result:', {
              originalSize: imageData?.originalSize,
              newSize: result.size,
              originalDimensions: `${originalWidth}x${originalHeight}`,
              newDimensions: `${newWidth}x${newHeight}`,
              scaleFactor: scaleFactor.toFixed(2),
              compressionRatio: imageData?.originalSize ? ((imageData.originalSize - result.size) / imageData.originalSize * 100).toFixed(1) + '%' : 'N/A'
            });
            
            targetUrl = result.url;
            targetSize = result.size;
          } else {
            // Fallback to original if temp canvas fails
            const result = encodeWithQuality(undefined);
            targetUrl = result.url;
            targetSize = result.size;
          }
        } else {
          // No compression needed, use original size
          const result = encodeWithQuality(undefined);
          targetUrl = result.url;
          targetSize = result.size;
        }
      }

      setImageData(prev => prev ? {
        ...prev,
        processedDataUrl: targetUrl,
        processedSize: targetSize,
        settings,
      } : null);

    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [imageData, applyFilters]);

  const uploadImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await loadImage(file);
      setImageData(data);
      // Process with default settings after a short delay to ensure state is updated
      setTimeout(() => {
        processImage(data.settings);
      }, 50);
    } catch (error) {
      console.error('Error loading image:', error);
      setIsProcessing(false);
    }
  }, [loadImage, processImage]);

  const updateSettings = useCallback((newSettings: Partial<ImageSettings>) => {
    if (imageData) {
      const updatedSettings = { ...imageData.settings, ...newSettings };
      processImage(updatedSettings);
    }
  }, [imageData, processImage]);

  const downloadProcessedImage = useCallback((filename?: string) => {
    if (!imageData?.processedDataUrl) return;

    const link = document.createElement('a');
    link.href = imageData.processedDataUrl;
    link.download = filename || `processed_${imageData.originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageData]);

  const reset = useCallback(() => {
    setImageData(null);
    setIsProcessing(false);
  }, []);

  const getCompressionRatio = useCallback(() => {
    if (!imageData?.processedSize || !imageData.originalSize) return 0;
    return Math.round(((imageData.originalSize - imageData.processedSize) / imageData.originalSize) * 100);
  }, [imageData]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  return {
    imageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    getCompressionRatio,
    formatFileSize,
    checkWebPSupport,
  };
}
