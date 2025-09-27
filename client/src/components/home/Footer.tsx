import type React from "react";

interface FooterProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

export const Footer = ({ onGetStarted, onAdminLogin }: FooterProps) => (
  <footer className="bg-gray-900 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Dynaforms</h4>
          <p className="text-gray-400">
            The most flexible dynamic form builder for businesses of all sizes.
          </p>
        </div>
        <div>
          <h5 className="text-white text-sm font-semibold mb-4">Quick Links</h5>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={onGetStarted}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Browse Forms
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onAdminLogin}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Admin Panel
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="text-white text-sm font-semibold mb-4">Support</h5>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:zeffah.elly@gmail.com"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Email Support
              </a>
            </li>
            <li>
              <a
                href="tel:+254706567060"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Phone Support
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400">
          &copy; 2025 Dynaforms. Built with Next.js and Django.
        </p>
      </div>
    </div>
  </footer>
);
