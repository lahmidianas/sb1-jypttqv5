import React from 'react';
import FormSection from '../../common/FormSection';
import { PropertyFormProps } from '../../../../types/property';

export default function PropertyLocation({ formData, errors, onChange }: PropertyFormProps) {
  return (
    <FormSection title="Location">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={onChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Select area</option>
            <option value="medina">Medina</option>
            <option value="malabata">Malabata</option>
            <option value="centre">City Center</option>
          </select>
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Adress
          </label>
          <input
            type="text"
            name="adress"
            value={formData.adress}
            onChange={onChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.adress}</p>}
        </div>
      </div>
    </FormSection>
  );
}