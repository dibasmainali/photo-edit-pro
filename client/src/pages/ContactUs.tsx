import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Clock, Twitter, Facebook, Github } from "lucide-react";

export default function ContactUs() {
  if (typeof document !== 'undefined') {
    document.title = "PhotoPro — Contact Us";
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="mt-4 text-lg text-purple-200">
          We’d love to hear from you! Reach out anytime.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 pb-16">
        {/* Contact Info */}
        <Card className="bg-purple-800/40 border-0 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Mail className="text-purple-300" />
              <p className="text-purple-200">support@photopro.com</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-purple-300" />
              <p className="text-purple-200">+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-purple-300" />
              <p className="text-purple-200">123 Creative Lane, Tech City</p>
            </div>
            <Separator className="bg-purple-600/40" />
            <div className="flex items-center space-x-3">
              <Clock className="text-purple-300" />
              <div>
                <p className="text-purple-100 font-medium">Support Hours</p>
                <p className="text-purple-300 text-sm">Mon - Fri: 9:00 AM — 6:00 PM (UTC)</p>
              </div>
            </div>
            <div>
              <p className="text-purple-100 font-medium mb-3">Follow us</p>
              <div className="flex gap-3">
                <Button variant="outline" className="border-purple-500/40 text-white hover:bg-white/10">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="border-purple-500/40 text-white hover:bg-white/10">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="border-purple-500/40 text-white hover:bg-white/10">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-purple-800/40 border-0 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <form className="space-y-4">
              <Input type="text" placeholder="Your Name" required className="bg-purple-900/50 border-purple-600 text-white" />
              <Input type="email" placeholder="Your Email" required className="bg-purple-900/50 border-purple-600 text-white" />
              <Textarea placeholder="Your Message" rows={5} required className="bg-purple-900/50 border-purple-600 text-white" />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500">
                Send Message
              </Button>
              <p className="text-xs text-purple-200/80">We typically respond within 24 hours.</p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Map / Location Placeholder */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Card className="bg-purple-800/40 border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="h-64 w-full bg-purple-900/40 flex items-center justify-center text-purple-300 text-sm">
              Map preview coming soon
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
