import { useRouter } from "next/navigation";

interface NavbarProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

export const Navbar = ({ onGetStarted, onAdminLogin }: NavbarProps) => (
  <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DYNAFORMS</h1>
          <p className="text-sm text-gray-500">Dynamic Form Builder</p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Forms
          </button>
          <button
            type="button"
            onClick={onAdminLogin}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  </nav>
);
