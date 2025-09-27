import { useRouter } from 'next/navigation';

interface FormNavigationProps {
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

export const FormNavigation = ({
  onBack,
  backLabel = 'Back to Forms',
  className = '',
}: FormNavigationProps) => {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={`max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 ${className}`}>
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {backLabel}
      </button>
    </div>
  );
};
