import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md mx-auto p-8 text-center">
            <CardContent className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
              </div>

              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We encountered an unexpected error. Our team has been notified.
                </p>
                {this.state.error && (
                  <details className="text-left mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Error details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;