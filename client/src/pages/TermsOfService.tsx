// TermsOfService.jsx
import { ShieldCheck, BookMarked, Link as LinkIcon, Clock, CheckCircle2 } from "lucide-react";
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
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center shadow-lg shadow-primary/30">
          <ShieldCheck className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-purple-200 flex items-center justify-center gap-2"><Clock className="w-4 h-4" /> Last updated: September 14, 2025</p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[280px,1fr] gap-8">
        {/* TOC */}
        <Card className="bg-white/10 border-0 h-fit sticky top-6 self-start">
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

        {/* Numbered sections with accent border and checks */}
        <div className="space-y-6">
          {[
            { id: "acceptance", title: "Acceptance of Terms", body: "By using our website, tools, or services, you agree to comply with these Terms of Service. If you do not agree, you must stop using our services immediately." },
            { id: "permitted", title: "Permitted Use", body: "You are granted a limited, non-transferable license to use the platform strictly for personal and non-commercial purposes. Any misuse, including hacking, distributing malware, or reselling our tools, is prohibited." },
            { id: "ip", title: "Intellectual Property", body: "All content, design, and tools available on this website remain the intellectual property of our team. You may not copy, modify, or distribute our resources without prior written consent." },
            { id: "privacy", title: "Privacy & Data Security", body: "We respect your privacy. All uploaded files are processed securely and deleted automatically after processing. For more details, please read our Privacy Policy." },
            { id: "liability", title: "Limitation of Liability", body: "We are not liable for any loss of data, damage, or inconvenience caused by the use of our tools. All services are provided ‘as is’ without warranties of any kind." },
            { id: "termination", title: "Termination", body: "We reserve the right to suspend or terminate your access to our services if you violate these Terms of Service." },
            { id: "law", title: "Governing Law", body: "These Terms of Service shall be governed by and interpreted in accordance with the laws of your jurisdiction, without regard to conflict of law principles." },
          ].map((sec, idx) => (
            <section key={sec.id} id={sec.id} className="relative overflow-hidden rounded-2xl bg-white/10 border border-white/10">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-accent"></div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center text-sm font-bold">{idx + 1}</div>
                  <h2 className="text-2xl font-semibold">{sec.title}</h2>
                  <CheckCircle2 className="text-purple-300 ml-auto" />
                </div>
                <p className="text-purple-200 leading-relaxed">{sec.body}</p>
              </div>
            </section>
          ))}

          <Separator className="bg-purple-600/40" />
          <section id="contact" className="pt-2">
            <p className="text-sm text-purple-300 text-center">
              Questions about these Terms? <span className="underline cursor-pointer">Contact Us</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
