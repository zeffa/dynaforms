"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import DynamicForm from "@/components/DynamicForm";
import { formApi } from "@/services/formApi";
import type { FormTemplate } from "@/types/form";
import {
  LoadingState,
  NotFoundState,
  ErrorState,
  SuccessState,
} from "@/components/apply/forms";
import { FormFooter } from "@/components/apply/forms/FormFooter";
import { FormNavigation } from "@/components/apply/forms/FormNavigation";

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

  const handleGoBack = () => {
    router.push("/forms");
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Form...</title>
        </Head>
        <LoadingState />
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
        <NotFoundState onGoBack={handleGoBack} />
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
        <ErrorState 
          error={error} 
          onRetry={() => window.location.reload()} 
          onGoBack={handleGoBack}
        />
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
        <SuccessState 
          formTitle={form.name}
          onGoBack={handleGoBack}
        />
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
        <FormNavigation onBack={handleGoBack} />

        {error && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <ErrorState 
              error={error} 
              onRetry={() => window.location.reload()}
              onGoBack={handleGoBack}
              isInline
            />
          </div>
        )}

        <DynamicForm
          formTemplate={form}
          onSubmit={handleSubmit}
          loading={submitting}
        />

        <FormFooter category={form.category} />
      </div>
    </>
  );
};

export default FormPage;
