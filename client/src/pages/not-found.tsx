import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  if (typeof document !== 'undefined') {
    document.title = "PhotoPro — 404 Not Found";
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <Card className="w-full max-w-lg mx-4 feature-card card-glow border-0">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <h1 className="text-2xl font-bold text-white">404 — Page Not Found</h1>
          </div>
          <p className="mt-2 text-sm text-purple-200">
            The page you’re looking for doesn’t exist or has moved.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button className="hero-gradient text-white">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
