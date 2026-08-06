import type {
  FormItem,
  FormValidity,
  UpdateFormValidityPayload,
} from "../types/form";

const REDIRECT_API_URL = import.meta.env.VITE_PUBLIC_REDIRECT_API_URL || "";
const FORMS_API_BASE = `${REDIRECT_API_URL}/api/forms`;

export class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${FORMS_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      // Non-JSON response
    }
    throw new ApiError(response.status, errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const formService = {
  /** Fetch all available forms */
  getAllForms: (): Promise<FormItem[]> => {
    return request<FormItem[]>("/get-all");
  },

  /** Get validity settings for a specific form */
  getFormValidity: async (formId: string): Promise<FormValidity> => {
    try {
      const data = await request<FormValidity>(
        `/${encodeURIComponent(formId)}/validity`,
      );
      return {
        is_valid: data?.is_valid ?? true,
        close_time: data?.close_time || "",
      };
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // Default state if no record exists
        return { is_valid: true, close_time: "" };
      }
      throw err;
    }
  },

  /** Update validity settings for a form */
  updateFormValidity: (
    formId: string,
    payload: UpdateFormValidityPayload,
  ): Promise<FormValidity> => {
    const newPayload = {
      is_valid: Boolean(payload.is_valid),
      close_time: payload.close_time,
    };
    return request<FormValidity>(`/${encodeURIComponent(formId)}/validity`, {
      method: "POST",
      body: JSON.stringify(newPayload),
    });
  },

  /** Delete validity settings for a specific form */
  deleteFormValidity: async (formId: string): Promise<void> => {
    try {
      await request<void>(`/${encodeURIComponent(formId)}/validity`, {
        method: "DELETE",
      });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 405)) {
        await request<void>(`/${encodeURIComponent(formId)}`, {
          method: "DELETE",
        });
        return;
      }
      throw err;
    }
  },
};
