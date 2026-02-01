import { useState, useEffect } from "react";
import { siteConfig } from "@/lib/content";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#servicos", label: "Serviços" },
    { href: "#sobre", label: "Sobre" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#faq", label: "FAQ" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#0d1526]/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-xl transform group-hover:scale-110 transition-transform duration-300" />
              {/* Ice crystal icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v18m0-18l-4 4m4-4l4 4m-4 14l-4-4m4 4l4-4M3 12h18M3 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4"
                  />
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold text-white leading-tight">Cold Service</span>
              <span className="block text-xs text-[#9dd1f1] uppercase tracking-wider">Refrigeração</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6bb8e8] to-[#ff6b35] group-hover:w-full group-hover:left-0 transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Phone CTA (Desktop) - WCAG AA Compliant */}
          <a
            href={`tel:${siteConfig.phoneClean}`}
            className="hidden md:flex items-center gap-3 bg-gradient-to-r from-[#c54a1c] to-[#a83d15] hover:from-[#d4551f] hover:to-[#c54a1c] text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c54a1c]/30"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="font-mono text-sm">{siteConfig.phone}</span>
          </a>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Phone Button - WCAG AA Compliant */}
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="flex items-center justify-center w-11 h-11 bg-gradient-to-r from-[#c54a1c] to-[#a83d15] text-white rounded-xl transition-transform hover:scale-110"
              aria-label="Ligar agora"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? "top-2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 w-full h-0.5 bg-current transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? "top-2 -rotate-45" : "top-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 space-y-1 border-t border-white/10" role="navigation" aria-label="Menu mobile">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
