import { useState, useEffect } from "react";
import { Download, RotateCcw, RefreshCw, Eye, ArrowRight, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { useImageProcessing } from "@/hooks/use-image-processing";
import { formatFileSize } from "@/lib/image-utils";

export default function Converter() {
  const {
    imageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    formatFileSize: formatSize,
  } = useImageProcessing();

  const [showOriginal, setShowOriginal] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Photo Converter";
  }, []);

  const handleFileSelect = (file: File) => {
    uploadImage(file);
  };

  const handleFormatChange = (format: 'jpeg' | 'png' | 'webp') => {
    // Preserve current quality when switching formats
    // Only reset to default if current quality would be invalid for new format
    const newQuality = format === 'png' ? 100 : imageData?.settings.quality ?? 95;
    updateSettings({ format, quality: newQuality });
  };

  const handleDownload = () => {
    if (imageData) {
      const extension = imageData.settings.format === 'jpeg' ? 'jpg' : imageData.settings.format;
      const filename = `converted_${imageData.originalFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      downloadProcessedImage(filename);
    }
  };

  const getOriginalFormat = () => {
    if (!imageData) return '';
    const type = imageData.originalFile.type.split('/')[1];
    return type === 'jpeg' ? 'jpg' : type;
  };

  const supportedFormats = [
    { value: 'jpeg' as const, label: 'JPEG', desc: 'Best for photos, smaller files', icon: '📷' },
    { value: 'png' as const, label: 'PNG', desc: 'Best for graphics, transparency', icon: '🎨' },
    { value: 'webp' as const, label: 'WebP', desc: 'Modern format, great compression', icon: '⚡' },
  ];

  if (!imageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-16 animate-in">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Format Conversion • Quality Preservation • Instant Results
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-2 sm:mb-6">
                Photo Converter
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-10 leading-relaxed">
                <span className="sm:hidden">Convert photos to JPEG, PNG, or WebP in your browser.</span>
                <span className="hidden sm:inline">Convert your images between JPEG, PNG, and WebP formats with perfect quality preservation.</span>
              </p>

              <Card className="p-4 sm:p-8 md:p-12">
                <div className="hidden sm:block mx-auto max-w-md mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-red-500" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Upload Your Image
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drop your image to start converting between formats
                  </p>
                </div>

                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  icon={<RefreshCw className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />}
                  title="Drop an image here"
                  description="Choose or drop • 10MB max"
                  supportedFormats="JPEG • PNG • WebP"
                  testId="converter-upload"
                  isLoading={isProcessing}
                  compact
                />
              </Card>
            </div>

            <div className="hidden md:grid mt-16 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: ImageIcon, title: "Format Flexibility", desc: "Convert between JPEG, PNG, WebP seamlessly" },
                { icon: Eye, title: "Quality Preservation", desc: "Maintain maximum quality during conversion" },
                { icon: Download, title: "Instant Download", desc: "Get converted images instantly, no waiting" },
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

            <div className="hidden md:block mt-16 max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white text-center mb-10">Choose the Right Format</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { format: 'JPG', color: 'bg-blue-500', items: ['Smaller file sizes', 'Great for photographs', 'Widely supported', 'Lossy compression'] },
                  { format: 'PNG', color: 'bg-green-500', items: ['Supports transparency', 'Lossless compression', 'Perfect for logos', 'Larger file sizes'] },
                  { format: 'WebP', color: 'bg-purple-500', items: ['Superior compression', 'Supports transparency', 'Modern browsers', 'Best quality/size'] },
                ].map((item, index) => (
                  <Card key={item.format} className="p-6 text-center animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${item.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{item.format}</span>
                    </div>
                    <h4 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">
                      {item.format === 'JPG' ? 'Best for Photos' : item.format === 'PNG' ? 'Best for Graphics' : 'Modern & Efficient'}
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      {item.items.map((text, i) => (
                        <li key={i} className="flex items-center gap-2 justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const originalFormat = getOriginalFormat().toUpperCase();
  const newFormat = imageData.settings.format.toUpperCase();
  const extension = imageData.settings.format === 'jpeg' ? 'jpg' : imageData.settings.format;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
      <div className="container">
        <div className="mb-8 animate-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Photo Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Convert between image formats with perfect quality</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Conversion Panel */}
          <div className="animate-in stagger-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Format Conversion</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Format Display */}
                <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
                    <Badge variant="secondary" className="px-4 py-2 text-base">{originalFormat}</Badge>
                    <ArrowRight className="w-6 h-6 text-red-500 flex-shrink-0" aria-hidden="true" />
                    <Badge variant="default" className="px-4 py-2 text-base">{newFormat}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Converting from {originalFormat} to {newFormat}
                  </p>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Choose Output Format</label>
                  <div className="space-y-2">
                    {supportedFormats.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => handleFormatChange(format.value)}
                        className={`w-full px-4 py-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4 ${
                          imageData.settings.format === format.value
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                        }`}
                        role="radio"
                        aria-checked={imageData.settings.format === format.value}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                          {format.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{format.label}</div>
                          <div className="text-sm opacity-80">{format.desc}</div>
                        </div>
                        {imageData.settings.format === format.value && (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">File Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Original Format:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{originalFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">New Format:</span>
                      <span className="font-medium text-red-500">{newFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatSize(imageData.originalSize)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600"
                    size="lg"
                    onClick={handleDownload}
                    disabled={!imageData.processedDataUrl || isProcessing}
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    {isProcessing ? 'Converting...' : 'Download Converted Image'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    className="w-full"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Convert Another Image
                  </Button>
                </div>
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
                    <CardTitle className="text-xl">Conversion Preview</CardTitle>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => setShowOriginal(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        showOriginal
                          ? "bg-red-500 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      aria-pressed={showOriginal}
                    >
                      Original ({originalFormat})
                    </button>
                    <button
                      onClick={() => setShowOriginal(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !showOriginal
                          ? "bg-red-500 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      aria-pressed={!showOriginal}
                    >
                      Converted ({newFormat})
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative min-h-[260px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '16/9' }}>
                  {showOriginal ? (
                    <img
                      src={imageData.originalDataUrl}
                      alt="Original image"
                      className="max-w-full max-h-full object-contain px-4"
                    />
                  ) : (
                    <>
                      <img
                        src={imageData.processedDataUrl || imageData.originalDataUrl}
                        alt="Converted image"
                        className="max-w-full max-h-full object-contain px-4"
                      />
                      {!isProcessing && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" aria-hidden="true" />
                          {newFormat}
                        </div>
                      )}
                    </>
                  )}

                  {isProcessing && !showOriginal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                        <p className="font-medium">Converting...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Format Details */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{originalFormat}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Original Format</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800">
                      <div className="text-3xl font-bold text-red-500 mb-1">{newFormat}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">New Format</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}