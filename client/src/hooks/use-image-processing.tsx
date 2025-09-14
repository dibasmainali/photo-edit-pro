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

      // Convert to desired format and quality
      const mimeType = `image/${settings.format}`;
      const quality = settings.format === 'jpeg' ? settings.quality / 100 : undefined;
      
      const processedDataUrl = canvas.toDataURL(mimeType, quality);
      
      // Calculate processed size (approximate)
      const base64Data = processedDataUrl.split(',')[1];
      const processedSize = Math.round((base64Data.length * 3) / 4);

      setImageData(prev => prev ? {
        ...prev,
        processedDataUrl,
        processedSize,
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
      // Process with default settings
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow state to update
      processImage(data.settings);
    } catch (error) {
      console.error('Error loading image:', error);
    } finally {
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
  };
}
