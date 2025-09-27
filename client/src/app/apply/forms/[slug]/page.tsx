"use client";

import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DynamicForm from "@/components/DynamicForm";
import { formApi } from "@/services/formApi";
import type { FormTemplate } from "@/types/form";

const FormPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch form data when component mounts or slug changes
  useEffect(() => {
    const fetchForm = async () => {
      if (!slug || typeof slug !== "string") return;

      try {
        setLoading(true);
        setError(null);
        const formData = await formApi.getFormBySlug(slug);
        // Check if form is active
        if (!formData.is_active) {
          setNotFound(true);
          return;
        }

        setForm(formData);
      } catch (error: any) {
        console.error("Failed to fetch form:", error);
        if (error.message === "Form not found") {
          setNotFound(true);
        } else {
          setError("Failed to load form. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [slug]);

  const handleSubmit = async (data: Record<string, any>) => {
    if (!form) return;

    try {
      setSubmitting(true);
      setError(null);
      await formApi.submitForm(form.id, data);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Submission failed:", error);
      setError(error.message || "Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setSubmitted(false);
    setError(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoBack = () => {
    router.push("/apply/forms");
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Form...</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form...</p>
          </div>
        </div>
      </>
    );
  }

  // Not found state
  if (notFound || !form) {
    return (
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
              onClick={handleGoBack}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Available Forms
            </button>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && !form) {
    return (
      <>
        <Head>
          <title>Error Loading Form</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-red-400 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Form
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleGoBack}
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

  // Success state
  if (submitted) {
    return (
      <>
        <Head>
          <title>Form Submitted - {form.name}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-green-800 mb-4">
                Thank You!
              </h2>
              <p className="text-lg text-green-700 mb-6">
                Your form "{form.name}" has been submitted successfully.
              </p>
              <p className="text-gray-600 mb-8">
                We've received your information and will process it accordingly.
                {form.category &&
                  ` This ${form.category.toLowerCase()} form submission will be reviewed shortly.`}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGoBack}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View More Forms
                </button>
                <button
                  onClick={handleStartOver}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main form view
  return (
    <>
      <Head>
        <title>{form.name}</title>
        <meta
          name="description"
          content={form.description || `Fill out the ${form.name} form`}
        />
        {form.category && (
          <meta
            name="keywords"
            content={`${form.category}, form, ${form.name}`}
          />
        )}
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        {/* Navigation */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            type="button"
            onClick={handleGoBack}
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
            Back to Forms
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Submission Error
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex text-red-400 hover:text-red-600 transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <DynamicForm
          formTemplate={form}
          onSubmit={handleSubmit}
          loading={submitting}
        />

        {/* Form Info Footer */}
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
                  <strong>Privacy Notice:</strong> Your information will be
                  handled securely and in accordance with our privacy policy.
                  Required fields are marked with an asterisk (*).
                </p>
                {form.category && (
                  <p className="text-blue-700 mt-1">
                    This form is categorized under:{" "}
                    <span className="font-medium">{form.category}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormPage;
