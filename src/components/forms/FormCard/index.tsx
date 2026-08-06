import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import type { FormItem } from "../../../types/form";
import styles from "./FormCard.module.css";

export interface FormCardProps {
  form: FormItem;
}

export const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/forms/${encodeURIComponent(form.form_id)}`);
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
          <span className={styles.subtext}>Click to manage validity settings</span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button
          className={styles.manageButton}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          type="button"
        >
          <span>Manage</span>
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FormCard;
