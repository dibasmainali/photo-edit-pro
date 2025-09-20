import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import GlobalLoading from "@/components/global-loading";
import PageWrapper from "@/components/page-wrapper";
import Home from "@/pages/home";
import Compressor from "@/pages/compressor";
import Enhancer from "@/pages/enhancer";
import Converter from "@/pages/converter";
import PDFConverter from "@/pages/pdf";
import HelpCenter from "@/pages/help-center";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import ContactUs from "@/pages/ContactUs";
import NotFound from "@/pages/not-found";

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
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/compressor" component={Compressor} />
            <Route path="/enhancer" component={Enhancer} />
            <Route path="/converter" component={Converter} />
            <Route path="/pdf" component={PDFConverter} />
            <Route path="/help-center" component={HelpCenter} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/contact-us" component={ContactUs} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route component={NotFound} />
          </Switch>
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
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
