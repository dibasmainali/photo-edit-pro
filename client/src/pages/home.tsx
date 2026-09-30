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
  Clock,
  Check,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState({
    imagesProcessed: 0,
    timeSaved: 0,
    users: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Professional Photo Processing Made Simple";

    const timer = setTimeout(() => {
      setStats({
        imagesProcessed: 125000,
        timeSaved: 2500,
        users: 15000,
      });
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Combine,
      title: "Smart Compression",
      description: "Reduce file sizes by up to 80% while maintaining visual quality with our advanced compression algorithms.",
    },
    {
      icon: Eye,
      title: "Real-time Preview",
      description: "See changes instantly as you adjust compression levels and enhancement settings with live preview.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens in your browser. Your photos never leave your device, ensuring complete privacy.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Enhancement",
      description: "Advanced algorithms automatically optimize your photos with intelligent brightness, contrast, and saturation adjustments.",
    },
    {
      icon: ImageIcon,
      title: "Multiple Formats",
      description: "Support for JPEG, PNG, WebP and other popular image formats with batch processing capabilities.",
    },
    {
      icon: RefreshCw,
      title: "Format Converter",
      description: "Convert between JPEG, PNG, WebP formats instantly while preserving image quality and metadata.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process images in seconds with optimized algorithms and hardware acceleration support.",
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: "Fully responsive design works seamlessly on desktop, tablet, and mobile devices.",
    },
  ];

  const benefits = [
    { icon: Check, text: "No registration required" },
    { icon: Check, text: "No file size limits for local processing" },
    { icon: Check, text: "No watermarks on your images" },
    { icon: Check, text: "Open source and transparent" },
    { icon: Check, text: "Works offline after first load" },
    { icon: Check, text: "GDPR & CCPA compliant" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <nav aria-label="Main navigation" />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pb-32 overflow-hidden">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-8 animate-in stagger-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Version 2.0 launched — Faster, smarter, better
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-tight mb-6 animate-in stagger-2">
                <span className="block">Professional Photo Processing</span>
                <span className="block text-red-500">Made Simple</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-in stagger-3">
                Compress images without losing quality, enhance photos with real-time editing controls, and convert between formats. All processing happens in your browser for maximum privacy and speed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in stagger-4">
                <Link href="/compressor">
                  <Button size="lg" className="w-full sm:w-auto group">
                    <Combine className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
                    Start Compressing
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/enhancer">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                    <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" aria-hidden="true" />
                    Enhance Photos
                  </Button>
                </Link>
                <Link href="/converter">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                    <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
                    Convert Formats
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 animate-in stagger-5">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <benefit.icon className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-in stagger-6">
              <StatCard
                icon={TrendingUp}
                value={stats.imagesProcessed.toLocaleString() + "+"}
                label="Images Processed"
              />
              <StatCard
                icon={Clock}
                value={stats.timeSaved.toLocaleString() + "+"}
                label="Hours Saved"
              />
              <StatCard
                icon={Star}
                value={stats.users.toLocaleString() + "+"}
                label="Happy Users"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Everything you need to process photos quickly and efficiently
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 50}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Simple three-step process to perfect images
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard
                number="01"
                title="Upload Your Image"
                description="Drag and drop or click to select your image. Supports JPEG, PNG, WebP up to 10MB."
                icon={<ImageIcon className="w-6 h-6" />}
              />
              <StepCard
                number="02"
                title="Adjust Settings"
                description="Fine-tune compression quality, enhancement levels, or choose output format with real-time preview."
                icon={<Sparkles className="w-6 h-6" />}
              />
              <StepCard
                number="03"
                title="Download Result"
                description="Get your optimized image instantly. No waiting, no registration, no watermarks."
                icon={<Combine className="w-6 h-6" />}
              />
            </div>
          </div>
        </section>

        {/* Tools Overview */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Our Tools
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Specialized tools for every image processing need
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <ToolCard
                title="Compressor"
                description="Reduce image file sizes by up to 80% with smart compression algorithms and real-time preview."
                icon={<Combine className="w-6 h-6" />}
                href="/compressor"
                badge="Most Popular"
              />
              <ToolCard
                title="Enhancer"
                description="Adjust brightness, contrast, saturation with professional presets. See changes instantly."
                icon={<Sparkles className="w-6 h-6" />}
                href="/enhancer"
              />
              <ToolCard
                title="Converter"
                description="Convert between JPEG, PNG, WebP formats while preserving quality and metadata."
                icon={<RefreshCw className="w-6 h-6" />}
                href="/converter"
              />
              <ToolCard
                title="Resizer"
                description="Batch resize images by percentage, dimensions, or social media presets. Multiple formats supported."
                icon={<Maximize className="w-6 h-6" />}
                href="/resizer"
                badge="New"
              />
              <ToolCard
                title="PDF Tools"
                description="Create PDFs from images, merge multiple PDFs, customize layouts and page settings."
                icon={<ImageIcon className="w-6 h-6" />}
                href="/pdf"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                Ready to get started?
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
                Join Thousands of Happy Users
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                Start compressing and enhancing your photos today. Free, fast, and privacy-focused.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/compressor">
                  <Button size="lg" className="w-full sm:w-auto bg-red-500 hover:bg-red-600 group">
                    Try Compressor Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/enhancer">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white group">
                    Try Enhancer Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer />
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <Card className="text-center p-6">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <Icon className="w-7 h-7 text-red-500" aria-hidden="true" />
      </div>
      <div className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; delay: number }) {
  return (
    <Card className="p-6 h-full group animate-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-red-500" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-500 transition-colors">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </Card>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="p-6 relative">
      <div className="absolute -top-3 -right-3 text-6xl font-heading font-bold text-red-500/10 dark:text-red-500/5">{number}</div>
      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 text-red-500">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </Card>
  );
}

function ToolCard({ title, description, icon, href, badge }: { title: string; description: string; icon: React.ReactNode; href: string; badge?: string }) {
  return (
    <Link href={href}>
      <Card className="p-6 h-full group relative overflow-hidden">
        {badge && (
          <Badge className="absolute top-4 right-4" variant="default">
            {badge}
          </Badge>
        )}
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 text-red-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-500 transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{description}</p>
        <div className="flex items-center text-red-500 font-medium text-sm group-hover:gap-2 transition-all">
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </Card>
    </Link>
  );
}