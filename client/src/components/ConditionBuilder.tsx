import type React from "react";
import { useState, useEffect } from "react";
import type { FormField, ConditionalLogic } from "@/types/form";

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
  const conditions = field.conditional_logic?.conditions || [];
  const [localLogic, setLocalLogic] = useState<Omit<ConditionalLogic, 'conditions'>>({
    action: field.conditional_logic?.action || 'show',
    logicalOperator: field.conditional_logic?.logicalOperator || 'and',
  });

  useEffect(() => {
    if (field.conditional_logic) {
      const newAction = field.conditional_logic.action || 'show';
      const newLogicalOperator = field.conditional_logic.logicalOperator || 'and';
      
      setLocalLogic(prev => {
        if (prev.action === newAction && prev.logicalOperator === newLogicalOperator) {
          return prev;
        }
        return {
          action: newAction,
          logicalOperator: newLogicalOperator,
        };
      });
    }
  }, [JSON.stringify(field.conditional_logic)]);

  useEffect(() => {
    if (!field.conditional_logic) return;
    
    const hasChanges = 
      field.conditional_logic.action !== localLogic.action || 
      field.conditional_logic.logicalOperator !== localLogic.logicalOperator;
    
    if (hasChanges) {
      onChange({
        ...field.conditional_logic,
        action: localLogic.action,
        logicalOperator: localLogic.logicalOperator,
      });
    }
  }, [localLogic, field.conditional_logic, onChange]);

  const addCondition = () => {
    const newCondition = {
      field: availableFields[0]?.field_name || "",
      operator: "equals",
      value: "",
    };
    
    const updatedLogic = {
      ...(field.conditional_logic || { action: 'show', logicalOperator: 'and' }),
      conditions: [...conditions, newCondition],
    };
    
    onChange(updatedLogic);
  };

  const updateCondition = (index: number, updates: any) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    
    const currentCondition = conditions[index];
    if (JSON.stringify(currentCondition) !== JSON.stringify(updated[index])) {
      onChange({
        ...field.conditional_logic,
        action: localLogic.action,
        logicalOperator: localLogic.logicalOperator,
        conditions: updated,
      });
    }
  };

  const removeCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    
    if (updated.length !== conditions.length) {
      onChange({
        ...field.conditional_logic,
        action: localLogic.action,
        logicalOperator: localLogic.logicalOperator,
        conditions: updated,
      });
    }
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAction = e.target.value as 'show' | 'hide';
    setLocalLogic(prev => ({
      ...prev,
      action: newAction,
    }));
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOperator = e.target.value as 'and' | 'or';
    setLocalLogic(prev => ({
      ...prev,
      logicalOperator: newOperator,
    }));
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Action:</span>
          <label htmlFor="action-select" className="sr-only">Action</label>
          <select
            id="action-select"
            value={localLogic.action}
            onChange={handleActionChange}
            className="text-sm border rounded p-1 text-gray-700"
          >
            <option value="show">Show</option>
            <option value="hide">Hide</option>
          </select>
          <span className="text-sm text-gray-700">this field when</span>
          <button
            type="button"
            onClick={addCondition}
            className="ml-auto text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            + Add Condition
          </button>
        </div>
      </div>

      {conditions.length === 0 ? (
        <p className="text-sm text-gray-500">No conditions (always {localLogic.action === 'show' ? 'visible' : 'hidden'})</p>
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
                  .filter(
                    (field) =>
                      !["file", "image"].includes(field.widget_type || ""),
                  )
                  .map((field) => {
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
                <option value="greater_than_or_equals">is greater than or equal to</option>
                <option value="less_than_or_equals">is less than or equal to</option>
                <option value="contains">contains</option>
                <option value="not_contains">does not contain</option>
                <option value="is_empty">is empty</option>
                <option value="is_not_empty">is not empty</option>
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
          
          {conditions.length > 1 && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm font-medium text-gray-700">Match:</span>
              <select
                value={localLogic.logicalOperator}
                onChange={handleOperatorChange}
                className="text-sm border rounded p-1 text-gray-700"
                aria-label="Select logical operator for conditions"
              >
                <option value="and">All conditions (AND)</option>
                <option value="or">Any condition (OR)</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
