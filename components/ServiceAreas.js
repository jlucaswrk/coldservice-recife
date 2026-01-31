import { serviceAreas, siteConfig } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/dtr";

export default function ServiceAreas() {
  return (
    <section id="areas" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#6bb8e8]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ff6b35]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#e8f4fc] rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#6bb8e8] rounded-full" />
            <span className="text-sm font-semibold text-[#1a2744] uppercase tracking-wider">Cobertura</span>
          </div>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-[#131d35] mb-6">
            Onde <span className="text-gradient-orange">Atendemos</span>
          </h2>
          <p className="text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed">
            Atendemos toda Recife e região metropolitana. Técnico na sua casa em até 2 horas!
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {serviceAreas.zones.map((zone, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-[#6bb8e8]/20"
            >
              {/* Zone Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#131d35] to-[#1a2744] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#131d35]">{zone.name}</h3>
              </div>

              {/* Neighborhoods */}
              <div className="flex flex-wrap gap-2">
                {zone.neighborhoods.map((neighborhood, nIndex) => (
                  <span
                    key={nIndex}
                    className="inline-block px-3 py-1 bg-[#f8f9fa] text-[#6c757d] text-sm rounded-lg hover:bg-[#e8f4fc] hover:text-[#1a2744] transition-colors cursor-default"
                  >
                    {neighborhood}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-[#131d35] to-[#1a2744] rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Não encontrou seu bairro?
            </h3>
            <p className="text-[#9dd1f1]/80 mb-8">
              Provavelmente atendemos sua região também! Entre em contato e confirme.
            </p>
            {/* Buttons - WCAG AA Compliant */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#c54a1c] to-[#a83d15] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#c54a1c]/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {siteConfig.phone}
              </a>
              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp, { message: "Olá! Gostaria de saber se vocês atendem minha região." })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#128c4a] hover:bg-[#0d6e3a] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
