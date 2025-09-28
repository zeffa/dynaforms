import React from 'react';
import type { FormField } from '../../types/form';

interface FieldBasicSettingsProps {
  field: FormField;
  index: number;
  onUpdate: (updates: Partial<FormField>) => void;
  widgetTypes: Array<{ value: string; label: string }>;
}

export const FieldBasicSettings: React.FC<FieldBasicSettingsProps> = ({
  field,
  index,
  onUpdate,
  widgetTypes,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label *
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="What users will see"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Name
        </label>
        <input
          type="text"
          value={field.field_name}
          onChange={(e) => onUpdate({ field_name: e.target.value })}
          placeholder="Auto-generated from label"
          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          Internal field name (optional)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Widget Type *
        </label>
        <select
          value={field.widget_type}
          onChange={(e) => onUpdate({ widget_type: e.target.value })}
          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
          aria-label="Widget Type"
        >
          {widgetTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Placeholder
        </label>
        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Hint text for users"
        />
      </div>
    </div>
  );
};
