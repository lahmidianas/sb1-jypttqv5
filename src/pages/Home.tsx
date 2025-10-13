import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';
import SEO from '../components/seo/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="Accueil"
        description="MED IMMO SECRET - Votre partenaire immobilier de confiance à Tanger. Location, vente et gestion de biens immobiliers."
      />
      <main>
        <div className="relative">
          <HeroSection />
          <ServicesSection />
        </div>
        <AboutSection />
        <FeaturedProperties />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </>
  );
}