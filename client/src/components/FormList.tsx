"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { formApi } from "@/services/formApi";
import type { FormTemplate } from "@/types/form";

interface FormListProps {
  onFormSelect: (form: FormTemplate) => void;
  isAdmin?: boolean;
  onEditForm?: (form: FormTemplate) => void;
  onDeleteForm?: (form: FormTemplate) => void;
}

const FormList: React.FC<FormListProps> = ({
  onFormSelect,
  isAdmin = false,
  onEditForm,
  onDeleteForm,
}) => {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        let fetchedForms;
        if (isAdmin) {
          const token = localStorage.getItem("authToken") || "";
          if (!token) {
            setError('Authentication required.');
            return;
          }
          fetchedForms = await formApi.getForms(token);
        } else {
          fetchedForms = await formApi.getForms();
        }
        setForms(fetchedForms);
      } catch (err) {
        setError("Failed to load forms.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [isAdmin]);

  if (loading) {
    return <div className="text-center py-10">Loading forms...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {forms.map((form) => (
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
                  onClick={() => onFormSelect(form)}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Submissions
                </button>
                <button
                  onClick={() => onEditForm(form)}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteForm(form)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
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
