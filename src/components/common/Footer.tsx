import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 flex items-center justify-between">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} MedImmo-Secret</p>
        <Link
          to="/login"
          className="text-sm text-gray-500 opacity-70 hover:opacity-100 transition-opacity"
        >
          Accès administrateur
        </Link>
      </div>
    </footer>
  );
}
