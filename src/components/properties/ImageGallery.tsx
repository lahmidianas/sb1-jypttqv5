import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <img
            src={images[0]}
            alt={`${title} - Photo principale`}
            className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
            onClick={() => {
              setCurrentImageIndex(0);
              setShowLightbox(true);
            }}
          />
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} ${index + 2}`}
              className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index + 1);
                setShowLightbox(true);
              }}
            />
          ))}
          {images.length > 5 && (
            <button
              onClick={() => {
                setCurrentImageIndex(5);
                setShowLightbox(true);
              }}
              className="relative w-full h-[195px]"
            >
              <img
                src={images[5]}
                alt={`${title} 6`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  +{images.length - 5} photos
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            onClick={previousImage}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <img
            src={images[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}