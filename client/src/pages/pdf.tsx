import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { Download, FilePlus2, Trash2 } from "lucide-react";
import {
  createPDFFromImages,
  defaultPDFSettings,
  loadImageAsDataUrl,
  validateImageFile,
  type ImageForPDF,
  type PDFSettings,
  formatFileSize,
  generateDefaultFilename,
} from "@/lib/pdf-utils";

export default function PDFConverter() {
  const [images, setImages] = useState<ImageForPDF[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<PDFSettings>(defaultPDFSettings);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — PDF Converter";
  }, []);

  const addFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter((file) => !validateImageFile(file));
    const enriched: ImageForPDF[] = await Promise.all(
      validFiles.map(async (file) => ({
        file,
        dataUrl: await loadImageAsDataUrl(file),
        name: file.name,
      }))
    );
    setImages((prev) => [...prev, ...enriched]);
  }, []);

  const handleSingleFile = useCallback((file: File) => {
    addFiles([file]);
  }, [addFiles]);

  const handleCreatePDF = async () => {
    if (!images.length) return;
    setIsProcessing(true);
    try {
      const filename = generateDefaultFilename(images);
      await createPDFFromImages(images, settings, filename);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">PDF Converter</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your images into professional PDFs. Combine multiple photos, adjust layouts, and create documents instantly.
          </p>
        </div>

        {/* Features Section - Only show when no images */}
        {!images.length && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                PDF Creation Features
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <FilePlus2 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Multi-Image Support</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Upload multiple images at once and combine them into a single, organized PDF document.
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <Download className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Customizable Layout</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Choose page size, orientation, and fit mode to create PDFs that match your exact requirements.
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trash2 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reorder images, remove unwanted ones, and preview your PDF layout before downloading.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Perfect For</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                    <FilePlus2 className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Scan to PDF</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Convert scanned documents and receipts into organized PDFs
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Photo Albums</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Create digital photo albums and portfolios for sharing
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Trash2 className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Visual Reports</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Combine charts, graphs, and images into professional reports
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                    <FilePlus2 className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Image Catalogs</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Create product catalogs and presentation materials
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FilePlus2 className="mr-3 text-red-500 h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-800">Add Images</h2>
          </div>
          <FileUploadZone
            onFileSelect={handleSingleFile}
            onFilesSelect={addFiles}
            multiple
            isLoading={isProcessing}
            title="Drop your images here"
            description="or click to select multiple files"
            supportedFormats="Supports: JPEG, PNG, WebP, GIF, BMP • Max size: 10MB"
            testId="pdf-upload"
          />
          {!!images.length && (
            <div className="mt-4 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded mr-2">{images.length} selected</span>
              Total size: {formatFileSize(images.reduce((acc, img) => acc + img.file.size, 0))}
            </div>
          )}
        </div>

        {!!images.length && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reorder and Review</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img.dataUrl} alt={img.name} className="w-full h-40 object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {idx + 1}
                  </div>
                  <Button size="icon" className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white" onClick={() => removeImage(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">PDF Settings</h2>
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Page Size</label>
                <select
                  className="w-full bg-white border border-gray-300 rounded-md p-3 text-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={settings.pageSize}
                  onChange={(e) => setSettings((s) => ({ ...s, pageSize: e.target.value as PDFSettings["pageSize"] }))}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Orientation</label>
                <select
                  className="w-full bg-white border border-gray-300 rounded-md p-3 text-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={settings.orientation}
                  onChange={(e) => setSettings((s) => ({ ...s, orientation: e.target.value as PDFSettings["orientation"] }))}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Fit Mode</label>
                <select
                  className="w-full bg-white border border-gray-300 rounded-md p-3 text-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={settings.fitMode}
                  onChange={(e) => setSettings((s) => ({ ...s, fitMode: e.target.value as PDFSettings["fitMode"] }))}
                >
                  <option value="fit-page">Fit Page</option>
                  <option value="fit-width">Fit Width</option>
                  <option value="fit-height">Fit Height</option>
                  <option value="original">Original Size</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Margin (mm)</label>
                <input
                  type="number"
                  className="w-full bg-white border border-gray-300 rounded-md p-3 text-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={settings.margin}
                  min={0}
                  max={50}
                  onChange={(e) => setSettings((s) => ({ ...s, margin: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white" 
                size="lg" 
                onClick={handleCreatePDF} 
                disabled={!images.length || isProcessing}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


