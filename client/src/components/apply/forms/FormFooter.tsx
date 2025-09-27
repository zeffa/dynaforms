import { FormTemplate } from "@/types/form";

interface FormFooterProps {
  category?: string;
}

export const FormFooter = ({ category }: FormFooterProps) => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 text-sm">
          <p className="text-blue-800">
            <strong>Notice:</strong>
            Required fields are marked with an asterisk (*).
          </p>
          {category && (
            <p className="text-blue-700 mt-1">
              This form is categorized under:{" "}
              <span className="font-medium">{category}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);
