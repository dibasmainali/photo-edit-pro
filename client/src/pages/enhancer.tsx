import { useState, useEffect } from "react";
import { Download, RotateCcw, Palette, Eye, ZoomIn, ZoomOut, Undo, Sun, Moon, Contrast, Sparkles } from "lucide-react";
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
  } = useImageProcessing();

  const [showOriginal, setShowOriginal] = useState(false);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-16 animate-in">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                <Palette className="w-4 h-4" aria-hidden="true" />
                Real-time Enhancement • Professional Presets • Privacy First
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-2 sm:mb-6">
                Photo Enhancer
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-10 leading-relaxed">
                <span className="sm:hidden">Tune light, contrast, and color right in your browser.</span>
                <span className="hidden sm:inline">Transform your photos with professional-grade enhancement tools. Adjust brightness, contrast, and saturation with real-time preview.</span>
              </p>

              <Card className="p-4 sm:p-8 md:p-12">
                <div className="hidden sm:block mx-auto max-w-md mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <Palette className="w-10 h-10 text-red-500" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Upload Your Photo
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drop your image to start enhancing with professional tools
                  </p>
                </div>

                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  icon={<Palette className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />}
                  title="Drop a photo here"
                  description="Choose or drop • 10MB max"
                  supportedFormats="JPEG • PNG • WebP"
                  testId="enhancer-upload"
                  isLoading={isProcessing}
                  compact
                />
              </Card>
            </div>

            <div className="hidden md:grid mt-16 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Eye, title: "Real-Time Editing", desc: "See changes instantly as you adjust settings" },
                { icon: Sparkles, title: "Smart Presets", desc: "Auto Enhance, Warm, Cool, B&W and more" },
                { icon: Download, title: "Quality Preservation", desc: "Maintain original quality while enhancing" },
                { icon: Undo, title: "Non-Destructive", desc: "Reset anytime, original always preserved" },
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
      <div className="container">
        <div className="mb-8 animate-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Photo Enhancer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Adjust settings and see real-time enhancement results</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="animate-in stagger-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Enhancement Controls</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Brightness */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-orange-500" aria-hidden="true" />
                      Brightness
                    </label>
                    <Badge variant="secondary" className="text-sm">
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
                    aria-label="Brightness"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                    <span>Darker</span>
                    <span>Brighter</span>
                  </div>
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Contrast className="w-4 h-4 text-purple-500" aria-hidden="true" />
                      Contrast
                    </label>
                    <Badge variant="secondary" className="text-sm">
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
                    aria-label="Contrast"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                    <span>Less Contrast</span>
                    <span>More Contrast</span>
                  </div>
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-pink-500" aria-hidden="true" />
                      Saturation
                    </label>
                    <Badge variant="secondary" className="text-sm">
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
                    aria-label="Saturation"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                    <span>Desaturated</span>
                    <span>Vibrant</span>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {imagePresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetApply(preset)}
                        className="px-4 py-3 rounded-xl font-medium text-sm text-left transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                  size="lg"
                >
                  <Undo className="mr-2 h-4 w-4" aria-hidden="true" />
                  Reset All Adjustments
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="mt-6">
              <CardContent className="space-y-3 pt-6">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  size="lg"
                  onClick={handleDownload}
                  disabled={isProcessing}
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download Enhanced Image
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <Undo className="mr-2 h-4 w-4" aria-hidden="true" />
                    Reset Adjustments
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    New Image
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
                    <CardTitle className="text-xl">Live Preview</CardTitle>
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
                      Original
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
                      Enhanced
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
                        alt="Enhanced image"
                        className="max-w-full max-h-full object-contain px-4"
                      />
                      {!isProcessing && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Eye className="w-3 h-3" aria-hidden="true" />
                          Live
                        </div>
                      )}
                    </>
                  )}

                  {isProcessing && !showOriginal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                        <p className="font-medium">Enhancing...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Settings */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Settings</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <SettingItem
                      label="Brightness"
                      value={imageData.settings.brightness > 0 ? '+' + imageData.settings.brightness : imageData.settings.brightness}
                      icon={<Sun className="w-5 h-5 text-orange-500" />}
                    />
                    <SettingItem
                      label="Contrast"
                      value={imageData.settings.contrast > 0 ? '+' + imageData.settings.contrast : imageData.settings.contrast}
                      icon={<Contrast className="w-5 h-5 text-purple-500" />}
                    />
                    <SettingItem
                      label="Saturation"
                      value={imageData.settings.saturation > 0 ? '+' + imageData.settings.saturation : imageData.settings.saturation}
                      icon={<Palette className="w-5 h-5 text-pink-500" />}
                    />
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

function SettingItem({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
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