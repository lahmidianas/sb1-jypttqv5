import React from 'react';
import { MapPin, Phone, Clock, Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import SocialMediaLink from '../common/SocialMediaLink';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Tanger, Maroc'
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+212 777-000601'
  },
  {
    icon: Clock,
    label: 'Horaires',
    value: 'Lun - Sam: 9h00 - 18h00'
  }
];

const socialLinks = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    description: '+212 777-000601',
    url: 'https://wa.me/212777000601',
    color: '#25D366'
  },
  {
    icon: Facebook,
    label: 'Facebook',
    description: 'Suivez-nous sur Facebook',
    url: 'https://www.facebook.com/immosecret',
    color: '#1877F2'
  },
  {
    icon: Instagram,
    label: 'Instagram',
    description: 'Suivez-nous sur Instagram',
    url: 'https://www.instagram.com/medimmosecret/',
    color: '#E4405F'
  },
  {
    icon: Mail,
    label: 'Email',
    description: 'medimmosecret@gmail.com',
    url: 'mailto:medimmosecret@gmail.com',
    color: '#9DC44D'
  }
];

export default function ContactSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51820.91091299578!2d-5.833009!3d35.759465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b875cf04c132d%3A0x76bfc571bfb4e17a!2sTanger%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1708701234567!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6">Nos réseaux sociaux</h3>
            <div className="space-y-6">
              {socialLinks.map((link, index) => (
                <SocialMediaLink key={index} {...link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}