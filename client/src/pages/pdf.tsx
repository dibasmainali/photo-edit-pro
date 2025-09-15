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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-card mb-4">PDF Converter</h1>
          <p className="text-xl text-card/80 max-w-2xl mx-auto">Select multiple photos and combine them into a single PDF, entirely in your browser.</p>
        </div>

        <Card className="feature-card card-glow shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-heading">
              <FilePlus2 className="mr-3 text-primary" />
              Add Images
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="mt-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="mr-2">{images.length} selected</Badge>
                Total size: {formatFileSize(images.reduce((acc, img) => acc + img.file.size, 0))}
              </div>
            )}
          </CardContent>
        </Card>

        {!!images.length && (
          <Card className="feature-card card-glow shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Reorder and Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative bg-muted rounded-lg overflow-hidden">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-40 object-cover" />
                    <div className="absolute top-2 left-2 bg-card/80 text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </div>
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2" onClick={() => removeImage(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="feature-card card-glow shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">PDF Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Page Size</label>
                <select
                  className="w-full bg-card border border-border rounded-md p-2"
                  value={settings.pageSize}
                  onChange={(e) => setSettings((s) => ({ ...s, pageSize: e.target.value as PDFSettings["pageSize"] }))}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Orientation</label>
                <select
                  className="w-full bg-card border border-border rounded-md p-2"
                  value={settings.orientation}
                  onChange={(e) => setSettings((s) => ({ ...s, orientation: e.target.value as PDFSettings["orientation"] }))}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Fit Mode</label>
                <select
                  className="w-full bg-card border border-border rounded-md p-2"
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
                <label className="block text-sm mb-2">Margin (mm)</label>
                <input
                  type="number"
                  className="w-full bg-card border border-border rounded-md p-2"
                  value={settings.margin}
                  min={0}
                  max={50}
                  onChange={(e) => setSettings((s) => ({ ...s, margin: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="w-full sm:w-auto bg-success hover:bg-success/90" size="lg" onClick={handleCreatePDF} disabled={!images.length || isProcessing}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


