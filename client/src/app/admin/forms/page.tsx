'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import FormList from '../../../components/FormList';
import FormBuilder from '@/components/FormBuilder';
import { formApi } from '@/services/formApi';
import { FormTemplate } from '@/types/form';
import FormList from '@/components/FormList';

const AdminFormsPage: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateForm = () => {
    setSelectedForm(null);
    setView('create');
  };

  const handleEditForm = (form: FormTemplate) => {
    setSelectedForm(form);
    setView('edit');
  };

  const handleViewSubmissions = (form: FormTemplate) => {
    router.push(`/admin/forms/${form.id}/submissions`);
  };

  const handleDeleteForm = async (form: FormTemplate) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login first');
        return;
      }

      await formApi.deleteForm(form.id, token);
      // Refresh the list
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete form:', error);
      alert('Failed to delete form. Please try again.');
    }
  };

  const handleSaveForm = async (formData: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || '';
      
      // if (!token) {
      //   alert('Please login first');
      //   return;
      // }
      
      if (view === 'edit' && selectedForm) {
        await formApi.updateForm(selectedForm.id, formData, token);
      } else {
        await formApi.createForm(formData, token);
      }
      
      setView('list');
      setRefreshKey(prev => prev + 1); // Refresh the form list
    } catch (error) {
      console.error('Failed to save form:', error);
      alert('Failed to save form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedForm(null);
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              type='button'
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Forms
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {view === 'edit' ? 'Edit Form' : 'Create New Form'}
            </h1>
            {view === 'edit' && selectedForm && (
              <p className="text-gray-600 mt-2">
                Editing: {selectedForm.name}
              </p>
            )}
          </div>
          
          <FormBuilder
            onSave={handleSaveForm}
            initialData={selectedForm || undefined}
            loading={loading}
          />
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
              <h1 className="text-3xl font-bold text-gray-900">Form Management</h1>
              <p className="text-gray-600 mt-2">Create and manage your dynamic forms</p>
            </div>
            <button
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
              <div className="text-blue-600 text-sm font-medium">Total Forms</div>
              <div className="text-2xl font-bold text-blue-900">--</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 text-sm font-medium">Active Forms</div>
              <div className="text-2xl font-bold text-green-900">--</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 text-sm font-medium">Total Submissions</div>
              <div className="text-2xl font-bold text-purple-900">--</div>
            </div>
          </div>
        </div>
        
        Forms List
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