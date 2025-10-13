import React from 'react';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import SocialMediaLink from '../common/SocialMediaLink';

const socialLinks = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    description: 'Contactez-nous sur WhatsApp',
    url: 'https://wa.me/212777000601',
    color: '#25D366'
  },
  {
    icon: Facebook,
    label: 'Facebook',
    description: 'Contactez-nous sur Facebook',
    url: 'https://www.facebook.com/immosecret',
    color: '#1877F2'
  },
  {
    icon: Instagram,
    label: 'Instagram',
    description: 'Contactez-nous sur Instagram',
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

export default function BookingRequestForm() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Contactez-nous pour réserver</h3>
      {socialLinks.map((link, index) => (
        <SocialMediaLink key={index} {...link} className="w-full" />
      ))}
    </div>
  );
}