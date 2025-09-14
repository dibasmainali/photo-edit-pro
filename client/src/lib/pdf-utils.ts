import jsPDF from 'jspdf';

export interface PDFSettings {
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margin: number;
  fitMode: 'fit-width' | 'fit-height' | 'fit-page' | 'original';
  quality: number;
}

export interface ImageForPDF {
  file: File;
  dataUrl: string;
  name: string;
}

export const defaultPDFSettings: PDFSettings = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 20,
  fitMode: 'fit-page',
  quality: 0.9,
};

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

export function loadImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function calculateImageSize(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  fitMode: PDFSettings['fitMode']
): { width: number; height: number; x: number; y: number } {
  const availableWidth = pageWidth - (margin * 2);
  const availableHeight = pageHeight - (margin * 2);

  let width = imageWidth;
  let height = imageHeight;

  switch (fitMode) {
    case 'fit-width':
      if (imageWidth > availableWidth) {
        width = availableWidth;
        height = (imageHeight * availableWidth) / imageWidth;
      }
      break;
    case 'fit-height':
      if (imageHeight > availableHeight) {
        height = availableHeight;
        width = (imageWidth * availableHeight) / imageHeight;
      }
      break;
    case 'fit-page':
      const widthRatio = availableWidth / imageWidth;
      const heightRatio = availableHeight / imageHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      width = imageWidth * ratio;
      height = imageHeight * ratio;
      break;
    case 'original':
      // Keep original size, but ensure it fits on the page
      if (imageWidth > availableWidth || imageHeight > availableHeight) {
        const widthRatio = availableWidth / imageWidth;
        const heightRatio = availableHeight / imageHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        width = imageWidth * ratio;
        height = imageHeight * ratio;
      }
      break;
  }

  // Center the image on the page
  const x = margin + (availableWidth - width) / 2;
  const y = margin + (availableHeight - height) / 2;

  return { width, height, x, y };
}

export function getPageDimensions(
  pageSize: PDFSettings['pageSize'],
  orientation: PDFSettings['orientation']
): { width: number; height: number } {
  const dimensions = {
    a4: { width: 210, height: 297 },
    letter: { width: 216, height: 279 },
    legal: { width: 216, height: 356 },
  };

  const page = dimensions[pageSize];
  
  if (orientation === 'landscape') {
    return { width: page.height, height: page.width };
  }
  
  return page;
}

export async function createPDFFromImages(
  images: ImageForPDF[],
  settings: PDFSettings = defaultPDFSettings,
  filename: string = 'photos.pdf'
): Promise<void> {
  if (images.length === 0) {
    throw new Error('No images provided');
  }

  const pageDimensions = getPageDimensions(settings.pageSize, settings.orientation);
  const pdf = new jsPDF({
    orientation: settings.orientation,
    unit: 'mm',
    format: settings.pageSize,
  });

  let isFirstPage = true;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    if (!isFirstPage) {
      pdf.addPage();
    }

    try {
      // Get image dimensions
      const imageDimensions = await getImageDimensions(image.dataUrl);
      
      // Calculate how to fit the image on the page
      const imageSize = calculateImageSize(
        imageDimensions.width,
        imageDimensions.height,
        pageDimensions.width,
        pageDimensions.height,
        settings.margin,
        settings.fitMode
      );

      // Add the image to the PDF
      pdf.addImage(
        image.dataUrl,
        'JPEG', // jsPDF will handle the conversion
        imageSize.x,
        imageSize.y,
        imageSize.width,
        imageSize.height,
        undefined,
        'FAST' // Use fast rendering for better performance
      );

      isFirstPage = false;
    } catch (error) {
      console.error(`Error adding image ${image.name} to PDF:`, error);
      // Continue with other images even if one fails
    }
  }

  // Save the PDF
  pdf.save(filename);
}

export function downloadPDF(pdf: jsPDF, filename: string) {
  pdf.save(filename);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function generateDefaultFilename(images: ImageForPDF[]): string {
  const timestamp = new Date().toISOString().split('T')[0];
  if (images.length === 1) {
    const baseName = images[0].name.replace(/\.[^/.]+$/, '');
    return `${baseName}_${timestamp}.pdf`;
  }
  return `photos_${timestamp}.pdf`;
}
