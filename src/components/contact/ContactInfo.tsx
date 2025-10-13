import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactDetails = [
  {
    icon: MapPin,
    title: 'Adresse',
    content: 'Tanger, Maroc'
  },
  {
    icon: Phone,
    title: 'Téléphone',
    content: '+212 777-000601'
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'medimmosecret@gmail.com'
  },
  {
    icon: Clock,
    title: 'Horaires',
    content: 'Lun - Sam: 9h00 - 18h00'
  }
];

export default function ContactInfo() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Informations de contact</h2>
      <div className="space-y-6">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex items-start gap-4">
            <detail.icon className="h-6 w-6 text-[#9DC44D] flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">{detail.title}</h3>
              <p className="text-gray-600">{detail.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}