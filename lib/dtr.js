import { dtrMappings, defaultContent } from "./content";

/**
 * Get personalized content based on keyword from URL
 * @param {string|null} keyword - The keyword from ?keyword= URL parameter
 * @returns {Object} Personalized content object
 */
export function getPersonalizedContent(keyword) {
  // Type safety check
  if (!keyword || typeof keyword !== "string") {
    return defaultContent;
  }

  // Normalize keyword: lowercase, replace spaces with hyphens, remove accents
  const normalizedKeyword = keyword
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-");

  // Direct match
  if (dtrMappings[normalizedKeyword]) {
    return dtrMappings[normalizedKeyword];
  }

  // Partial match - check if keyword contains any of our mappings
  for (const [key, content] of Object.entries(dtrMappings)) {
    if (normalizedKeyword.includes(key) || key.includes(normalizedKeyword)) {
      return content;
    }
  }

  // Brand detection fallback
  const brandKeywords = {
    brastemp: "conserto-geladeira-brastemp",
    electrolux: "conserto-geladeira-electrolux",
    consul: "conserto-geladeira-consul",
    lg: "conserto-geladeira-lg",
    samsung: "conserto-geladeira-samsung",
  };

  for (const [brand, mappingKey] of Object.entries(brandKeywords)) {
    if (normalizedKeyword.includes(brand)) {
      return dtrMappings[mappingKey];
    }
  }

  // Problem detection fallback
  const problemKeywords = {
    "nao-gela": "geladeira-nao-gela",
    "não-gela": "geladeira-nao-gela",
    "barulho": "geladeira-fazendo-barulho",
    "vazando": "geladeira-vazando-agua",
  };

  for (const [problem, mappingKey] of Object.entries(problemKeywords)) {
    if (normalizedKeyword.includes(problem)) {
      return dtrMappings[mappingKey];
    }
  }

  // No match found, return default
  return defaultContent;
}

/**
 * Build WhatsApp URL with pre-filled message
 * @param {string} whatsappNumber - WhatsApp number without special characters
 * @param {Object|string} formDataOrMessage - Optional form data object or custom message string
 * @returns {string} WhatsApp URL
 */
export function buildWhatsAppUrl(whatsappNumber, formDataOrMessage = null) {
  let message;

  if (typeof formDataOrMessage === "string") {
    // Direct message string
    message = formDataOrMessage;
  } else if (formDataOrMessage && formDataOrMessage.name && formDataOrMessage.phone && formDataOrMessage.problem) {
    // Form data object
    message = `Olá! Meu nome é ${formDataOrMessage.name}, telefone ${formDataOrMessage.phone}. Preciso de ajuda com: ${formDataOrMessage.problem}`;
  } else {
    // Default message
    message = "Olá! Vi o anúncio e gostaria de solicitar um orçamento para conserto de geladeira.";
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
  // Remove non-digits
  const digits = phone.replace(/\D/g, "");

  // Format as (XX) XXXXX-XXXX
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  // Format as (XX) XXXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}
