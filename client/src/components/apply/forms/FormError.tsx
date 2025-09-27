import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface FormErrorProps {
  message: string;
  className?: string;
}

export const FormError = ({ message, className = "" }: FormErrorProps) => (
  <div className={`rounded-md bg-red-50 p-4 mb-6 ${className}`}>
    <div className="flex">
      <div className="flex-shrink-0">
        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">{message}</h3>
      </div>
    </div>
  </div>
);
