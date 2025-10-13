import React from 'react';

const team = [
  {
    name: 'IMAD EDDINE AZAMI HASSANI',
    role: 'Fondateur & Directeur',
    image: 'https://media.licdn.com/dms/image/v2/C4E03AQEyL1h4ut_52A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517221633065?e=2147483647&v=beta&t=J7boiMS5PBQEkVoFWOR7P3E0HX8_RO_fOivW2KXKWQU'
  }
];

export default function AboutTeam() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-display">Notre Équipe</h2>
        
        <div className="max-w-3xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="text-center bg-white p-8 rounded-lg shadow-lg">
              <div className="relative mb-6">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary/20"
                />
                <div className="absolute inset-0 rounded-full bg-primary/10 transform hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600 font-display text-lg">{member.role}</p>
              <div className="mt-6 max-w-2xl mx-auto">
                <p className="text-gray-700 leading-relaxed text-justify">
                  Fort d'une expérience approfondie dans l'immobilier de luxe à Tanger, notre fondateur dirige MED IMMO SECRET avec passion et expertise. Son engagement pour l'excellence et sa connaissance approfondie du marché immobilier local garantissent à nos clients un service personnalisé de premier ordre.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}