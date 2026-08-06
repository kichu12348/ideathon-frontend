import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { formService } from "../api/formService";
import { sanitizeFormId } from "../utils/sanitize";
import type { FormItem, UpdateFormValidityPayload } from "../types/form";

export function useForms() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchForms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await formService.getAllForms();
      setForms(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load forms";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const createForm = async (
    formId: string,
    payload: UpdateFormValidityPayload,
  ): Promise<boolean> => {
    const sanitizedId = sanitizeFormId(formId);
    if (!sanitizedId) {
      toast.error("Form ID is required and must contain valid characters");
      return false;
    }

    try {
      await formService.updateFormValidity(sanitizedId, payload);
      toast.success(`Form "${sanitizedId}" validity record created`);
      await fetchForms();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create form validity";
      toast.error(msg);
      return false;
    }
  };

  const deleteForm = async (formId: string): Promise<boolean> => {
    try {
      await formService.deleteFormValidity(formId);
      toast.success(`Form "${formId}" deleted successfully`);
      await fetchForms();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete form";
      toast.error(msg);
      return false;
    }
  };

  const filteredForms = forms.filter((form) =>
    form.form_id.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return {
    forms: filteredForms,
    totalCount: forms.length,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchForms,
    createForm,
    deleteForm,
  };
}
