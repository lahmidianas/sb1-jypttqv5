import React from 'react';
import AboutServices from '../components/about/AboutServices';
import SEO from '../components/seo/SEO';

export default function Services() {
  return (
    <>
      <SEO 
        title="Nos Services"
        description="Découvrez nos services immobiliers premium à Tanger - Location saisonnière, gestion de patrimoine et conciergerie de luxe."
      />
      <div className="pt-20">
        {/* Hero Section with Luxury Villa Background */}
        <div className="relative h-[60vh] min-h-[400px] mb-16">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-5xl font-display font-bold text-white mb-6">
              Nos Services d'Exception
            </h1>
            <p className="text-xl text-white/90 max-w-2xl font-display">
              Une gamme complète de services immobiliers haut de gamme pour répondre à vos exigences les plus élevées
            </p>
          </div>
        </div>

        <AboutServices />
      </div>
    </>
  );
}