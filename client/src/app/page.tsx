'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/apply/forms');
  };

  const handleAdminLogin = () => {
    router.push('/admin/forms');
  };

  return (
    <>
      <Head>
        <title>Dynamic Form Builder - Create and Fill Forms</title>
        <meta name="description" content="A powerful dynamic form builder for creating and managing custom forms" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FormBuilder</h1>
                <p className="text-sm text-gray-500">Dynamic Form Management System</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Forms
                </button>
                <button
                  type="button"
                  onClick={handleAdminLogin}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Admin Panel
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Create Dynamic Forms
              <span className="text-blue-600"> Effortlessly</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build custom forms on the fly, collect responses, and manage data with our 
              powerful dynamic form builder. No predefined templates - create exactly what you need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                Browse Forms
              </button>
              <button
                type="button"
                onClick={handleAdminLogin}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need for Dynamic Forms
              </h3>
              <p className="text-lg text-gray-600">
                Powerful features to create, manage, and analyze your forms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Dynamic Form Builder</h4>
                <p className="text-gray-600">
                  Create any form you need with our intuitive drag-and-drop builder. 
                  Add fields, set validations, and configure options on the fly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Smart Validation</h4>
                <p className="text-gray-600">
                  Built-in validation rules, custom patterns, and real-time feedback 
                  ensure data quality and improve user experience.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Response Analytics</h4>
                <p className="text-gray-600">
                  View, analyze, and export form responses. Get insights from your data 
                  with detailed submission reports and CSV exports.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Category Organization</h4>
                <p className="text-gray-600">
                  Organize forms by categories for easy browsing and management. 
                  Keep your forms structured and accessible.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h4>
                <p className="text-gray-600">
                  Enterprise-grade security with data encryption and secure form submissions. 
                  Your data is safe and protected.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Easy Management</h4>
                <p className="text-gray-600">
                  Intuitive admin dashboard for creating, editing, and managing forms. 
                  No technical skills required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Create your first dynamic form in minutes or browse existing forms to see what's available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAdminLogin}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold"
              >
                Create Forms
              </button>
              <button
                onClick={handleGetStarted}
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                Browse Forms
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">FormBuilder</h4>
                <p className="text-gray-400">
                  The most flexible dynamic form builder for businesses of all sizes.
                </p>
              </div>
              <div>
                <h5 className="text-white text-sm font-semibold mb-4">Quick Links</h5>
                <ul className="space-y-2">
                  <li><button onClick={handleGetStarted} className="text-gray-400 hover:text-white transition-colors">Browse Forms</button></li>
                  <li><button onClick={handleAdminLogin} className="text-gray-400 hover:text-white transition-colors">Admin Panel</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-white text-sm font-semibold mb-4">Support</h5>
                <ul className="space-y-2">
                  <li><a href="mailto:support@company.com" className="text-gray-400 hover:text-white transition-colors">Email Support</a></li>
                  <li><a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">Phone Support</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                &copy; 2024 FormBuilder. Built with Next.js and Django.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;