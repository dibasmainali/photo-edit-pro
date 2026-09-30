import { useState, useEffect } from "react";
import { Download, RotateCcw, Settings, Image as ImageIcon, Eye, ZoomIn, ZoomOut, RefreshCw, CheckCircle, ChevronLeft, ChevronRight, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { useImageProcessing, type ProcessedImageData } from "@/hooks/use-image-processing";
import { calculateBatchSavings, formatFileSize } from "@/lib/image-utils";

export default function Compressor() {
  const {
    imageData,
    setImageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    formatFileSize: formatSize,
    checkWebPSupport,
    batchCompress,
    defaultSettings,
  } = useImageProcessing();

  const [showOriginal, setShowOriginal] = useState(true);
  const [viewMode, setViewMode] = useState<"single" | "compare">("compare");
  const [batchImages, setBatchImages] = useState<ProcessedImageData[]>([]);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const [batchProgress, setBatchProgress] = useState({ completed: 0, total: 0 });
  const [batchError, setBatchError] = useState<string | null>(null);
  const [pendingSettings, setPendingSettings] = useState(defaultSettings);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Photo Compressor";
  }, []);

  useEffect(() => {
    if (!imageData || batchImages.length === 0) return;

    setBatchImages((current) => current.map((item, index) => (
      index === selectedBatchIndex ? imageData : item
    )));
  }, [imageData, selectedBatchIndex]);

  const handleFileSelect = (file: File) => {
    setBatchImages([]);
    setSelectedBatchIndex(0);
    setBatchProgress({ completed: 0, total: 0 });
    setBatchError(null);
    uploadImage(file, pendingSettings);
  };

  const handleFilesSelect = async (files: File[]) => {
    if (files.length === 0) return;
    if (files.length === 1) {
      handleFileSelect(files[0]);
      return;
    }

    const settings = imageData?.settings ?? pendingSettings;
    setBatchError(null);
    setBatchProgress({ completed: 0, total: files.length });

    try {
      const results = await batchCompress(files, settings, (completed, total) => {
        setBatchProgress({ completed, total });
      });

      if (results.length) {
        setBatchImages(results);
        setSelectedBatchIndex(0);
        setImageData(results[0]);
      }
    } catch (error) {
      console.error("Batch compression failed:", error);
      setBatchError("Compression failed for one of the selected images. Please check the files and try again.");
    }
  };

  const handleQualityChange = (value: number[]) => {
    setPendingSettings((settings) => ({ ...settings, quality: value[0] }));
    updateSettings({ quality: value[0] });
  };

  const handleFormatChange = (format: 'jpeg' | 'png' | 'webp') => {
    setPendingSettings((settings) => ({ ...settings, format }));
    updateSettings({ format });
  };

  const handleDownload = () => {
    if (imageData) {
      const extension = imageData.settings.format === 'jpeg' ? 'jpg' : imageData.settings.format;
      const filename = `compressed_${imageData.originalFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      downloadProcessedImage(filename);
    }
  };

  const getCompressionRatio = () => {
    if (!imageData?.processedSize || !imageData.originalFile.size) return 0;
    return Math.round(((imageData.originalFile.size - imageData.processedSize) / imageData.originalFile.size) * 100);
  };

  const getCompressionLabel = () => {
    const ratio = getCompressionRatio();
    return ratio < 0 ? `${Math.abs(ratio)}% larger` : `${ratio}% smaller`;
  };

  const batchSummary = batchImages.length > 0 ? calculateBatchSavings(batchImages.map((item) => ({
    originalSize: item.originalFile.size,
    processedSize: item.processedSize ?? item.originalFile.size,
  }))) : null;

  if (!imageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-8 md:mb-16 animate-in">
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium mb-4 md:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Smart Compression • Real-time Preview • Privacy First
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-6">
                Photo Compressor
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-10 leading-relaxed">
                <span className="sm:hidden">Compress photos in your browser. Your files stay on your device.</span>
                <span className="hidden sm:inline">Reduce file sizes by up to 80% while maintaining visual quality with our advanced compression algorithms and real-time preview.</span>
              </p>

              {/* Upload Section */}
              <Card className="p-4 sm:p-8 md:p-12">
                <div className="hidden sm:block mx-auto max-w-md mb-4 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-6 rounded-xl sm:rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-500" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    Drop Your Images Here
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Upload a photo to compress it in your browser
                  </p>
                </div>

                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  onFilesSelect={handleFilesSelect}
                  icon={<ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />}
                  title="Drop images here"
                  description="Choose or drop • 10MB max"
                  supportedFormats="JPEG • PNG • WebP"
                  testId="compressor-upload"
                  isLoading={isProcessing}
                  compact
                  multiple
                />
                {isProcessing && batchProgress.total > 0 && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
                    Compressing {batchProgress.completed} of {batchProgress.total} images...
                  </p>
                )}
                {batchError && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
                    {batchError}
                  </p>
                )}
              </Card>
              <Card className="sm:hidden mt-3 p-3 text-left">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="text-sm font-heading font-semibold">Compression Settings</h2>
                  <Badge variant="secondary" className="text-xs">{pendingSettings.quality}%</Badge>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="mobile-compression-quality">
                  Quality
                </label>
                <div className={isProcessing ? 'pointer-events-none opacity-50' : ''}>
                  <Slider
                    value={[pendingSettings.quality]}
                    onValueChange={handleQualityChange}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                    aria-label="Mobile compression quality"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Smaller</span>
                  <span>Higher quality</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 mb-2">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1" role="radiogroup" aria-label="Mobile output format">
                  {(['jpeg', 'png', 'webp'] as const).map((format) => (
                    <button
                      key={format}
                      type="button"
                      role="radio"
                      aria-checked={pendingSettings.format === format}
                      disabled={isProcessing}
                      onClick={() => handleFormatChange(format)}
                      className={`min-w-0 rounded-md px-2 py-2.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                        pendingSettings.format === format
                          ? 'bg-red-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Features */}
            <div className="hidden md:grid mt-16 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Zap, title: "Faster Loading", desc: "Smaller files load faster on websites and apps" },
                { icon: Download, title: "Save Space", desc: "Reduce storage requirements for cloud services" },
                { icon: Settings, title: "Lower Costs", desc: "Reduce bandwidth usage and hosting costs" },
                { icon: Eye, title: "Better SEO", desc: "Faster loading images improve search rankings" },
              ].map((feature, index) => (
                <Card key={feature.title} className="p-6 text-center animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </Card>
              ))}
            </div>

            {/* Why Compress */}
            <div className="hidden md:block mt-16 max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white text-center mb-10">Why Compress Images?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Smart Compression", desc: "Advanced algorithms automatically optimize compression settings for maximum size reduction with minimal quality loss.", icon: Settings },
                  { title: "Live Preview", desc: "See compression results instantly with before/after comparison and real-time file size updates.", icon: Eye },
                  { title: "Multiple Formats", desc: "Compress JPEG, PNG, and WebP images with format-specific optimization for best results.", icon: RefreshCw },
                  { title: "Privacy First", desc: "All processing happens in your browser. Your photos never leave your device.", icon: Shield },
                ].map((feature, index) => (
                  <Card key={feature.title} className="p-6 animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-red-500" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const extension = imageData.settings.format === 'jpeg' ? 'jpg' : imageData.settings.format;
  const originalFormat = imageData.originalFile.type.split('/')[1]?.toUpperCase() || 'UNKNOWN';
  const processedFormat = extension.toUpperCase();
  const sizeDifference = imageData.originalFile.size - (imageData.processedSize ?? imageData.originalFile.size);
  const spaceSaved = formatSize(Math.abs(sizeDifference));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 animate-in">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Photo Compressor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Adjust settings and see real-time compression results</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="animate-in stagger-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Compression Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* File Info */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Original File</span>
                    <Badge variant="secondary" className="text-xs">{originalFormat}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div><span className="font-medium">Size:</span> {formatSize(imageData.originalFile.size)}</div>
                    <div><span className="font-medium">Dimensions:</span> {imageData.originalWidth}×{imageData.originalHeight}</div>
                  </div>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Output Format</label>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Output format">
                    {(['jpeg', 'png', 'webp'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => handleFormatChange(format)}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                          imageData.settings.format === format
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                        }`}
                        role="radio"
                        aria-checked={imageData.settings.format === format}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider */}
                {imageData.settings.format !== 'png' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality</label>
                      <Badge variant="secondary" className="text-sm">{imageData.settings.quality}%</Badge>
                    </div>
                    <Slider
                      value={[imageData.settings.quality]}
                      onValueChange={handleQualityChange}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                      aria-label="Compression quality"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>Smaller file</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                )}

                {/* Processed File Info */}
                {imageData.processedDataUrl && imageData.processedSize && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Compressed File</span>
                      <Badge className="text-xs bg-green-500 text-white">{getCompressionLabel()}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                      <div><span className="font-medium">Size:</span> {formatSize(imageData.processedSize)}</div>
                      <div><span className="font-medium">Format:</span> {processedFormat}</div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-100 dark:border-green-900/30 text-sm text-green-700 dark:text-green-300">
                      {sizeDifference >= 0 ? 'Space saved:' : 'Size increase:'} <span className="font-medium">{spaceSaved}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleDownload}
                    disabled={!imageData.processedDataUrl || isProcessing}
                    className="w-full bg-red-500 hover:bg-red-600"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    {isProcessing ? 'Processing...' : 'Download Compressed Image'}
                  </Button>
                  {batchImages.length > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        batchImages.forEach((item) => {
                          const link = document.createElement('a');
                          link.href = item.processedDataUrl ?? item.originalDataUrl;
                          link.download = `compressed_${item.originalFile.name.replace(/\.[^/.]+$/, '')}.${(item.settings.format === 'jpeg' ? 'jpg' : item.settings.format)}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                      }}
                      className="w-full"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      Download All Batch Files
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBatchImages([]);
                      setSelectedBatchIndex(0);
                      setBatchProgress({ completed: 0, total: 0 });
                      setBatchError(null);
                      reset();
                    }}
                    className="w-full"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Start Over
                  </Button>
                </div>

                {batchImages.length > 1 && (
                  <div className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Batch results</p>
                      {batchSummary && (
                        <Badge variant="secondary" className="text-xs">
                          {batchSummary.percentSaved < 0
                            ? `${Math.abs(batchSummary.percentSaved)}% larger`
                            : `${batchSummary.percentSaved}% saved`}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {batchProgress.total > 0 ? `${batchProgress.completed}/${batchProgress.total} files processed` : `${batchImages.length} files processed`}
                    </p>
                    <div className="space-y-2">
                      {batchImages.map((item, index) => (
                        <button
                          key={`${item.originalFile.name}-${index}`}
                          onClick={() => {
                            setSelectedBatchIndex(index);
                            setImageData(item);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                            selectedBatchIndex === index
                              ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950/30 dark:text-red-200'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-red-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          <span className="truncate">{item.originalFile.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.processedSize
                              ? `${formatSize(Math.abs(item.originalFile.size - item.processedSize))} ${item.originalFile.size >= item.processedSize ? 'saved' : 'larger'}`
                              : 'Ready'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="animate-in stagger-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-red-500" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">Live Preview</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("single")}
                      className={`p-2 rounded-xl transition-colors ${
                        viewMode === "single"
                          ? "bg-red-500 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      aria-label="Single view"
                      aria-pressed={viewMode === "single"}
                    >
                      <ZoomIn className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setViewMode("compare")}
                      className={`p-2 rounded-xl transition-colors ${
                        viewMode === "compare"
                          ? "bg-red-500 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      aria-label="Compare view"
                      aria-pressed={viewMode === "compare"}
                    >
                      <ZoomOut className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">

                {viewMode === "compare" && imageData.processedDataUrl ? (
                  /* Compare View */
                  <div className="grid grid-cols-2">
                    <PreviewPane
                      label="Original"
                      src={imageData.originalDataUrl}
                      fileSize={formatSize(imageData.originalFile.size)}
                      format={originalFormat}
                    />
                    <PreviewPane
                      label="Compressed"
                      src={imageData.processedDataUrl}
                      fileSize={imageData.processedSize ? formatSize(imageData.processedSize) : 'Processing...'}
                      format={processedFormat}
                      isLoading={isProcessing}
                    />
                  </div>
                ) : (
                  /* Single View */
                  <PreviewPane
                    label={viewMode === "compare" ? "Compressed" : showOriginal ? "Original" : "Compressed"}
                    src={showOriginal ? imageData.originalDataUrl : (imageData.processedDataUrl || imageData.originalDataUrl)}
                    fileSize={showOriginal ? formatSize(imageData.originalFile.size) : (imageData.processedSize ? formatSize(imageData.processedSize) : 'Processing...')}
                    format={showOriginal ? originalFormat : processedFormat}
                    isLoading={isProcessing && !showOriginal}
                    fullWidth
                  />
                )}

                {/* Stats Bar */}
                {imageData.processedDataUrl && imageData.processedSize && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <StatItem
                        label="Size Reduction"
                        value={getCompressionLabel()}
                        icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                      />
                      <StatItem
                        label="Space Saved"
                        value={spaceSaved}
                        icon={<Download className="w-5 h-5 text-blue-500" />}
                      />
                      <StatItem
                        label="Quality Level"
                        value={`${imageData.settings.quality}%`}
                        icon={<Settings className="w-5 h-5 text-purple-500" />}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewPane({
  label,
  src,
  fileSize,
  format,
  isLoading = false,
  fullWidth = false,
}: {
  label: string;
  src: string;
  fileSize: string;
  format: string;
  isLoading?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${fullWidth ? 'col-span-2' : ''} relative min-h-[400px] flex flex-col`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h3>
          <Badge variant="secondary" className="text-xs">{format}</Badge>
        </div>
      </div>
      <div className="relative flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden" style={{ aspectRatio: fullWidth ? '16/9' : '4/3' }}>
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing...</p>
          </div>
        ) : (
          <img
            src={src}
            alt={`${label} image`}
            className="max-w-full max-h-full object-contain"
          />
        )}
        {!isLoading && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-black/60 rounded-lg text-white text-xs">
            <span>{fileSize}</span>
            <Badge variant="secondary" className="text-xs bg-white/20">{format}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}