import type { FormTemplate } from "@/types/form";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

type Headers = Record<string, string>;

const getHeaders = (token?: string): Headers => {
  const headers: Headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Something went wrong");
  }
  return response.json();
};

export const formApi = {
  async createForm(
    formData: Partial<FormTemplate>,
    token?: string,
  ): Promise<FormTemplate> {
    const response = await fetch(`${API_URL}/form-templates/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async updateForm(
    id: number,
    formData: Partial<FormTemplate>,
    token?: string,
  ): Promise<FormTemplate> {
    const response = await fetch(`${API_URL}/form-templates/${id}/`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async getForms(token?: string): Promise<FormTemplate[]> {
    const response = await fetch(`${API_URL}/form-templates/`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async getForm(id: number, token?: string): Promise<FormTemplate> {
    const response = await fetch(`${API_URL}/form-templates/${id}/`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async getFormBySlug(slug: string, token?: string): Promise<FormTemplate> {
    const response = await fetch(`${API_URL}/form-templates/${slug}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async submitForm(
    id: number,
    formData: Record<string, any>,
    token?: string,
  ): Promise<FormTemplate> {
    const response = await fetch(`${API_URL}/form-templates/${id}/submit/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async deleteForm(id: number, token?: string): Promise<void> {
    const response = await fetch(`${API_URL}/form-templates/${id}/`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete form");
    }
  },

  async getFormStatistics(token?: string): Promise<{
    total_forms: number;
    active_forms: number;
    total_submissions: number;
  }> {
    const response = await fetch(`${API_URL}/statistics/`, {
      method: "GET",
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    // Handle the case where the response is an array (default ViewSet list response)
    return Array.isArray(data) ? data[0] : data;
  },
};
