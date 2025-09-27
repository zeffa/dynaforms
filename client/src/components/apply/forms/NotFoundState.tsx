import Head from "next/head";

interface NotFoundStateProps {
  onGoBack: () => void;
}

export const NotFoundState = ({ onGoBack }: NotFoundStateProps) => (
  <>
    <Head>
      <title>Form Not Found</title>
    </Head>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl text-gray-400 mb-4">📝</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Form Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The form you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={onGoBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Available Forms
        </button>
      </div>
    </div>
  </>
);
