import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PhotoPro — 404 Not Found";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto text-center p-12 animate-in">
        <CardContent className="space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Go Home
              </Button>
            </Link>
            <Link href="/help-center">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Help Center
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Or try one of our tools:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Link href="/compressor">
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Compressor
                </Badge>
              </Link>
              <Link href="/enhancer">
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Enhancer
                </Badge>
              </Link>
              <Link href="/converter">
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Converter
                </Badge>
              </Link>
              <Link href="/pdf">
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  PDF Tools
                </Badge>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}