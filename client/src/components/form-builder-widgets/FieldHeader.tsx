import React from 'react';

interface FieldHeaderProps {
  index: number;
  totalFields: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export const FieldHeader: React.FC<FieldHeaderProps> = ({
  index,
  totalFields,
  onMoveUp,
  onMoveDown,
  onRemove,
}) => {
  return (
    <div className="flex justify-between items-start">
      <h4 className="font-medium text-gray-800">Field {index + 1}</h4>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="text-sm bg-gray-700 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === totalFields - 1}
          className="text-sm bg-gray-700 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm bg-red-700 text-white px-2 py-1 rounded hover:bg-red-200 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
