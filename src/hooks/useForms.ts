import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { formService } from "../api/formService";
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

  const createForm = async (formId: string, payload: UpdateFormValidityPayload): Promise<boolean> => {
    const trimmedId = formId.trim();
    if (!trimmedId) {
      toast.error("Form ID is required");
      return false;
    }

    try {
      await formService.updateFormValidity(trimmedId, payload);
      toast.success(`Form "${trimmedId}" validity settings created successfully`);
      await fetchForms();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create form validity";
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
  };
}
