import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import GlobalLoading from "@/components/global-loading";
import PageWrapper from "@/components/page-wrapper";
import { ErrorBoundary } from "@/components/error-boundary";

const Home = lazy(() => import("@/pages/home"));
const Compressor = lazy(() => import("@/pages/compressor"));
const Enhancer = lazy(() => import("@/pages/enhancer"));
const Converter = lazy(() => import("@/pages/converter"));
const PDFConverter = lazy(() => import("@/pages/pdf"));
const Resizer = lazy(() => import("@/pages/resizer"));
const HelpCenter = lazy(() => import("@/pages/help-center"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      Loading page...
    </div>
  );
}

function Router() {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // Global loading state management
  useEffect(() => {
    // Listen for global loading events
    const handleGlobalLoading = (event: CustomEvent) => {
      setIsGlobalLoading(event.detail.isLoading);
      setLoadingMessage(event.detail.message || "Loading...");
    };

    window.addEventListener('globalLoading', handleGlobalLoading as EventListener);
    
    return () => {
      window.removeEventListener('globalLoading', handleGlobalLoading as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1 w-full">
        <PageWrapper>
          <Suspense fallback={<PageFallback />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/compressor" component={Compressor} />
              <Route path="/enhancer" component={Enhancer} />
              <Route path="/converter" component={Converter} />
              <Route path="/resizer" component={Resizer} />
              <Route path="/pdf" component={PDFConverter} />
              <Route path="/help-center" component={HelpCenter} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/contact-us" component={ContactUs} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </PageWrapper>
      </main>
      <Footer />
      <GlobalLoading isLoading={isGlobalLoading} message={loadingMessage} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
