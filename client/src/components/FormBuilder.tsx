import React, { useCallback, useState } from "react";
import type { FieldOption, FormField, FormTemplate } from "../types/form";
import { ConditionBuilder } from "./ConditionBuilder";
import { FormSettings } from "./form-builder-widgets/FormSettings";
import { FieldHeader } from "./form-builder-widgets/FieldHeader";
import { FieldBasicSettings } from "./form-builder-widgets/FieldBasicSettings";
import { FieldAdvancedSettings } from "./form-builder-widgets/FieldAdvancedSettings";
import { FieldOptionsEditor } from "./form-builder-widgets/FieldOptionsEditor";

const WIDGET_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "DateTime" },
  { value: "select", label: "Select Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File Upload" },
  { value: "phone", label: "Phone Number" },
  { value: "url", label: "URL" },
];

interface FormBuilderProps {
  formData: Partial<FormTemplate>;
  onChange: (data: Partial<FormTemplate>) => void;
  onSave: () => void;
  loading?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  formData,
  onChange,
  onSave,
  loading = false,
}) => {
  const {
    name = "",
    description = "",
    category = "",
    is_active = true,
    fields = [],
  } = formData;

  const handleTemplateChange = (updates: Partial<FormTemplate>) => {
    onChange({ ...formData, ...updates });
  };

  const handleFieldsChange = (newFields: Partial<FormField>[]) => {
    onChange({ ...formData, fields: newFields as FormField[] });
  };

  const addField = () => {
    const newField: Partial<FormField> = {
      field_name: "",
      label: "",
      widget_type: "text",
      placeholder: "",
      help_text: "",
      is_required: false,
      order: fields.length,
      options: [],
      widget_config: {},
      validation_rules: {},
    };
    handleFieldsChange([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field,
    );
    handleFieldsChange(newFields);
  };

  const removeField = (index: number) => {
    handleFieldsChange(fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < fields.length - 1)
    ) {
      const newFields = [...fields];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newFields[index], newFields[swapIndex]] = [
        newFields[swapIndex],
        newFields[index],
      ];
      handleFieldsChange(newFields);
    }
  };

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const newOptions = [
      ...(field.options || []),
      { value: "", label: "", order: field.options?.length || 0 },
    ];
    updateField(fieldIndex, { options: newOptions });
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    updates: Partial<FieldOption>,
  ) => {
    const field = fields[fieldIndex];
    const updatedOptions =
      field.options?.map((option, i) =>
        i === optionIndex ? { ...option, ...updates } : option,
      ) || [];
    updateField(fieldIndex, { options: updatedOptions });
  };

  const updateFieldConfig = (
    fieldIndex: number,
    configType: "widget_config" | "validation_rules",
    key: string,
    value: any,
  ) => {
    const field = fields[fieldIndex];
    const newConfig = { ...(field as any)[configType], [key]: value };
    if (value === "" || value === null) {
      delete newConfig[key];
    }
    updateField(fieldIndex, { [configType]: newConfig });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const updatedOptions =
      field.options?.filter((_, i) => i !== optionIndex) || [];
    updateField(fieldIndex, { options: updatedOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const needsOptions = (widgetType: string) => {
    return ["select", "radio", "checkbox"].includes(widgetType);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Builder</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSettings 
          formData={formData} 
          onChange={handleTemplateChange} 
        />

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Form Fields</h3>
            <button
              type="button"
              onClick={addField}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Field
            </button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>
                No fields added yet. Click "Add Field" to start building your
                form.
              </p>
            </div>
          )}

          {fields.map((field, index) => (
            <div
              key={index}
              className="border border-gray-200 p-6 rounded-lg space-y-4 bg-white shadow-sm"
            >
              <FieldHeader
                index={index}
                totalFields={fields.length}
                onMoveUp={() => moveField(index, "up")}
                onMoveDown={() => moveField(index, "down")}
                onRemove={() => removeField(index)}
              />

              <FieldBasicSettings
                field={field}
                index={index}
                onUpdate={(updates) => updateField(index, updates)}
                widgetTypes={WIDGET_TYPES}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <input
                  type="text"
                  value={field.help_text}
                  onChange={(e) =>
                    updateField(index, { help_text: e.target.value })
                  }
                  className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional instructions or help for this field"
                />
              </div>

              <FieldAdvancedSettings
                field={field}
                index={index}
                onUpdateConfig={(
                  configType: 'widget_config' | 'validation_rules', 
                  key: string, 
                  value: any
                ) => updateFieldConfig(index, configType, key, value)}
              />

              <FieldOptionsEditor
                field={field}
                fieldIndex={index}
                onAddOption={() => addOption(index)}
                onUpdateOption={(optionIndex, updates) => 
                  updateOption(index, optionIndex, updates)
                }
                onRemoveOption={(optionIndex) => removeOption(index, optionIndex)}
              />

              {/* Conditional Logic */}
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Conditional Logic
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  Show/hide this field based on other field values
                </p>
                <ConditionBuilder
                  field={field}
                  allFields={fields}
                  onChange={(conditional_logic) =>
                    updateField(index, { conditional_logic })
                  }
                />
              </div>

              {/* Required Checkbox */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) =>
                      updateField(index, { is_required: e.target.checked })
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Required Field
                  </span>
                </label>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={addField}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Field
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Form"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
