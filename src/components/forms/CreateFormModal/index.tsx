import React, { useState } from "react";
import { FiPlus, FiRefreshCw, FiCalendar } from "react-icons/fi";
import { Dialog } from "../../ui/Dialog";
import { Switch } from "../../ui/Switch";
import { DateTimePicker } from "../../ui/DateTimePicker";
import { sanitizeFormId, sanitizeFormIdLive } from "../../../utils/sanitize";
import type { UpdateFormValidityPayload } from "../../../types/form";
import styles from "./CreateFormModal.module.css";

export interface CreateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    formId: string,
    payload: UpdateFormValidityPayload,
  ) => Promise<boolean>;
}

export const CreateFormModal: React.FC<CreateFormModalProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [formId, setFormId] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [closeTime, setCloseTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setFormId("");
    setIsValid(true);
    setCloseTime("");
    setIsSubmitting(false);
    setErrorMsg("");
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleFormIdChange = (value: string) => {
    const sanitizedLive = sanitizeFormIdLive(value);
    setFormId(sanitizedLive);
    if (errorMsg) setErrorMsg("");
  };

  const handleFormIdBlur = () => {
    setFormId((prev) => sanitizeFormId(prev));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const finalFormId = sanitizeFormId(formId);
    if (!finalFormId) {
      setErrorMsg("Form ID is required and must contain valid characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      const success = await onCreate(finalFormId, {
        is_valid: isValid,
        close_time: closeTime,
      });

      if (success) {
        resetForm();
        onOpenChange(false);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to create form validity.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      title="Create Form Validity Record"
      description="Initialize validity settings for a new form."
    >
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <div className={styles.fieldGroup}>
          <label htmlFor="modal-form-id" className={styles.fieldLabel}>
            Form ID <span className={styles.required}>*</span>
          </label>
          <input
            id="modal-form-id"
            type="text"
            placeholder="e.g. ideathon-2026-registration"
            value={formId}
            onChange={(e) => handleFormIdChange(e.target.value)}
            onBlur={handleFormIdBlur}
            disabled={isSubmitting}
            className={styles.textInput}
            autoFocus
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Initial Form Status</label>
          <div className={styles.switchWrapper}>
            <Switch
              id="modal-form-switch"
              checked={isValid}
              onCheckedChange={setIsValid}
              disabled={isSubmitting}
              label="Form Open"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <FiCalendar size={14} />
            <span>Closing Time (Optional)</span>
          </label>
          <DateTimePicker
            value={closeTime}
            onChange={setCloseTime}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FiRefreshCw size={15} className={styles.spin} />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FiPlus size={16} />
                <span>Create Form Record</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateFormModal;
