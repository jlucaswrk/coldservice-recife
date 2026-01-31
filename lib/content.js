// Site configuration - easy to update
export const siteConfig = {
  businessName: "Cold Service Refrigeração",
  siteUrl: "https://coldservicerefrigeracao.com.br", // Update after deploying
  phone: "(81) 99999-9999", // TODO: Replace with real phone number
  phoneClean: "81999999999", // TODO: Replace with real phone number
  whatsapp: "5581999999999", // TODO: Replace with real WhatsApp number
  email: "contato@coldservicerefrigeracao.com.br",
  hours: "Segunda a Sábado: 8h às 18h | Emergência: 24h",
  hoursEmergency: "Atendimento de Emergência 24h",
  address: "Recife, PE",
  googleMapsUrl: "https://maps.google.com/?q=recife+pe",
  googleBusinessUrl: "https://g.page/cold-service-refrigeracao",
  // Stats for social proof
  stats: {
    clientsServed: "5.000+",
    yearsExperience: "15+",
    warrantyDays: "90",
    responseTime: "2h",
  },
};

// Default content (used when no keyword match)
export const defaultContent = {
  hero: {
    headline: "Geladeira Parou? Consertamos Hoje!",
    subheadline: "Técnico na sua casa em até 2 horas. Acompanhe a chegada em tempo real pelo nosso sistema de rastreamento.",
    ctaText: "Chamar Técnico Agora",
    urgencyBadge: "Técnicos disponíveis agora",
  },
  services: {
    highlightedService: null,
  },
};

// DTR content mappings
export const dtrMappings = {
  // Brand keywords
  "conserto-geladeira-brastemp": {
    category: "brand",
    hero: {
      headline: "Sua Brastemp Parou? Resolvemos Hoje!",
      subheadline: "Especialistas certificados em Brastemp. Peças originais. Garantia de 90 dias. Diagnóstico grátis.",
      ctaText: "Chamar Especialista Brastemp",
      urgencyBadge: "Técnico Brastemp disponível",
    },
    services: {
      highlightedService: "brastemp",
    },
  },
  "conserto-geladeira-electrolux": {
    category: "brand",
    hero: {
      headline: "Electrolux com Problema? Consertamos Hoje!",
      subheadline: "Especialistas certificados em Electrolux. Peças originais. Garantia de 90 dias. Diagnóstico grátis.",
      ctaText: "Chamar Especialista Electrolux",
      urgencyBadge: "Técnico Electrolux disponível",
    },
    services: {
      highlightedService: "electrolux",
    },
  },
  "conserto-geladeira-consul": {
    category: "brand",
    hero: {
      headline: "Consul Não Gela? Resolvemos Hoje!",
      subheadline: "Especialistas certificados em Consul. Peças originais. Garantia de 90 dias. Diagnóstico grátis.",
      ctaText: "Chamar Especialista Consul",
      urgencyBadge: "Técnico Consul disponível",
    },
    services: {
      highlightedService: "consul",
    },
  },
  "conserto-geladeira-lg": {
    category: "brand",
    hero: {
      headline: "LG com Defeito? Consertamos Hoje!",
      subheadline: "Especialistas certificados em LG. Peças originais. Garantia de 90 dias. Diagnóstico grátis.",
      ctaText: "Chamar Especialista LG",
      urgencyBadge: "Técnico LG disponível",
    },
    services: {
      highlightedService: "lg",
    },
  },
  "conserto-geladeira-samsung": {
    category: "brand",
    hero: {
      headline: "Samsung com Problema? Resolvemos Hoje!",
      subheadline: "Especialistas certificados em Samsung. Peças originais. Garantia de 90 dias. Diagnóstico grátis.",
      ctaText: "Chamar Especialista Samsung",
      urgencyBadge: "Técnico Samsung disponível",
    },
    services: {
      highlightedService: "samsung",
    },
  },
  // Problem keywords
  "geladeira-nao-gela": {
    category: "problem",
    hero: {
      headline: "Geladeira Não Gela? Consertamos Hoje!",
      subheadline: "Não deixe seus alimentos estragarem! Diagnóstico grátis em até 2 horas. Garantia de 90 dias.",
      ctaText: "Resolver Meu Problema Agora",
      urgencyBadge: "Técnico a caminho em 2h",
    },
    services: {
      highlightedService: "diagnostico",
    },
  },
  "geladeira-fazendo-barulho": {
    category: "problem",
    hero: {
      headline: "Geladeira Fazendo Barulho Estranho?",
      subheadline: "Pode ser sinal de problema grave! Diagnóstico grátis. Técnico em até 2 horas. Garantia de 90 dias.",
      ctaText: "Agendar Diagnóstico Grátis",
      urgencyBadge: "Diagnóstico grátis hoje",
    },
    services: {
      highlightedService: "diagnostico",
    },
  },
  "geladeira-vazando-agua": {
    category: "problem",
    hero: {
      headline: "Geladeira Vazando Água? Resolvemos Hoje!",
      subheadline: "Evite danos maiores! Diagnóstico grátis em até 2 horas. Técnicos especializados. Garantia de 90 dias.",
      ctaText: "Resolver Vazamento Agora",
      urgencyBadge: "Atendimento emergencial",
    },
    services: {
      highlightedService: "diagnostico",
    },
  },
  // Generic keywords
  "conserto-geladeira-recife": {
    category: "generic",
    hero: {
      headline: "Conserto de Geladeira em Recife - Mesmo Dia!",
      subheadline: "Técnico na sua casa em até 2 horas. Todas as marcas. Diagnóstico grátis. Garantia de 90 dias.",
      ctaText: "Chamar Técnico Agora",
      urgencyBadge: "Atendimento hoje",
    },
    services: {
      highlightedService: null,
    },
  },
  "assistencia-tecnica-geladeira": {
    category: "generic",
    hero: {
      headline: "Assistência Técnica de Geladeira em Recife",
      subheadline: "Especialistas em todas as marcas. Atendimento em até 2 horas. Diagnóstico grátis. Garantia de 90 dias.",
      ctaText: "Solicitar Visita Técnica",
      urgencyBadge: "Técnicos disponíveis",
    },
    services: {
      highlightedService: null,
    },
  },
};

