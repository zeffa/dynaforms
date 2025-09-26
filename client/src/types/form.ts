// File location: types/form.ts
export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string | number | boolean;
}

export interface ConditionalLogic {
  conditions: Condition[];
  action: 'show' | 'hide';
}

export interface FieldOption {
  id?: number;
  value: string;
  label: string;
  order: number;
}

export interface FormField {
  id: number;
  field_name: string;
  label: string;
  widget_type: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  order: number;
  widget_config: Record<string, any>;
  validation_rules: Record<string, any>;
  options?: FieldOption[];
  conditional_logic?: ConditionalLogic;
}

export interface FormTemplate {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  fields: FormField[];
}

export interface FormSubmission {
  id: number;
  form_template: number;
  submission_data: Record<string, any>;
  submitted_at: string;
  submitted_by?: number;
}