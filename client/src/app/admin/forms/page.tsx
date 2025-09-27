"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import FormList from "@/components/FormList";
import JSONEditor from "@/components/JSONEditor"; // Import the new component
import { formApi } from "@/services/formApi";
import type { FormTemplate } from "@/types/form";

interface FormStatistics {
  total_forms: number;
  active_forms: number;
  total_submissions: number;
}

const AdminFormsPage: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editorMode, setEditorMode] = useState<"visual" | "json">("visual");
  const [formData, setFormData] = useState<Partial<FormTemplate>>({});
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statistics, setStatistics] = useState<FormStatistics>({
    total_forms: 0,
    active_forms: 0,
    total_submissions: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

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
    setEditorMode("visual");
  };

  const handleEditForm = (form: FormTemplate) => {
    setFormData(form);
    setView("edit");
    setEditorMode("visual");
  };

  const handleViewSubmissions = (form: FormTemplate) => {
    router.push(`/admin/forms/${form.id}/submissions`);
  };

  const handleDeleteForm = async (form: FormTemplate) => {
    try {
      const token = localStorage.getItem("authToken");
      await formApi.deleteForm(form.id, token || "");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete form:", error);
      alert("Failed to delete form. Please try again.");
    }
  };

  const handleSaveForm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken") || "";
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
        await formApi.updateForm(formData.id, dataToSave, token || "");
      } else {
        await formApi.createForm(dataToSave, token || "");
      }

      setView("list");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("Failed to save form. Please try again.");
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Forms
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {view === "edit" ? "Edit Form" : "Create New Form"}
            </h1>
            {view === "edit" && formData && (
              <p className="text-gray-600 mt-2">Editing: {formData.name}</p>
            )}
          </div>

          {/* Editor Mode Toggle */}
          <div className="mb-6 flex justify-end">
            <div className="bg-gray-200 rounded-lg p-1 flex space-x-1">
              <button
                onClick={() => setEditorMode("visual")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${editorMode === "visual" ? "bg-white text-blue-600 shadow" : "text-gray-600"}`}
              >
                Visual Editor
              </button>
              <button
                onClick={() => setEditorMode("json")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${editorMode === "json" ? "bg-white text-blue-600 shadow" : "text-gray-600"}`}
              >
                JSON Editor
              </button>
            </div>
          </div>

          {editorMode === "visual" ? (
            <FormBuilder
              formData={formData}
              onChange={setFormData}
              onSave={handleSaveForm}
              loading={loading}
            />
          ) : (
            <>
              <JSONEditor
                jsonData={formData}
                onChange={setFormData}
                loading={loading}
              />
              <button
                type="button"
                onClick={handleSaveForm}
                disabled={loading}
                className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Form"}
              </button>
            </>
          )}
        </div>
      </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 text-sm font-medium">
                Total Forms
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  statistics.total_forms.toLocaleString()
                )}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 text-sm font-medium">
                Active Forms
              </div>
              <div className="text-2xl font-bold text-green-900">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  statistics.active_forms.toLocaleString()
                )}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 text-sm font-medium">
                Total Submissions
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  statistics.total_submissions.toLocaleString()
                )}
              </div>
            </div>
          </div>
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
