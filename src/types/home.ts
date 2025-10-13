import { LucideIcon } from 'lucide-react';

export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
}

export interface IconMap {
  [key: string]: LucideIcon;
}