import { brands, trustBadges } from "@/lib/content";

const iconMap = {
  clock: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  document: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  star: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

// Frost crystal SVG for decoration
function FrostCrystal({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
      <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2l-2 3h4l-2-3M12 22l-2-3h4l-2 3M2 12l3-2v4l-3-2M22 12l-3-2v4l3-2" />
    </svg>
  );
}

export default function TrustBadges() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f0f7fc] overflow-hidden">
      {/* Frost pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60M10.6 10.6l38.8 38.8M49.4 10.6L10.6 49.4' stroke='%236bb8e8' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating frost crystals */}
      <FrostCrystal className="absolute top-8 left-[10%] w-8 h-8 text-[#6bb8e8]/20 animate-pulse" />
      <FrostCrystal className="absolute top-20 right-[15%] w-6 h-6 text-[#6bb8e8]/15 animate-pulse" style={{ animationDelay: '1s' }} />
      <FrostCrystal className="absolute bottom-16 left-[20%] w-5 h-5 text-[#6bb8e8]/10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges - Asymmetric Frost Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Frost glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#6bb8e8]/0 to-[#9dd1f1]/0 group-hover:from-[#6bb8e8]/20 group-hover:to-[#9dd1f1]/10 rounded-2xl blur-xl transition-all duration-500" />

              {/* Card */}
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-[#e8f4fc] group-hover:border-[#6bb8e8]/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[#6bb8e8]/10">
                {/* Frost corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-[#6bb8e8]/10 to-transparent rotate-45" />
                </div>

                {/* Icon with frost ring */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 mb-4">
                  {/* Animated frost ring */}
                  <div className="absolute inset-0 rounded-xl border-2 border-dashed border-[#6bb8e8]/20 group-hover:border-[#6bb8e8]/40 group-hover:rotate-45 transition-all duration-700" />

                  {/* Icon container */}
                  <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-[#131d35] to-[#1a2744] flex items-center justify-center text-[#6bb8e8] group-hover:from-[#1a2744] group-hover:to-[#243556] transition-all duration-300">
                    {iconMap[badge.icon]}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-[#131d35] text-base md:text-lg mb-1 tracking-tight">
                  {badge.title}
                </h3>
                <p className="text-sm text-[#6c757d] leading-relaxed">
                  {badge.description}
                </p>

                {/* Bottom frost line */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#6bb8e8]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Brands Section - Industrial Style */}
        <div className="relative">
          {/* Section divider with frost effect */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#6bb8e8]/30 to-[#6bb8e8]/50" />
            <div className="flex items-center gap-3 px-4 py-2 bg-[#131d35] rounded-full">
              <div className="w-2 h-2 bg-[#6bb8e8] rounded-full animate-pulse" />
              <span className="text-xs font-bold text-[#9dd1f1] uppercase tracking-[0.2em]">
                Marcas Atendidas
              </span>
              <div className="w-2 h-2 bg-[#6bb8e8] rounded-full animate-pulse" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#6bb8e8]/30 to-[#6bb8e8]/50" />
          </div>

          {/* Brand logos - Grid on mobile, Marquee on desktop */}

          {/* Mobile: Grid 2 columns */}
          <div className="md:hidden py-6">
            <div className="grid grid-cols-2 gap-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="group relative"
                >
                  {/* Brand card */}
                  <div
                    className="relative px-4 py-4 bg-gradient-to-b from-[#f8f9fa] to-white rounded-xl border-2 transition-all duration-300 text-center"
                    style={{ borderColor: `${brand.color}30` }}
                  >
                    {/* Technical corner marks with brand color */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-l border-t" style={{ borderColor: `${brand.color}50` }} />
                    <div className="absolute top-1 right-1 w-2 h-2 border-r border-t" style={{ borderColor: `${brand.color}50` }} />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b" style={{ borderColor: `${brand.color}50` }} />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b" style={{ borderColor: `${brand.color}50` }} />

                    <span
                      className="font-bold text-lg tracking-tight"
                      style={{ color: brand.color }}
                    >
                      {brand.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Scrolling marquee */}
          <div className="hidden md:block relative overflow-hidden py-6">
            {/* Gradient masks for infinite scroll effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Scrolling container */}
            <div className="flex animate-scroll-brands">
              {/* First set */}
              <div className="flex items-center gap-12 px-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="group relative flex-shrink-0"
                  >
                    {/* Brand card */}
                    <div
                      className="relative px-8 py-5 bg-gradient-to-b from-[#f8f9fa] to-white rounded-xl border-2 group-hover:shadow-lg transition-all duration-300"
                      style={{ borderColor: `${brand.color}30` }}
                    >
                      {/* Technical corner marks */}
                      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t" style={{ borderColor: `${brand.color}50` }} />
                      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t" style={{ borderColor: `${brand.color}50` }} />
                      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b" style={{ borderColor: `${brand.color}50` }} />
                      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b" style={{ borderColor: `${brand.color}50` }} />

                      <span
                        className="text-2xl font-bold tracking-tight transition-colors whitespace-nowrap"
                        style={{ color: brand.color }}
                      >
                        {brand.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-12 px-4">
                {brands.map((brand) => (
                  <div
                    key={`dup-${brand.id}`}
                    className="group relative flex-shrink-0"
                  >
                    <div
                      className="relative px-8 py-5 bg-gradient-to-b from-[#f8f9fa] to-white rounded-xl border-2 group-hover:shadow-lg transition-all duration-300"
                      style={{ borderColor: `${brand.color}30` }}
                    >
                      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t" style={{ borderColor: `${brand.color}50` }} />
                      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t" style={{ borderColor: `${brand.color}50` }} />
                      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b" style={{ borderColor: `${brand.color}50` }} />
                      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b" style={{ borderColor: `${brand.color}50` }} />

                      <span
                        className="text-2xl font-bold tracking-tight transition-colors whitespace-nowrap"
                        style={{ color: brand.color }}
                      >
                        {brand.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-xs text-[#6c757d]">
              <span className="w-8 h-px bg-[#6bb8e8]/30" />
              <span className="font-medium uppercase tracking-wider">Técnicos Certificados</span>
              <span className="w-8 h-px bg-[#6bb8e8]/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
