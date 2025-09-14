import { useState, useEffect } from "react";
import { Download, RotateCcw, Palette, Eye, ZoomIn, ZoomOut, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { useImageProcessing } from "@/hooks/use-image-processing";
import { imagePresets } from "@/lib/image-utils";

export default function Enhancer() {
  const {
    imageData,
    isProcessing,
    uploadImage,
    updateSettings,
    downloadProcessedImage,
    reset,
    formatFileSize,
  } = useImageProcessing();

  const [showOriginal, setShowOriginal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileSelect = (file: File) => {
    uploadImage(file);
  };

  const handleBrightnessChange = (value: number[]) => {
    updateSettings({ brightness: value[0] });
  };

  const handleContrastChange = (value: number[]) => {
    updateSettings({ contrast: value[0] });
  };

  const handleSaturationChange = (value: number[]) => {
    updateSettings({ saturation: value[0] });
  };

  const handlePresetApply = (preset: typeof imagePresets[0]) => {
    updateSettings({
      brightness: preset.brightness,
      contrast: preset.contrast,
      saturation: preset.saturation,
    });
  };

  const handleReset = () => {
    updateSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
    });
  };

  const handleDownload = () => {
    if (imageData) {
      const filename = `enhanced_${imageData.originalFile.name}`;
      downloadProcessedImage(filename);
    }
  };

  if (!imageData) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-card mb-4">
              Photo Enhancer
            </h1>
            <p className="text-xl text-card/80 max-w-2xl mx-auto">
              Enhance your photos with real-time editing controls and live preview
            </p>
          </div>

          <Card className="feature-card card-glow shadow-2xl border-0">
            <CardContent className="p-8">
              <FileUploadZone
                onFileSelect={handleFileSelect}
                icon={<Palette className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />}
                title="Drop your image here"
                description="or click to browse files for enhancement"
                supportedFormats="Supports: JPEG, PNG, WebP • Max size: 10MB"
                testId="enhancer-upload"
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
            Photo Enhancer
          </h1>
          <p className="text-xl text-card/80 max-w-2xl mx-auto">
            Enhance your photos with real-time editing controls
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <Card className="feature-card card-glow shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-heading">
                <Palette className="mr-3 text-primary" />
                Enhancement Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Brightness Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-medium text-foreground">Brightness</label>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {imageData.settings.brightness > 0 ? '+' : ''}{imageData.settings.brightness}
                  </Badge>
                </div>
                <Slider
                  value={[imageData.settings.brightness]}
                  onValueChange={handleBrightnessChange}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                  data-testid="slider-brightness"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Darker</span>
                  <span>Brighter</span>
                </div>
              </div>

              {/* Contrast Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-medium text-foreground">Contrast</label>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {imageData.settings.contrast > 0 ? '+' : ''}{imageData.settings.contrast}
                  </Badge>
                </div>
                <Slider
                  value={[imageData.settings.contrast]}
                  onValueChange={handleContrastChange}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                  data-testid="slider-contrast"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Less Contrast</span>
                  <span>More Contrast</span>
                </div>
              </div>

              {/* Saturation Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-medium text-foreground">Saturation</label>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {imageData.settings.saturation > 0 ? '+' : ''}{imageData.settings.saturation}
                  </Badge>
                </div>
                <Slider
                  value={[imageData.settings.saturation]}
                  onValueChange={handleSaturationChange}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                  data-testid="slider-saturation"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Desaturated</span>
                  <span>Vibrant</span>
                </div>
              </div>

              {/* Preset Filters */}
              <div>
                <label className="text-lg font-medium text-foreground mb-4 block">Quick Presets</label>
                <div className="grid grid-cols-2 gap-3">
                  {imagePresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="secondary"
                      className="font-medium h-auto py-3 px-4 text-sm"
                      onClick={() => handlePresetApply(preset)}
                      data-testid={`button-preset-${preset.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {preset.name}
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
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium" data-testid="text-file-size">
                        {formatFileSize(imageData.originalSize)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium uppercase">
                        {imageData.originalFile.type.split('/')[1]}
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
                  disabled={isProcessing}
                  data-testid="button-download-enhanced"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Enhanced Image
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleReset}
                    data-testid="button-reset-changes"
                  >
                    <Undo className="mr-2 h-4 w-4" />
                    Reset Changes
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={reset}
                    data-testid="button-new-image"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    New Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="feature-card card-glow shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-heading">
                <Eye className="mr-3 text-primary" />
                Live Preview
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
                    data-testid="button-show-original-enhancer"
                  >
                    Original
                  </Button>
                  <Button
                    variant={!showOriginal ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowOriginal(false)}
                    data-testid="button-show-enhanced"
                  >
                    Enhanced
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
                    data-testid="image-original-enhancer"
                  />
                ) : (
                  <img
                    src={imageData.processedDataUrl || imageData.originalDataUrl}
                    alt="Enhanced image"
                    className="w-full h-full object-contain"
                    data-testid="image-enhanced"
                  />
                )}

                {/* Live Enhancement Indicator */}
                {!showOriginal && !isProcessing && (
                  <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-success-foreground rounded-full mr-1 animate-pulse"></div>
                      Live
                    </div>
                  </div>
                )}
              </div>

              {/* Enhancement Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-brightness-level">
                    {imageData.settings.brightness > 0 ? '+' : ''}{imageData.settings.brightness}
                  </div>
                  <div className="text-xs text-muted-foreground">Brightness</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-contrast-level">
                    {imageData.settings.contrast > 0 ? '+' : ''}{imageData.settings.contrast}
                  </div>
                  <div className="text-xs text-muted-foreground">Contrast</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-saturation-level">
                    {imageData.settings.saturation > 0 ? '+' : ''}{imageData.settings.saturation}
                  </div>
                  <div className="text-xs text-muted-foreground">Saturation</div>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center space-x-2">
                <Button variant="secondary" size="icon" data-testid="button-zoom-out-enhancer">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-medium px-3">100%</span>
                <Button variant="secondary" size="icon" data-testid="button-zoom-in-enhancer">
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
