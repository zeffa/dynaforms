import type React from "react";

interface CTASectionProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

export const CTASection = ({ onGetStarted, onAdminLogin }: CTASectionProps) => (
  <div className="bg-blue-600 py-16">
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h3 className="text-3xl font-bold text-white mb-4">
        Ready to Get Started?
      </h3>
      <p className="text-xl text-blue-100 mb-8">
        Create your first dynamic form in minutes or browse existing forms
        to see what's available.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onAdminLogin}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold"
        >
          Create Forms
        </button>
        <button
          type="button"
          onClick={onGetStarted}
          className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          Browse Forms
        </button>
      </div>
    </div>
  </div>
);