// Services data
export const services = [
  {
    id: "diagnostico",
    title: "Diagnóstico e Reparo",
    description: "Identificamos o problema da sua geladeira e realizamos o conserto com peças de qualidade.",
    icon: "wrench",
  },
  {
    id: "brastemp",
    title: "Especialistas em Brastemp",
    description: "Técnicos treinados e peças originais para sua geladeira Brastemp.",
    icon: "star",
  },
  {
    id: "electrolux",
    title: "Especialistas em Electrolux",
    description: "Técnicos treinados e peças originais para sua geladeira Electrolux.",
    icon: "star",
  },
  {
    id: "consul",
    title: "Especialistas em Consul",
    description: "Técnicos treinados e peças originais para sua geladeira Consul.",
    icon: "star",
  },
  {
    id: "lg",
    title: "Especialistas em LG",
    description: "Técnicos treinados e peças originais para sua geladeira LG.",
    icon: "star",
  },
  {
    id: "samsung",
    title: "Especialistas em Samsung",
    description: "Técnicos treinados e peças originais para sua geladeira Samsung.",
    icon: "star",
  },
  {
    id: "manutencao",
    title: "Manutenção Preventiva",
    description: "Evite problemas futuros com manutenção periódica da sua geladeira.",
    icon: "shield",
  },
  {
    id: "emergencia",
    title: "Atendimento de Emergência",
    description: "Conserto urgente para sua geladeira no mesmo dia.",
    icon: "clock",
  },
];

// Differentials data
export const differentials = [
  {
    title: "Atendimento Rápido",
    description: "Chegamos em até 2 horas na região de Recife.",
    icon: "clock",
  },
  {
    title: "Técnicos Especializados",
    description: "Profissionais treinados nas principais marcas do mercado.",
    icon: "user",
  },
  {
    title: "Garantia de Serviço",
    description: "90 dias de garantia em todas as peças e serviços.",
    icon: "shield",
  },
  {
    title: "Peças Originais",
    description: "Utilizamos apenas peças originais e de alta qualidade.",
    icon: "check",
  },
  {
    title: "Orçamento Gratuito",
    description: "Diagnóstico sem compromisso antes de aprovar o serviço.",
    icon: "document",
  },
  {
    title: "Pagamento Facilitado",
    description: "Aceitamos cartão, PIX e parcelamento.",
    icon: "credit-card",
  },
];

