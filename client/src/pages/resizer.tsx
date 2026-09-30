import { useState, useEffect, useCallback } from "react";
import {
  Download,
  RotateCcw,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Smartphone,
  Layout,
  Grid,
  CheckCircle,
  X,
  Loader2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FileUploadZone from "@/components/file-upload-zone";
import { useImageProcessing, type ResizeSettings } from "@/hooks/use-image-processing";
import { formatFileSize } from "@/lib/image-utils";

export default function Resizer() {
  const {
    batchResize,
    formatFileSize: formatSize,
    isProcessing: hookIsProcessing,
  } = useImageProcessing();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<Map<File, string>>(new Map());
  const [results, setResults] = useState<Array<{
    dataUrl: string;
    size: number;
    width: number;
    height: number;
    filename: string;
    originalName: string;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
    mode: 'dimensions',
    width: 1920,
    height: 1080,
    maintainAspect: true,
  });
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [outputQuality, setOutputQuality] = useState(90);
  const [activeTab, setActiveTab] = useState<'resize' | 'results'>('resize');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Image Resizer";
  }, []);

  useEffect(() => {
    const urls = new Map(images.map((file) => [file, URL.createObjectURL(file)]));
    setImagePreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const socialPresets = [
    { id: 'instagram-post', label: 'Instagram Post', icon: '📷', dimensions: '1080×1080' },
    { id: 'instagram-story', label: 'Instagram Story', icon: '📱', dimensions: '1080×1920' },
    { id: 'instagram-reel', label: 'Instagram Reel', icon: '🎬', dimensions: '1080×1920' },
    { id: 'facebook-post', label: 'Facebook Post', icon: '👍', dimensions: '1200×630' },
    { id: 'facebook-cover', label: 'Facebook Cover', icon: '📄', dimensions: '820×312' },
    { id: 'twitter-post', label: 'Twitter/X Post', icon: '🐦', dimensions: '1200×675' },
    { id: 'twitter-header', label: 'Twitter/X Header', icon: '🎨', dimensions: '1500×500' },
    { id: 'linkedin-post', label: 'LinkedIn Post', icon: '💼', dimensions: '1200×627' },
    { id: 'linkedin-cover', label: 'LinkedIn Cover', icon: '🔗', dimensions: '1128×191' },
    { id: 'youtube-thumbnail', label: 'YouTube Thumbnail', icon: '▶️', dimensions: '1280×720' },
    { id: 'youtube-banner', label: 'YouTube Banner', icon: '📺', dimensions: '2560×1440' },
    { id: 'pinterest-pin', label: 'Pinterest Pin', icon: '📌', dimensions: '1000×1500' },
    { id: 'tiktok-video', label: 'TikTok Video', icon: '🎵', dimensions: '1080×1920' },
  ];

  const handleFileSelect = useCallback(async (files: File[]) => {
    setImages(prev => [...prev, ...files]);
    setResults([]);
    setProgress({ completed: 0, total: 0 });
    setActiveTab('resize');
  }, []);

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setResults([]);
        setProgress({ completed: 0, total: 0 });
      }
      return next;
    });
  };

  const clearAll = () => {
    setImages([]);
    setResults([]);
    setProgress({ completed: 0, total: 0 });
    setActiveTab('resize');
  };

  const handleResize = async () => {
    if (!images.length) return;
    
    setIsProcessing(true);
    setProgress({ completed: 0, total: images.length });
    setResults([]);

    try {
      const resized = await batchResize(
        images,
        resizeSettings,
        outputFormat,
        outputQuality,
        (completed, total) => setProgress({ completed, total })
      );
      setResults(resized);
      setActiveTab('results');
    } catch (err) {
      console.error('Batch resize failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    results.forEach((r, index) => {
      setTimeout(() => downloadResult(r.dataUrl, r.filename), index * 100);
    });
  };

  const totalOriginalSize = images.reduce((acc, f) => acc + f.size, 0);
  const totalResizedSize = results.reduce((acc, r) => acc + r.size, 0);

  const formatMode = (mode: ResizeSettings['mode']) => {
    switch (mode) {
      case 'percentage': return 'By Percentage';
      case 'dimensions': return 'By Dimensions';
      case 'social': return 'Social Media';
      default: return mode;
    }
  };

  if (!images.length && !results.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-8 px-3 sm:py-16 sm:px-6 lg:px-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-16 animate-in">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                <Maximize className="w-4 h-4" aria-hidden="true" />
                Batch Resize • Social Presets • Multiple Formats
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-2 sm:mb-6">
                Image Resizer
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-10 leading-relaxed">
                <span className="sm:hidden">Resize photos by size, percentage, or social presets.</span>
                <span className="hidden sm:inline">Resize multiple images at once with precise dimensions, percentages, or social media presets. Perfect for preparing images for web, social media, or print.</span>
              </p>

              <Card className="p-4 sm:p-8 md:p-12">
                <div className="hidden sm:block mx-auto max-w-md mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-red-500" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Drop Your Images Here
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload multiple images for batch resizing
                  </p>
                </div>

                <FileUploadZone
                  onFileSelect={(f) => handleFileSelect([f])}
                  onFilesSelect={handleFileSelect}
                  multiple
                  icon={<ImageIcon className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />}
                  title="Drop images here"
                  description="Choose or drop • Batch resize • 10MB max"
                  supportedFormats="JPEG • PNG • WebP • GIF • BMP"
                  testId="resizer-upload"
                  compact
                />
              </Card>
            </div>

            <div className="hidden md:grid mt-16 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Zap, title: "Batch Processing", desc: "Resize hundreds of images simultaneously" },
                { icon: Smartphone, title: "Social Media Presets", desc: "13+ platform-optimized sizes" },
                { icon: Layout, title: "Flexible Modes", desc: "Percentage, exact dimensions, or fit" },
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Image Resizer
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {images.length} image{images.length !== 1 ? 's' : ''} ready to resize
                </p>
              </div>
              {images.length > 0 && (
                <Button variant="outline" onClick={clearAll} size="sm">
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Image List / Upload */}
          <Card className="mb-4 sm:mb-8 animate-in stagger-1">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Images to Resize</CardTitle>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <FileUploadZone
                  onFileSelect={(f) => handleFileSelect([f])}
                  onFilesSelect={handleFileSelect}
                  multiple
                  accept="image/*"
                  icon={<ImageIcon className="w-10 h-10 text-gray-400" />}
                  title="Add images to resize"
                  description="Drag & drop or click to select multiple images"
                  supportedFormats="JPEG, PNG, WebP, GIF, BMP • Max 10MB each"
                  testId="resizer-upload-main"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {images.length} image{images.length !== 1 ? 's' : ''} • {formatSize(totalOriginalSize)}
                    </span>
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                      Clear
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 max-h-72 sm:max-h-96 overflow-y-auto">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden aspect-square"
                      >
                        <img
                          src={imagePreviewUrls.get(file) ?? ''}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          <button
                            onClick={() => removeImage(index)}
                            className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1.5 truncate" title={file.name}>
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <FileUploadZone
                      onFileSelect={(f) => handleFileSelect([f])}
                      onFilesSelect={handleFileSelect}
                      multiple
                      accept="image/*"
                      title="Add more images"
                      description="Drag & drop or click to add more"
                      testId="resizer-upload-add"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="animate-in stagger-1">
              <Card className="lg:sticky lg:top-24">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <Maximize className="w-5 h-5 text-red-500" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">Resize Settings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* Mode Tabs */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex -mb-px" role="tablist">
                      {(['percentage', 'dimensions', 'social'] as const).map((mode) => (
                        <button
                          key={mode}
                          role="tab"
                          aria-selected={resizeSettings.mode === mode}
                          onClick={() => setResizeSettings(prev => ({ ...prev, mode }))}
                          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                            resizeSettings.mode === mode
                              ? 'border-red-500 text-red-500'
                              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >
                          {formatMode(mode)}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Percentage Mode */}
                  {resizeSettings.mode === 'percentage' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Scale</label>
                          <Badge variant="secondary" className="text-sm">{resizeSettings.percentage}%</Badge>
                        </div>
                        <Slider
                          value={[resizeSettings.percentage || 100]}
                          onValueChange={(v) => setResizeSettings(prev => ({ ...prev, percentage: v[0] }))}
                          min={1}
                          max={500}
                          step={1}
                          className="w-full"
                          aria-label="Resize percentage"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                          <span>1% (Tiny)</span>
                          <span>500% (Large)</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Quick presets:</strong>{' '}
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, percentage: 50 }))} className="text-red-500 hover:underline mx-1">50%</button>
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, percentage: 75 }))} className="text-red-500 hover:underline mx-1">75%</button>
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, percentage: 150 }))} className="text-red-500 hover:underline mx-1">150%</button>
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, percentage: 200 }))} className="text-red-500 hover:underline mx-1">200%</button>
                      </div>
                    </div>
                  )}

                  {/* Dimensions Mode */}
                  {resizeSettings.mode === 'dimensions' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Width (px)</label>
                          <input
                            type="number"
                            className="input"
                            value={resizeSettings.width || 1920}
                            min={1}
                            max={10000}
                            onChange={(e) => setResizeSettings(prev => ({ ...prev, width: Number(e.target.value) || 1 }))}
                          />
                        </div>
                        <div>
                          <label className="label">Height (px)</label>
                          <input
                            type="number"
                            className="input"
                            value={resizeSettings.height || 1080}
                            min={1}
                            max={10000}
                            onChange={(e) => setResizeSettings(prev => ({ ...prev, height: Number(e.target.value) || 1 }))}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                          checked={resizeSettings.maintainAspect !== false}
                          onChange={(e) => setResizeSettings(prev => ({ ...prev, maintainAspect: e.target.checked }))}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintain aspect ratio</span>
                      </label>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Common sizes:</strong>{' '}
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, width: 1920, height: 1080 }))} className="text-red-500 hover:underline mx-1">1920×1080</button>
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, width: 1280, height: 720 }))} className="text-red-500 hover:underline mx-1">1280×720</button>
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, width: 800, height: 600 }))} className="text-red-500 hover:underline mx-1">800×600</button>
                        <button onClick={() => setResizeSettings(prev => ({ ...prev, width: 1200, height: 1200 }))} className="text-red-500 hover:underline mx-1">1200×1200</button>
                      </div>
                    </div>
                  )}

                  {/* Social Media Mode */}
                  {resizeSettings.mode === 'social' && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Choose Platform Preset</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                        {socialPresets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => setResizeSettings(prev => ({ ...prev, mode: 'social', socialPreset: preset.id }))}
                            className={`p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                              resizeSettings.socialPreset === preset.id
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300 dark:hover:border-red-700'
                            }`}
                            role="radio"
                            aria-checked={resizeSettings.socialPreset === preset.id}
                          >
                            <div className="text-2xl mb-1">{preset.icon}</div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">{preset.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{preset.dimensions}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Output Settings */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Output Format</h4>
                    <div className="flex gap-2">
                      {(['jpeg', 'png', 'webp'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setOutputFormat(fmt)}
                          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            outputFormat === fmt
                              ? 'bg-red-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300'
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality</label>
                        <Badge variant="secondary" className="text-sm">{outputQuality}%</Badge>
                      </div>
                      <Slider
                        value={[outputQuality]}
                        onValueChange={(v) => setOutputQuality(v[0])}
                        min={10}
                        max={100}
                        step={5}
                        className="w-full"
                        aria-label="Output quality"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={handleResize}
                      disabled={!images.length || isProcessing}
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Resizing... ({progress.completed}/{progress.total})
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
                          Resize {images.length} Image{images.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="animate-in stagger-2">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl">Results</CardTitle>
                  {results.length > 0 && (
                    <Button variant="outline" onClick={downloadAll} size="sm">
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      Download All
                    </Button>
                  )}
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Resize your images to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="p-3 rounded-lg bg-white dark:bg-gray-800 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{results.length}</div>
                        <div className="text-gray-500 dark:text-gray-400">Images Resized</div>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-gray-800 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatSize(totalOriginalSize)}</div>
                        <div className="text-gray-500 dark:text-gray-400">Original Size</div>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-gray-800 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatSize(totalResizedSize)}</div>
                        <div className="text-gray-500 dark:text-gray-400">Resized Size</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 max-h-96 overflow-y-auto">
                      {results.map((result, index) => (
                        <Card key={index} className="p-2 sm:p-3">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
                            <img
                              src={result.dataUrl}
                              alt={result.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-gray-900 dark:text-white truncate" title={result.filename}>
                              {result.filename}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {result.width} × {result.height} • {formatSize(result.size)}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              From: {result.originalName}
                            </p>
                          </div>
                          <Button
                            className="w-full mt-2"
                            size="sm"
                            onClick={() => downloadResult(result.dataUrl, result.filename)}
                          >
                            <Download className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                            Download
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}