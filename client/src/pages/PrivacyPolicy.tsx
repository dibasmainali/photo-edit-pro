import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Database, BookMarked, Link as LinkIcon, Clock, Trash2, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  if (typeof document !== 'undefined') {
    document.title = "PhotoPro — Privacy Policy";
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-purple-200 flex items-center justify-center gap-2 text-sm">
          <Clock className="w-4 h-4" /> Last updated: September 14, 2025
        </p>
        <p className="mt-4 text-lg text-purple-200">
          Your privacy and trust matter to us. Here’s how we protect your data.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid lg:grid-cols-[280px,1fr] gap-8">
        {/* TOC */}
        <Card className="bg-purple-800/40 border-0 h-fit">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="text-purple-300" />
              <h2 className="text-lg font-semibold">On this page</h2>
            </div>
            <ul className="text-sm text-purple-100/90 space-y-2">
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#collect">Information We Collect</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#use">How We Use Data</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#security">Security & Protection</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#retention">Data Retention</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#sharing">Data Sharing</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#rights">Your Rights</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#contact">Contact</a></li>
            </ul>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          <Card className="bg-purple-800/40 border-0 shadow-lg" id="collect">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Shield className="text-purple-300" />
                <h2 className="text-2xl font-semibold">Information We Collect</h2>
              </div>
              <p className="text-purple-200">
                We may collect minimal information such as feedback emails and usage analytics (aggregated and anonymized) to improve performance and reliability. Images you upload are processed locally in your browser.
              </p>
              <ul className="list-disc list-inside text-purple-200/90 text-sm space-y-1">
                <li>Contact information you provide (e.g., email for support)</li>
                <li>Anonymous usage metrics (feature usage, errors)</li>
                <li>No biometric or sensitive categories collected</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/40 border-0 shadow-lg" id="use">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Database className="text-purple-300" />
                <h2 className="text-2xl font-semibold">How We Use Data</h2>
              </div>
              <p className="text-purple-200">
                Data helps us improve features, maintain stability, and respond to your requests. We never sell your data.
              </p>
              <ul className="list-disc list-inside text-purple-200/90 text-sm space-y-1">
                <li>Enhance compression and enhancement quality</li>
                <li>Diagnose performance issues and bugs</li>
                <li>Support communication when you contact us</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/40 border-0 shadow-lg" id="security">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Lock className="text-purple-300" />
                <h2 className="text-2xl font-semibold">Security & Protection</h2>
              </div>
              <p className="text-purple-200">
                We use strong security practices. Image processing occurs locally, so your photos do not leave your device.
              </p>
              <ul className="list-disc list-inside text-purple-200/90 text-sm space-y-1">
                <li>Local, in-browser image processing</li>
                <li>Industry-standard security for our website and analytics</li>
                <li>Access restricted to authorized personnel only</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/40 border-0 shadow-lg" id="retention">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Trash2 className="text-purple-300" />
                <h2 className="text-2xl font-semibold">Data Retention</h2>
              </div>
              <p className="text-purple-200">
                We retain minimal data only as long as necessary to provide services and comply with legal obligations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/40 border-0 shadow-lg" id="sharing">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Share2 className="text-purple-300" />
                <h2 className="text-2xl font-semibold">Data Sharing</h2>
              </div>
              <p className="text-purple-200">
                We do not sell personal data. Limited, anonymized analytics may be shared with service providers under strict agreements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/40 border-0 shadow-lg" id="rights">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Shield className="text-purple-300" />
                <h2 className="text-2xl font-semibold">Your Rights</h2>
              </div>
              <p className="text-purple-200">
                Depending on your region, you may have rights to access, correct, or delete your information.
              </p>
            </CardContent>
          </Card>

          <Separator className="bg-purple-600/40" />
          <p id="contact" className="text-sm text-purple-300 text-center">
            Questions? Contact us at support@photopro.com
          </p>
        </div>
      </div>
    </div>
  );
}
