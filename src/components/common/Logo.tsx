import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/logo.png"
        alt="MedImmo-Secret Logo"
        className="h-20 w-20"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.onerror = null;
          img.src = '/logo.svg';
        }}
      />
    </Link>
  );
}
