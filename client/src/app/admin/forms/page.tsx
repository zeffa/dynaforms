"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormList from "@/components/FormList";
import { formApi } from "@/services/formApi";
import type { FormTemplate } from "@/types/form";
import { FormEditor } from "@/components/admin/FormEditor";
import { StatsSection } from "@/components/admin/StatsSection";
import { useCreateForm, useDeleteForm, useUpdateForm } from "@/hooks/useForms";

interface FormStatistics {
  total_forms: number;
  active_forms: number;
  total_submissions: number;
}

const AdminFormsPage: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [formData, setFormData] = useState<Partial<FormTemplate>>({});
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statistics, setStatistics] = useState<FormStatistics>({
    total_forms: 0,
    active_forms: 0,
    total_submissions: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") || "" : "";
  
  const { mutate: deleteForm } = useDeleteForm(token);
  const { mutate: createForm } = useCreateForm(token);
  const { mutate: updateForm } = useUpdateForm(
    formData.id || 0,
    token
  );

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);
        const token = localStorage.getItem("authToken");
        const stats = await formApi.getFormStatistics(token || "");
        setStatistics(stats);
      } catch (error) {
        console.error("Failed to fetch form statistics:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, [refreshKey]);

  const handleCreateForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      is_active: true,
      fields: [],
    });
    setView("create");
  };

  const handleEditForm = (form: FormTemplate) => {
    setFormData(form);
    setView("edit");
  };

  const handleViewSubmissions = (form: FormTemplate) => {
    router.push(`/admin/forms/${form.id}/submissions`);
  };

  const handleDeleteForm = async (form: FormTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${form.name}"?`)) {
      try {
        await deleteForm(form.id);
        // The query invalidation will happen in the useDeleteForm hook
      } catch (error) {
        console.error("Failed to delete form:", error);
        alert(error instanceof Error ? error.message : "Failed to delete form. Please try again.");
      }
    }
  };

  const handleSaveForm = async () => {
    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        fields_data: formData.fields?.map((field, index) => ({
          ...field,
          order: index,
          field_name:
            field.field_name ||
            field.label?.toLowerCase().replace(/\s+/g, "_") ||
            `field_${index}`,
        })),
      };

      if (view === "edit" && formData.id) {
        await updateForm(dataToSave);
      } else {
        await createForm(dataToSave);
      }

      setView("list");
      setFormData({}); // Reset form data
    } catch (error) {
      console.error("Failed to save form:", error);
      alert(error instanceof Error ? error.message : "Failed to save form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setView("list");
    setFormData({});
  };

  if (view === "create" || view === "edit") {
    return (
      <FormEditor
        formData={formData}
        view={view}
        loading={loading}
        onBack={handleBackToList}
        onSave={handleSaveForm}
        onFormChange={setFormData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Form Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage your dynamic forms
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateForm}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
            >
              <span>+</span>
              Create New Form
            </button>
          </div>

          {/* Quick Stats */}
          <StatsSection
            totalForms={statistics.total_forms}
            activeForms={statistics.active_forms}
            totalSubmissions={statistics.total_submissions}
            loading={statsLoading}
          />
        </div>

        {/* Forms List */}
        <div key={refreshKey}>
          <FormList
            isAdmin={true}
            onFormSelect={handleViewSubmissions}
            onEditForm={handleEditForm}
            onDeleteForm={handleDeleteForm}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminFormsPage;
