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
    document.title = "PhotoPro — Photo Enhancer";
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
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Photo Enhancer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your photos with professional-grade enhancement tools. Adjust brightness, contrast, and saturation with real-time preview.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Upload Your Photo
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Drop your image to start enhancing with professional tools
            </p>
            <FileUploadZone
              onFileSelect={handleFileSelect}
              icon={<Palette className="mx-auto mb-6 h-20 w-20 text-gray-400" />}
              title="Drop your image here"
              description="or click to browse files for enhancement"
              supportedFormats="Supports: JPEG, PNG, WebP • Max size: 10MB"
              testId="enhancer-upload"
              isLoading={isProcessing}
            />
          </div>

          {/* Enhancement Features */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Enhancement Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Palette className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Real-Time Editing</h3>
                <p className="text-gray-600 leading-relaxed">
                  See your changes instantly as you adjust brightness, contrast, and saturation with live preview.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Presets</h3>
                <p className="text-gray-600 leading-relaxed">
                  Apply professional presets like Auto Enhance, Warm Tone, Cool Tone, and Black & White instantly.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Download className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Quality Preservation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Maintain original image quality while enhancing colors and exposure with advanced algorithms.
                </p>
              </div>
            </div>
          </div>

          {/* Enhancement Tools */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Enhancement Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Brightness</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Adjust overall brightness to fix under or overexposed photos
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Contrast</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Enhance the difference between light and dark areas
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Saturation</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Make colors more vibrant or create subtle, muted tones
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-red-50 transition-colors duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Undo className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Presets</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Apply professional filters and effects with a single click
                </p>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              How to Enhance
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  1
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Upload Photo</h4>
                <p className="text-gray-600 leading-relaxed">
                  Drop your image or click to browse files
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  2
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Choose Preset</h4>
                <p className="text-gray-600 leading-relaxed">
                  Try our smart presets or start with manual adjustments
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  3
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Fine-tune</h4>
                <p className="text-gray-600 leading-relaxed">
                  Adjust sliders to perfect your enhancement
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  4
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Download</h4>
                <p className="text-gray-600 leading-relaxed">
                  Save your enhanced photo in high quality
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
            Photo Enhancer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Adjust settings and see real-time enhancement results
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Palette className="mr-3 text-red-500 h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Enhancement Controls</h2>
            </div>
            <div className="space-y-8">
              {/* Brightness Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-medium text-gray-800">Brightness</label>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {imageData.settings.brightness > 0 ? '+' : ''}{imageData.settings.brightness}
                  </span>
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Darker</span>
                  <span>Brighter</span>
                </div>
              </div>

              {/* Contrast Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-medium text-gray-800">Contrast</label>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {imageData.settings.contrast > 0 ? '+' : ''}{imageData.settings.contrast}
                  </span>
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Less Contrast</span>
                  <span>More Contrast</span>
                </div>
              </div>

              {/* Saturation Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-medium text-gray-800">Saturation</label>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {imageData.settings.saturation > 0 ? '+' : ''}{imageData.settings.saturation}
                  </span>
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Desaturated</span>
                  <span>Vibrant</span>
                </div>
              </div>

              {/* Preset Filters */}
              <div>
                <label className="text-lg font-medium text-gray-800 mb-4 block">Quick Presets</label>
                <div className="grid grid-cols-2 gap-3">
                  {imagePresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="font-medium h-auto py-3 px-4 text-sm border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300"
                      onClick={() => handlePresetApply(preset)}
                      data-testid={`button-preset-${preset.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
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
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    data-testid="button-reset-changes"
                  >
                    <Undo className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    data-testid="button-new-image"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    New Image
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Eye className="mr-3 text-red-500 h-6 w-6" />
                <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
              </div>
              <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                <Button
                  variant={showOriginal ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowOriginal(true)}
                  className={showOriginal ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-600 hover:text-gray-800"}
                  data-testid="button-show-original-enhancer"
                >
                  Original
                </Button>
                <Button
                  variant={!showOriginal ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowOriginal(false)}
                  className={!showOriginal ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-600 hover:text-gray-800"}
                  data-testid="button-show-enhanced"
                >
                  Enhanced
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
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <div className="flex items-center">
                    <Eye className="inline w-3 h-3 mr-1" />
                    Live
                  </div>
                </div>
              )}
            </div>

            {/* Enhancement Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Current Settings</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-red-500" data-testid="text-brightness-level">
                    {imageData.settings.brightness > 0 ? '+' : ''}{imageData.settings.brightness}
                  </div>
                  <div className="text-xs text-gray-600">Brightness</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500" data-testid="text-contrast-level">
                    {imageData.settings.contrast > 0 ? '+' : ''}{imageData.settings.contrast}
                  </div>
                  <div className="text-xs text-gray-600">Contrast</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500" data-testid="text-saturation-level">
                    {imageData.settings.saturation > 0 ? '+' : ''}{imageData.settings.saturation}
                  </div>
                  <div className="text-xs text-gray-600">Saturation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
