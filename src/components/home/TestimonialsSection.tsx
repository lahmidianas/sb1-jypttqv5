import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Propriétaire',
    content: 'Grâce à MED IMMO SECRET, j\'ai trouvé l\'appartement de mes rêves rapidement et sans stress !',
    rating: 5
  },
  {
    name: 'Mohammed K.',
    role: 'Investisseur',
    content: 'Une équipe professionnelle qui comprend vraiment les besoins de ses clients. Je recommande !',
    rating: 5
  },
  {
    name: 'Julie M.',
    role: 'Locataire',
    content: 'Location saisonnière parfaite, tout était conforme à la description. Service impeccable.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre meilleure récompense
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}