// Testimonials data
export const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    neighborhood: "Boa Viagem",
    rating: 5,
    comment: "Minha geladeira Brastemp parou de gelar numa sexta à noite. Liguei sábado de manhã e em 2 horas o técnico já estava aqui. Problema resolvido no mesmo dia! Super recomendo.",
    service: "Conserto Brastemp",
    date: "Janeiro 2026",
  },
  {
    id: 2,
    name: "João Santos",
    neighborhood: "Casa Forte",
    rating: 5,
    comment: "Profissionais muito competentes. Achei que ia ter que comprar geladeira nova, mas eles consertaram a minha Electrolux por um preço justo. Funcionando perfeitamente há 3 meses!",
    service: "Conserto Electrolux",
    date: "Janeiro 2026",
  },
  {
    id: 3,
    name: "Ana Costa",
    neighborhood: "Imbiribeira",
    rating: 5,
    comment: "Atendimento no domingo de emergência! A geladeira não estava gelando e eu tinha muita comida. Eles vieram rápido e resolveram. Salvaram minha semana! Obrigada Cold Service!",
    service: "Emergência Domingo",
    date: "Janeiro 2026",
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    neighborhood: "Espinheiro",
    rating: 5,
    comment: "Já é a terceira vez que chamo a Cold Service. Atendimento sempre impecável, técnicos educados e o serviço é garantido. Indico de olhos fechados para toda Recife!",
    service: "Cliente Fiel",
    date: "Dezembro 2025",
  },
  {
    id: 5,
    name: "Fernanda Almeida",
    neighborhood: "Graças",
    rating: 5,
    comment: "Orçamento grátis e sem enrolação. O técnico explicou tudo direitinho, mostrou o problema e o preço foi justo. Geladeira Samsung voltou a funcionar perfeitamente!",
    service: "Conserto Samsung",
    date: "Janeiro 2026",
  },
  {
    id: 6,
    name: "Roberto Lima",
    neighborhood: "Aflitos",
    rating: 5,
    comment: "Geladeira fazendo um barulho estranho há dias. Chamei a Cold Service, o técnico identificou o problema rapidamente. Serviço rápido e com garantia. Recomendo!",
    service: "Diagnóstico + Reparo",
    date: "Dezembro 2025",
  },
];

// FAQ data
export const faqItems = [
  {
    question: "Quanto custa o conserto de geladeira?",
    answer: "O valor varia de R$ 150 a R$ 600 conforme o problema. Mas não se preocupe: oferecemos diagnóstico e orçamento 100% gratuitos, sem compromisso. Você só paga se aprovar o serviço. Ligue agora e descubra o valor exato para o seu caso!",
  },
  {
    question: "Vocês conseguem atender hoje mesmo?",
    answer: "Sim! Na maioria dos casos, nosso técnico chega em até 2 horas após o contato. Trabalhamos de segunda a sábado das 8h às 18h, e atendemos emergências aos domingos e feriados.",
  },
  {
    question: "E se o problema voltar depois do conserto?",
    answer: "Oferecemos 90 dias de garantia em todas as peças e serviços. Se qualquer problema relacionado ao conserto ocorrer nesse período, voltamos sem custo adicional. Sua tranquilidade é garantida!",
  },
  {
    question: "Vocês usam peças originais?",
    answer: "Sim! Trabalhamos exclusivamente com peças originais e de alta qualidade das principais marcas: Brastemp, Electrolux, Consul, LG, Samsung e outras. Isso garante durabilidade e mantém a garantia do seu aparelho.",
  },
  {
    question: "Preciso levar a geladeira até vocês?",
    answer: "Não! Nosso atendimento é 100% em domicílio. O técnico vai até sua casa com todas as ferramentas e peças mais comuns. Na maioria dos casos, o conserto é feito na hora, sem você precisar se deslocar.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Aceitamos PIX, dinheiro, cartão de débito e crédito (com parcelamento em até 12x). Você escolhe a forma que for mais conveniente!",
  },
  {
    question: "Vocês atendem meu bairro?",
    answer: "Atendemos toda Recife e região metropolitana: Boa Viagem, Casa Forte, Espinheiro, Graças, Imbiribeira, Olinda, Jaboatão e muito mais. Se você está na Grande Recife, atendemos você!",
  },
  {
    question: "Vale a pena consertar ou é melhor comprar uma geladeira nova?",
    answer: "Na maioria dos casos, o conserto é muito mais econômico! Nosso técnico faz uma avaliação honesta e só recomenda o conserto se for vantajoso para você. Se não valer a pena, avisamos. Confiança é nosso maior valor.",
  },
];

