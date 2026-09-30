import { Camera, Twitter, Facebook, Instagram, Github } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navSections = [
    {
      title: "Tools",
      links: [
        { href: "/compressor", label: "Image Compressor" },
        { href: "/enhancer", label: "Photo Enhancer" },
        { href: "/converter", label: "Format Converter" },
        { href: "/resizer", label: "Image Resizer" },
        { href: "/pdf", label: "PDF Tools" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help-center", label: "Help Center" },
        { href: "/contact-us", label: "Contact Us" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#", label: "About Us" },
        { href: "#", label: "Blog" },
        { href: "#", label: "Careers" },
        { href: "#", label: "Press" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2.5 mb-6" aria-label="PhotoPro Home">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Camera className="text-white text-lg" aria-hidden="true" />
                </div>
                <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">PhotoPro</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs leading-relaxed">
                Professional photo processing made simple. Compress, enhance, and convert images with privacy-first, browser-based technology.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                &copy; {currentYear} PhotoPro. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Made with care for photographers everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}