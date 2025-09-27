import Head from "next/head";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onGoBack: () => void;
  isInline?: boolean;
}

export const ErrorState = ({ error, onRetry, onGoBack, isInline = false }: ErrorStateProps) => {
  const containerClasses = isInline 
    ? "bg-white p-6 rounded-lg shadow-md" 
    : "min-h-screen bg-gray-50 flex items-center justify-center";
    
  const contentClasses = isInline 
    ? "text-center p-4" 
    : "text-center";

  return (
    <>
      {!isInline && (
        <Head>
          <title>Error Loading Form</title>
        </Head>
      )}
      <div className={containerClasses}>
        <div className={contentClasses}>
          <div className="text-6xl text-red-400 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isInline ? 'Error' : 'Error Loading Form'}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className={`flex ${isInline ? 'flex-row' : 'flex-col sm:flex-row'} gap-4 justify-center`}>
            <button
              onClick={onRetry}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onGoBack}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