// Google reviews summary (mock data - would come from API in production)
export const googleReviews = {
  rating: 4.9,
  totalReviews: 247,
  url: "https://g.page/cold-service-refrigeracao/review",
};

// Brands we service
export const brands = [
  { id: "brastemp", name: "Brastemp", logo: "/brands/brastemp.svg" },
  { id: "electrolux", name: "Electrolux", logo: "/brands/electrolux.svg" },
  { id: "consul", name: "Consul", logo: "/brands/consul.svg" },
  { id: "lg", name: "LG", logo: "/brands/lg.svg" },
  { id: "samsung", name: "Samsung", logo: "/brands/samsung.svg" },
  { id: "panasonic", name: "Panasonic", logo: "/brands/panasonic.svg" },
];

// Service areas in Recife
export const serviceAreas = {
  zones: [
    {
      name: "Zona Sul",
      neighborhoods: [
        "Boa Viagem", "Pina", "Imbiribeira", "Ipsep", "Ibura", "Jordão",
        "Cohab", "Brasília Teimosa", "Areias"
      ],
    },
    {
      name: "Zona Norte",
      neighborhoods: [
        "Casa Amarela", "Casa Forte", "Parnamirim", "Tamarineira", "Graças",
        "Espinheiro", "Aflitos", "Derby", "Jaqueira", "Santana"
      ],
    },
    {
      name: "Zona Oeste",
      neighborhoods: [
        "Várzea", "Cordeiro", "Madalena", "Torre", "Engenho do Meio",
        "Iputinga", "Cidade Universitária", "Caxangá"
      ],
    },
    {
      name: "Centro",
      neighborhoods: [
        "Boa Vista", "Santo Amaro", "São José", "Recife Antigo",
        "Soledade", "Coelhos", "Ilha do Leite"
      ],
    },
    {
      name: "Região Metropolitana",
      neighborhoods: [
        "Olinda", "Jaboatão dos Guararapes", "Paulista", "Camaragibe",
        "Abreu e Lima", "Igarassu"
      ],
    },
  ],
};

// How it works steps
export const howItWorksSteps = [
  {
    number: "01",
    title: "Você Liga ou Chama no WhatsApp",
    description: "Descreva o problema da sua geladeira. Atendimento 24h para emergências.",
    icon: "phone",
  },
  {
    number: "02",
    title: "Técnico Vai Até Você",
    description: "Em até 2 horas, um técnico especializado chega na sua casa para diagnóstico grátis.",
    icon: "truck",
  },
  {
    number: "03",
    title: "Orçamento Sem Compromisso",
    description: "Você aprova o orçamento antes de qualquer serviço. Sem surpresas, sem taxas ocultas.",
    icon: "document",
  },
  {
    number: "04",
    title: "Problema Resolvido com Garantia",
    description: "Consertamos sua geladeira na hora. 90 dias de garantia em peças e serviços.",
    icon: "check",
  },
];

// Trust badges
export const trustBadges = [
  {
    icon: "clock",
    title: "Atendimento em 2h",
    description: "Técnico na sua casa rapidamente",
  },
  {
    icon: "shield",
    title: "Garantia de 90 Dias",
    description: "Em peças e serviços realizados",
  },
  {
    icon: "document",
    title: "Orçamento Grátis",
    description: "Sem compromisso, sem surpresas",
  },
  {
    icon: "star",
    title: "15+ Anos de Experiência",
    description: "Mais de 5.000 clientes satisfeitos",
  },
];
