import useGet, { customOptions } from "@/api/query";
import useMutationHandler from "@/api/mutation";
import { UseQueryOptions } from "@tanstack/react-query";

export interface TemplateField {
  id?: string;
  name: string;
  key: string;
  type: "string" | "number" | "array";
  method: "regex" | "marker";
  regex: string;
  startMarker?: string;
  endMarker?: string;
  required: boolean;
  description?: string;
}

export interface Template {
  id: string;
  channel_id: string;
  version: number;
  extraction_config: {
    fields: TemplateField[];
  };
  test_message?: string;
  is_active: boolean;
  extraction_success_rate: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateTemplateData {
  channel_id: string;
  extraction_config: {
    fields: TemplateField[];
  };
  test_message?: string;
  is_active?: boolean;
}

export const useGetChannelTemplates = (
  channelId: string,
  options?: Omit<
    UseQueryOptions<Template[], unknown, Template[], readonly unknown[]>,
    "queryKey"
  > &
    customOptions & { active_only?: boolean }
) => {
  const { data, isLoading } = useGet<Template[]>(
    `channels/${channelId}/templates`,
    {
      queryParams: options?.active_only ? { active_only: "true" } : undefined,
      ...options,
    }
  );

  return {
    data: data,
    isLoading,
  };
};

export const useGetTemplate = (
  templateId: string,
  options?: Omit<
    UseQueryOptions<Template, unknown, Template, readonly unknown[]>,
    "queryKey"
  > &
    customOptions
) => {
  const { data, isLoading } = useGet<Template>(
    `templates/${templateId}`,
    options
  );

  return {
    data: data,
    isLoading,
  };
};

export const useCreateTemplate = () => {
  return useMutationHandler<Template>("templates", {
    method: "POST",
    contentType: "application/json",
  });
};

export const useUpdateTemplate = (templateId: string) => {
  return useMutationHandler<Template>(`templates/${templateId}`, {
    method: "PUT",
    contentType: "application/json",
  });
};

export const useDeleteTemplate = (templateId?: string) => {
  return useMutationHandler("templates/:id", {
    method: "DELETE",
    id: templateId,
  });
};

export const useToggleTemplateActive = (templateId: string) => {
  return useMutationHandler<Template>(`templates/${templateId}/toggle-active`, {
    method: "PUT",
    contentType: "application/json",
  });
};
