import { useState } from "react";
import Head from "next/head";
import { getPersonalizedContent } from "@/lib/dtr";
import { siteConfig, googleReviews } from "@/lib/content";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ServiceAreas from "@/components/ServiceAreas";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AtendimentoModal from "@/components/AtendimentoModal";

export default function Home({ personalizedContent, keyword }) {
  const content = personalizedContent;
  const [isAtendimentoOpen, setIsAtendimentoOpen] = useState(false);
  const [isAtendimentoMinimized, setIsAtendimentoMinimized] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Build canonical URL
  const canonicalUrl = keyword
    ? `${siteConfig.siteUrl}/?keyword=${keyword}`
    : siteConfig.siteUrl;

  // Structured data for LocalBusiness
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.businessName,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Recife",
      addressRegion: "PE",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.0476,
      longitude: -34.877,
    },
    openingHours: "Mo-Sa 08:00-18:00",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleReviews.rating,
      reviewCount: googleReviews.totalReviews,
    },
    priceRange: "$$",
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -8.0476,
        longitude: -34.877,
      },
      geoRadius: "50000",
    },
  };

  return (
    <>
      <Head>
        <title>{content.hero.headline} | {siteConfig.businessName}</title>
        <meta
          name="description"
          content={`${content.hero.subheadline}. Conserto de geladeira em Recife com atendimento rápido, técnicos especializados e garantia de serviço. Ligue agora: ${siteConfig.phone}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${content.hero.headline} | ${siteConfig.businessName}`} />
        <meta property="og:description" content={content.hero.subheadline} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteConfig.businessName} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.hero.headline} />
        <meta name="twitter:description" content={content.hero.subheadline} />

        {/* Geo tags for local SEO */}
        <meta name="geo.region" content="BR-PE" />
        <meta name="geo.placename" content="Recife" />

        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts - Archivo Black (Display), DM Sans (Body), JetBrains Mono (Numbers) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero
            content={content}
            onOpenAtendimento={() => setIsAtendimentoOpen(true)}
            onLocationUpdate={setUserLocation}
          />
          <TrustBadges />
          <Services highlightedService={content.services?.highlightedService} />
          <HowItWorks />
          <Testimonials />
          <FAQ />
          <ServiceAreas />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFloat />

        {/* Modal de Atendimento Urgente */}
        <AtendimentoModal
          isOpen={isAtendimentoOpen}
          isMinimized={isAtendimentoMinimized}
          onClose={() => {
            setIsAtendimentoOpen(false);
            setIsAtendimentoMinimized(false);
          }}
          onMinimize={(minimized) => setIsAtendimentoMinimized(minimized)}
          whatsappNumber={siteConfig.whatsappClean || "5581999999999"}
          initialLocation={userLocation}
        />
      </div>
    </>
  );
}

// Server-side props for DTR
export async function getServerSideProps({ query }) {
  const keyword = query.keyword || null;
  const personalizedContent = getPersonalizedContent(keyword);

  return {
    props: {
      personalizedContent,
      keyword,
    },
  };
}
