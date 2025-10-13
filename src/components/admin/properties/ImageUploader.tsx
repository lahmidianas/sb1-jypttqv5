import React, { useCallback, useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 12 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > maxImages) {
      setError(`Vous ne pouvez pas télécharger plus de ${maxImages} images`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const uploadPromises = files.map(uploadImage);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      setError('Erreur lors du téléchargement des images. Veuillez réessayer.');
      console.error('Error uploading images:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group aspect-video">
            <img
              src={url}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => reorderImages(index, index - 1)}
                    className="p-1 bg-white/20 hover:bg-white/30 rounded-full text-white"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => reorderImages(index, index + 1)}
                    className="p-1 bg-white/20 hover:bg-white/30 rounded-full text-white"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                Photo principale
              </div>
            )}
          </div>
        ))}
        
        {images.length < maxImages && !uploading && (
          <label className="flex items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm text-gray-600">Ajouter des photos</span>
              <span className="mt-1 block text-xs text-gray-500">
                {maxImages - images.length} photo{maxImages - images.length > 1 ? 's' : ''} restante{maxImages - images.length > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </label>
        )}

        {uploading && (
          <div className="flex items-center justify-center aspect-video border-2 border-gray-300 rounded-lg">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      <p className="text-sm text-gray-500">
        Formats acceptés : JPG, PNG. Taille maximale : 5MB par image
      </p>
    </div>
  );
}