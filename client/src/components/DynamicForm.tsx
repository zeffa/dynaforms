import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormField as FormFieldType, FormTemplate } from "@/types/form";
import React from "react";

interface DynamicFormProps {
  formTemplate: FormTemplate;
  loading?: boolean;
  onSubmit: (data: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formTemplate,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  const evaluateConditions = (
    fields: FormFieldType[],
    currentData: Record<string, any>,
  ) => {
    const visible = new Set<string>();

    fields.forEach((field) => {
      if (!field.conditional_logic?.conditions?.length) {
        visible.add(field.field_name);
      }
    });

    fields.forEach((field) => {
      const conditionalLogic = field.conditional_logic;
      if (!conditionalLogic?.conditions?.length) return;

      const conditions = conditionalLogic.conditions;
      const action = conditionalLogic.action || "show";

      const conditionsMet = conditions.every((condition) => {
        if (!condition.field) return false;

        const fieldValue = currentData[condition.field];
        const conditionValue = condition.value;

        switch (condition.operator) {
          case "equals":
            return fieldValue == conditionValue;

          case "not_equals":
            return fieldValue != conditionValue;

          case "contains":
            return (
              fieldValue != null &&
              String(fieldValue).includes(String(conditionValue))
            );

          case "not_contains":
            return (
              fieldValue != null &&
              !String(fieldValue).includes(String(conditionValue))
            );

          case "greater_than":
            return Number(fieldValue) > Number(conditionValue);

          case "less_than":
            return Number(fieldValue) < Number(conditionValue);

          case "greater_than_or_equals":
            return Number(fieldValue) >= Number(conditionValue);

          case "less_than_or_equals":
            return Number(fieldValue) <= Number(conditionValue);

          case "is_empty":
            return (
              fieldValue === "" || fieldValue == null || fieldValue === false
            );

          case "is_not_empty":
            return (
              fieldValue !== "" && fieldValue != null && fieldValue !== false
            );

          default:
            console.warn(`Unknown operator: ${condition.operator}`);
            return true;
        }
      });

      if (conditionsMet) {
        if (action === "show") {
          visible.add(field.field_name);
        } else {
          visible.delete(field.field_name);
        }
      } else if (action === "hide") {
        visible.add(field.field_name);
      }
    });

    return visible;
  };

  // Memoize the evaluateConditions function
  const memoizedEvaluateConditions = useCallback(
    (fields: FormFieldType[], currentData: Record<string, any>) => {
      return evaluateConditions(fields, currentData);
    },
    []
  );

  // Update visible fields when form data changes
  useEffect(() => {
    // Debounce the evaluation to prevent excessive re-renders
    const timer = setTimeout(() => {
      const newVisibleFields = memoizedEvaluateConditions(
        formTemplate.fields,
        formData,
      );
      setVisibleFields(newVisibleFields);
    }, 50);

    return () => clearTimeout(timer);
  }, [formData, formTemplate.fields, memoizedEvaluateConditions]);

  const handleInputChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    formTemplate.fields.forEach((field) => {
      if (
        field.is_required &&
        (!formData[field.field_name] || formData[field.field_name] === "")
      ) {
        newErrors[field.field_name] = `${field.label} is required`;
      }

      // Add more validation based on field type and validation_rules
      if (field.widget_type === "email" && formData[field.field_name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.field_name])) {
          newErrors[field.field_name] = "Invalid email format";
        }
      }

      // Length validation
      if (field.validation_rules?.min_length && formData[field.field_name]) {
        if (
          String(formData[field.field_name]).length <
          field.validation_rules.min_length
        ) {
          newErrors[field.field_name] =
            `Minimum ${field.validation_rules.min_length} characters required`;
        }
      }

      if (field.validation_rules?.max_length && formData[field.field_name]) {
        if (
          String(formData[field.field_name]).length >
          field.validation_rules.max_length
        ) {
          newErrors[field.field_name] =
            `Maximum ${field.validation_rules.max_length} characters allowed`;
        }
      }

      // Pattern validation
      if (field.validation_rules?.pattern && formData[field.field_name]) {
        const pattern = new RegExp(field.validation_rules.pattern);
        if (!pattern.test(formData[field.field_name])) {
          newErrors[field.field_name] = "Invalid format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formTemplate.fields, formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [formData, onSubmit, validateForm]);

  const renderField = useCallback((field: FormFieldType) => {
    const fieldError = errors[field.field_name];
    const isFileInput = field.widget_type === 'file';

    // Create base props that are common to all fields
    const baseProps = useMemo(() => ({
      id: field.field_name,
      name: field.field_name,
      placeholder: field.placeholder,
      disabled: loading,
      className: `w-full p-3 text-gray-700 border rounded-lg ${
        fieldError
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:ring-blue-500'
      } focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:bg-gray-50`,
      required: field.is_required,
      'aria-invalid': !!fieldError,
      'aria-describedby': fieldError ? `${field.field_name}-error` : undefined,
    }), [field, loading, fieldError]);

    // For non-file inputs, add value and change handler
    const commonProps = useMemo(() => {
      if (isFileInput) return baseProps;
      
      return {
        ...baseProps,
        value: formData[field.field_name] ?? "",
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
          const value = e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
          handleInputChange(field.field_name, value);
        },
      };
    }, [baseProps, field.field_name, formData, handleInputChange, isFileInput]);

    // Render the appropriate input based on field type
    switch (field.widget_type) {
      case "text":
      case "email":
      case "password":
      case "url":
      case "phone":
        return (
          <input
            type={field.widget_type === "phone" ? "tel" : field.widget_type}
            {...commonProps}
          />
        );

      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            min={field.widget_config?.min}
            max={field.widget_config?.max}
            step={field.widget_config?.step}
          />
        );

      case "date":
        return <input type="date" {...commonProps} />;

      case "datetime":
        return <input type="datetime-local" {...commonProps} />;

      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={field.widget_config?.rows || 4}
            onChange={(e) =>
              handleInputChange(field.field_name, e.target.value)
            }
          />
        );

      case "select":
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={field.field_name}
                  value={option.value}
                  checked={formData[field.field_name] === option.value}
                  onChange={() =>
                    handleInputChange(field.field_name, option.value)
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        if (field.options && field.options.length > 1) {
          // Multiple checkboxes
          return (
            <div className="space-y-3">
              {field.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(formData[field.field_name] || []).includes(
                      option.value,
                    )}
                    onChange={(e) => {
                      const currentValues = formData[field.field_name] || [];
                      if (e.target.checked) {
                        handleInputChange(field.field_name, [
                          ...currentValues,
                          option.value,
                        ]);
                      } else {
                        handleInputChange(
                          field.field_name,
                          currentValues.filter(
                            (v: string) => v !== option.value,
                          ),
                        );
                      }
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData[field.field_name] || false}
                onChange={(e) =>
                  handleInputChange(field.field_name, e.target.checked)
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
              </span>
            </label>
          );
        }

      case "file":
        const isMultiple = field.widget_config?.multiple === true;
        const currentFiles = formData[field.field_name] || [];
        
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (!files || files.length === 0) {
            handleInputChange(field.field_name, isMultiple ? [] : null);
            return;
          }
          
          if (isMultiple) {
            // Convert FileList to array and combine with existing files if needed
            const newFiles = Array.from(files);
            const existingFiles = Array.isArray(currentFiles) ? currentFiles : [];
            const allFiles = [...existingFiles, ...newFiles];
            
            // Apply max files limit if set
            const maxFiles = field.validation_rules?.maxFiles;
            const finalFiles = maxFiles ? allFiles.slice(0, maxFiles) : allFiles;
            
            handleInputChange(field.field_name, finalFiles);
          } else {
            // Single file upload
            handleInputChange(field.field_name, files[0]);
          }
        };
        
        const removeFile = (index: number) => {
          if (!isMultiple || !Array.isArray(currentFiles)) {
            handleInputChange(field.field_name, null);
            return;
          }
          
          const updatedFiles = [...currentFiles];
          updatedFiles.splice(index, 1);
          handleInputChange(field.field_name, updatedFiles.length > 0 ? updatedFiles : null);
        };
        
        return (
          <div className="w-full">
            <input
              type="file"
              {...commonProps}
              onChange={handleFileChange}
              accept={field.widget_config?.accept}
              multiple={isMultiple}
              className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {field.widget_config?.help_text && (
              <p className="mt-1 text-xs text-gray-500">
                {field.widget_config.help_text}
              </p>
            )}
            
            {currentFiles && (
              <div className="mt-2 space-y-2">
                {Array.isArray(currentFiles) ? (
                  // Multiple files
                  <div className="space-y-1">
                    {currentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {field.validation_rules?.maxFiles && (
                      <p className="text-xs text-gray-500">
                        Maximum {field.validation_rules.maxFiles} files allowed
                        {currentFiles.length >= field.validation_rules.maxFiles && (
                          <span className="text-red-500 ml-1">(Limit reached)</span>
                        )}
                      </p>
                    )}
                  </div>
                ) : (
                  // Single file
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700 truncate">
                      {currentFiles.name} ({(currentFiles.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(0)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  }, [formData, errors, loading, handleInputChange]);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {formTemplate.name}
        </h2>
        {formTemplate.description && (
          <p className="text-gray-600 leading-relaxed">
            {formTemplate.description}
          </p>
        )}
        {formTemplate.category && (
          <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {formTemplate.category}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {formTemplate.fields.map((field) => (
          <div
            key={field.id}
            className={`transition-all duration-300 ease-in-out ${
              !visibleFields.has(field.field_name) ? 'hidden' : ''
            }`}
          >
            <label
              htmlFor={field.field_name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
              {field.is_required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {renderField(field)}
            {errors[field.field_name] && (
              <p
                id={`${field.field_name}-error`}
                className="mt-1 text-sm text-red-600"
              >
                {errors[field.field_name]}
              </p>
            )}
            {field.help_text && (
              <p className="mt-1 text-sm text-gray-500">
                {field.help_text}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Form'
          )}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
