import React from 'react';
import type { FormField } from '../../types/form';

interface FieldAdvancedSettingsProps {
  field: FormField;
  index: number;
  onUpdateConfig: (configType: 'widget_config' | 'validation_rules', key: string, value: any) => void;
}

export const FieldAdvancedSettings: React.FC<FieldAdvancedSettingsProps> = ({
  field,
  index,
  onUpdateConfig,
}) => {
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, isNumber = false) => {
    const value = isNumber 
      ? (e.target.value ? parseInt(e.target.value) : '') 
      : e.target.value;
    onUpdateConfig('widget_config', key, value);
  };

  const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, isNumber = false) => {
    const value = isNumber 
      ? (e.target.value ? parseInt(e.target.value) : '') 
      : e.target.value;
    onUpdateConfig('validation_rules', key, value);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mt-4">
      <h5 className="font-medium text-gray-700 mb-2">
        Advanced Settings
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text-based inputs */}
        {['text', 'textarea', 'email', 'password', 'url', 'phone'].includes(field.widget_type || 'text') && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Length
              </label>
              <input
                type="number"
                placeholder="e.g., 5"
                value={field.validation_rules?.minLength || ''}
                onChange={(e) => handleValidationChange(e, 'minLength', true)}
                className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Length
              </label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={field.validation_rules?.maxLength || ''}
                onChange={(e) => handleValidationChange(e, 'maxLength', true)}
                className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </>
        )}

        {/* Number input */}
        {field.widget_type === 'number' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Value
              </label>
              <input
                type="number"
                placeholder="e.g., 0"
                value={field.validation_rules?.minValue || ''}
                onChange={(e) => handleValidationChange(e, 'minValue', true)}
                className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Value
              </label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={field.validation_rules?.maxValue || ''}
                onChange={(e) => handleValidationChange(e, 'maxValue', true)}
                className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </>
        )}

        {/* Textarea */}
        {field.widget_type === 'textarea' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Rows
            </label>
            <input
              type="number"
              placeholder="e.g., 4"
              value={field.widget_config?.rows || ''}
              onChange={(e) => handleConfigChange(e, 'rows', true)}
              className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        )}

        {/* File upload */}
        {field.widget_type === 'file' && (
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${field.field_name}-multiple`}
                checked={field.widget_config?.multiple || false}
                onChange={(e) => onUpdateConfig('widget_config', 'multiple', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label 
                htmlFor={`${field.field_name}-multiple`}
                className="text-sm font-medium text-gray-700"
              >
                Allow multiple file uploads
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Accepted file types (comma-separated, e.g., .pdf,.jpg,.png)
              </label>
              <input
                type="text"
                placeholder="e.g., .pdf,.jpg,.png"
                value={field.widget_config?.accept || ''}
                onChange={(e) => onUpdateConfig('widget_config', 'accept', e.target.value)}
                className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Max file size (MB)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  value={field.validation_rules?.maxFileSize || ''}
                  onChange={(e) => handleValidationChange(e, 'maxFileSize', true)}
                  className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Max files (if multiple)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5"
                  value={field.validation_rules?.maxFiles || ''}
                  onChange={(e) => handleValidationChange(e, 'maxFiles', true)}
                  disabled={!field.widget_config?.multiple}
                  className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
