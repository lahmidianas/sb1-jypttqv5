import React from 'react';
import { Helmet } from 'react-helmet-async';
import { defaultSEO } from '../../config/seo';
import { SEOProps } from '../../types/seo';

export default function SEO({ 
  title, 
  description, 
  image, 
  url,
  type = 'website'
}: SEOProps) {
  const seoTitle = title 
    ? `${title} | ${defaultSEO.siteName}` 
    : defaultSEO.title;
  
  const seoDescription = description || defaultSEO.description;
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || defaultSEO.url;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
}