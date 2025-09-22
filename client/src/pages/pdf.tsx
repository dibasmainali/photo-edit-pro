import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { Download, FilePlus2, Trash2, ArrowUp, ArrowDown, Info } from "lucide-react";
import {
  createPDFFromImages,
  createPDFWithMerges,
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
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfPreviews, setPdfPreviews] = useState<{ name: string; url: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<PDFSettings>(defaultPDFSettings);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — PDF Converter";
  }, []);

  const addFiles = useCallback(async (files: File[]) => {
    const imageFiles: File[] = [];
    const newPdfFiles: File[] = [];
    for (const f of files) {
      if (f.type === 'application/pdf') {
        newPdfFiles.push(f);
      } else if (!validateImageFile(f)) {
        imageFiles.push(f);
      }
    }
    if (imageFiles.length) {
      const enriched: ImageForPDF[] = await Promise.all(
        imageFiles.map(async (file) => ({ file, dataUrl: await loadImageAsDataUrl(file), name: file.name }))
      );
      setImages((prev) => [...prev, ...enriched]);
    }
    if (newPdfFiles.length) {
      setPdfFiles((prev) => [...prev, ...newPdfFiles]);
      setPdfPreviews((prev) => [
        ...prev,
        ...newPdfFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
      ]);
    }
  }, []);

  const handleSingleFile = useCallback((file: File) => {
    addFiles([file]);
  }, [addFiles]);

  const handleCreatePDF = async () => {
    if (!images.length && !pdfFiles.length) return;
    setIsProcessing(true);
    try {
      const filename = generateDefaultFilename(images);
      if (pdfFiles.length) {
        await createPDFWithMerges(images, pdfFiles, settings, filename);
      } else {
        await createPDFFromImages(images, settings, filename);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const next = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[newIndex];
      next[newIndex] = temp;
      return next;
    });
  };

  const clearAll = () => {
    setImages([]);
    setPdfFiles([]);
    setPdfPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  };

  // DnD handlers
  const handleDragStart = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (overIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (dropIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const removePdf = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
    setPdfPreviews((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
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

        {/* Upload FIRST */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <FilePlus2 className="mr-3 text-red-500 h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-800">Add Images</h2>
            {!!images.length && (
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          <FileUploadZone
            onFileSelect={handleSingleFile}
            onFilesSelect={addFiles}
            multiple
            accept="image/*,application/pdf"
            isLoading={isProcessing}
            title="Drop your images here"
            description="or click to select images or PDFs"
            supportedFormats="Supports: JPEG, PNG, WebP, GIF, BMP, PDF • Max size: 10MB per image"
            testId="pdf-upload"
          />
          <p className="text-gray-600 mt-4">
            Upload one or multiple images to start creating your PDF.
          </p>
          <div className="mt-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
              <ul className="list-disc list-inside space-y-1">
                <li>You can drag files in or click to browse.</li>
                <li>Reorder pages with the arrows on each thumbnail.</li>
                <li>Use Clear All to start over quickly.</li>
              </ul>
            </div>
          </div>
          {(!!images.length || !!pdfFiles.length) && (
            <div className="mt-4 text-sm text-gray-600">
              {!!images.length && <span className="bg-gray-100 px-2 py-1 rounded mr-2">{images.length} images</span>}
              {!!pdfFiles.length && <span className="bg-gray-100 px-2 py-1 rounded mr-2">{pdfFiles.length} PDFs</span>}
              Total size: {formatFileSize(images.reduce((acc, img) => acc + img.file.size, 0) + pdfFiles.reduce((acc, f) => acc + f.size, 0))}
            </div>
          )}
        </div>

        {/* Features Section - show only when nothing uploaded */}
        {!(images.length || pdfFiles.length) && (
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

        {(images.length || pdfFiles.length) && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reorder and Review</h2>
            {!!images.length && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative bg-gray-100 rounded-lg overflow-hidden ${dragIndex === idx ? 'ring-2 ring-red-400' : ''}`}
                    draggable
                    onDragStart={handleDragStart(idx)}
                    onDragOver={handleDragOver(idx)}
                    onDrop={handleDrop(idx)}
                  >
                    <img src={img.dataUrl} alt={img.name} className="w-full h-40 object-cover" />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white text-gray-700 shadow" onClick={() => moveImage(idx, "up")} disabled={idx === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white text-gray-700 shadow" onClick={() => moveImage(idx, "down")} disabled={idx === images.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button size="icon" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => removeImage(idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[11px] px-2 py-1">
                      <div className="truncate" title={img.name}>{img.name}</div>
                      <div className="opacity-80">{formatFileSize(img.file.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!!pdfFiles.length && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">PDF Previews</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pdfPreviews.map((p, i) => (
                    <div key={i} className="relative bg-gray-100 rounded-lg overflow-hidden border">
                      <iframe src={p.url} title={p.name} className="w-full h-40" />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-[70%] truncate" title={p.name}>
                        {p.name}
                      </div>
                      <Button size="icon" className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white" onClick={() => removePdf(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Cover Page</label>
                <div className="flex items-center gap-3">
                  <input
                    id="toggle-cover"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={!!settings.addCoverPage}
                    onChange={(e) => setSettings((s) => ({ ...s, addCoverPage: e.target.checked }))}
                  />
                  <label htmlFor="toggle-cover" className="text-sm text-gray-700">Add a text cover page</label>
                </div>
                {settings.addCoverPage && (
                  <input
                    type="text"
                    className="mt-2 w-full bg-white border border-gray-300 rounded-md p-3 text-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={settings.coverTitle || ''}
                    onChange={(e) => setSettings((s) => ({ ...s, coverTitle: e.target.value }))}
                    placeholder="Cover page title"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Page Numbers</label>
                <div className="flex items-center gap-3">
                  <input
                    id="toggle-numbers"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={!!settings.addPageNumbers}
                    onChange={(e) => setSettings((s) => ({ ...s, addPageNumbers: e.target.checked }))}
                  />
                  <label htmlFor="toggle-numbers" className="text-sm text-gray-700">Show page numbers</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white" 
                size="lg" 
                onClick={handleCreatePDF} 
                disabled={!(images.length || pdfFiles.length) || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="mr-2 inline-flex h-4 w-4">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    </span>
                    Creating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        {!!images.length || !!pdfFiles.length ? (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-white/95 backdrop-blur rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {images.length} image{images.length === 1 ? '' : 's'} selected{pdfFiles.length ? ` + ${pdfFiles.length} PDF${pdfFiles.length > 1 ? 's' : ''}` : ''}
              </span>
              <span className="hidden sm:inline text-xs text-gray-500">
                Total {formatFileSize(images.reduce((acc, img) => acc + img.file.size, 0) + pdfFiles.reduce((acc, f) => acc + f.size, 0))}
              </span>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white h-8 px-3"
                onClick={handleCreatePDF}
                disabled={isProcessing}
              >
                {isProcessing ? 'Creating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


