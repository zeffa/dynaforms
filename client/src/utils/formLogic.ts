import type { FormField, FormTemplate } from "@/types/form";

export const evaluateConditions = (
  field: FormField,
  formValues: Record<string, any>,
): boolean => {
  if (!field.conditional_logic?.conditions?.length) {
    return true; // No conditions means always show
  }

  return field.conditional_logic.conditions.every((condition: any) => {
    const fieldValue = formValues[condition.field];
    if (fieldValue === undefined) return false;

    switch (condition.operator) {
      case "equals":
        return String(fieldValue) === String(condition.value);
      case "not_equals":
        return String(fieldValue) !== String(condition.value);
      case "greater_than":
        return Number(fieldValue) > Number(condition.value);
      case "less_than":
        return Number(fieldValue) < Number(condition.value);
      case "contains":
        return String(fieldValue).includes(String(condition.value));
      default:
        return true;
    }
  });
};

export const getVisibleFields = (
  formTemplate: FormTemplate,
  formValues: Record<string, any>,
): FormField[] => {
  if (!formTemplate.fields) return [];

  // First, create a map of field IDs to their values for easier lookup
  const fieldValues = formTemplate.fields.reduce(
    (acc, field) => {
      acc[field.id] = formValues[field.id];
      return acc;
    },
    {} as Record<string, any>,
  );

  // Then evaluate conditions for each field
  return formTemplate.fields.filter((field) => {
    return evaluateConditions(field, { ...formValues, ...fieldValues });
  });
};
