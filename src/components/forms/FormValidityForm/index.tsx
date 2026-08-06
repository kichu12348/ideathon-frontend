import React from "react";
import { FiSave, FiRefreshCw, FiCalendar, FiFileText } from "react-icons/fi";
import { Switch } from "../../ui/Switch";
import { DateTimePicker } from "../../ui/DateTimePicker";
import { getFormatedHumanDate } from "../../../utils/date";
import { sanitizeFormId } from "../../../utils/sanitize";
import styles from "./FormValidityForm.module.css";

export interface FormValidityFormProps {
  formId?: string;
  onFormIdChange?: (value: string) => void;
  isValid: boolean;
  closeTime: string;
  isSaving: boolean;
  isDirty?: boolean;
  onIsValidChange: (value: boolean) => void;
  onCloseTimeChange: (value: string) => void;
  onSave: () => void;
}

export const FormValidityForm: React.FC<FormValidityFormProps> = ({
  formId = "",
  onFormIdChange,
  isValid,
  closeTime,
  isSaving,
  onIsValidChange,
  onCloseTimeChange,
  onSave,
}) => {
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isSaving) {
      onSave();
    }
  };

  const handleBlur = () => {
    if (onFormIdChange && formId) {
      onFormIdChange(sanitizeFormId(formId));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* Form ID Identifier Section */}
      {onFormIdChange && (
        <>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Form Identifier</h2>
              <p className={styles.sectionDescription}>
                Unique identifier for this form in the system. Spaces will be automatically converted to hyphens.
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FiFileText size={15} />
                <span>Form ID</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={formId}
                onChange={(e) => onFormIdChange(e.target.value)}
                onBlur={handleBlur}
                disabled={isSaving}
                placeholder="e.g. registration-form"
              />
            </div>
          </div>
          <hr className={styles.divider} />
        </>
      )}

      {/* Form Status Toggle Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Form Availability Status</h2>
          <p className={styles.sectionDescription}>
            Toggle whether this form is currently accepting responses from
            users.
          </p>
        </div>
        <div className={styles.controlRow}>
          <div className={styles.statusBadgeWrapper}>
            <Switch
              id="form-open-switch"
              checked={isValid}
              onCheckedChange={onIsValidChange}
              disabled={isSaving}
              label="Form Open"
            />
            <span
              className={`${styles.statusBadge} ${
                isValid ? styles.statusBadgeOpen : styles.statusBadgeClosed
              }`}
            >
              {isValid ? "OPEN" : "CLOSED"}
            </span>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Closing Time Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Automatic Closing Time</h2>
          <p className={styles.sectionDescription}>
            Set a scheduled date and time when the form will automatically
            close. Leave empty for indefinite access.
          </p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <FiCalendar size={15} />
            <span>Scheduled Close Date & Time</span>
          </label>

          <DateTimePicker
            value={closeTime}
            onChange={onCloseTimeChange}
            disabled={isSaving}
          />

          {closeTime && (
            <p className={styles.helperText}>
              Form scheduled to close on:{" "}
              <strong>{getFormatedHumanDate(closeTime)}</strong>
            </p>
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Form Action Footer */}
      <div className={styles.actionFooter}>
        <button type="submit" disabled={isSaving} className={styles.saveButton}>
          {isSaving ? (
            <>
              <FiRefreshCw size={17} className={styles.spin} />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <FiSave size={17} />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormValidityForm;
