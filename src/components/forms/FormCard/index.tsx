import React from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import type { FormItem } from "../../../types/form";
import styles from "./FormCard.module.css";

export interface FormCardProps {
  form: FormItem;
  onDelete?: (formId: string) => void;
}

export const FormCard: React.FC<FormCardProps> = ({ form, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/forms/${encodeURIComponent(form.form_id)}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete form "${form.form_id}"?`)
    ) {
      onDelete?.(form.form_id);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className={styles.cardContent}>
        <div className={styles.iconWrapper}>
          <FiFileText size={22} className={styles.icon} />
        </div>
        <div className={styles.details}>
          <h3 className={styles.formId}>{form.form_id}</h3>
          <span className={styles.subtext}>
            Click to manage validity settings
          </span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        {onDelete && (
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            title="Delete form"
            type="button"
          >
            <FiTrash2 size={16} />
          </button>
        )}
        <button
          className={styles.manageButton}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          type="button"
        >
          <span>Manage</span>
        </button>
      </div>
    </div>
  );
};

export default FormCard;
