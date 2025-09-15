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
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Particles */}
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-card mb-6 leading-tight">
          <span className="text-purple-400">
          Professional Photo Processing</span>
            <span className="block text-card/90">Made Simple</span>
          </h1>
          <p className="text-lg sm:text-xl text-card/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Combine images without losing quality and enhance photos with real-time editing controls. 
            All processing happens in your browser for maximum privacy and speed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/compressor">
              <Button 
                size="lg" 
                className="w-full sm:w-auto hero-gradient text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 group"
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
                className="w-full sm:w-auto bg-card/20 backdrop-blur-sm text-white border-2 border-primary/30 px-8 py-4 rounded-xl font-semibold hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 transform hover:scale-105 group"
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
                className="w-full sm:w-auto bg-card/20 backdrop-blur-sm text-white border-2 border-accent/30 px-8 py-4 rounded-xl font-semibold hover:bg-accent/20 hover:border-accent/60 transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-convert-formats"
              >
                <RefreshCw className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Convert Formats
              </Button>
            </Link>
          </div>
          
          {/* Stats Section */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.imagesProcessed.toLocaleString()}+
              </div>
              <div className="text-card/80">Images Processed</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.timeSaved}+
              </div>
              <div className="text-card/80">Hours Saved</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-card/80">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-card mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-card/80 max-w-2xl mx-auto">
              Everything you need to process photos quickly and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="feature-card hover:card-glow transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-0 group hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground relative z-10 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10 group-hover:text-foreground/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="feature-card card-glow rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
            <h2 className="text-3xl font-heading font-bold text-white mb-4 relative z-10">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of users who trust PhotoPro for their image processing needs. 
              Start compressing and enhancing your photos today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/compressor">
                <Button 
                  size="lg"
                  className="hero-gradient text-white hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
                  data-testid="button-try-compressor"
                >
                  Try Compressor Free
                </Button>
              </Link>
              <Link href="/enhancer">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-white hover:bg-primary/20 hover:border-primary transition-all duration-300"
                  data-testid="button-try-enhancer"
                >
                  Try Enhancer Free
                </Button>
              </Link>
              <Link href="/converter">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-accent/50 text-white hover:bg-accent/20 hover:border-accent transition-all duration-300"
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
