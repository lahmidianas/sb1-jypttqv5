import React from 'react';
import { Shield, Key, Settings, Target, BarChart, Wrench, FileCheck, Sparkles, Heart } from 'lucide-react';

const mainServices = [
  {
    icon: Key,
    title: 'Location Saisonnière de Prestige',
    description: 'Des propriétés d\'exception soigneusement sélectionnées pour des séjours inoubliables à Tanger.',
    features: [
      'Sélection rigoureuse des biens',
      'Conciergerie privée 24/7',
      'Service de majordome',
      'Accueil VIP personnalisé',
      'Prestations haut de gamme',
      'Expériences sur mesure'
    ]
  },
  {
    icon: Settings,
    title: 'Gestion de Patrimoine Premium',
    description: 'Une gestion sur mesure de votre patrimoine immobilier avec une approche exclusive et personnalisée.',
    features: [
      'Optimisation des revenus',
      'Maintenance préventive',
      'Marketing de luxe',
      'Reporting détaillé',
      'Conseils patrimoniaux',
      'Service dédié'
    ]
  }
];

const additionalServices = [
  {
    icon: Target,
    title: 'Stratégie Personnalisée',
    description: 'Une approche sur mesure pour valoriser votre patrimoine'
  },
  {
    icon: BarChart,
    title: 'Performance Optimale',
    description: 'Maximisation des revenus et de l\'occupation'
  },
  {
    icon: Wrench,
    title: 'Maintenance d\'Excellence',
    description: 'Un entretien minutieux de votre propriété'
  },
  {
    icon: FileCheck,
    title: 'Gestion Administrative',
    description: 'Une prise en charge complète et rigoureuse'
  },
  {
    icon: Sparkles,
    title: 'Conciergerie de Luxe',
    description: 'Des services exclusifs pour votre confort'
  },
  {
    icon: Heart,
    title: 'Accompagnement Premium',
    description: 'Une attention particulière à chaque détail'
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Services d'Exception</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre gamme de services haut de gamme, conçue pour répondre aux exigences les plus élevées en matière d'immobilier de prestige.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {mainServices.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-primary/10 w-20 h-20 rounded-xl flex items-center justify-center mb-8">
                <service.icon className="h-10 w-10 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-8 text-lg">{service.description}</p>
              
              <ul className="grid grid-cols-2 gap-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {additionalServices.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <service.icon className="h-12 w-12 text-primary mb-6" />
              <h4 className="text-xl font-bold mb-3">{service.title}</h4>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}