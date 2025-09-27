import type React from "react";
import type { FormField } from "@/types/form";

type WidgetType = {
  value: string;
  label: string;
};

const WIDGET_TYPES: WidgetType[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "DateTime" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "URL" },
];

interface ConditionBuilderProps {
  field: FormField;
  allFields: FormField[];
  onChange: (conditions: any) => void;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  field,
  allFields,
  onChange,
}) => {
  const availableFields = allFields.filter(
    (f) => f.field_name !== field.field_name,
  );
  console.log("allFields", allFields);
  console.log("availableFields", availableFields);
  const conditions = field.conditional_logic?.conditions || [];

  const addCondition = () => {
    const newCondition = {
      field: availableFields[0]?.field_name || "",
      operator: "equals",
      value: "",
    };
    onChange({
      ...field.conditional_logic,
      conditions: [...conditions, newCondition],
    });
  };

  const updateCondition = (index: number, updates: any) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    onChange({
      ...field.conditional_logic,
      conditions: updated,
    });
  };

  const removeCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    onChange({
      ...field.conditional_logic,
      conditions: updated,
    });
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">
          Show this field when:
        </h4>
        <button
          type="button"
          onClick={addCondition}
          className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
        >
          + Add Condition
        </button>
      </div>

      {conditions.length === 0 ? (
        <p className="text-sm text-gray-500">No conditions (always visible)</p>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition: any, index: number) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-white rounded border"
            >
              <select
                value={condition.field}
                onChange={(e) =>
                  updateCondition(index, { field: e.target.value })
                }
                className="flex-1 text-sm border rounded p-1 text-gray-700"
                aria-label="Select field to compare"
              >
                <option value="">Select a field</option>
                {availableFields
                  // Filter out fields that shouldn't be used in conditions
                  .filter(
                    (field) =>
                      !["file", "image"].includes(field.widget_type || ""),
                  )
                  .map((field) => {
                    // Create a more descriptive label
                    const fieldType =
                      WIDGET_TYPES.find((t) => t.value === field.widget_type)
                        ?.label ||
                      field.widget_type ||
                      "Field";
                    const displayName =
                      field.label ||
                      field.field_name ||
                      `Field ${field.field_name}`;
                    return (
                      <option key={field.field_name} value={field.field_name}>
                        {`${displayName} (${fieldType})`}
                      </option>
                    );
                  })}
              </select>

              <select
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(index, { operator: e.target.value })
                }
                className="text-sm border rounded p-1 text-gray-700"
                aria-label="Select comparison operator"
              >
                <option value="equals">equals</option>
                <option value="not_equals">does not equal</option>
                <option value="greater_than">is greater than</option>
                <option value="less_than">is less than</option>
                <option value="contains">contains</option>
              </select>

              <input
                type="text"
                value={condition.value}
                onChange={(e) =>
                  updateCondition(index, { value: e.target.value })
                }
                className="flex-1 text-sm border rounded p-1 text-gray-700"
                placeholder="Value"
              />

              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
