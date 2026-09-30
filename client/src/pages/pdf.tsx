import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { Download, FilePlus2, Trash2, ArrowUp, ArrowDown, Info, FileText, Image as ImageIcon, RotateCcw } from "lucide-react";
import {
  createPDFFromImages,
  createPDFWithMerges,
  defaultPDFSettings,
  loadImageAsDataUrl,
  type ImageForPDF,
  type PDFSettings,
  generateDefaultFilename,
} from "@/lib/pdf-utils";
import { formatFileSize, validateImageFile } from "@/lib/image-utils";

export default function PDFConverter() {
  const [images, setImages] = useState<ImageForPDF[]>([]);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfPreviews, setPdfPreviews] = useState<{ name: string; url: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<PDFSettings>(defaultPDFSettings);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'images' | 'settings'>('images');
  const previewUrlsRef = useRef<string[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — PDF Converter";
    return () => {
      previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
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
      const newPreviews = newPdfFiles.map((f) => {
        const url = URL.createObjectURL(f);
        previewUrlsRef.current.push(url);
        return { name: f.name, url };
      });
      setPdfFiles((prev) => [...prev, ...newPdfFiles]);
      setPdfPreviews((prev) => [...prev, ...newPreviews]);
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
    previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
    setPdfPreviews([]);
  };

  const removePdf = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
    setPdfPreviews((prev) => {
      const item = prev[index];
      if (item) {
        URL.revokeObjectURL(item.url);
        previewUrlsRef.current = previewUrlsRef.current.filter(u => u !== item.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

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

  const totalSize = images.reduce((acc, img) => acc + img.file.size, 0) + pdfFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 px-4 sm:px-6 lg:px-8 ${
      images.length || pdfFiles.length ? 'pb-36 sm:pb-28' : 'pb-16'
    }`}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-in">
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
              <FileText className="w-4 h-4" aria-hidden="true" />
              Create PDFs from Images • Merge PDFs • Custom Layouts
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              PDF Converter
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              <span className="sm:hidden">Combine images and PDFs into one document.</span>
              <span className="hidden sm:inline">Transform your images into professional PDFs. Combine multiple photos, adjust layouts, and create documents instantly.</span>
            </p>
          </div>

          {/* Upload Section */}
          <Card className="mb-4 sm:mb-8 animate-in stagger-1">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <FilePlus2 className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Add Files</CardTitle>
                    <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to browse</p>
                  </div>
                </div>
                {(images.length || pdfFiles.length) && (
                  <Button variant="outline" onClick={clearAll} size="sm">
                    <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <FileUploadZone
                onFileSelect={handleSingleFile}
                onFilesSelect={addFiles}
                multiple
                accept="image/*,application/pdf"
                isLoading={isProcessing}
                title="Drop images or PDFs here"
                description="Choose or drop • 10MB max"
                supportedFormats="JPEG • PNG • WebP • GIF • BMP • PDF"
                testId="pdf-upload"
                compact
              />

              {(images.length || pdfFiles.length) && (
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  {images.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <ImageIcon className="w-3 h-3" aria-hidden="true" />
                      {images.length} image{images.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {pdfFiles.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <FileText className="w-3 h-3" aria-hidden="true" />
                      {pdfFiles.length} PDF{pdfFiles.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  <span className="text-gray-500 dark:text-gray-400">Total: {formatFileSize(totalSize)}</span>
                </div>
              )}

              <div className="hidden sm:block mt-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Drag to reorder images, or use arrow buttons</li>
                    <li>Mix images and PDFs - they'll be merged in order</li>
                    <li>Adjust page size, orientation, and margins in Settings tab</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Card className="overflow-hidden animate-in stagger-2">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'images'}
                  aria-controls="images-panel"
                  id="images-tab"
                  onClick={() => setActiveTab('images')}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'images'
                      ? 'border-red-500 text-red-500'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Images & PDFs ({images.length + pdfFiles.length})
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'settings'}
                  aria-controls="settings-panel"
                  id="settings-tab"
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'settings'
                      ? 'border-red-500 text-red-500'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Images Tab */}
            <div role="tabpanel" id="images-panel" aria-labelledby="images-tab" className="p-3 sm:p-6" hidden={activeTab !== 'images'}>
              {(!images.length && !pdfFiles.length) ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <FilePlus2 className="w-8 h-8 text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files added yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">Upload images or PDFs to get started</p>
                </div>
              ) : (
                <>
                  {images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
                        Images ({images.length})
                      </h3>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden ${dragIndex === idx ? 'ring-2 ring-red-400' : ''}`}
                            draggable
                            onDragStart={handleDragStart(idx)}
                            onDragOver={handleDragOver(idx)}
                            onDrop={handleDrop(idx)}
                          >
                            <img src={img.dataUrl} alt={img.name} className="w-full h-40 object-cover" />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {idx + 1}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                onClick={() => moveImage(idx, "up")}
                                disabled={idx === 0}
                                className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                                aria-label="Move up"
                              >
                                <ArrowUp className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => moveImage(idx, "down")}
                                disabled={idx === images.length - 1}
                                className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                                aria-label="Move down"
                              >
                                <ArrowDown className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => removeImage(idx)}
                                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors"
                                aria-label="Remove image"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[11px] px-2 py-1.5">
                              <div className="truncate" title={img.name}>{img.name}</div>
                              <div className="opacity-80">{formatFileSize(img.file.size)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pdfFiles.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-500" aria-hidden="true" />
                        PDFs ({pdfFiles.length})
                      </h3>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {pdfPreviews.map((p, i) => (
                          <div key={i} className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <iframe src={p.url} title={p.name} className="w-full h-40 border-0" />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full max-w-[70%] truncate" title={p.name}>
                              {p.name}
                            </div>
                            <button
                              onClick={() => removePdf(i)}
                              className="absolute top-2 right-2 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors"
                              aria-label={`Remove ${p.name}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Settings Tab */}
            <div role="tabpanel" id="settings-panel" aria-labelledby="settings-tab" className="p-3 sm:p-6" hidden={activeTab !== 'settings'}>
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-6">Page Layout</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Page Size</label>
                      <select
                        className="input"
                        value={settings.pageSize}
                        onChange={(e) => setSettings((s) => ({ ...s, pageSize: e.target.value as PDFSettings["pageSize"] }))}
                      >
                        <option value="a4">A4 (210 × 297 mm)</option>
                        <option value="letter">Letter (8.5 × 11 in)</option>
                        <option value="legal">Legal (8.5 × 14 in)</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Orientation</label>
                      <select
                        className="input"
                        value={settings.orientation}
                        onChange={(e) => setSettings((s) => ({ ...s, orientation: e.target.value as PDFSettings["orientation"] }))}
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Fit Mode</label>
                      <select
                        className="input"
                        value={settings.fitMode}
                        onChange={(e) => setSettings((s) => ({ ...s, fitMode: e.target.value as PDFSettings["fitMode"] }))}
                      >
                        <option value="fit-page">Fit Page (maintain aspect)</option>
                        <option value="fit-width">Fit Width</option>
                        <option value="fit-height">Fit Height</option>
                        <option value="original">Original Size</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Margin (mm)</label>
                      <input
                        type="number"
                        className="input"
                        value={settings.margin}
                        min={0}
                        max={50}
                        onChange={(e) => setSettings((s) => ({ ...s, margin: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-6">Extras</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                          checked={!!settings.addCoverPage}
                          onChange={(e) => setSettings((s) => ({ ...s, addCoverPage: e.target.checked }))}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add cover page</span>
                      </label>
                      {settings.addCoverPage && (
                        <input
                          type="text"
                          className="input mt-2"
                          value={settings.coverTitle || ''}
                          onChange={(e) => setSettings((s) => ({ ...s, coverTitle: e.target.value }))}
                          placeholder="Cover page title"
                        />
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                          checked={!!settings.addPageNumbers}
                          onChange={(e) => setSettings((s) => ({ ...s, addPageNumbers: e.target.checked }))}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add page numbers</span>
                      </label>
                    </div>
                  </div>
                </Card>

                <div className="pt-4">
                  <Button
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
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
                        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                        Create & Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Sticky Action Bar */}
          {(images.length || pdfFiles.length) && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-in w-full max-w-5xl px-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {images.length} image{images.length === 1 ? '' : 's'}{pdfFiles.length ? ` + ${pdfFiles.length} PDF${pdfFiles.length > 1 ? 's' : ''}` : ''}
                  </span>
                  <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">Total {formatFileSize(totalSize)}</span>
                </div>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white h-10 px-4"
                  onClick={handleCreatePDF}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Creating...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}