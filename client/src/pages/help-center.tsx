import { useState, useEffect } from "react";
import { Search, HelpCircle, BookOpen, MessageCircle, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqData = [
    {
      category: "Getting Started",
      icon: <HelpCircle className="w-5 h-5" />,
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
      icon: <BookOpen className="w-5 h-5" />,
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
            "Yes! Our new PDF converter allows you to convert single or multiple images into a PDF document with customizable page settings.",
        },
      ],
    },
    {
      category: "Privacy & Security",
      icon: <FileText className="w-5 h-5" />,
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
      icon: <MessageCircle className="w-5 h-5" />,
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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-card mb-4">
            Help Center
          </h1>
          <p className="text-xl text-card/80 max-w-2xl mx-auto mb-8">
            Find answers to common questions and learn how to get the most out of PhotoPro
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="feature-card card-glow border-0 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">User Guide</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Step-by-step tutorials for all PhotoPro features
              </p>
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="feature-card card-glow border-0 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Can't find what you're looking for? We're here to help
              </p>
              <Link href="/contact-us">
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="feature-card card-glow border-0 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <Download className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Download App</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get PhotoPro as a desktop app for offline use
              </p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-heading font-bold text-card text-center mb-8">
            Frequently Asked Questions
          </h2>

          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category, categoryIndex) => (
              <Card
                key={categoryIndex}
                className="feature-card card-glow border-0"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <span className="mr-3 text-primary">{category.icon}</span>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${categoryIndex}-${index}`}
                      >
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="feature-card border-0">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse our categories above.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Still Need Help Section */}
        <Card className="feature-card card-glow border-0 mt-12">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Still Need Help?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help you get the most out of PhotoPro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <Button className="hero-gradient text-white">
                  Contact Support
                </Button>
              </Link>
              <Link href="/contact-us">
                <Button variant="outline">Submit Feedback</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
