import { services } from "@/lib/content";

const iconMap = {
  wrench: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  star: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  shield: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  clock: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Services({ highlightedService }) {
  // Sort services so highlighted one comes first
  const sortedServices = [...services].sort((a, b) => {
    if (a.id === highlightedService) return -1;
    if (b.id === highlightedService) return 1;
    return 0;
  });

  // Show only top 6 services
  const displayServices = sortedServices.slice(0, 6);

  return (
    <section id="servicos" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#6bb8e8]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ff6b35]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e8f4fc] rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#6bb8e8] rounded-full" />
            <span className="text-sm font-semibold text-[#1a2744] uppercase tracking-wider">Serviços</span>
          </div>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-[#131d35] mb-6">
            Nossos <span className="text-gradient-orange">Serviços</span>
          </h2>
          <p className="text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed">
            Soluções completas para o conserto da sua geladeira, com técnicos especializados nas principais marcas.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayServices.map((service, index) => (
            <div
              key={service.id}
              className={`group relative p-8 rounded-2xl transition-all duration-500 ${
                service.id === highlightedService
                  ? "bg-gradient-to-br from-[#131d35] to-[#1a2744] text-white shadow-2xl shadow-[#131d35]/20 scale-105"
                  : "bg-white hover:bg-gradient-to-br hover:from-[#131d35] hover:to-[#1a2744] hover:text-white shadow-lg hover:shadow-2xl hover:shadow-[#131d35]/20 hover:scale-105"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Frost effect on hover */}
              <div className={`absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-500 ${
                service.id === highlightedService ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#6bb8e8]/10 to-transparent" />
              </div>

              {/* Icon */}
              <div
                className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  service.id === highlightedService
                    ? "bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] text-white"
                    : "bg-gradient-to-br from-[#e8f4fc] to-[#c5e4f7] text-[#1a2744] group-hover:from-[#ff6b35] group-hover:to-[#e55a2b] group-hover:text-white"
                }`}
              >
                {iconMap[service.icon] || iconMap.wrench}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-500 ${
                  service.id === highlightedService ? "text-white" : "text-[#131d35] group-hover:text-white"
                }`}>
                  {service.title}
                </h3>
                <p className={`leading-relaxed transition-colors duration-500 ${
                  service.id === highlightedService ? "text-[#9dd1f1]/80" : "text-[#6c757d] group-hover:text-[#9dd1f1]/80"
                }`}>
                  {service.description}
                </p>
              </div>

              {/* Highlighted badge */}
              {service.id === highlightedService && (
                <div className="absolute -top-3 -right-3">
                  <div className="bg-gradient-to-r from-[#ff6b35] to-[#e55a2b] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
                    Destaque
                  </div>
                </div>
              )}

              {/* Hover arrow */}
              <div className={`absolute bottom-8 right-8 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                service.id === highlightedService
                  ? "bg-white/10 text-white"
                  : "bg-transparent text-transparent group-hover:bg-white/10 group-hover:text-white"
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
