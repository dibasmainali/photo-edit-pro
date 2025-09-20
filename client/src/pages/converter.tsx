import { useState, useEffect } from "react";
import { Download, RotateCcw, RefreshCw, Eye, ZoomIn, ZoomOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { useImageProcessing } from "@/hooks/use-image-processing";

export default function Converter() {
  const {
    imageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    formatFileSize,
  } = useImageProcessing();

  const [showOriginal, setShowOriginal] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Photo Converter";
  }, []);

  const handleFileSelect = (file: File) => {
    uploadImage(file);
  };

  const handleFormatChange = (format: 'jpeg' | 'png' | 'webp') => {
    updateSettings({ format, quality: format === 'jpeg' ? 95 : 100 });
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
    { value: 'jpeg' as const, label: 'JPEG', description: 'Best for photos, smaller files' },
    { value: 'png' as const, label: 'PNG', description: 'Best for graphics, transparency' },
    { value: 'webp' as const, label: 'WebP', description: 'Modern format, great compression' }
  ];

  if (!imageData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Photo Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Convert your images between JPEG, PNG, and WebP formats with perfect quality preservation
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Upload Your Image
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Drop your image to start converting between formats
            </p>
            <FileUploadZone
              onFileSelect={handleFileSelect}
              icon={<RefreshCw className="mx-auto mb-6 h-20 w-20 text-gray-400" />}
              title="Drop your image here"
              description="or click to browse files for conversion"
              supportedFormats="Supports: JPEG, PNG, WebP • Max size: 10MB"
              testId="converter-upload"
              isLoading={isProcessing}
            />
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Conversion Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <RefreshCw className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Format Flexibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  Convert between JPEG, PNG, and WebP formats seamlessly. Choose the best format for your needs.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Quality Preservation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Maintain maximum image quality during conversion with our advanced processing algorithms.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Download className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant Download</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your converted images instantly. No waiting, no registration required.
                </p>
              </div>
            </div>
          </div>

          {/* Format Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Choose the Right Format</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JPG</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Best for Photos</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Smaller file sizes</li>
                  <li>• Great for photographs</li>
                  <li>• Widely supported</li>
                  <li>• Lossy compression</li>
                </ul>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PNG</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Best for Graphics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Supports transparency</li>
                  <li>• Lossless compression</li>
                  <li>• Perfect for logos</li>
                  <li>• Larger file sizes</li>
                </ul>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">WebP</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Modern & Efficient</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Superior compression</li>
                  <li>• Supports transparency</li>
                  <li>• Modern browsers</li>
                  <li>• Best quality/size ratio</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  1
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Upload Image</h4>
                <p className="text-gray-600 leading-relaxed">
                  Drop your image or click to browse files
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  2
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Choose Format</h4>
                <p className="text-gray-600 leading-relaxed">
                  Select your desired output format
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  3
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Preview Result</h4>
                <p className="text-gray-600 leading-relaxed">
                  See the conversion result instantly
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  4
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Download</h4>
                <p className="text-gray-600 leading-relaxed">
                  Get your converted image instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Photo Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert between image formats with perfect quality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Conversion Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <RefreshCw className="mr-3 text-red-500 h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Format Conversion</h2>
            </div>
            <div className="space-y-8">
              {/* Current Format Display */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-lg font-bold px-4 py-2 bg-gray-100 rounded border text-gray-700">
                    {getOriginalFormat().toUpperCase()}
                  </span>
                  <ArrowRight className="h-6 w-6 text-red-500" />
                  <span className="text-lg font-bold px-4 py-2 bg-red-500 text-white rounded">
                    {imageData.settings.format.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Converting from {getOriginalFormat().toUpperCase()} to {imageData.settings.format.toUpperCase()}
                </p>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-lg font-medium text-gray-800 mb-4 block">Choose Output Format</label>
                <div className="space-y-3">
                  {supportedFormats.map((format) => (
                    <Button
                      key={format.value}
                      variant={imageData.settings.format === format.value ? "default" : "secondary"}
                      className={`w-full justify-start text-left h-auto py-4 px-4 ${
                        imageData.settings.format === format.value 
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg" 
                          : "bg-gray-50 hover:bg-red-50 border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleFormatChange(format.value)}
                      data-testid={`button-format-${format.value}`}
                    >
                      <div>
                        <div className="font-bold text-base">{format.label}</div>
                        <div className={`text-sm ${
                          imageData.settings.format === format.value 
                            ? "text-white/80" 
                            : "text-gray-600"
                        }`}>
                          {format.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">File Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Format:</span>
                    <span className="font-medium text-gray-800" data-testid="text-original-format">
                      {getOriginalFormat().toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Format:</span>
                    <span className="font-medium text-red-500" data-testid="text-new-format">
                      {imageData.settings.format.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-medium text-gray-800" data-testid="text-file-size-converter">
                      {formatFileSize(imageData.originalSize)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  size="lg"
                  onClick={handleDownload}
                  disabled={!imageData.processedDataUrl || isProcessing}
                  data-testid="button-download-converted"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Converted Image
                </Button>
                <Button
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  variant="outline"
                  size="lg"
                  onClick={reset}
                  data-testid="button-convert-another"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Convert Another Image
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Eye className="mr-3 text-red-500 h-6 w-6" />
                <h2 className="text-2xl font-bold text-gray-800">Conversion Preview</h2>
              </div>
              <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                <Button
                  variant={showOriginal ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowOriginal(true)}
                  className={showOriginal ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-600 hover:text-gray-800"}
                  data-testid="button-show-original-converter"
                >
                  Original ({getOriginalFormat().toUpperCase()})
                </Button>
                <Button
                  variant={!showOriginal ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowOriginal(false)}
                  className={!showOriginal ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-600 hover:text-gray-800"}
                  data-testid="button-show-converted"
                >
                  Converted ({imageData.settings.format.toUpperCase()})
                </Button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {showOriginal ? (
                <img
                  src={imageData.originalDataUrl}
                  alt="Original image"
                  className="w-full h-full object-contain"
                  data-testid="image-original-converter"
                />
              ) : (
                <img
                  src={imageData.processedDataUrl || imageData.originalDataUrl}
                  alt="Converted image"
                  className="w-full h-full object-contain"
                  data-testid="image-converted"
                />
              )}
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="font-medium">Converting...</p>
                  </div>
                </div>
              )}

              {/* Format Indicator */}
              {!showOriginal && !isProcessing && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <RefreshCw className="inline w-3 h-3 mr-1" />
                  {imageData.settings.format.toUpperCase()}
                </div>
              )}
            </div>

            {/* Format Details */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800" data-testid="text-original-format-display">
                    {getOriginalFormat().toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600">Original Format</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500" data-testid="text-converted-format-display">
                    {imageData.settings.format.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600">New Format</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}