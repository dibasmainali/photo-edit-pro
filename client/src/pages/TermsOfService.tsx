// TermsOfService.jsx
import { ShieldCheck } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <ShieldCheck size={40} className="mx-auto mb-3 text-purple-300" />
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-purple-200">Last updated: September 14, 2025</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-2xl shadow-lg space-y-8">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-purple-200 leading-relaxed">
            By using our website, tools, or services, you agree to comply with
            these Terms of Service. If you do not agree, you must stop using our
            services immediately.
          </p>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Permitted Use</h2>
          <p className="text-purple-200 leading-relaxed">
            You are granted a limited, non-transferable license to use the
            platform strictly for personal and non-commercial purposes. Any
            misuse, including hacking, distributing malware, or reselling our
            tools, is prohibited.
          </p>
        </section>

        {/* Content Ownership */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Intellectual Property</h2>
          <p className="text-purple-200 leading-relaxed">
            All content, design, and tools available on this website remain the
            intellectual property of our team. You may not copy, modify, or
            distribute our resources without prior written consent.
          </p>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Privacy & Data Security</h2>
          <p className="text-purple-200 leading-relaxed">
            We respect your privacy. All uploaded files are processed securely
            and deleted automatically after processing. For more details, please
            read our <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </section>

        {/* Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p className="text-purple-200 leading-relaxed">
            We are not liable for any loss of data, damage, or inconvenience
            caused by the use of our tools. All services are provided “as is”
            without warranties of any kind.
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Termination</h2>
          <p className="text-purple-200 leading-relaxed">
            We reserve the right to suspend or terminate your access to our
            services if you violate these Terms of Service.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
          <p className="text-purple-200 leading-relaxed">
            These Terms of Service shall be governed by and interpreted in
            accordance with the laws of your jurisdiction, without regard to
            conflict of law principles.
          </p>
        </section>

        {/* Closing */}
        <section className="pt-6 border-t border-purple-600">
          <p className="text-sm text-purple-300 text-center">
            If you have any questions about these Terms, please{" "}
            <span className="underline cursor-pointer">Contact Us</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
