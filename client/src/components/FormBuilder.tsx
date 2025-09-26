import React, { useState } from 'react';
import { FormTemplate, FormField, FieldOption } from '../types/form';

const WIDGET_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'DateTime' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'url', label: 'URL' },
];

interface FormBuilderProps {
  onSave: (formData: any) => void;
  initialData?: Partial<FormTemplate>;
  loading?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onSave, initialData, loading = false }) => {
  const [formTemplate, setFormTemplate] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    is_active: initialData?.is_active ?? true,
  });

  const [fields, setFields] = useState<Partial<FormField>[]>(
    initialData?.fields || []
  );

  const addField = () => {
    const newField: Partial<FormField> = {
      field_name: '',
      label: '',
      widget_type: 'text',
      placeholder: '',
      help_text: '',
      is_required: false,
      order: fields.length,
      widget_config: {},
      validation_rules: {},
      options: [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFields(prev => prev.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      setFields(prev => {
        const newFields = [...prev];
        [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
        return newFields;
      });
    } else if (direction === 'down' && index < fields.length - 1) {
      setFields(prev => {
        const newFields = [...prev];
        [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
        return newFields;
      });
    }
  };

  const addOption = (fieldIndex: number) => {
    updateField(fieldIndex, {
      options: [
        ...(fields[fieldIndex].options || []),
        { value: '', label: '', order: fields[fieldIndex].options?.length || 0 }
      ]
    });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, updates: Partial<FieldOption>) => {
    const field = fields[fieldIndex];
    const updatedOptions = field.options?.map((option, i) =>
      i === optionIndex ? { ...option, ...updates } : option
    ) || [];
    updateField(fieldIndex, { options: updatedOptions });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const updatedOptions = field.options?.filter((_, i) => i !== optionIndex) || [];
    updateField(fieldIndex, { options: updatedOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...formTemplate,
      fields_data: fields.map((field, index) => ({
        ...field,
        order: index,
        field_name: field.field_name || field.label?.toLowerCase().replace(/\s+/g, '_') || `field_${index}`,
      }))
    };
    console.log(JSON.stringify(formData));
    onSave(formData);
  };

  const needsOptions = (widgetType: string) => {
    return ['select', 'radio', 'checkbox'].includes(widgetType);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Builder</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Template Settings */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Form Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formTemplate.name}
                onChange={(e) => setFormTemplate(prev => ({ ...prev, name: e.target.value }))}
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
                value={formTemplate.category}
                onChange={(e) => setFormTemplate(prev => ({ ...prev, category: e.target.value }))}
                className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., HR, Finance, Customer Service"
              />
              <p className="text-xs text-gray-500 mt-1">Use categories to organize your forms</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formTemplate.description}
              onChange={(e) => setFormTemplate(prev => ({ ...prev, description: e.target.value }))}
              className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of what this form is for..."
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formTemplate.is_active}
                onChange={(e) => setFormTemplate(prev => ({ ...prev, is_active: e.target.checked }))}
                className="text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Form Fields</h3>
            <button
              type="button"
              onClick={addField}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Field
            </button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No fields added yet. Click "Add Field" to start building your form.</p>
            </div>
          )}

          {fields.map((field, index) => (
            <div key={index} className="border border-gray-200 p-6 rounded-lg space-y-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">Field {index + 1}</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveField(index, 'up')}
                    disabled={index === 0}
                    className="text-sm bg-gray-700 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(index, 'down')}
                    disabled={index === fields.length - 1}
                    className="text-sm bg-gray-700 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-sm bg-red-700 text-white px-2 py-1 rounded hover:bg-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
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
                    onChange={(e) => updateField(index, { field_name: e.target.value })}
                    placeholder="Auto-generated from label"
                    className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">Internal field name (optional)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Widget Type *
                  </label>
                  <select
                    value={field.widget_type}
                    onChange={(e) => updateField(index, { widget_type: e.target.value })}
                    className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                    aria-label="Widget Type"
                  >
                    {WIDGET_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
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
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Hint text for users"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <input
                  type="text"
                  value={field.help_text}
                  onChange={(e) => updateField(index, { help_text: e.target.value })}
                  className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional instructions or help for this field"
                />
              </div>

              {/* Options for select, radio, checkbox */}
              {needsOptions(field.widget_type || 'text') && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {field.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) => updateOption(index, optionIndex, { value: e.target.value })}
                          className="flex-1 p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Display Label"
                          value={option.label}
                          onChange={(e) => updateOption(index, optionIndex, { label: e.target.value })}
                          className="flex-1 p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index, optionIndex)}
                          className="text-red-600 hover:text-red-800 px-2 py-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {(!field.options || field.options.length === 0) && (
                      <p className="text-sm text-gray-500">No options added yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Required Checkbox */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) => updateField(index, { is_required: e.target.checked })}
                    className="text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Required Field</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Form'}
        </button>
      </form>
    </div>
  );
};

export default FormBuilder;