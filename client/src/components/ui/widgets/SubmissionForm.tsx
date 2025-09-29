import { FormTemplate, FormField } from '@/types/form'
import React from 'react'

function SubmissionForm({ formTemplate, visibleFields, errors, loading, renderField, handleSubmit }: { formTemplate: FormTemplate, visibleFields: Set<string>, errors: Record<string, string>, loading: boolean, renderField: (field: FormField) => React.ReactNode, handleSubmit: (e: React.FormEvent) => void }) {
    return (
        <>
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
                            className={`transition-all duration-300 ease-in-out ${!visibleFields.has(field.field_name) ? 'hidden' : ''
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
        </>
    )
}

export default SubmissionForm