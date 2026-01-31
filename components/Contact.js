import { useState } from "react";
import { siteConfig } from "@/lib/content";
import { buildWhatsAppUrl, formatPhone } from "@/lib/dtr";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    problem: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.phone = "Telefone inválido";
    }

    if (!formData.problem || formData.problem.trim().length < 10) {
      newErrors.problem = "Descreva o problema (mínimo 10 caracteres)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build WhatsApp URL with form data
    const url = buildWhatsAppUrl(siteConfig.whatsapp, {
      name: formData.name,
      phone: formatPhone(formData.phone),
      problem: formData.problem,
    });

    setWhatsappUrl(url);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contato" className="py-20 md:py-28 bg-[#0d1526] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6bb8e8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff6b35]/5 rounded-full blur-3xl" />

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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#9dd1f1] uppercase tracking-wider">Contato</span>
            </div>

            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              Entre em <span className="text-gradient-orange">Contato</span>
            </h2>
            <p className="text-lg text-[#9dd1f1]/80 mb-10 leading-relaxed">
              Estamos prontos para atender você. Escolha a forma de contato que preferir.
            </p>

            {/* Contact Options */}
            <div className="space-y-4 mb-10">
              {/* Phone */}
              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="group flex items-center gap-5 p-5 bg-gradient-to-br from-[#1a2744] to-[#131d35] rounded-2xl border border-[#243556] hover:border-[#6bb8e8]/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Ligue Agora</p>
                  <p className="font-mono text-[#ff6b35]">{siteConfig.phone}</p>
                </div>
                <div className="ml-auto w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#ff6b35]/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-[#9dd1f1] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 p-5 bg-gradient-to-br from-[#1a2744] to-[#131d35] rounded-2xl border border-[#243556] hover:border-[#25d366]/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#25d366] to-[#1da851] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-lg">WhatsApp</p>
                  <p className="text-[#25d366]">Clique para conversar</p>
                </div>
                <div className="ml-auto w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#25d366]/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-[#9dd1f1] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-5 p-5 bg-gradient-to-br from-[#1a2744] to-[#131d35] rounded-2xl border border-[#243556]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6bb8e8]/20 to-[#6bb8e8]/5 border border-[#6bb8e8]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#6bb8e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Horário de Atendimento</p>
                  <p className="text-[#9dd1f1]/70 text-sm">{siteConfig.hours}</p>
                </div>
              </div>
            </div>

            {/* Mobile: Direct CTA buttons instead of form */}
            <div className="lg:hidden space-y-4">
              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#ff6b35] to-[#e55a2b] text-white px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff6b35]/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Ligar Agora
              </a>
              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25d366] to-[#1da851] text-white px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#25d366]/30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chamar no WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form (Desktop only) */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6bb8e8]/20 to-[#ff6b35]/20 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                {!submitted ? (
                  <>
                    <h3 className="heading-display text-2xl text-[#131d35] mb-2">
                      Solicite um Orçamento
                    </h3>
                    <p className="text-[#6c757d] mb-8">
                      Preencha o formulário e continue a conversa no WhatsApp
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-[#131d35] mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Seu nome completo"
                          className={`w-full px-5 py-4 bg-[#f8f9fa] border-2 rounded-xl focus:ring-0 focus:border-[#6bb8e8] outline-none transition-colors text-[#131d35] placeholder-[#adb5bd] ${
                            errors.name ? "border-red-500" : "border-transparent"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-[#131d35] mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(81) 99999-9999"
                          className={`w-full px-5 py-4 bg-[#f8f9fa] border-2 rounded-xl focus:ring-0 focus:border-[#6bb8e8] outline-none transition-colors text-[#131d35] placeholder-[#adb5bd] font-mono ${
                            errors.phone ? "border-red-500" : "border-transparent"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      {/* Problem */}
                      <div>
                        <label htmlFor="problem" className="block text-sm font-semibold text-[#131d35] mb-2">
                          Qual o problema? *
                        </label>
                        <textarea
                          id="problem"
                          name="problem"
                          value={formData.problem}
                          onChange={handleChange}
                          placeholder="Descreva o problema com sua geladeira..."
                          rows={4}
                          className={`w-full px-5 py-4 bg-[#f8f9fa] border-2 rounded-xl focus:ring-0 focus:border-[#6bb8e8] outline-none transition-colors resize-none text-[#131d35] placeholder-[#adb5bd] ${
                            errors.problem ? "border-red-500" : "border-transparent"
                          }`}
                        />
                        {errors.problem && (
                          <p className="mt-2 text-sm text-red-500">{errors.problem}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#ff6b35] to-[#e55a2b] text-white px-6 py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#ff6b35]/30"
                      >
                        Enviar e Continuar no WhatsApp
                      </button>
                    </form>
                  </>
                ) : (
                  /* Confirmation */
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="heading-display text-2xl text-[#131d35] mb-2">
                      Obrigado, {formData.name}!
                    </h3>
                    <p className="text-[#6c757d] mb-8">
                      Clique no botão abaixo para continuar a conversa no WhatsApp
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25d366] to-[#1da851] text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#25d366]/30"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Abrir WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", phone: "", problem: "" });
                      }}
                      className="block mx-auto mt-6 text-[#6c757d] hover:text-[#131d35] text-sm font-medium transition-colors"
                    >
                      Enviar outro formulário
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
