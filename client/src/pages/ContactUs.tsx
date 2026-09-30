import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Clock, Twitter, Facebook, Github, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — Contact Us";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, you'd send to an API endpoint
    console.log("Form submitted:", formData);

    setSubmitStatus("success");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset status after 5 seconds
    setTimeout(() => setSubmitStatus("idle"), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
              <Mail className="w-4 h-4" aria-hidden="true" />
              Get in Touch • Support • Feedback
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you! Whether you have a question, feedback, or need support, our team is here to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="animate-in stagger-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-red-500" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <ContactItem
                      icon={Mail}
                      title="Email Support"
                      value="support@photopro.com"
                      description="We typically respond within 24 hours"
                    />
                    <ContactItem
                      icon={Phone}
                      title="Phone"
                      value="+1 (555) 123-4567"
                      description="Mon–Fri, 9am–6pm UTC"
                    />
                    <ContactItem
                      icon={MapPin}
                      title="Office"
                      value="123 Creative Lane"
                      description="Tech City, TC 10001"
                    />
                    <ContactItem
                      icon={Clock}
                      title="Support Hours"
                      value="Mon–Fri, 9am–6pm UTC"
                      description="Weekend inquiries answered next business day"
                    />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h4>
                    <div className="flex gap-3">
                      <a href="#" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors" aria-label="Twitter">
                        <Twitter className="w-5 h-5" aria-hidden="true" />
                      </a>
                      <a href="#" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors" aria-label="GitHub">
                        <Github className="w-5 h-5" aria-hidden="true" />
                      </a>
                      <a href="#" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors" aria-label="Facebook">
                        <Facebook className="w-5 h-5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="animate-in stagger-2">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-red-500" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-center gap-3 animate-in">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Message Sent!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="name" className="label">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="label">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="label">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="input"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select a topic</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feature Request / Feedback</option>
                        <option value="bug">Bug Report</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="press">Press / Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="label">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your issue or question in detail..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        aria-required="true"
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="mr-2 inline-flex h-4 w-4">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          </span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      We typically respond within 24 hours on business days.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="mt-16 animate-in stagger-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm">How to compress images?</Badge>
                  <Badge variant="outline" className="text-sm">Supported formats?</Badge>
                  <Badge variant="outline" className="text-sm">File size limits?</Badge>
                  <Badge variant="outline" className="text-sm">Privacy policy?</Badge>
                  <Badge variant="outline" className="text-sm">Batch processing?</Badge>
                  <Badge variant="outline" className="text-sm">Download issues?</Badge>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Can't find your answer? <a href="/help-center" className="text-red-500 hover:underline font-medium">Visit Help Center</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-red-500" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}