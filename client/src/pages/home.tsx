import { Link } from "wouter";
import { 
  Combine, 
  Sparkles, 
  Shield, 
  Smartphone, 
  Image as ImageIcon, 
  Zap,
  Eye,
  ArrowRight,
  RefreshCw,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState({
    imagesProcessed: 0,
    timeSaved: 0,
    users: 0
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Professional Photo Processing Made Simple";
    
    // Animate stats on load
    const timer = setTimeout(() => {
      setStats({
        imagesProcessed: 125000,
        timeSaved: 2500,
        users: 15000
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Combine className="w-8 h-8 text-primary-foreground" />,
      title: "Smart Compression",
      description: "Reduce file sizes by up to 80% while maintaining visual quality with our advanced compression algorithms.",
      gradient: "from-primary to-secondary",
    },
    {
      icon: <Eye className="w-8 h-8 text-success-foreground" />,
      title: "Real-time Preview",
      description: "See changes instantly as you adjust compression levels and enhancement settings with live preview.",
      gradient: "from-accent to-success",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-foreground" />,
      title: "Privacy First",
      description: "All processing happens in your browser. Your photos never leave your device, ensuring complete privacy.",
      gradient: "from-secondary to-primary",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-success-foreground" />,
      title: "AI-Powered Enhancement",
      description: "Advanced algorithms automatically optimize your photos with intelligent brightness, contrast, and saturation adjustments.",
      gradient: "from-accent to-primary",
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-primary-foreground" />,
      title: "Multiple Formats",
      description: "Support for JPEG, PNG, WebP and other popular image formats with batch processing capabilities.",
      gradient: "from-primary to-accent",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-secondary-foreground" />,
      title: "Format Converter",
      description: "Convert between JPEG, PNG, WebP formats instantly while preserving image quality and metadata.",
      gradient: "from-secondary to-accent",
    },
    {
      icon: <Zap className="w-8 h-8 text-secondary-foreground" />,
      title: "Lightning Fast",
      description: "Process images in seconds with optimized algorithms and hardware acceleration support.",
      gradient: "from-secondary to-success",
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-800 mb-6 leading-tight">
            <span className="text-red-500">Professional Photo Processing</span>
            <span className="block text-gray-700">Made Simple</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compress images without losing quality and enhance photos with real-time editing controls. 
            All processing happens in your browser for maximum privacy and speed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/compressor">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-start-compressing"
              >
                <Combine className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Start Compressing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/enhancer">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-enhance-photos"
              >
                <Sparkles className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                Enhance Photos
              </Button>
            </Link>
            <Link href="/converter">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-convert-formats"
              >
                <RefreshCw className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Convert Formats
              </Button>
            </Link>
          </div>
          
          {/* Stats Section */}
          <div className="mt-12 sm:mt-16 bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stats.imagesProcessed.toLocaleString()}+
                </div>
                <div className="text-gray-600">Images Processed</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stats.timeSaved}+
                </div>
                <div className="text-gray-600">Hours Saved</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-800 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to process photos quickly and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-8 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-red-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-4 text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl font-heading font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust PhotoPro for their image processing needs. 
              Start compressing and enhancing your photos today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compressor">
                <Button 
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  data-testid="button-try-compressor"
                >
                  Try Compressor Free
                </Button>
              </Link>
              <Link href="/enhancer">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
                  data-testid="button-try-enhancer"
                >
                  Try Enhancer Free
                </Button>
              </Link>
              <Link href="/converter">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
                  data-testid="button-try-converter"
                >
                  Try Converter Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
