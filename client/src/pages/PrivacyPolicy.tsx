import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Database, BookMarked, Link as LinkIcon, Clock, Trash2, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Privacy Policy";
  }, []);

  const sections = [
    {
      id: "collect",
      title: "Information We Collect",
      icon: Shield,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We may collect minimal information such as feedback emails and usage analytics (aggregated and anonymized) to improve performance and reliability. Images you upload are processed locally in your browser.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>Contact information you provide (e.g., email for support)</li>
            <li>Anonymous usage metrics (feature usage, errors)</li>
            <li>No biometric or sensitive categories collected</li>
          </ul>
        </>
      ),
    },
    {
      id: "use",
      title: "How We Use Data",
      icon: Database,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Data helps us improve features, maintain stability, and respond to your requests. We never sell your data.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>Enhance compression and enhancement quality</li>
            <li>Diagnose performance issues and bugs</li>
            <li>Support communication when you contact us</li>
          </ul>
        </>
      ),
    },
    {
      id: "security",
      title: "Security & Protection",
      icon: Lock,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We use strong security practices. Image processing occurs locally, so your photos do not leave your device.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>Local, in-browser image processing</li>
            <li>Industry-standard security for our website and analytics</li>
            <li>Access restricted to authorized personnel only</li>
          </ul>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: Trash2,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We retain minimal data only as long as necessary to provide services and comply with legal obligations.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing",
      icon: Share2,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We do not sell personal data. Limited, anonymized analytics may be shared with service providers under strict agreements.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: Shield,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Depending on your region, you may have rights to access, correct, or delete your information.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16 animate-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Privacy Policy • Your Data • Your Rights
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
              Your privacy and trust matter to us. Here's how we protect your data.
            </p>
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4" aria-hidden="true" />
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
              <Accordion type="single" collapsible className="w-full space-y-4">
                {sections.map((section, index) => (
                  <AccordionItem key={section.id} value={section.id} className="border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-red-500" aria-hidden="true" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{section.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6">
                          {section.content}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Separator className="my-8" />
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Questions? Contact us at support@photopro.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}