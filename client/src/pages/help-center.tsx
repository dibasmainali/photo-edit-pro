import { useState, useEffect } from "react";
import { Search, HelpCircle, BookOpen, MessageCircle, FileText, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Help Center";
  }, []);

  const faqData = [
    {
      category: "Getting Started",
      icon: HelpCircle,
      questions: [
        {
          question: "How do I compress my photos?",
          answer:
            "Upload your image using the drag-and-drop area or click to browse. Adjust the quality slider to your preference and download the compressed image. All processing happens in your browser for privacy.",
        },
        {
          question: "What image formats are supported?",
          answer:
            "We support JPEG, PNG, WebP, GIF, and BMP formats. You can convert between JPEG, PNG, and WebP formats using our converter tool.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "Yes, the maximum file size is 10MB per image. This ensures optimal performance and processing speed.",
        },
        {
          question: "How do I enhance my photos?",
          answer:
            "Use our Photo Enhancer tool to automatically improve brightness, contrast, and saturation. You can also apply preset filters like Auto Enhance, Warm Tone, or Black & White.",
        },
      ],
    },
    {
      category: "Features",
      icon: BookOpen,
      questions: [
        {
          question: "Can I process multiple images at once?",
          answer:
            "Currently, you can process one image at a time. We're working on batch processing features for future updates.",
        },
        {
          question: "How does the photo compression work?",
          answer:
            "Our compression uses advanced algorithms to reduce file size while maintaining visual quality. You can adjust the quality level from 10% to 100% to find the perfect balance.",
        },
        {
          question: "What is the difference between compression and enhancement?",
          answer:
            "Compression reduces file size, while enhancement improves visual quality by adjusting brightness, contrast, and saturation. You can use both tools together for the best results.",
        },
        {
          question: "Can I convert images to PDF?",
          answer:
            "Yes! Our PDF converter allows you to convert single or multiple images into a PDF document with customizable page settings.",
        },
      ],
    },
    {
      category: "Privacy & Security",
      icon: FileText,
      questions: [
        {
          question: "Are my images stored on your servers?",
          answer:
            "No! All image processing happens entirely in your browser. Your images never leave your device, ensuring complete privacy and security.",
        },
        {
          question: "Do you collect any personal data?",
          answer:
            "We don't collect or store any personal data or images. The only data we collect is basic usage analytics to improve our service.",
        },
        {
          question: "Is my data encrypted?",
          answer:
            "Since all processing happens in your browser, there's no need for encryption during processing. Your images remain on your device throughout the entire process.",
        },
      ],
    },
    {
      category: "Technical Issues",
      icon: MessageCircle,
      questions: [
        {
          question: "Why is my image not uploading?",
          answer:
            "Check that your file is under 10MB and in a supported format (JPEG, PNG, WebP, GIF, BMP). Try refreshing the page or using a different browser.",
        },
        {
          question: "The download is not working. What should I do?",
          answer:
            "Try right-clicking the download button and selecting 'Save link as'. If the issue persists, check your browser's download settings or try a different browser.",
        },
        {
          question: "Why is processing taking so long?",
          answer:
            "Processing time depends on image size and complexity. Large images may take longer. If processing seems stuck, try refreshing the page and uploading again.",
        },
        {
          question: "Which browsers are supported?",
          answer:
            "PhotoPro works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.",
        },
      ],
    },
  ];

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              Help Center • FAQs • Guides • Support
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Find answers to common questions and learn how to get the most out of PhotoPro
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-lg"
                aria-label="Search help articles"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link href="/help-center#guide" className="block">
              <Card className="p-8 text-center h-full group animate-in stagger-1">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-red-500" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">User Guide</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Step-by-step tutorials for all PhotoPro features
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Guide
                  <ChevronDown className="ml-2 w-3 h-3" aria-hidden="true" />
                </Button>
              </Card>
            </Link>

            <Link href="/contact-us" className="block">
              <Card className="p-8 text-center h-full group animate-in stagger-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-red-500" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">Contact Support</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Can't find what you're looking for? We're here to help
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Us
                  <ChevronDown className="ml-2 w-3 h-3" aria-hidden="true" />
                </Button>
              </Card>
            </Link>

            <Link href="#download" className="block">
              <Card className="p-8 text-center h-full group animate-in stagger-3">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-7 h-7 text-red-500" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">Download App</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get PhotoPro as a desktop app for offline use
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Download
                  <ChevronDown className="ml-2 w-3 h-3" aria-hidden="true" />
                </Button>
              </Card>
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6 animate-in stagger-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Can't find your answer? Use the search above or browse categories below.
              </p>
            </div>

            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="overflow-hidden animate-in" style={{ animationDelay: `${categoryIndex * 50}ms` }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-red-500" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${categoryIndex}-${index}`}
                          className="border-gray-200 dark:border-gray-700"
                        >
                          <AccordionTrigger className="text-left text-gray-900 dark:text-white hover:text-red-500">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 dark:text-gray-400">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center animate-in">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or browse our categories above.
                </p>
              </Card>
            )}

            {/* Still Need Help Section */}
            <Card className="p-8 md:p-12 text-center animate-in stagger-5" style={{ animationDelay: `${filteredFAQ.length * 50 + 100}ms` }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-gray-900 dark:text-white mb-4">Still Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you get the most out of PhotoPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact-us">
                  <Button size="lg" className="w-full sm:w-auto">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/contact-us">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Submit Feedback
                  </Button>
                </Link>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">Response time: within 24 hours on business days</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}