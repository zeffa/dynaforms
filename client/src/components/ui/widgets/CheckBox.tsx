import { FormField } from '@/types/form';

export const MultiCheckBox: React.FC<{ field: FormField, formData: Record<string, any>, handleInputChange: (fieldName: string, value: any) => void }> = ({ field, formData, handleInputChange }) => {
    return (
        <div className="space-y-3">
            {field.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-3">
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
    )
}

export const SingleCheckBox: React.FC<{ field: FormField, formData: Record<string, any>, handleInputChange: (fieldName: string, value: any) => void }> = ({ field, formData, handleInputChange }) => {
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
    )
}

export const CheckBox: React.FC<{ field: FormField, formData: Record<string, any>, handleInputChange: (fieldName: string, value: any) => void }> = ({ field, formData, handleInputChange }) => {
    if (field.options && field.options.length > 1) {
        // Multiple checkboxes
        return (
            <MultiCheckBox
                field={field}
                formData={formData}
                handleInputChange={handleInputChange}
            />
        );
    } else {
        // Single checkbox
        return (
            <SingleCheckBox
                field={field}
                formData={formData}
                handleInputChange={handleInputChange}
            />
        );
    }
}

