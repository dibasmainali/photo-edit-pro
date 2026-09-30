import { useEffect } from "react";
import { ShieldCheck, BookMarked, Link as LinkIcon, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Terms of Service";
  }, []);

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      body: "By using our website, tools, or services, you agree to comply with these Terms of Service. If you do not agree, you must stop using our services immediately.",
    },
    {
      id: "permitted",
      title: "Permitted Use",
      body: "You are granted a limited, non-transferable license to use the platform strictly for personal and non-commercial purposes. Any misuse, including hacking, distributing malware, or reselling our tools, is prohibited.",
    },
    {
      id: "ip",
      title: "Intellectual Property",
      body: "All content, design, and tools available on this website remain the intellectual property of our team. You may not copy, modify, or distribute our resources without prior written consent.",
    },
    {
      id: "privacy",
      title: "Privacy & Data Security",
      body: "We respect your privacy. All uploaded files are processed securely and deleted automatically after processing. For more details, please read our Privacy Policy.",
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      body: "We are not liable for any loss of data, damage, or inconvenience caused by the use of our tools. All services are provided 'as is' without warranties of any kind.",
    },
    {
      id: "termination",
      title: "Termination",
      body: "We reserve the right to suspend or terminate your access to our services if you violate these Terms of Service.",
    },
    {
      id: "law",
      title: "Governing Law",
      body: "These Terms of Service shall be governed by and interpreted in accordance with the laws of your jurisdiction, without regard to conflict of law principles.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" aria-hidden="true" />
              Last updated: September 2025
            </p>
          </div>

          <div className="grid lg:grid-cols-[280px,1fr] gap-8">
            {/* Table of Contents */}
            <div className="animate-in stagger-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookMarked className="w-5 h-5 text-red-500" aria-hidden="true" />
                    <h2 className="font-heading font-semibold text-gray-900 dark:text-white">On this page</h2>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="flex items-center gap-2 hover:text-red-500 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="animate-in stagger-2">
              <div className="space-y-6">
                {sections.map((sec, idx) => (
                  <section key={sec.id} id={sec.id} className="relative overflow-hidden">
                    <Card className="border-gray-200 dark:border-gray-700">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-sm font-bold text-red-500">
                            {idx + 1}
                          </div>
                          <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">{sec.title}</h2>
                          <CheckCircle2 className="text-green-500 ml-auto flex-shrink-0" aria-hidden="true" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{sec.body}</p>
                      </CardContent>
                    </Card>
                  </section>
                ))}

                <Separator className="my-8" />
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Questions about these Terms?{' '}
                    <a href="/contact-us" className="underline hover:text-red-500 transition-colors">
                      Contact Us
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}