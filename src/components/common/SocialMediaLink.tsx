import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SocialMediaLinkProps {
  icon: LucideIcon;
  label: string;
  description: string;
  url: string;
  color: string;
  className?: string;
}

export default function SocialMediaLink({
  icon: Icon,
  label,
  description,
  url,
  color,
  className = ''
}: SocialMediaLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      <Icon className="h-6 w-6" style={{ color }} />
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}