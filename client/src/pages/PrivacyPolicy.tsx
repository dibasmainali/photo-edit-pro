import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Database } from "lucide-react";

export default function PrivacyPolicy() {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-lg text-purple-200">
          Your privacy and trust matter to us. Here’s how we protect your data.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="max-w-5xl mx-auto px-4 space-y-8 pb-16">
        <Card className="bg-purple-800/40 border-0 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Shield className="text-purple-300" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>
            <p className="text-purple-200">
              We may collect details like your name, email, and preferences when
              you interact with our platform. This helps us improve our services.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-800/40 border-0 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Database className="text-purple-300" />
              <h2 className="text-2xl font-semibold">How We Use Data</h2>
            </div>
            <p className="text-purple-200">
              Data is used to enhance your experience, provide faster services,
              and ensure personalization. We do not sell your data to third parties.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-800/40 border-0 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Lock className="text-purple-300" />
              <h2 className="text-2xl font-semibold">Security & Protection</h2>
            </div>
            <p className="text-purple-200">
              We implement advanced encryption and security practices to safeguard
              your information against unauthorized access.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
