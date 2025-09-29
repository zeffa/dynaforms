import React from 'react'

export default function RadioButton({ field, formData, handleInputChange }: any) {
    return (
        <div className="space-y-3">
          {field.options?.map((option: any) => (
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
}
