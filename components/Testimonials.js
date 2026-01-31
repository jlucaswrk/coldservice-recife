import { testimonials, googleReviews } from "@/lib/content";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-[#f59e0b]" : "text-[#dee2e6]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-[#0d1526] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6bb8e8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff6b35]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 mb-8">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-bold text-white">{googleReviews.rating}</span>
              <StarRating rating={5} />
            </div>
            <div className="w-px h-8 bg-white/20" />
            <span className="text-[#9dd1f1]/80">{googleReviews.totalReviews} avaliações</span>
          </div>

          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            O Que Nossos <span className="text-gradient">Clientes</span> Dizem
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6bb8e8]/20 to-[#ff6b35]/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card */}
              <div className="relative bg-gradient-to-br from-[#1a2744] to-[#131d35] rounded-2xl p-8 border border-[#243556] hover:border-[#6bb8e8]/30 transition-all duration-500">
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6bb8e8]/20 to-[#6bb8e8]/5 border border-[#6bb8e8]/20 flex items-center justify-center">
                      <span className="text-[#6bb8e8] font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{testimonial.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        {testimonial.neighborhood && (
                          <span className="text-[#ff6b35]">{testimonial.neighborhood}</span>
                        )}
                        {testimonial.neighborhood && testimonial.service && (
                          <span className="text-[#9dd1f1]/40">•</span>
                        )}
                        <span className="text-[#9dd1f1]/60">{testimonial.service}</span>
                      </div>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Comment */}
                <p className="text-[#9dd1f1]/80 text-lg leading-relaxed mb-4">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>

                {/* Date */}
                <p className="text-[#9dd1f1]/40 text-sm">{testimonial.date}</p>

                {/* Frost effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#6bb8e8]/5 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Link */}
        <div className="text-center">
          <a
            href={googleReviews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[#9dd1f1] hover:text-white font-semibold text-lg transition-colors"
          >
            Ver todas as avaliações no Google
            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#ff6b35] flex items-center justify-center transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
