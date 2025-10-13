import React from 'react';
import { Home, Key, Settings, Shield, Clock, Users, Target, BarChart, Wrench, FileCheck, Sparkles, Heart } from 'lucide-react';

const services = [
  {
    icon: Key,
    title: 'Location Saisonnière',
    description: 'Une expérience de location unique à Tanger, alliant confort moderne et authenticité marocaine. Notre service complet garantit des séjours mémorables dans des propriétés soigneusement sélectionnées.',
    features: [
      'Sélection rigoureuse des biens',
      'Accueil personnalisé multilingue',
      'Service de conciergerie 24/7',
      'Maintenance réactive',
      'Ménage professionnel',
      'Support local dédié'
    ]
  },
  {
    icon: Settings,
    title: 'Gestion de Patrimoine Immobilier',
    description: 'Une solution complète de gestion immobilière pour optimiser la rentabilité de votre bien tout en préservant sa valeur. Notre expertise garantit une gestion sans souci et des revenus optimisés.',
    features: [
      'Gestion locative complète',
      'Optimisation des revenus',
      'Marketing stratégique',
      'Suivi comptable détaillé',
      'Maintenance préventive',
      'Reporting mensuel personnalisé'
    ]
  }
];

const additionalFeatures = [
  {
    icon: Target,
    title: 'Objectifs Clairs',
    description: 'Des stratégies personnalisées pour atteindre vos objectifs immobiliers'
  },
  {
    icon: BarChart,
    title: 'Performance Optimale',
    description: 'Maximisation des revenus et optimisation de l\'occupation'
  },
  {
    icon: Wrench,
    title: 'Maintenance Proactive',
    description: 'Entretien régulier pour préserver la valeur de votre bien'
  },
  {
    icon: FileCheck,
    title: 'Gestion Administrative',
    description: 'Prise en charge complète des aspects administratifs'
  },
  {
    icon: Sparkles,
    title: 'Service Premium',
    description: 'Une qualité de service irréprochable pour votre satisfaction'
  },
  {
    icon: Heart,
    title: 'Accompagnement Personnalisé',
    description: 'Des solutions adaptées à vos besoins spécifiques'
  }
];

export default function AboutServices() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des solutions immobilières complètes et personnalisées pour répondre à vos besoins, portées par notre expertise locale et notre engagement envers l'excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="grid grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}