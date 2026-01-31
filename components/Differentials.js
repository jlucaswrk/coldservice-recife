import { differentials } from "@/lib/content";

const iconMap = {
  clock: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  user: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  "credit-card": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
};

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#6bb8e8]/5 to-[#ff6b35]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e8f4fc] rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#ff6b35] rounded-full" />
            <span className="text-sm font-semibold text-[#1a2744] uppercase tracking-wider">Diferenciais</span>
          </div>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-[#131d35] mb-6">
            Por Que Nos <span className="text-gradient-orange">Escolher?</span>
          </h2>
          <p className="text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed">
            Somos referência em conserto de geladeiras em Recife. Confira os diferenciais que nos tornam a melhor escolha.
          </p>
        </div>

        {/* Differentials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl bg-white border-2 border-transparent hover:border-[#6bb8e8]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Number badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#131d35] to-[#1a2744] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="font-mono font-bold text-[#9dd1f1]">{String(index + 1).padStart(2, '0')}</span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e8f4fc] to-[#c5e4f7] flex items-center justify-center text-[#1a2744] mb-6 group-hover:from-[#ff6b35] group-hover:to-[#e55a2b] group-hover:text-white transition-all duration-500">
                  {iconMap[item.icon] || iconMap.check}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#131d35] mb-3 group-hover:text-[#1a2744] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#6c757d] leading-relaxed">
                  {item.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden rounded-br-2xl">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#e8f4fc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-br from-[#131d35] to-[#1a2744] rounded-2xl p-6 pr-8 shadow-2xl">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg">Satisfação Garantida</p>
              <p className="text-[#9dd1f1]/70 text-sm">Mais de 500 clientes satisfeitos em Recife</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
