import React from 'react';
import { Building, Award, Users, Star } from 'lucide-react';

export default function AboutHistory() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
            <div className="space-y-6 text-gray-600">
              <p className="text-lg leading-relaxed">
                Depuis 2015, MED IMMO SECRET s'est imposée comme une référence incontournable dans l'immobilier de prestige à Tanger. Notre expertise locale, combinée à un service d'excellence et une approche innovante, nous permet d'offrir des expériences immobilières uniques à nos clients.
              </p>
              <p className="text-lg leading-relaxed">
                De la Médina aux quartiers modernes, notre connaissance approfondie du marché et notre engagement envers la qualité nous distinguent dans le secteur immobilier tangérois.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-12">
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
              <div className="text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="block text-2xl font-bold">4.9/5</span>
                <span className="text-sm text-gray-500">Note moyenne</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80"
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