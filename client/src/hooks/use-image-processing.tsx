import { useState, useCallback, useRef, useEffect } from "react";
import { formatFileSize } from "@/lib/image-utils";
import { orientation as readExifOrientation } from "exifr";

// EXIF Orientation values:
// 1 = normal, 2 = flip horizontal, 3 = rotate 180, 4 = flip vertical
// 5 = transpose, 6 = rotate 90 CW, 7 = transverse, 8 = rotate 90 CCW
async function getOrientation(file: File): Promise<number> {
  try {
    return (await readExifOrientation(file)) || 1;
  } catch (error) {
    console.warn("Could not read image orientation; using the default orientation.", error);
    return 1;
  }
}
export interface ImageSettings {
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface ResizeSettings {
  mode: 'percentage' | 'dimensions' | 'social';
  percentage?: number;
  width?: number;
  height?: number;
  maintainAspect?: boolean;
  socialPreset?: string;
  customName?: string;
}

export interface ProcessedImageData {
  originalFile: File;
  originalSize: number;
  processedSize?: number;
  originalDataUrl: string;
  processedDataUrl?: string;
  settings: ImageSettings;
  orientation: number;
  originalWidth: number;
  originalHeight: number;
}

export const defaultSettings: ImageSettings = {
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
  }, []);

  const loadImage = useCallback(async (file: File): Promise<ProcessedImageData> => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const originalDataUrl = e.target?.result as string;
          
          // Read EXIF orientation
          const orientation = await getOrientation(file);
          
          // Calculate corrected dimensions for the oriented image
          let orientedWidth = img.width;
          let orientedHeight = img.height;
          if (orientation >= 5 && orientation <= 8) {
            orientedWidth = img.height;
            orientedHeight = img.width;
          }
          
          resolve({
            originalFile: file,
            originalSize: file.size,
            originalDataUrl,
            settings: { ...defaultSettings },
            orientation,
            originalWidth: orientedWidth,
            originalHeight: orientedHeight,
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

  const compressFile = useCallback(async (file: File, settings: ImageSettings): Promise<ProcessedImageData> => {
    const loaded = await loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('Could not create canvas context for compression');
    }

    canvas.width = loaded.originalWidth;
    canvas.height = loaded.originalHeight;

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image for batch compression'));
      img.src = loaded.originalDataUrl;
    });

    const orientation = loaded.orientation;
    let orientedWidth = image.width;
    let orientedHeight = image.height;
    if (orientation >= 5 && orientation <= 8) {
      orientedWidth = image.height;
      orientedHeight = image.width;
    }

    canvas.width = orientedWidth;
    canvas.height = orientedHeight;

    if (orientation > 1) {
      ctx.save();
      ctx.translate(orientedWidth / 2, orientedHeight / 2);

      switch (orientation) {
        case 2: ctx.scale(-1, 1); break;
        case 3: ctx.rotate(Math.PI); break;
        case 4: ctx.scale(1, -1); break;
        case 5: ctx.rotate(Math.PI / 2); ctx.scale(1, -1); break;
        case 6: ctx.rotate(Math.PI / 2); break;
        case 7: ctx.rotate(-Math.PI / 2); ctx.scale(1, -1); break;
        case 8: ctx.rotate(-Math.PI / 2); break;
      }

      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();
    } else {
      ctx.drawImage(image, 0, 0);
    }

    applyFilters(canvas, ctx, settings);

    const mimeType = `image/${settings.format}`;
    const encodeWithQuality = (q?: number): { url: string; size: number } => {
      try {
        const url = canvas.toDataURL(mimeType, q);
        if (url.startsWith('data:image/png') && settings.format !== 'png') {
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
        const fallbackUrl = canvas.toDataURL('image/png');
        const base64 = fallbackUrl.split(',')[1] || '';
        const size = Math.round((base64.length * 3) / 4);
        return { url: fallbackUrl, size };
      }
    };

    let targetUrl = '';
    let targetSize = 0;

    if (settings.format === 'jpeg') {
      const result = encodeWithQuality(settings.quality / 100);
      targetUrl = result.url;
      targetSize = result.size;
    } else if (settings.format === 'webp') {
      if (checkWebPSupport()) {
        const result = encodeWithQuality(settings.quality / 100);
        targetUrl = result.url;
        targetSize = result.size;
      } else {
        const result = canvas.toDataURL('image/jpeg', settings.quality / 100);
        const base64 = result.split(',')[1] || '';
        targetUrl = result;
        targetSize = Math.round((base64.length * 3) / 4);
      }
    } else if (settings.format === 'png') {
      const result = encodeWithQuality();
      targetUrl = result.url;
      targetSize = result.size;
    }

    return {
      originalFile: file,
      originalSize: file.size,
      processedDataUrl: targetUrl,
      processedSize: targetSize,
      originalDataUrl: loaded.originalDataUrl,
      settings: { ...settings },
      orientation: loaded.orientation,
      originalWidth: orientedWidth,
      originalHeight: orientedHeight,
    };
  }, [applyFilters, checkWebPSupport, loadImage]);

  const processImage = useCallback(async (settings: ImageSettings, sourceData: ProcessedImageData | null) => {
    if (!sourceData || !canvasRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = sourceData.originalDataUrl;
      });

      const orientation = sourceData.orientation;
      const orientedWidth = orientation >= 5 && orientation <= 8 ? image.height : image.width;
      const orientedHeight = orientation >= 5 && orientation <= 8 ? image.width : image.height;
      canvas.width = orientedWidth;
      canvas.height = orientedHeight;

      if (orientation > 1) {
        ctx.save();
        ctx.translate(orientedWidth / 2, orientedHeight / 2);

        switch (orientation) {
          case 2: ctx.scale(-1, 1); break;
          case 3: ctx.rotate(Math.PI); break;
          case 4: ctx.scale(1, -1); break;
          case 5: ctx.rotate(Math.PI / 2); ctx.scale(1, -1); break;
          case 6: ctx.rotate(Math.PI / 2); break;
          case 7: ctx.rotate(-Math.PI / 2); ctx.scale(1, -1); break;
          case 8: ctx.rotate(-Math.PI / 2); break;
        }

        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
      } else {
        ctx.drawImage(image, 0, 0);
      }

      // Apply filters
      applyFilters(canvas, ctx, settings);

      // Convert to desired format with smart compression
      const mimeType = `image/${settings.format}`;

      const encodeWithQuality = (q?: number): { url: string; size: number } => {
        try {
          const url = canvas.toDataURL(mimeType, q);
          if (url.startsWith('data:image/png') && settings.format !== 'png') {
            console.warn(`Browser doesn't support ${settings.format}, falling back to PNG`);
            if (q !== undefined && q < 1) {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              const levels = Math.max(2, Math.round(4 * q));
              for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.round(data[i] / 255 * (levels - 1)) / (levels - 1) * 255;
                data[i + 1] = Math.round(data[i + 1] / 255 * (levels - 1)) / (levels - 1) * 255;
                data[i + 2] = Math.round(data[i + 2] / 255 * (levels - 1)) / (levels - 1) * 255;
              }
              ctx.putImageData(imageData, 0, 0);
            }
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
          const fallbackUrl = canvas.toDataURL('image/png');
          const base64 = fallbackUrl.split(',')[1] || '';
          const size = Math.round((base64.length * 3) / 4);
          return { url: fallbackUrl, size };
        }
      };

      let targetUrl = '';
      let targetSize = 0;

      if (settings.format === 'jpeg') {
        const quality = settings.quality / 100;
        const result = encodeWithQuality(quality);
        targetUrl = result.url;
        targetSize = result.size;
      } else if (settings.format === 'webp') {
        if (checkWebPSupport()) {
          const quality = settings.quality / 100;
          const result = encodeWithQuality(quality);
          targetUrl = result.url;
          targetSize = result.size;
        } else {
          console.warn('WebP not supported, falling back to JPEG');
          const quality = settings.quality / 100;
          const result = canvas.toDataURL('image/jpeg', quality);
          const base64 = result.split(',')[1] || '';
          targetUrl = result;
          targetSize = Math.round((base64.length * 3) / 4);
        }
      } else if (settings.format === 'png') {
        const colorCount = Math.max(2, Math.round((settings.quality / 100) * 256));
        const result = encodeWithQuality(undefined);
        targetUrl = result.url;
        targetSize = result.size;

        if (settings.quality < 50 && colorCount < 256) {
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const levels = Math.max(2, Math.round(colorCount / 64));

            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.round(data[i] / 255 * (levels - 1)) / (levels - 1) * 255;
              data[i + 1] = Math.round(data[i + 1] / 255 * (levels - 1)) / (levels - 1) * 255;
              data[i + 2] = Math.round(data[i + 2] / 255 * (levels - 1)) / (levels - 1) * 255;
            }

            ctx.putImageData(imageData, 0, 0);
            const posterizedResult = encodeWithQuality(undefined);
            targetUrl = posterizedResult.url;
            targetSize = posterizedResult.size;
          } catch (e) {
            console.warn('PNG posterization failed, using standard compression');
          }
        }
      }

      setImageData(prev => prev?.originalFile === sourceData.originalFile ? {
        ...prev,
        processedDataUrl: targetUrl,
        processedSize: targetSize,
        settings,
      } : prev);

    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [applyFilters, checkWebPSupport]);

  const batchCompress = useCallback(async (
    files: File[],
    settings: ImageSettings,
    onProgress?: (completed: number, total: number) => void
  ): Promise<ProcessedImageData[]> => {
    const results: ProcessedImageData[] = [];

    setIsProcessing(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await compressFile(file, settings);
        results.push(processed);
        onProgress?.(i + 1, files.length);
      }
    } finally {
      setIsProcessing(false);
    }

    return results;
  }, [compressFile]);

  const uploadImage = useCallback(async (file: File, initialSettings: ImageSettings = defaultSettings) => {
    setIsProcessing(true);
    try {
      const loadedData = await loadImage(file);
      const data = { ...loadedData, settings: { ...initialSettings } };
      setImageData(data);
      // Process with default settings after a short delay to ensure state is updated
      setTimeout(() => {
        processImage(data.settings, data);
      }, 50);
    } catch (error) {
      console.error('Error loading image:', error);
      setIsProcessing(false);
    }
  }, [loadImage, processImage]);

  const updateSettings = useCallback((newSettings: Partial<ImageSettings>) => {
    if (imageData) {
      const updatedSettings = { ...imageData.settings, ...newSettings };
      processImage(updatedSettings, imageData);
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

  // Resize function for batch processing
  const resizeImage = useCallback(async (
    file: File,
    resizeSettings: ResizeSettings,
    outputFormat: 'jpeg' | 'png' | 'webp' = 'jpeg',
    quality = 90
  ): Promise<{ dataUrl: string; size: number; width: number; height: number; filename: string }> => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Read EXIF orientation
            const orientation = await getOrientation(file);
            
            // Calculate target dimensions based on ORIGINAL image dimensions
            let targetWidth = img.width;
            let targetHeight = img.height;
            
            if (resizeSettings.mode === 'percentage') {
              const pct = (resizeSettings.percentage || 100) / 100;
              targetWidth = Math.round(img.width * pct);
              targetHeight = Math.round(img.height * pct);
            } else if (resizeSettings.mode === 'dimensions') {
              if (resizeSettings.maintainAspect !== false) {
                // Maintain aspect ratio
                const aspectRatio = img.width / img.height;
                if (resizeSettings.width && resizeSettings.height) {
                  // Both specified - fit within bounds
                  const scaleX = resizeSettings.width / img.width;
                  const scaleY = resizeSettings.height / img.height;
                  const scale = Math.min(scaleX, scaleY);
                  targetWidth = Math.round(img.width * scale);
                  targetHeight = Math.round(img.height * scale);
                } else if (resizeSettings.width) {
                  targetWidth = resizeSettings.width;
                  targetHeight = Math.round(targetWidth / aspectRatio);
                } else if (resizeSettings.height) {
                  targetHeight = resizeSettings.height;
                  targetWidth = Math.round(targetHeight * aspectRatio);
                }
              } else {
                // Exact dimensions (no aspect ratio constraint)
                targetWidth = resizeSettings.width || img.width;
                targetHeight = resizeSettings.height || img.height;
              }
            } else if (resizeSettings.mode === 'social') {
              // Social media presets - use exact dimensions
              const presets: Record<string, { width: number; height: number }> = {
                'instagram-post': { width: 1080, height: 1080 },
                'instagram-story': { width: 1080, height: 1920 },
                'instagram-reel': { width: 1080, height: 1920 },
                'facebook-post': { width: 1200, height: 630 },
                'facebook-cover': { width: 820, height: 312 },
                'twitter-post': { width: 1200, height: 675 },
                'twitter-header': { width: 1500, height: 500 },
                'linkedin-post': { width: 1200, height: 627 },
                'linkedin-cover': { width: 1128, height: 191 },
                'youtube-thumbnail': { width: 1280, height: 720 },
                'youtube-banner': { width: 2560, height: 1440 },
                'pinterest-pin': { width: 1000, height: 1500 },
                'tiktok-video': { width: 1080, height: 1920 },
              };
              
              const preset = presets[resizeSettings.socialPreset || 'instagram-post'];
              if (preset) {
                targetWidth = preset.width;
                targetHeight = preset.height;
              }
            }
            
            // STEP 1: Create intermediate canvas with orientation-corrected image at original size
            let orientedWidth = img.width;
            let orientedHeight = img.height;
            if (orientation >= 5 && orientation <= 8) {
              orientedWidth = img.height;
              orientedHeight = img.width;
            }
            
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) throw new Error('Could not get canvas context');
            
            tempCanvas.width = orientedWidth;
            tempCanvas.height = orientedHeight;
            
            // Apply orientation correction on temp canvas
            if (orientation > 1) {
              // Save context state
              tempCtx.save();
              // Move origin to center for rotations
              tempCtx.translate(orientedWidth / 2, orientedHeight / 2);
              
              switch (orientation) {
                case 2: // flip horizontal
                  tempCtx.scale(-1, 1);
                  break;
                case 3: // rotate 180
                  tempCtx.rotate(Math.PI);
                  break;
                case 4: // flip vertical
                  tempCtx.scale(1, -1);
                  break;
                case 5: // transpose
                  tempCtx.rotate(Math.PI / 2);
                  tempCtx.scale(1, -1);
                  break;
                case 6: // rotate 90 CW
                  tempCtx.rotate(Math.PI / 2);
                  break;
                case 7: // transverse
                  tempCtx.rotate(-Math.PI / 2);
                  tempCtx.scale(1, -1);
                  break;
                case 8: // rotate 90 CCW
                  tempCtx.rotate(-Math.PI / 2);
                  break;
              }
              // Draw image centered at origin
              tempCtx.drawImage(img, -img.width / 2, -img.height / 2);
              tempCtx.restore();
            } else {
              // Normal orientation
              tempCtx.drawImage(img, 0, 0);
            }
            
            // STEP 2: Create final canvas at target dimensions and draw resized
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // High quality scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw the oriented image resized to target dimensions
            ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
            
            // Convert to output format
            const mimeType = `image/${outputFormat}`;
            const q = outputFormat === 'png' ? undefined : quality / 100;
            const dataUrl = canvas.toDataURL(mimeType, q);
            const base64 = dataUrl.split(',')[1] || '';
            const size = Math.round((base64.length * 3) / 4);
            
            // Generate filename
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
            const suffix = resizeSettings.customName || 
              (resizeSettings.mode === 'percentage' ? `_${resizeSettings.percentage}pct` :
               resizeSettings.mode === 'social' ? `_${resizeSettings.socialPreset}` :
               `_${targetWidth}x${targetHeight}`);
            const filename = `${originalName}${suffix}.${ext}`;
            
            resolve({ dataUrl, size, width: targetWidth, height: targetHeight, filename });
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Batch resize multiple images
  const batchResize = useCallback(async (
    files: File[],
    resizeSettings: ResizeSettings,
    outputFormat: 'jpeg' | 'png' | 'webp' = 'jpeg',
    quality = 90,
    onProgress?: (completed: number, total: number) => void
  ): Promise<Array<{ dataUrl: string; size: number; width: number; height: number; filename: string; originalName: string }>> => {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await resizeImage(files[i], resizeSettings, outputFormat, quality);
        results.push({ ...result, originalName: files[i].name });
        onProgress?.(i + 1, files.length);
      } catch (err) {
        console.error(`Failed to resize ${files[i].name}:`, err);
        onProgress?.(i + 1, files.length);
      }
    }
    return results;
  }, [resizeImage]);

  return {
    imageData,
    setImageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    getCompressionRatio,
    formatFileSize,
    checkWebPSupport,
    resizeImage,
    batchResize,
    batchCompress,
    defaultSettings,
  };
}
