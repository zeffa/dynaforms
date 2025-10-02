import type React from "react";
import type { FieldOption, FormField, FormTemplate } from "../types/form";
import { ConditionBuilder } from "./ConditionBuilder";

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
                value={name}
                onChange={(e) => handleTemplateChange({ name: e.target.value })}
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
                onChange={(e) =>
                  handleTemplateChange({ category: e.target.value })
                }
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
              onChange={(e) =>
                handleTemplateChange({ description: e.target.value })
              }
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
                onChange={(e) =>
                  handleTemplateChange({ is_active: e.target.checked })
                }
                className="text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible to users)
              </span>
            </label>
          </div>
        </div>

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
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">Field {index + 1}</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveField(index, "up")}
                    disabled={index === 0}
                    className="text-sm bg-gray-700 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(index, "down")}
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
                    onChange={(e) =>
                      updateField(index, { label: e.target.value })
                    }
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
                    onChange={(e) =>
                      updateField(index, { field_name: e.target.value })
                    }
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
                    onChange={(e) =>
                      updateField(index, { widget_type: e.target.value })
                    }
                    className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                    aria-label="Widget Type"
                  >
                    {WIDGET_TYPES.map((type) => (
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
                    onChange={(e) =>
                      updateField(index, { placeholder: e.target.value })
                    }
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
                  onChange={(e) =>
                    updateField(index, { help_text: e.target.value })
                  }
                  className="w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional instructions or help for this field"
                />
              </div>

              {/* Advanced Settings for widget_config and validation_rules */}
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h5 className="font-medium text-gray-700 mb-2">
                  Advanced Settings
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* minLength & maxLength for text-based inputs */}
                  {[
                    "text",
                    "textarea",
                    "email",
                    "password",
                    "url",
                    "phone",
                  ].includes(field.widget_type || "text") && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Min Length
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 5"
                          value={field.validation_rules?.minLength || ""}
                          onChange={(e) =>
                            updateFieldConfig(
                              index,
                              "validation_rules",
                              "minLength",
                              e.target.value ? parseInt(e.target.value) : "",
                            )
                          }
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
                          value={field.validation_rules?.maxLength || ""}
                          onChange={(e) =>
                            updateFieldConfig(
                              index,
                              "validation_rules",
                              "maxLength",
                              e.target.value ? parseInt(e.target.value) : "",
                            )
                          }
                          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* minValue & maxValue for number inputs */}
                  {field.widget_type === "number" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Min Value
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 0"
                          value={field.validation_rules?.minValue || ""}
                          onChange={(e) =>
                            updateFieldConfig(
                              index,
                              "validation_rules",
                              "minValue",
                              e.target.value ? parseInt(e.target.value) : "",
                            )
                          }
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
                          value={field.validation_rules?.maxValue || ""}
                          onChange={(e) =>
                            updateFieldConfig(
                              index,
                              "validation_rules",
                              "maxValue",
                              e.target.value ? parseInt(e.target.value) : "",
                            )
                          }
                          className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Rows for textarea */}
                  {field.widget_type === "textarea" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Rows
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 4"
                        value={field.widget_config?.rows || ""}
                        onChange={(e) =>
                          updateFieldConfig(
                            index,
                            "widget_config",
                            "rows",
                            e.target.value ? parseInt(e.target.value) : "",
                          )
                        }
                        className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  )}

                  {/* File upload settings */}
                  {field.widget_type === "file" && (
                    <>
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            id={`${field.field_name}-multiple`}
                            checked={field.widget_config?.multiple || false}
                            onChange={(e) =>
                              updateFieldConfig(
                                index,
                                "widget_config",
                                "multiple",
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`${field.field_name}-multiple`}
                            className="text-sm font-medium text-gray-700"
                          >
                            Allow multiple file uploads
                          </label>
                        </div>

                        <div className="mt-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Accepted file types (comma-separated, e.g., .pdf,.jpg,.png)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., .pdf,.jpg,.png"
                            value={field.widget_config?.accept || ""}
                            onChange={(e) =>
                              updateFieldConfig(
                                index,
                                "widget_config",
                                "accept",
                                e.target.value,
                              )
                            }
                            className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Max file size (MB)
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 10"
                              value={field.validation_rules?.maxFileSize || ""}
                              onChange={(e) =>
                                updateFieldConfig(
                                  index,
                                  "validation_rules",
                                  "maxFileSize",
                                  e.target.value ? parseInt(e.target.value) : "",
                                )
                              }
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
                              value={field.validation_rules?.maxFiles || ""}
                              onChange={(e) =>
                                updateFieldConfig(
                                  index,
                                  "validation_rules",
                                  "maxFiles",
                                  e.target.value ? parseInt(e.target.value) : "",
                                )
                              }
                              disabled={!field.widget_config?.multiple}
                              className="w-full text-gray-700 p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Options for select, radio, checkbox */}
              {needsOptions(field.widget_type || "text") && (
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
                      <div
                        key={optionIndex}
                        className="flex gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) =>
                            updateOption(index, optionIndex, {
                              value: e.target.value,
                            })
                          }
                          className="flex-1 p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Display Label"
                          value={option.label}
                          onChange={(e) =>
                            updateOption(index, optionIndex, {
                              label: e.target.value,
                            })
                          }
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
                      <p className="text-sm text-gray-500">
                        No options added yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

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
