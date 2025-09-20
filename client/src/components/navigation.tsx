import { Link, useLocation } from "wouter";
import { Camera, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/compressor", label: "Compressor" },
    { path: "/enhancer", label: "Enhancer" },
    { path: "/converter", label: "Converter" },
    { path: "/pdf", label: "PDF" },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shadow-lg">
                <Camera className="text-white text-lg" />
              </div>
              <span className="text-2xl font-heading font-bold text-red-500">PhotoPro</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-medium transition-all duration-300 px-4 py-2 rounded-xl relative ${
                    location === item.path
                      ? "text-white bg-red-500 shadow-lg"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors duration-300"
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:text-red-600 hover:bg-red-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    location === item.path
                      ? "text-white bg-red-500 shadow-lg"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
