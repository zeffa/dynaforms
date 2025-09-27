import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface FormHeaderProps {
  title: string;
  description?: string;
  category?: string;
}

export const FormHeader = ({ title, description, category }: FormHeaderProps) => (
  <div className="mb-8">
    <div className="flex items-center mb-6">
      <Link
        href="/forms"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mr-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Forms
      </Link>
      {category && (
        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {category}
        </span>
      )}
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    {description && (
      <p className="text-gray-600 max-w-3xl">{description}</p>
    )}
  </div>
);
