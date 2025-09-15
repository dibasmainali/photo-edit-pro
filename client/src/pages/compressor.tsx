import { useState, useEffect } from "react";
import { Download, RotateCcw, Settings, Image as ImageIcon, Eye, ZoomIn, ZoomOut } from "lucide-react";
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
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-card mb-4">
              Photo Compressor
            </h1>
            <p className="text-xl text-card/80 max-w-2xl mx-auto">
              Reduce file sizes while maintaining visual quality with our advanced compression engine
            </p>
          </div>

          <Card className="feature-card card-glow shadow-2xl border-0">
            <CardContent className="p-8">
              <FileUploadZone
                onFileSelect={handleFileSelect}
                icon={<ImageIcon className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />}
                title="Drop your image here"
                description="or click to browse files"
                supportedFormats="Supports: JPEG, PNG, WebP • Max size: 10MB"
                testId="compressor-upload"
                isLoading={isProcessing}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-card mb-4">
            Photo Compressor
          </h1>
          <p className="text-xl text-card/80 max-w-2xl mx-auto">
            Reduce file sizes while maintaining visual quality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <Card className="feature-card card-glow shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-heading">
                <Settings className="mr-3 text-primary" />
                Compression Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Quality Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-medium text-foreground">Quality Level</label>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {imageData.settings.quality}%
                  </Badge>
                </div>
                <Slider
                  value={[imageData.settings.quality]}
                  onValueChange={handleQualityChange}
                  max={100}
                  min={10}
                  step={1}
                  className="w-full"
                  data-testid="slider-quality"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>High Compression</span>
                  <span>High Quality</span>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-lg font-medium text-foreground mb-4 block">Output Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['jpeg', 'png', 'webp'] as const).map((format) => (
                    <Button
                      key={format}
                      variant={imageData.settings.format === format ? "default" : "secondary"}
                      className="font-medium"
                      onClick={() => handleFormatChange(format)}
                      data-testid={`button-format-${format}`}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* File Info */}
              <Card className="bg-muted border-0">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-3">File Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Original Size:</span>
                      <span className="font-medium" data-testid="text-original-size">
                        {formatFileSize(imageData.originalSize)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compressed Size:</span>
                      <span className="font-medium text-success" data-testid="text-compressed-size">
                        {imageData.processedSize ? formatFileSize(imageData.processedSize) : 'Processing...'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reduction:</span>
                      <span className="font-bold text-success" data-testid="text-reduction">
                        {getCompressionRatio()}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-success hover:bg-success/90"
                  size="lg"
                  onClick={handleDownload}
                  disabled={!imageData.processedDataUrl || isProcessing}
                  data-testid="button-download-compressed"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Compressed Image
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  size="lg"
                  onClick={reset}
                  data-testid="button-process-another"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Process Another Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="feature-card card-glow shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-heading">
                <ImageIcon className="mr-3 text-primary" />
                Image Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Before/After Toggle */}
              <div className="flex items-center justify-center">
                <div className="bg-muted rounded-lg p-1 inline-flex">
                  <Button
                    variant={showOriginal ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowOriginal(true)}
                    data-testid="button-show-original"
                  >
                    Original
                  </Button>
                  <Button
                    variant={!showOriginal ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowOriginal(false)}
                    data-testid="button-show-compressed"
                  >
                    Compressed
                  </Button>
                </div>
              </div>

              {/* Image Container */}
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                {showOriginal ? (
                  <img
                    src={imageData.originalDataUrl}
                    alt="Original image"
                    className="w-full h-full object-contain"
                    data-testid="image-original"
                  />
                ) : (
                  <img
                    src={imageData.processedDataUrl || imageData.originalDataUrl}
                    alt="Compressed image"
                    className="w-full h-full object-contain"
                    data-testid="image-compressed"
                  />
                )}
                
                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="font-medium">Processing...</p>
                    </div>
                  </div>
                )}

                {/* Live Indicator */}
                {!showOriginal && !isProcessing && (
                  <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <Eye className="inline w-3 h-3 mr-1" />
                    Live
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center space-x-2">
                <Button variant="secondary" size="icon" data-testid="button-zoom-out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-medium px-3">100%</span>
                <Button variant="secondary" size="icon" data-testid="button-zoom-in">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
