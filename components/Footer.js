import { siteConfig } from "@/lib/content";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "#servicos", label: "Serviços" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#faq", label: "Perguntas Frequentes" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <footer className="bg-[#0a0f1a] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#6bb8e8]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#ff6b35]/3 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18l-4 4m4-4l4 4m-4 14l-4-4m4 4l4-4M3 12h18M3 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="block text-xl font-bold">{siteConfig.businessName}</span>
                <span className="block text-xs text-[#9dd1f1]/60 uppercase tracking-wider">Refrigeração</span>
              </div>
            </div>
            <p className="text-[#9dd1f1]/60 leading-relaxed max-w-md mb-6">
              Especialistas em conserto de geladeiras em Recife e região metropolitana. Atendimento rápido, técnicos qualificados e garantia em todos os serviços.
            </p>
            {/* Social proof */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#9dd1f1]/60 text-sm">+500 clientes satisfeitos</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#9dd1f1]/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.phoneClean}`}
                  className="flex items-center gap-3 text-[#9dd1f1]/60 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2744] to-[#131d35] border border-[#243556] flex items-center justify-center group-hover:border-[#ff6b35]/30 transition-colors">
                    <svg className="w-4 h-4 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-mono text-sm">{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-[#9dd1f1]/60 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2744] to-[#131d35] border border-[#243556] flex items-center justify-center group-hover:border-[#6bb8e8]/30 transition-colors">
                    <svg className="w-4 h-4 text-[#6bb8e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm break-all">{siteConfig.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-[#9dd1f1]/60">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2744] to-[#131d35] border border-[#243556] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#9dd1f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3 text-[#9dd1f1]/60">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2744] to-[#131d35] border border-[#243556] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#9dd1f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm">{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#243556]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#9dd1f1]/40 text-sm">
              &copy; {currentYear} {siteConfig.businessName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#9dd1f1]/40 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-[#9dd1f1]/40 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
