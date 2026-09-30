export interface ImagePreset {
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

export const imagePresets: ImagePreset[] = [
  {
    name: "Auto Enhance",
    brightness: 10,
    contrast: 15,
    saturation: 10,
  },
  {
    name: "Warm Tone",
    brightness: 5,
    contrast: 10,
    saturation: 20,
  },
  {
    name: "Cool Tone",
    brightness: 0,
    contrast: 10,
    saturation: -10,
  },
  {
    name: "Black & White",
    brightness: 0,
    contrast: 20,
    saturation: -100,
  },
];

export function validateImageFile(file: File, maxSize = 10 * 1024 * 1024): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Please select a valid image file';
  }

  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
  }

  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
  if (!supportedTypes.includes(file.type)) {
    return 'Supported formats: JPEG, PNG, WebP, GIF, BMP';
  }

  return null;
}

export function filterValidFiles(files: File[], accept: string, maxSize = 10 * 1024 * 1024): File[] {
  const acceptsPdf = accept.includes('application/pdf');
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

  return files.filter((file) => {
    if (file.size > maxSize) return false;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (acceptsPdf && isPdf) return true;
    if (!isImage) return false;
    if (!supportedTypes.includes(file.type)) return false;

    return true;
  });
}

export function calculateBatchSavings(items: Array<{ originalSize: number; processedSize?: number }>) {
  const totalOriginal = items.reduce((sum, item) => sum + item.originalSize, 0);
  const totalProcessed = items.reduce((sum, item) => sum + (item.processedSize ?? item.originalSize), 0);
  const percentSaved = totalOriginal > 0 ? Math.round(((totalOriginal - totalProcessed) / totalOriginal) * 100) : 0;

  return {
    totalOriginal,
    totalProcessed,
    percentSaved,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, format, quality);
  });
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
