import { FormField } from '@/types/form'
import React from 'react'

export const SingleFileUpload = ({ currentFiles, removeFile }: { currentFiles: File, removeFile: (index: number) => void }) => {
    return (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm text-gray-700 truncate">
                {currentFiles.name} ({(currentFiles.size / 1024).toFixed(1)} KB)
            </span>
            <button
                type="button"
                onClick={() => removeFile(0)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove file">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export const MultiFileUpload = ({ field, currentFiles, removeFile }: { field: FormField, currentFiles: File[], removeFile: (index: number) => void }) => {
    return (
        <div className="space-y-1">
            {currentFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700 truncate">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove file"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
            {field.validation_rules?.maxFiles && (
                <p className="text-xs text-gray-500">
                    Maximum {field.validation_rules.maxFiles} files allowed
                    {currentFiles.length >= field.validation_rules.maxFiles && (
                        <span className="text-red-500 ml-1">(Limit reached)</span>
                    )}
                </p>
            )}
        </div>
    )
}

export const FileUpload = ({ field, formData, commonProps, handleInputChange }: { field: FormField, formData: any, commonProps: any, handleInputChange: (fieldName: string, value: any) => void }) => {
    const isMultiple = field.widget_config?.multiple === true;
    const currentFiles = formData[field.field_name] || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            handleInputChange(field.field_name, isMultiple ? [] : null);
            return;
        }

        if (isMultiple) {
            // Convert FileList to array and combine with existing files if needed
            const newFiles = Array.from(files);
            const existingFiles = Array.isArray(currentFiles) ? currentFiles : [];
            const allFiles = [...existingFiles, ...newFiles];

            // Apply max files limit if set
            const maxFiles = field.validation_rules?.maxFiles;
            const finalFiles = maxFiles ? allFiles.slice(0, maxFiles) : allFiles;

            handleInputChange(field.field_name, finalFiles);
        } else {
            // Single file upload
            handleInputChange(field.field_name, files[0]);
        }
    };

    const removeFile = (index: number) => {
        if (!isMultiple || !Array.isArray(currentFiles)) {
            handleInputChange(field.field_name, null);
            return;
        }

        const updatedFiles = [...currentFiles];
        updatedFiles.splice(index, 1);
        handleInputChange(field.field_name, updatedFiles.length > 0 ? updatedFiles : null);
    };

    return (
        <div className="w-full">
            <input
                type="file"
                {...commonProps}
                onChange={handleFileChange}
                accept={field.widget_config?.accept}
                multiple={isMultiple}
                className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {field.widget_config?.help_text && (
                <p className="mt-1 text-xs text-gray-500">
                    {field.widget_config.help_text}
                </p>
            )}

            {currentFiles && (
                <div className="mt-2 space-y-2">
                    {Array.isArray(currentFiles) ? (
                        // Multiple files
                        <MultiFileUpload field={field} currentFiles={currentFiles} removeFile={removeFile} />
                    ) : (
                        // Single file
                        <SingleFileUpload currentFiles={currentFiles} removeFile={removeFile} />
                    )}
                </div>
            )}
        </div>
    )
}


