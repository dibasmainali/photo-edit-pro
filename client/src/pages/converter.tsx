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
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-card mb-4">
              Photo Converter
            </h1>
            <p className="text-xl text-card/80 max-w-2xl mx-auto">
              Convert your images between JPEG, PNG, and WebP formats with perfect quality preservation
            </p>
          </div>

          <Card className="feature-card card-glow shadow-2xl border-0">
            <CardContent className="p-8">
              <FileUploadZone
                onFileSelect={handleFileSelect}
                icon={<RefreshCw className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />}
                title="Drop your image here"
                description="or click to browse files for conversion"
                supportedFormats="Supports: JPEG, PNG, WebP • Max size: 10MB"
                testId="converter-upload"
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
            Photo Converter
          </h1>
          <p className="text-xl text-card/80 max-w-2xl mx-auto">
            Convert between image formats with perfect quality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Conversion Panel */}
          <Card className="feature-card card-glow shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-heading">
                <RefreshCw className="mr-3 text-primary" />
                Format Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Current Format Display */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Badge variant="outline" className="text-lg font-bold px-4 py-2">
                    {getOriginalFormat().toUpperCase()}
                  </Badge>
                  <ArrowRight className="h-6 w-6 text-primary" />
                  <Badge variant="default" className="text-lg font-bold px-4 py-2 hero-gradient text-white">
                    {imageData.settings.format.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Converting from {getOriginalFormat().toUpperCase()} to {imageData.settings.format.toUpperCase()}
                </p>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-lg font-medium text-foreground mb-4 block">Choose Output Format</label>
                <div className="space-y-3">
                  {supportedFormats.map((format) => (
                    <Button
                      key={format.value}
                      variant={imageData.settings.format === format.value ? "default" : "secondary"}
                      className={`w-full justify-start text-left h-auto py-4 px-4 ${
                        imageData.settings.format === format.value 
                          ? "hero-gradient text-white shadow-lg shadow-primary/30" 
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => handleFormatChange(format.value)}
                      data-testid={`button-format-${format.value}`}
                    >
                      <div>
                        <div className="font-bold text-base">{format.label}</div>
                        <div className={`text-sm ${
                          imageData.settings.format === format.value 
                            ? "text-white/80" 
                            : "text-muted-foreground"
                        }`}>
                          {format.description}
                        </div>
                      </div>
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
                      <span className="text-muted-foreground">Original Format:</span>
                      <span className="font-medium" data-testid="text-original-format">
                        {getOriginalFormat().toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Format:</span>
                      <span className="font-medium text-primary" data-testid="text-new-format">
                        {imageData.settings.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium" data-testid="text-file-size-converter">
                        {formatFileSize(imageData.originalSize)}
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
                  data-testid="button-download-converted"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Converted Image
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  size="lg"
                  onClick={reset}
                  data-testid="button-convert-another"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Convert Another Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="feature-card card-glow shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-heading">
                <Eye className="mr-3 text-primary" />
                Conversion Preview
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
                    data-testid="button-show-original-converter"
                  >
                    Original ({getOriginalFormat().toUpperCase()})
                  </Button>
                  <Button
                    variant={!showOriginal ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowOriginal(false)}
                    data-testid="button-show-converted"
                  >
                    Converted ({imageData.settings.format.toUpperCase()})
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
                  <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <RefreshCw className="inline w-3 h-3 mr-1" />
                    {imageData.settings.format.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Format Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-original-format-display">
                    {getOriginalFormat().toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">Original Format</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success" data-testid="text-converted-format-display">
                    {imageData.settings.format.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">New Format</div>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center space-x-2">
                <Button variant="secondary" size="icon" data-testid="button-zoom-out-converter">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-medium px-3">100%</span>
                <Button variant="secondary" size="icon" data-testid="button-zoom-in-converter">
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