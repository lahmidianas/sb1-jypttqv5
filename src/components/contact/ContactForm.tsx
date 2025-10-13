import React from 'react';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import SocialMediaLink from '../common/SocialMediaLink';

const socialLinks = [
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
    icon: MessageCircle,
    label: 'WhatsApp',
    description: '+212 777-000601',
    url: 'https://wa.me/212777000601',
    color: '#25D366'
  },
  {
    icon: Mail,
    label: 'Email',
    description: 'medimmosecret@gmail.com',
    url: 'mailto:medimmosecret@gmail.com',
    color: '#9DC44D'
  }
];

export default function ContactForm() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-semibold mb-6">Contactez-nous</h2>
      <div className="space-y-6">
        {socialLinks.map((link, index) => (
          <SocialMediaLink key={index} {...link} />
        ))}
      </div>
    </div>
  );
}