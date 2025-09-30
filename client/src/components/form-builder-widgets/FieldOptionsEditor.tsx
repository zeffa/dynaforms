import React from 'react';
import type { FieldOption, FormField } from '../../types/form';

interface FieldOptionsEditorProps {
  field: FormField;
  fieldIndex: number;
  onAddOption: () => void;
  onUpdateOption: (optionIndex: number, updates: Partial<FieldOption>) => void;
  onRemoveOption: (optionIndex: number) => void;
}

export const FieldOptionsEditor: React.FC<FieldOptionsEditorProps> = ({
  field,
  fieldIndex,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  const needsOptions = ['select', 'radio', 'checkbox'].includes(field.widget_type || '');
  
  if (!needsOptions) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        <button
          type="button"
          onClick={onAddOption}
          className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
        >
          Add Option
        </button>
      </div>

      <div className="space-y-2">
        {field.options?.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Value"
              value={option.value}
              onChange={(e) =>
                onUpdateOption(optionIndex, { value: e.target.value })
              }
              className="flex-1 p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Display Label"
              value={option.label}
              onChange={(e) =>
                onUpdateOption(optionIndex, { label: e.target.value })
              }
              className="flex-1 p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => onRemoveOption(optionIndex)}
              className="text-red-600 hover:text-red-800 px-2 py-1"
            >
              ×
            </button>
          </div>
        ))}

        {(!field.options || field.options.length === 0) && (
          <p className="text-sm text-gray-500">
            No options added yet.
          </p>
        )}
      </div>
    </div>
  );
};
