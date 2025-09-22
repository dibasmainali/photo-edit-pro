import jsPDF from 'jspdf';
// Note: Use dynamic import for pdf-lib where needed to avoid type dependency at build time

export interface PDFSettings {
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margin: number;
  fitMode: 'fit-width' | 'fit-height' | 'fit-page' | 'original';
  quality: number;
  addPageNumbers?: boolean;
  addCoverPage?: boolean;
  coverTitle?: string;
}

export interface ImageForPDF {
  file: File;
  dataUrl: string;
  name: string;
}

export interface ExternalPDFSource {
  file: File;
  name: string;
  type: 'pdf';
}

export const defaultPDFSettings: PDFSettings = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 20,
  fitMode: 'fit-page',
  quality: 0.9,
  addPageNumbers: false,
  addCoverPage: false,
  coverTitle: 'My PDF',
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

  // Optional cover page
  if (settings.addCoverPage) {
    const pageDimensions = getPageDimensions(settings.pageSize, settings.orientation);
    const centerX = pageDimensions.width / 2;
    const centerY = pageDimensions.height / 2;
    pdf.setFontSize(24);
    pdf.setTextColor(40);
    const title = settings.coverTitle || 'My PDF';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, centerX - titleWidth / 2, centerY - 10);
    isFirstPage = false;
  }

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

      // Page numbers (draw after content)
      if (settings.addPageNumbers) {
        const pageDimensionsForText = getPageDimensions(settings.pageSize, settings.orientation);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        const pageNumberText = `${i + (settings.addCoverPage ? 0 : 1)} / ${images.length + (settings.addCoverPage ? 0 : 0)}`;
        // Place at bottom center within margins
        const textWidth = pdf.getTextWidth(pageNumberText);
        const x = (pageDimensionsForText.width - textWidth) / 2;
        const y = pageDimensionsForText.height - (settings.margin / 2);
        pdf.text(pageNumberText, x, y);
      }

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

async function downloadBytesAsFile(bytes: Uint8Array, filename: string) {
  const arrayBuffer = bytes.buffer as unknown as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function createPDFWithMerges(
  images: ImageForPDF[],
  pdfFiles: File[],
  settings: PDFSettings = defaultPDFSettings,
  filename: string = 'photos.pdf'
): Promise<void> {
  if (!images.length && !pdfFiles.length) {
    throw new Error('No content provided');
  }

  // First, build an image-only PDF with jsPDF to preserve sizing, cover and page numbers
  let baseBytes: ArrayBuffer | Uint8Array | null = null;
  if (images.length) {
    const pageDimensions = getPageDimensions(settings.pageSize, settings.orientation);
    const pdf = new jsPDF({ orientation: settings.orientation, unit: 'mm', format: settings.pageSize });

    let isFirstPage = true;
    if (settings.addCoverPage) {
      const centerX = pageDimensions.width / 2;
      const centerY = pageDimensions.height / 2;
      pdf.setFontSize(24);
      pdf.setTextColor(40);
      const title = settings.coverTitle || 'My PDF';
      const titleWidth = pdf.getTextWidth(title);
      pdf.text(title, centerX - titleWidth / 2, centerY - 10);
      isFirstPage = false;
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!isFirstPage) pdf.addPage();
      const imageDimensions = await getImageDimensions(image.dataUrl);
      const imageSize = calculateImageSize(
        imageDimensions.width,
        imageDimensions.height,
        pageDimensions.width,
        pageDimensions.height,
        settings.margin,
        settings.fitMode
      );
      pdf.addImage(image.dataUrl, 'JPEG', imageSize.x, imageSize.y, imageSize.width, imageSize.height, undefined, 'FAST');

      if (settings.addPageNumbers) {
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        const pageNumberText = `${i + (settings.addCoverPage ? 0 : 1)} / ${images.length + (settings.addCoverPage ? 0 : 0)}`;
        const textWidth = pdf.getTextWidth(pageNumberText);
        const x = (pageDimensions.width - textWidth) / 2;
        const y = pageDimensions.height - settings.margin / 2;
        pdf.text(pageNumberText, x, y);
      }
      isFirstPage = false;
    }

    baseBytes = pdf.output('arraybuffer');
  }

  // If no external PDFs, just save the images PDF
  if (pdfFiles.length === 0 && baseBytes) {
    const blob = new Blob([baseBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  // Otherwise, merge using pdf-lib
  const { PDFDocument } = await import('pdf-lib') as any;
  const outDoc = baseBytes
    ? await PDFDocument.load(baseBytes)
    : await PDFDocument.create();

  for (const file of pdfFiles) {
    try {
      const donorBytes = new Uint8Array(await file.arrayBuffer());
      const donor = await PDFDocument.load(donorBytes);
      const pages = await outDoc.copyPages(donor, donor.getPageIndices());
      pages.forEach((p: any) => outDoc.addPage(p));
    } catch (e) {
      console.error('Error merging PDF', file.name, e);
    }
  }

  const mergedBytes = await outDoc.save();
  await downloadBytesAsFile(mergedBytes, filename);
}
