import React from 'react'

export default function Select({ field, props }: any) {
    return (
        <select {...props}>
            <option value="">Select an option</option>
            {field.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}
