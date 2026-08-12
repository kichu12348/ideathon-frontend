import { useState } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
import { useForms } from "../../hooks/useForms";
import { FormCard } from "../../components/forms/FormCard";
import { CreateFormModal } from "../../components/forms/CreateFormModal";
import styles from "./FormsList.module.css";

export const FormsList = () => {
  const {
    forms,
    totalCount,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch,
    createForm,
    deleteForm,
  } = useForms();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Form Validity Management</h1>
              <p className={styles.pageSubtitle}>
                {isLoading
                  ? "Loading forms..."
                  : `${totalCount} form${totalCount !== 1 ? "s" : ""} available`}
              </p>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={refetch}
                disabled={isLoading}
                title="Refresh forms list"
                type="button"
              >
                <FiRefreshCw
                  size={16}
                  className={isLoading ? styles.spin : ""}
                />
              </button>
              <button
                className={styles.createButton}
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                <FiPlus size={18} />
                <span>Create Form</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <FiSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search forms by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm("")}
                type="button"
              >
                Clear
              </button>
            )}
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonHeader}>
                    <div className={`skeleton ${styles.skeletonIcon}`} />
                    <div className={`skeleton ${styles.skeletonText}`} />
                  </div>
                  <div className={styles.skeletonFooter}>
                    <div className={`skeleton ${styles.skeletonBtn}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <FiAlertCircle size={40} className={styles.errorIcon} />
              <h2>Unable to load forms</h2>
              <p>{error}</p>
              <button
                className={styles.retryButton}
                onClick={refetch}
                type="button"
              >
                <FiRefreshCw size={16} />
                <span>Retry</span>
              </button>
            </div>
          ) : forms.length > 0 ? (
            <div className={styles.grid}>
              {forms.map((form) => (
                <FormCard
                  key={form.form_id}
                  form={form}
                  onDelete={deleteForm}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiFileText size={44} className={styles.emptyIcon} />
              <h2>
                {searchTerm ? "No matching forms found" : "No forms found"}
              </h2>
              <p>
                {searchTerm
                  ? `No form matching "${searchTerm}" was found.`
                  : "Get started by creating your first form validity record."}
              </p>
              {!searchTerm && (
                <button
                  className={styles.createButton}
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                >
                  <FiPlus size={18} />
                  <span>Create Form Record</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Radix UI Powered Create Modal */}
        <CreateFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onCreate={createForm}
        />
      </div>
    </div>
  );
};
