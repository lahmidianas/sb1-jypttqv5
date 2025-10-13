import React from 'react';
import FormSection from '../../common/FormSection';
import ImageUploader from '../ImageUploader';
import { PropertyFormProps } from '../../../../types/property';

export default function PropertyImages({ formData, errors, onChange }: PropertyFormProps) {
  const handleImagesChange = (images: string[]) => {
    onChange({
      target: {
        name: 'images',
        value: images
      }
    } as any);
  };

  return (
    <FormSection title="Images">
      <ImageUploader
        images={formData.images || []}
        onChange={handleImagesChange}
        maxImages={10}
      />
      {errors.images && (
        <p className="text-red-500 text-sm mt-2">{errors.images}</p>
      )}
    </FormSection>
  );
}