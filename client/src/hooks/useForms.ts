import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formApi } from "@/services/formApi";
import type { FormTemplate } from "@/types/form";
import { setAuthData } from "@/utils/auth";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  is_admin: boolean;
}

export const formKeys = {
  all: ["forms"] as const,
  lists: () => [...formKeys.all, "list"] as const,
  list: (filters: Record<string, any> = {}) =>
    [...formKeys.lists(), { ...filters }] as const,
  details: () => [...formKeys.all, "detail"] as const,
  detail: (id: number | string) => [...formKeys.details(), id] as const,
  stats: () => [...formKeys.all, "stats"] as const,
};

export const useForms = (token?: string) => {
  return useQuery({
    queryKey: formKeys.lists(),
    queryFn: () => formApi.getForms(token),
    // enabled: !!token
  });
};

export const useForm = (id: number, token?: string) => {
  return useQuery({
    queryKey: formKeys.detail(id),
    queryFn: () => formApi.getForm(id, token),
    enabled: !!id,
  });
};

export const useFormBySlug = (slug: string, token?: string) => {
  return useQuery({
    queryKey: formKeys.detail(slug),
    queryFn: () => formApi.getFormBySlug(slug, token),
    enabled: !!slug,
  });
};

export const useCreateForm = (token?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: Partial<FormTemplate>) =>
      formApi.createForm(formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
    },
  });
};

export const useUpdateForm = (id: number, token?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: Partial<FormTemplate>) =>
      formApi.updateForm(id, formData, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
      queryClient.setQueryData(formKeys.detail(id), data);
    },
  });
};

export const useDeleteForm = (token?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => formApi.deleteForm(id, token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
      queryClient.removeQueries({ queryKey: formKeys.detail(id) });
    },
  });
};

export const useSubmitForm = (id: number, token?: string) => {
  return useMutation({
    mutationFn: (formData: Record<string, any>) =>
      formApi.submitForm(id, formData, token),
  });
};

export const useFormStatistics = (token?: string) => {
  return useQuery({
    queryKey: formKeys.stats(),
    queryFn: () => formApi.getFormStatistics(token),
    enabled: !!token,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed. Please check your credentials.");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAuthData(data.access, {
        username: data.username,
        isAdmin: data.is_admin,
      });
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
    },
  });
};
