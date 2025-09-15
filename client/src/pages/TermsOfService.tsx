// TermsOfService.jsx
import { ShieldCheck, BookMarked, Link as LinkIcon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  if (typeof document !== 'undefined') {
    document.title = "PhotoPro — Terms of Service";
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <ShieldCheck size={40} className="mx-auto mb-3 text-purple-300" />
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-purple-200 flex items-center justify-center gap-2"><Clock className="w-4 h-4" /> Last updated: September 14, 2025</p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[280px,1fr] gap-8">
        {/* TOC */}
        <Card className="bg-white/10 border-0 h-fit">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="text-purple-300" />
              <h2 className="text-lg font-semibold">On this page</h2>
            </div>
            <ul className="text-sm text-purple-100/90 space-y-2">
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#acceptance">Acceptance of Terms</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#permitted">Permitted Use</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#ip">Intellectual Property</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#privacy">Privacy & Security</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#liability">Limitation of Liability</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#termination">Termination</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#law">Governing Law</a></li>
              <li className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-purple-300" /><a href="#contact">Questions</a></li>
            </ul>
          </CardContent>
        </Card>

        <div className="bg-white/10 p-8 rounded-2xl shadow-lg space-y-8">
        {/* Intro */}
        <section id="acceptance">
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-purple-200 leading-relaxed">
            By using our website, tools, or services, you agree to comply with
            these Terms of Service. If you do not agree, you must stop using our
            services immediately.
          </p>
        </section>

        {/* Usage */}
        <Separator className="bg-purple-600/40" />
        <section id="permitted">
          <h2 className="text-2xl font-semibold mb-3">2. Permitted Use</h2>
          <p className="text-purple-200 leading-relaxed">
            You are granted a limited, non-transferable license to use the
            platform strictly for personal and non-commercial purposes. Any
            misuse, including hacking, distributing malware, or reselling our
            tools, is prohibited.
          </p>
        </section>

        {/* Content Ownership */}
        <Separator className="bg-purple-600/40" />
        <section id="ip">
          <h2 className="text-2xl font-semibold mb-3">3. Intellectual Property</h2>
          <p className="text-purple-200 leading-relaxed">
            All content, design, and tools available on this website remain the
            intellectual property of our team. You may not copy, modify, or
            distribute our resources without prior written consent.
          </p>
        </section>

        {/* Privacy & Security */}
        <Separator className="bg-purple-600/40" />
        <section id="privacy">
          <h2 className="text-2xl font-semibold mb-3">4. Privacy & Data Security</h2>
          <p className="text-purple-200 leading-relaxed">
            We respect your privacy. All uploaded files are processed securely
            and deleted automatically after processing. For more details, please
            read our <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </section>

        {/* Liability */}
        <Separator className="bg-purple-600/40" />
        <section id="liability">
          <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p className="text-purple-200 leading-relaxed">
            We are not liable for any loss of data, damage, or inconvenience
            caused by the use of our tools. All services are provided “as is”
            without warranties of any kind.
          </p>
        </section>

        {/* Termination */}
        <Separator className="bg-purple-600/40" />
        <section id="termination">
          <h2 className="text-2xl font-semibold mb-3">6. Termination</h2>
          <p className="text-purple-200 leading-relaxed">
            We reserve the right to suspend or terminate your access to our
            services if you violate these Terms of Service.
          </p>
        </section>

        {/* Governing Law */}
        <Separator className="bg-purple-600/40" />
        <section id="law">
          <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
          <p className="text-purple-200 leading-relaxed">
            These Terms of Service shall be governed by and interpreted in
            accordance with the laws of your jurisdiction, without regard to
            conflict of law principles.
          </p>
        </section>

        {/* Closing */}
        <Separator className="bg-purple-600/40" />
        <section id="contact" className="pt-6">
          <p className="text-sm text-purple-300 text-center">
            If you have any questions about these Terms, please <span className="underline cursor-pointer">Contact Us</span>.
          </p>
        </section>
        </div>
      </div>
    </div>
  );
}
