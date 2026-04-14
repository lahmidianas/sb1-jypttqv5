import React, { useCallback, useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;
const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Impossible de lire l'image ${file.name}`));
    };

    image.src = objectUrl;
  });
}

async function optimizeImage(file: File): Promise<File> {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      `Le format ${file.name.split('.').pop()?.toUpperCase() || 'fichier'} n'est pas pris en charge. Utilisez JPG, PNG ou WEBP.`
    );
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error("Impossible de preparer l'image pour optimisation.");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', IMAGE_QUALITY);
  });

  if (!blob) {
    throw new Error(`Impossible d'optimiser ${file.name}.`);
  }

  const baseName = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
}

export default function ImageUploader({ images, onChange, maxImages = 12 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    try {
      const optimizedFile = await optimizeImage(file);
      const fileExt = optimizedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, optimizedFile, {
          contentType: optimizedFile.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('property-images').getPublicUrl(filePath);

      return publicUrl;
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > maxImages) {
      setError(`Vous ne pouvez pas telecharger plus de ${maxImages} images`);
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const uploadedUrls = await Promise.all(files.map(uploadImage));
      onChange([...images, ...uploadedUrls]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Erreur lors du telechargement des images. Veuillez reessayer."
      );
      console.error('Error uploading images:', uploadError);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-video group">
            <img
              src={url}
              alt={`Property ${index + 1}`}
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => reorderImages(index, index - 1)}
                    className="rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
                  >
                    {'<-'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-full bg-red-500/80 p-1 text-white hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => reorderImages(index, index + 1)}
                    className="rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
                  >
                    {'->'}
                  </button>
                )}
              </div>
            </div>
            {index === 0 && (
              <div className="absolute left-2 top-2 rounded bg-primary/80 px-2 py-1 text-xs text-white">
                Photo principale
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && !uploading && (
          <label className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-primary">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm text-gray-600">Ajouter des photos</span>
              <span className="mt-1 block text-xs text-gray-500">
                {maxImages - images.length} photo{maxImages - images.length > 1 ? 's' : ''} restante
                {maxImages - images.length > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
            />
          </label>
        )}

        {uploading && (
          <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-gray-300">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-sm text-gray-500">
        Les nouvelles images sont redimensionnees automatiquement a 1600px max et converties en WEBP.
      </p>
      <p className="text-sm text-gray-500">
        Formats acceptes : JPG, PNG, WEBP. Convertissez les fichiers HEIC avant upload.
      </p>
    </div>
  );
}
