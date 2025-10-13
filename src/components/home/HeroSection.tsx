import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative h-[85vh] min-h-[600px]">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1649770638360-35ed4eb0e381?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <span className="text-xl md:text-2xl mb-4 font-light">
          Votre partenaire de confiance pour louer et vendre au Maroc
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl">
          Découvrez des biens d'exception pour vivre des moments inoubliables
        </h1>
        
        <div className="flex gap-4">
          <Link
            to="/properties"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            Découvrir nos offres
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/contact"
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}