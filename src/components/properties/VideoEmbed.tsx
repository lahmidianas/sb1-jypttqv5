import React from 'react';
import { formatYouTubeUrl } from '../../utils/youtube';

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export default function VideoEmbed({ url, className = '' }: VideoEmbedProps) {
  const embedUrl = formatYouTubeUrl(url);
  
  if (!embedUrl) return null;

  return (
    <div className={`relative pt-[56.25%] ${className}`}>
      <iframe
        src={embedUrl}
        title="Property video"
        className="absolute inset-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}