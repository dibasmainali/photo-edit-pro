import { useState, useEffect } from "react";
import { Download, RotateCcw, Settings, Image as ImageIcon, Eye, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { useImageProcessing } from "@/hooks/use-image-processing";

export default function Compressor() {
  const {
    imageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    getCompressionRatio,
    formatFileSize,
    checkWebPSupport,
  } = useImageProcessing();

  const [showOriginal, setShowOriginal] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Photo Compressor";
  }, []);

  const handleFileSelect = (file: File) => {
    uploadImage(file);
  };

  const handleQualityChange = (value: number[]) => {
    updateSettings({ quality: value[0] });
  };

  const handleFormatChange = (format: 'jpeg' | 'png' | 'webp') => {
    updateSettings({ format });
  };

  const handleDownload = () => {
    if (imageData) {
      const extension = imageData.settings.format === 'jpeg' ? 'jpg' : imageData.settings.format;
      const filename = `compressed_${imageData.originalFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      downloadProcessedImage(filename);
    }
  };

  if (!imageData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Photo Compressor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Reduce file sizes by up to 80% while maintaining visual quality with our advanced compression algorithms and real-time preview.
            </p>
          </div>

          {/* Why Compress Images - Moved to top */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Why Compress Images?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Faster Loading</h3>
                <p className="text-gray-600 text-sm">
                  Smaller files load faster on websites and apps, improving user experience
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Save Space</h3>
                <p className="text-gray-600 text-sm">
                  Reduce storage requirements for cloud services and devices
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Lower Costs</h3>
                <p className="text-gray-600 text-sm">
                  Reduce bandwidth usage and hosting costs for websites
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Better SEO</h3>
                <p className="text-gray-600 text-sm">
                  Faster loading images improve SEO and search rankings
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Drop Your Images Here
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Upload single or multiple images for batch processing
            </p>
            <FileUploadZone
              onFileSelect={handleFileSelect}
              icon={<ImageIcon className="mx-auto mb-6 h-20 w-20 text-gray-400" />}
              title="Drop your images here"
              description="or click to browse files • Supports batch processing"
              supportedFormats="Supports: JPEG, PNG, WebP • Max size: 10MB per file"
              testId="compressor-upload"
              isLoading={isProcessing}
            />
          </div>

          {/* Powerful Features */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Settings className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Compression</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced AI algorithms automatically optimize compression settings for maximum size reduction with minimal quality loss.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Live Preview</h3>
                <p className="text-gray-600 leading-relaxed">
                  See compression results instantly with before/after comparison and real-time file size updates.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <RefreshCw className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Multiple Formats</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compress JPEG, PNG, and WebP images with format-specific optimization for best results.
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
            Photo Compressor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Adjust settings and see real-time compression results
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Settings className="mr-3 text-red-500 h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Compression Settings</h2>
            </div>

            <div className="space-y-6">
              {/* File Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">Original File</span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{imageData.originalFile.name}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Size: {formatFileSize(imageData.originalFile.size)}</div>
                  <div>Format: {imageData.originalFile.type}</div>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-800">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['jpeg', 'png', 'webp'] as const).map((format) => (
                    <Button
                      key={format}
                      variant={imageData.settings.format === format ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ format })}
                      className={`text-xs ${imageData.settings.format === format 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality Slider */}
              {imageData.settings.format !== 'png' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-800">Quality</label>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{imageData.settings.quality}%</span>
                  </div>
                  <Slider
                    value={[imageData.settings.quality]}
                    onValueChange={(value) => updateSettings({ quality: value[0] })}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Processed File Info */}
              {imageData.processedDataUrl && imageData.processedSize && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Compressed File</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      {Math.round((1 - imageData.processedSize / imageData.originalFile.size) * 100)}% smaller
                    </span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <div>Size: {formatFileSize(imageData.processedSize)}</div>
                    <div>Format: {imageData.settings.format.toUpperCase()}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={handleDownload} 
                  disabled={!imageData.processedDataUrl || isProcessing} 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  onClick={reset} 
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Split-Screen Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Eye className="mr-3 text-red-500 h-6 w-6" />
                <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-gray-600 hover:text-gray-800"
              >
                {showOriginal ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                {showOriginal ? 'Show Split' : 'Toggle View'}
              </Button>
            </div>

            <div className="space-y-4">
              {/* Before/After Comparison */}
              {!showOriginal && imageData.processedDataUrl ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Original */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Original</h3>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={imageData.originalDataUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {formatFileSize(imageData.originalFile.size)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Compressed */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Compressed</h3>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      {isProcessing ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto mb-2"></div>
                            <p className="text-xs text-gray-600">Processing...</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <img
                            src={imageData.processedDataUrl}
                            alt="Compressed"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {imageData.processedSize ? formatFileSize(imageData.processedSize) : 'Processing...'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Single View */
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {showOriginal ? 'Original Image' : 'Compressed Image'}
                  </h3>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {isProcessing ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Processing...</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={showOriginal ? imageData.originalDataUrl : (imageData.processedDataUrl || imageData.originalDataUrl)}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Compression Stats */}
              {imageData.processedDataUrl && imageData.processedSize && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Compression Results</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-500">
                        {Math.round((1 - imageData.processedSize / imageData.originalFile.size) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Size Reduction</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatFileSize(imageData.originalFile.size - imageData.processedSize)}
                      </div>
                      <div className="text-xs text-gray-600">Space Saved</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {imageData.settings.quality}%
                      </div>
                      <div className="text-xs text-gray-600">Quality Level</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
