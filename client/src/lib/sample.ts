export const sampleFormTemplate = {
    "name": "Sample Form",
    "description": "A sample form with various field types",
    "category": "general",
    "is_active": true,
    "fields": [
        {
            "field_name": "full_name",
            "label": "Full Name",
            "widget_type": "text",
            "placeholder": "Enter your full name",
            "is_required": true,
            "order": 1,
            "widget_config": {
                "max_length": 100
            },
            "validation_rules": {
                "minLength": 2
            }
        },
        {
            "field_name": "age",
            "label": "Age",
            "widget_type": "number",
            "is_required": true,
            "order": 2,
            "widget_config": {
                "min_value": 18,
                "max_value": 120
            }
        },
        {
            "field_name": "newsletter",
            "label": "Subscribe to newsletter",
            "widget_type": "checkbox",
            "is_required": false,
            "order": 3,
            "conditional_logic": {
                "action": "show",
                "conditions": [
                    {
                        "field": "age",
                        "operator": "greater_than_or_equals",
                        "value": 18
                    }
                ]
            }
        }
    ]
}

export const conditionalLogic = {
    "conditional_logic": {
        "action": "show",
        "conditions": [
            {
                "field": "other_field_name",
                "operator": "equals",
                "value": "expected_value"
            }
        ]
    },
    "operators": [
        "equals",
        "not_equals",
        "greater_than",
        "less_than",
        "greater_than_or_equals",
        "less_than_or_equals",
        "contains",
        "not_contains",
        "is_empty",
        "is_not_empty"
    ]
}

export const options = {
    "value": "option1",
    "label": "Option 1",
    "order": 1
}