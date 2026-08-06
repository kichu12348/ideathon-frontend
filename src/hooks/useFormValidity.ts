import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { formService } from "../api/formService";
import { formatToDatetimeLocal } from "../utils/date";

export function useFormValidity(initialFormId: string | undefined) {
  const [currentFormId, setCurrentFormId] = useState<string>(initialFormId || "");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [closeTime, setCloseTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (initialFormId) {
      setCurrentFormId(initialFormId);
    }
  }, [initialFormId]);

  const fetchValidity = useCallback(async () => {
    if (!initialFormId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await formService.getFormValidity(initialFormId);
      setIsValid(data.is_valid ?? true);
      setCloseTime(formatToDatetimeLocal(data.close_time));
      setIsDirty(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load form validity";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [initialFormId]);

  useEffect(() => {
    fetchValidity();
  }, [fetchValidity]);

  const handleSetFormId = (id: string) => {
    setCurrentFormId(id);
    setIsDirty(true);
  };

  const handleSetIsValid = (value: boolean) => {
    setIsValid(value);
    setIsDirty(true);
  };

  const handleSetCloseTime = (value: string) => {
    setCloseTime(value);
    setIsDirty(true);
  };

  const saveValidity = async (targetId?: string): Promise<string | null> => {
    const finalFormId = (targetId || currentFormId).trim();
    if (!finalFormId) {
      toast.error("Form ID cannot be empty");
      return null;
    }
    try {
      setIsSaving(true);
      setError(null);
      await formService.updateFormValidity(finalFormId, {
        is_valid: isValid,
        close_time: closeTime,
      });
      toast.success(`Form "${finalFormId}" validity settings saved successfully!`);
      setIsDirty(false);
      return finalFormId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save form validity";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formId: currentFormId,
    setFormId: handleSetFormId,
    isValid,
    closeTime,
    isLoading,
    isSaving,
    error,
    isDirty,
    setIsValid: handleSetIsValid,
    setCloseTime: handleSetCloseTime,
    saveValidity,
    refetch: fetchValidity,
  };
}
