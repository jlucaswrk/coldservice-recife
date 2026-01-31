import { faqItems } from "@/lib/content";

export default function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#6bb8e8]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#ff6b35]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e8f4fc] rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#6bb8e8] rounded-full" />
            <span className="text-sm font-semibold text-[#1a2744] uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-[#131d35] mb-6">
            Perguntas <span className="text-gradient-orange">Frequentes</span>
          </h2>
          <p className="text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed">
            Tire suas dúvidas sobre nossos serviços de conserto de geladeira.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-2 border-transparent hover:border-[#6bb8e8]/20">
                {/* Number badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#131d35] to-[#1a2744] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="font-mono font-bold text-[#9dd1f1] text-sm">{String(index + 1).padStart(2, '0')}</span>
                </div>

                {/* Question */}
                <h3 className="text-lg md:text-xl font-bold text-[#131d35] mb-4 pr-8 group-hover:text-[#1a2744] transition-colors">
                  {item.question}
                </h3>

                {/* Answer */}
                <p className="text-[#6c757d] leading-relaxed">
                  {item.answer}
                </p>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#e8f4fc] to-transparent" />
                </div>

                {/* Ice crystal decoration */}
                <div className="absolute top-6 right-6 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg className="w-full h-full text-[#6bb8e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18m0-18l-4 4m4-4l4 4m-4 14l-4-4m4 4l4-4M3 12h18M3 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - WCAG AA Compliant */}
        <div className="mt-12 text-center">
          <p className="text-[#6c757d] mb-4">Ainda tem dúvidas?</p>
          <a
            href="#contato"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c54a1c] to-[#a83d15] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#c54a1c]/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
