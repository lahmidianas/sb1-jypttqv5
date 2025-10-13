import React from 'react';
import FormSection from '../../common/FormSection';
import { PropertyFormProps } from '../../../../types/property';

const commonFeatures = [
  'Wifi',
  'Air Conditioning',
  'Pool',
  'Parking',
  'Terrace',
  'Sea View',
  'Garden',
  '24/7 Security'
];

export default function PropertyFeatures({ formData, errors, onChange }: PropertyFormProps) {
  const handleFeatureChange = (feature: string) => {
    const features = formData.features || [];
    const newFeatures = features.includes(feature)
      ? features.filter(f => f !== feature)
      : [...features, feature];
    
    onChange({
      target: {
        name: 'features',
        value: newFeatures
      }
    } as any);
  };

  return (
    <FormSection title="Features">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {commonFeatures.map(feature => (
          <label key={feature} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.features?.includes(feature)}
              onChange={() => handleFeatureChange(feature)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{feature}</span>
          </label>
        ))}
      </div>
      {errors.features && <p className="text-red-500 text-sm mt-2">{errors.features}</p>}
    </FormSection>
  );
}