import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutHistory from '../components/about/AboutHistory';
import AboutValues from '../components/about/AboutValues';
import AboutTeam from '../components/about/AboutTeam';
import SEO from '../components/seo/SEO';

export default function About() {
  return (
    <>
      <SEO 
        title="À propos"
        description="Découvrez l'histoire et les valeurs de MED IMMO SECRET, votre partenaire immobilier de confiance à Tanger depuis 2015."
      />
      <div className="pt-20">
        <AboutHero />
        <AboutHistory />
        <AboutValues />
        <AboutTeam />
      </div>
    </>
  );
}