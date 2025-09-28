import React from 'react';
import type { FormTemplate } from '../../types/form';

interface FormSettingsProps {
  formData: Partial<FormTemplate>;
  onChange: (updates: Partial<FormTemplate>) => void;
}

export const FormSettings: React.FC<FormSettingsProps> = ({ formData, onChange }) => {
  const { name = '', description = '', category = '', is_active = true } = formData;

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Form Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Employee Onboarding, Loan Application"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category (Optional)
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., HR, Finance, Customer Service"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use categories to organize your forms
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Brief description of what this form is for..."
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={is_active}
            onChange={(e) => onChange({ is_active: e.target.checked })}
            className="text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Active (visible to users)
          </span>
        </label>
      </div>
    </div>
  );
};
