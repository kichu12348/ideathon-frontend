import { useParams, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiRefreshCw,
  FiAlertCircle,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";
import { useFormValidity } from "../../hooks/useFormValidity";
import { FormValidityForm } from "../../components/forms/FormValidityForm";
import styles from "./FormDetail.module.css";

export const FormDetail = () => {
  const { formId: routeFormId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const decodedRouteFormId = routeFormId ? decodeURIComponent(routeFormId) : "";

  const {
    formId: currentFormId,
    setFormId: setCurrentFormId,
    isValid,
    closeTime,
    isLoading,
    isSaving,
    isDeleting,
    error,
    isDirty,
    setIsValid,
    setCloseTime,
    saveValidity,
    deleteValidity,
    refetch,
  } = useFormValidity(decodedRouteFormId);

  const handleSave = async () => {
    const savedId = await saveValidity();
    if (savedId && savedId !== decodedRouteFormId) {
      navigate(`/forms/${encodeURIComponent(savedId)}`, { replace: true });
    }
  };

  const handleDelete = async () => {
    const targetId = currentFormId || decodedRouteFormId;
    if (window.confirm(`Are you sure you want to delete form "${targetId}"?`)) {
      const deleted = await deleteValidity();
      if (deleted) {
        navigate("/forms");
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Navigation Breadcrumb & Back Action */}
        <div className={styles.topNav}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/forms")}
          >
            <FiChevronLeft className={styles.backIcon} size={18} />
            <span>Back to Forms</span>
          </button>
        </div>

        {/* Page Title Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.iconContainer}>
              <FiFileText size={24} />
            </div>
            <div>
              <h1 className={styles.formIdTitle}>
                {currentFormId || "Form Validity"}
              </h1>
              <p className={styles.subtitle}>
                Manage availability status and scheduled closing time for this
                form.
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.deleteIconButton}
              onClick={handleDelete}
              disabled={isLoading || isSaving || isDeleting}
              title="Delete form"
            >
              <FiTrash2 size={16} />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={refetch}
              disabled={isLoading || isSaving || isDeleting}
              title="Refresh form settings"
            >
              <FiRefreshCw size={16} className={isLoading ? styles.spin : ""} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className={styles.skeletonContainer}>
            <div className={`skeleton ${styles.skeletonHeader}`} />
            <div className={`skeleton ${styles.skeletonBlock}`} />
            <div className={`skeleton ${styles.skeletonBlock}`} />
            <div className={styles.skeletonFooter}>
              <div className={`skeleton ${styles.skeletonButton}`} />
            </div>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <FiAlertCircle size={40} className={styles.errorIcon} />
            <h2>Unable to load validity settings</h2>
            <p>{error}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={refetch}
            >
              <FiRefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <FormValidityForm
            formId={currentFormId}
            onFormIdChange={setCurrentFormId}
            isValid={isValid}
            closeTime={closeTime}
            isSaving={isSaving}
            isDirty={isDirty}
            onIsValidChange={setIsValid}
            onCloseTimeChange={setCloseTime}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};
