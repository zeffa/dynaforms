import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface SuccessStateProps {
  formTitle: string;
  onGoBack: () => void;
}

export const SuccessState = ({ formTitle, onGoBack }: SuccessStateProps) => (
  <>
    <Head>
      <title>Form Submitted - {formTitle}</title>
    </Head>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Form Submitted Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for submitting "{formTitle}". Your response has been recorded.
          </p>
          <div className="mt-8">
            <button
              onClick={onGoBack}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Forms
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
