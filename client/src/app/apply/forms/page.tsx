'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
// import FormList from '@/components/FormList';
import { FormTemplate } from '@/types/form';

const FormsDirectoryPage: React.FC = () => {
  const router = useRouter();

  const handleFormSelect = (form: FormTemplate) => {
    router.push(`/forms/${form.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Forms</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select a form below to get started. All forms are designed to be quick and easy to complete.
            </p>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="py-12">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FormList onFormSelect={handleFormSelect} />
        </div> */}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you're having trouble finding the right form or need assistance filling one out, 
            don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@company.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+1234567890"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Call Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormsDirectoryPage;