import React from 'react';
import { ArrowRight, Shield, Key, Settings, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Key,
    title: 'Propriétés d\'Exception',
    description: 'Une collection exclusive de biens immobiliers de prestige à Tanger',
    highlights: ['Villas de luxe', 'Appartements vue mer', 'Riads authentiques']
  },
  {
    icon: Settings,
    title: 'Conciergerie Premium',
    description: 'Un service sur mesure pour une expérience sans compromis',
    highlights: ['Service 24/7', 'Personnel multilingue', 'Prestations VIP']
  },
  {
    icon: Shield,
    title: 'Gestion Dédiée',
    description: 'Une gestion professionnelle pour valoriser votre patrimoine',
    highlights: ['Maintenance proactive', 'Reporting détaillé', 'Optimisation locative']
  }
];

export default function Hero() {
  return (
    <div className="relative">
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white pt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-5xl leading-tight">
            Découvrez l'Excellence Immobilière à Tanger
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl font-light leading-relaxed">
            Une collection exclusive de propriétés d'exception et un service sur mesure pour des expériences immobilières uniques
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-16">
            <Link
              to="/properties"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-colors text-lg"
            >
              Découvrir nos Propriétés
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg transition-colors text-lg border border-white/30"
            >
              Service Conciergerie
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto bg-black/40 backdrop-blur-sm p-8 rounded-xl">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-6">
                  <service.icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
                <p className="text-white/90 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                      <Star className="h-4 w-4 text-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}