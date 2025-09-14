import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
