import type { FormField, FormTemplate } from "@/types/form";

export const evaluateConditions = (fields: FormField[], currentData: Record<string, any>) => {
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

  export const validateFields = (
    fields: FormField[], 
    visibleFields: Set<string>, 
    formData: Record<string, any>
  ) => {
    const formErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (
        field.is_required &&
        visibleFields.has(field.field_name) &&
        (!formData[field.field_name] || formData[field.field_name] === "")
      ) {
        formErrors[field.field_name] = `${field.label} is required`;
      }

      if (field.widget_type === "email" && formData[field.field_name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.field_name])) {
          formErrors[field.field_name] = "Invalid email format";
        }
      }

      if (field.validation_rules?.min_length && formData[field.field_name]) {
        if (
          String(formData[field.field_name]).length <
          field.validation_rules.min_length
        ) {
          formErrors[field.field_name] =
            `Minimum ${field.validation_rules.min_length} characters required`;
        }
      }

      if (field.validation_rules?.max_length && formData[field.field_name]) {
        if (String(formData[field.field_name]).length > field.validation_rules.max_length) {
          formErrors[field.field_name] =
            `Maximum ${field.validation_rules.max_length} characters allowed`;
        }
      }

      if (field.validation_rules?.pattern && formData[field.field_name]) {
        const pattern = new RegExp(field.validation_rules.pattern);
        if (!pattern.test(formData[field.field_name])) {
          formErrors[field.field_name] = "Invalid format";
        }
      }
    });
    return formErrors;
  }

// export const getVisibleFields = (
//   formTemplate: FormTemplate,
//   formValues: Record<string, any>,
// ): FormField[] => {
//   if (!formTemplate.fields) return [];

//   // First, create a map of field IDs to their values for easier lookup
//   const fieldValues = formTemplate.fields.reduce(
//     (acc, field) => {
//       acc[field.id] = formValues[field.id];
//       return acc;
//     },
//     {} as Record<string, any>,
//   );

//   // Then evaluate conditions for each field
//   return formTemplate.fields.filter((field) => {
//     return evaluateConditions(field, { ...formValues, ...fieldValues });
//   });
// };
