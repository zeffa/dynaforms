// 'use client';

import type React from "react";
import { useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import type { FormTemplate } from "@/types/form";
import { sampleFormTemplate, conditionalLogic, options } from "@/lib/sample";

interface JSONEditorProps {
  jsonData: Partial<FormTemplate>;
  onChange: (data: any) => void;
  loading?: boolean;
}

const JSONEditor: React.FC<JSONEditorProps> = ({
  jsonData,
  onChange,
  loading,
}) => {
  const [isCheatSheetVisible, setIsCheatSheetVisible] = useState(false);
  const handleEditorChange = (e: any) => {
    if (e.jsObject) {
      onChange(e.jsObject);
    }
  };

  const placeholderData = {
    name: "",
    description: "",
    category: "",
    is_active: true,
    ...jsonData,
    fields:
      jsonData.fields && jsonData.fields.length > 0
        ? jsonData.fields
        : [
            {
              id: 1,
              field_name: "sample_field",
              label: "Sample Field",
              widget_type: "text",
              placeholder: "e.g., John Doe",
              help_text: "This is a sample help text.",
              is_required: true,
              order: 1,
              widget_config: {
                max_length: 100,
              },
              validation_rules: {
                minLength: 2,
              },
              options: [],
            },
          ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">JSON Editor</h2>
      <p className="text-sm text-gray-600 mb-4">
        Advanced users can directly edit the form's JSON structure below.
        Changes will be reflected in the visual builder.
      </p>

      <div className="mb-4">
        <button
          onClick={() => setIsCheatSheetVisible(!isCheatSheetVisible)}
          className="text-sm text-blue-600 hover:underline focus:outline-none"
        >
          {isCheatSheetVisible ? "Hide" : "Show"} Cheat Sheet for Configurations
        </button>
        {isCheatSheetVisible && (
          <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Complete Form Template Example
            </h3>
            <pre className="bg-gray-100 p-3 rounded text-xs mb-4 overflow-x-auto">
              <code>{`${JSON.stringify(sampleFormTemplate, null, 2)}`}</code>
            </pre>

            <h3 className="font-bold text-lg mb-3 text-gray-800">
              Field Configurations
            </h3>
            <h4 className="font-bold mb-2">
              Widget Configurations (widget_config)
            </h4>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>
                <code>max_length</code>: (number) - For text-based inputs.
              </li>
              <li>
                <code>min_value</code>, <code>max_value</code>: (number) - For
                number inputs.
              </li>
              <li>
                <code>rows</code>, <code>cols</code>: (number) - For textareas.
              </li>
              <li>
                <code>accepted_file_types</code>: (string[]) - For file uploads,
                e.g., <code>['.pdf', '.docx']</code>.
              </li>
            </ul>
            <h4 className="font-bold mb-2">
              Validation Rules (validation_rules)
            </h4>
            <ul className="list-disc list-inside pl-4">
              <li>
                <code>minLength</code>, <code>maxLength</code>: (number) - For
                string length.
              </li>
              <li>
                <code>minValue</code>, <code>maxValue</code>: (number) - For
                numeric values.
              </li>
              <li>
                <code>pattern</code>: (string) - For regex validation.
              </li>
              <li>
                <code>required</code>: (boolean) - If the field is mandatory.
              </li>
            </ul>
            <h4 className="font-bold mt-4 mb-2">
              Conditional Logic (conditional_logic)
            </h4>
            <p className="mb-2">
              Add show/hide logic to fields based on other field values:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs mb-2">
              <code>{`${JSON.stringify(conditionalLogic, null, 2)}`}</code>
            </pre>
            <h4 className="font-bold mt-4 mb-2">
              Options (for select, radio, checkbox)
            </h4>
            <p className="mb-2">
              The <code>options</code> array should contain objects with the
              following structure:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              <code>{`${JSON.stringify(options, null, 2)}`}</code>
            </pre>
          </div>
        )}
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <JSONInput
          id="form-json-editor"
          placeholder={placeholderData}
          onChange={handleEditorChange}
          locale={locale}
          height="550px"
          width="100%"
          theme="light_mitsuketa_tribute"
          viewOnly={loading}
          confirmGood={false}
        />
      </div>
    </div>
  );
};

export default JSONEditor;
