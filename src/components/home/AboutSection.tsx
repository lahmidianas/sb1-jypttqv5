import React from 'react';
import { Building, Users, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Qui sommes-nous ?</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Située au cœur de Tanger, OK IMMO SECRET offre des services immobiliers fiables et personnalisés. 
              Notre expertise nous permet de vous accompagner à chaque étape de votre projet immobilier.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Building className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="block text-2xl font-bold">150+</span>
                <span className="text-sm text-gray-500">Biens gérés</span>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="block text-2xl font-bold">500+</span>
                <span className="text-sm text-gray-500">Clients satisfaits</span>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="block text-2xl font-bold">8+</span>
                <span className="text-sm text-gray-500">Années d'expérience</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1589278173760-b2f426dc0903?auto=format&fit=crop&q=80"
              alt="Notre équipe"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-lg">
              <span className="block text-2xl font-bold">2015</span>
              <span className="text-sm opacity-80">Année de création</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}