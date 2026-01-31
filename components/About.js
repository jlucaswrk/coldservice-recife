import { siteConfig } from "@/lib/content";

export default function About() {
  return (
    <section id="sobre" className="py-20 md:py-28 bg-[#0d1526] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-[#6bb8e8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#9dd1f1 1px, transparent 1px), linear-gradient(90deg, #9dd1f1 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <div className="relative order-2 lg:order-1">
            {/* Main visual card */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#6bb8e8]/20 to-[#ff6b35]/10 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative aspect-square max-w-md mx-auto bg-gradient-to-br from-[#1a2744] to-[#131d35] rounded-3xl overflow-hidden border border-[#243556]">
                {/* Frost overlay */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#6bb8e8]/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#ff6b35]/5 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  {/* Ice crystal icon */}
                  <div className="w-32 h-32 mb-6 rounded-3xl bg-gradient-to-br from-[#6bb8e8]/20 to-[#6bb8e8]/5 flex items-center justify-center border border-[#6bb8e8]/20">
                    <svg className="w-16 h-16 text-[#6bb8e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18m0-18l-4 4m4-4l4 4m-4 14l-4-4m4 4l4-4M3 12h18M3 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4" />
                    </svg>
                  </div>

                  <h3 className="heading-display text-2xl text-white mb-2">Cold Service</h3>
                  <p className="text-[#9dd1f1]/70 uppercase tracking-widest text-sm">Refrigeração</p>

                  {/* Decorative line */}
                  <div className="w-24 h-1 bg-gradient-to-r from-[#6bb8e8] to-[#ff6b35] rounded-full mt-6" />
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-8 -right-8 lg:right-0 animate-float">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <p className="font-mono text-4xl font-bold text-[#ff6b35]">+500</p>
                <p className="text-[#6c757d] text-sm font-medium">Clientes atendidos</p>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 lg:left-8 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="bg-gradient-to-br from-[#6bb8e8] to-[#4a9ed4] rounded-2xl shadow-2xl p-4 text-white">
                <p className="font-mono text-2xl font-bold">10+</p>
                <p className="text-sm opacity-90">Anos de experiência</p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#6bb8e8] rounded-full" />
              <span className="text-sm font-semibold text-[#9dd1f1] uppercase tracking-wider">Sobre Nós</span>
            </div>

            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-white mb-8">
              Sobre a <span className="text-gradient">Cold Service</span>
            </h2>

            <div className="space-y-6 text-[#9dd1f1]/80 text-lg leading-relaxed">
              <p>
                Somos uma empresa especializada em <span className="text-white font-semibold">conserto de geladeiras e refrigeradores</span> em Recife e região metropolitana. Com anos de experiência no mercado, oferecemos soluções rápidas e eficientes.
              </p>
              <p>
                Nossa equipe de técnicos é treinada para atender todas as principais marcas: <span className="text-[#ff6b35] font-semibold">Brastemp, Electrolux, Consul, LG, Samsung</span> e muitas outras. Trabalhamos com peças originais e oferecemos garantia em todos os serviços.
              </p>
              <p>
                Acreditamos que ninguém deve ficar sem geladeira funcionando. Por isso, oferecemos atendimento rápido, com possibilidade de visita no mesmo dia.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: "90", label: "Dias de garantia", suffix: "" },
                { value: "2", label: "Horas de chegada", suffix: "h" },
                { value: "7", label: "Dias por semana", suffix: "" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a2744] to-[#131d35] border border-[#243556] text-center group hover:border-[#6bb8e8]/30 transition-colors"
                >
                  {/* Frost effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#6bb8e8]/10 to-transparent" />
                  </div>

                  <div className="relative">
                    <p className="font-mono text-3xl md:text-4xl font-bold text-[#ff6b35]">
                      {stat.value}<span className="text-2xl">{stat.suffix}</span>
                    </p>
                    <p className="text-[#9dd1f1]/60 text-sm mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
