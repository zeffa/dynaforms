import React from 'react';
import { FormTemplate } from '@/types/form';
import { EditorModeToggle } from './EditorModeToggle';
import FormBuilder from '@/components/FormBuilder';
import JSONEditor from '@/components/JSONEditor';

interface FormEditorProps {
  formData: Partial<FormTemplate>;
  view: 'create' | 'edit';
  loading: boolean;
  onBack: () => void;
  onSave: () => void;
  onFormChange: (data: Partial<FormTemplate>) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({
  formData,
  view,
  loading,
  onBack,
  onSave,
  onFormChange,
}) => {
  const [editorMode, setEditorMode] = React.useState<'visual' | 'json'>('visual');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Forms
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {view === 'edit' ? 'Edit Form' : 'Create New Form'}
          </h1>
          {view === 'edit' && formData?.name && (
            <p className="text-gray-600 mt-2">Editing: {formData.name}</p>
          )}
        </div>

        <EditorModeToggle
          mode={editorMode}
          onModeChange={setEditorMode}
        />

        {editorMode === 'visual' ? (
          <FormBuilder
            formData={formData}
            onChange={onFormChange}
            onSave={onSave}
            loading={loading}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <JSONEditor
              jsonData={formData}
              onChange={onFormChange}
              loading={loading}
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Form'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
