import type React from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

export const HeroSection = ({ onGetStarted, onAdminLogin }: HeroSectionProps) => (
  <div className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-5xl font-bold text-gray-900 mb-6">
        Create Dynamic Forms
        <span className="text-blue-600"> Effortlessly</span>
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Build custom forms on the fly, collect responses, and manage data
        with our powerful dynamic form builder. No predefined templates -
        create exactly what you need.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          Browse Forms
        </button>
        <button
          type="button"
          onClick={onAdminLogin}
          className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
        >
          Admin Dashboard
        </button>
      </div>
    </div>
  </div>
);
