import React from 'react';

interface EditorModeToggleProps {
  mode: 'visual' | 'json';
  onModeChange: (mode: 'visual' | 'json') => void;
}

export const EditorModeToggle: React.FC<EditorModeToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="mb-6 flex justify-end">
      <div className="bg-gray-200 rounded-lg p-1 flex space-x-1">
        <button
          type="button"
          onClick={() => onModeChange('visual')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            mode === 'visual' 
              ? 'bg-white text-blue-600 shadow' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Visual Editor
        </button>
        <button
          type="button"
          onClick={() => onModeChange('json')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            mode === 'json' 
              ? 'bg-white text-blue-600 shadow' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          JSON Editor
        </button>
      </div>
    </div>
  );
};
