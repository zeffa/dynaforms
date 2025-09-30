"use client";

import type React from "react";
import { useForms } from "@/hooks/useForms";
import type { FormTemplate } from "@/types/form";
import { getAuthToken } from "@/utils/auth";

interface FormListProps {
  isAdmin?: boolean;
  onFormSelect: (form: FormTemplate) => void;
  onEditForm?: (form: FormTemplate) => void;
  onDeleteForm?: (form: FormTemplate) => void;
}

const FormList: React.FC<FormListProps> = ({
  isAdmin = false,
  onFormSelect,
  onEditForm,
  onDeleteForm,
}) => {
  const { data: forms, isLoading, error } = useForms(getAuthToken() || "");
  
  const errorMessage = error ? "Failed to load forms." : null;

  if (isLoading) {
    return <div className="text-center py-10">Loading forms...</div>;
  }

  if (errorMessage) {
    return <div className="text-center py-10 text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      {forms?.map((form) => (
        <div
          key={form.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{form.name}</h3>
            <p className="text-sm text-gray-600">{form.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && onEditForm && onDeleteForm ? (
              <>
                <button
                  type="button"
                  onClick={() => onFormSelect(form)}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Submissions
                </button>
                <button
                  type="button"
                  onClick={() => onEditForm(form)}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteForm(form)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onFormSelect(form)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Open Form
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormList;
