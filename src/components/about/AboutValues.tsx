import React from 'react';
import { Shield, Heart, Star } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Confiance',
    description: 'Nous construisons des relations durables basées sur la transparence et l\'intégrité'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Notre amour pour Tanger se reflète dans chaque propriété que nous sélectionnons'
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'Nous visons l\'excellence dans chaque aspect de nos services'
  }
];

export default function AboutValues() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}