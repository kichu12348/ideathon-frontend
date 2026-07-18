import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiLink,
  FiCopy,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { RedirectsService } from "../../api/redirects";
import { REDIRECT_BASE_URL, buildRedirectUrl } from "../../config/redirect";
import type { Link } from "../../types/redirect";
import styles from "./RedirectsList.module.css";

export const RedirectsList = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [baseUrlCopied, setBaseUrlCopied] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await RedirectsService.getLinks();
      setLinks(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch links");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(REDIRECT_BASE_URL).then(() => {
      setBaseUrlCopied(true);
      setTimeout(() => setBaseUrlCopied(false), 2000);
    });
  };

  const handleCopySlug = (link: Link, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(buildRedirectUrl(link.slug)).then(() => {
      setCopiedSlug(link.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const handleCardClick = (link: Link) => {
    navigate(`/redirects/${link.slug}`, { state: { link } });
  };

  return (
    <div className={styles.page}>
      {/* Top nav bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span className={styles.brand}>↗ Redirects</span>
          <div
            className={styles.baseUrlPill}
            onClick={handleCopyBaseUrl}
            title="Click to copy base URL"
          >
            <FiLink size={13} />
            <span className={styles.baseUrlText}>{REDIRECT_BASE_URL}</span>
            {baseUrlCopied ? <FiCheck size={13} /> : <FiCopy size={13} />}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Manage Redirects</h1>
            <p className={styles.pageSubtitle}>
              {links.length} link{links.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.iconButton}
              onClick={fetchLinks}
              disabled={isLoading}
              title="Refresh"
            >
              <FiRefreshCw size={16} className={isLoading ? styles.spin : ""} />
            </button>
            <button
              className={styles.createButton}
              onClick={() => navigate("/redirects/new")}
            >
              <FiPlus size={18} />
              <span>New Link</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={styles.list}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${styles.linkCard} ${styles.skeletonCard}`}
              >
                <div
                  className="skeleton"
                  style={{
                    height: "1.2rem",
                    width: "30%",
                    marginBottom: "0.5rem",
                  }}
                />
                <div
                  className="skeleton"
                  style={{ height: "0.9rem", width: "70%" }}
                />
              </div>
            ))}
          </div>
        ) : links.length > 0 ? (
          <div className={styles.list}>
            {links.map((link) => (
              <div
                key={link.slug}
                className={styles.linkCard}
                onClick={() => handleCardClick(link)}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.slugRow}>
                    <span
                      className={styles.slugBadge}
                      title={buildRedirectUrl(link.slug)}
                    >
                      <span className={styles.slugBase}>
                        {REDIRECT_BASE_URL}
                      </span>
                      /{link.slug}
                    </span>
                    <button
                      className={styles.copyBtn}
                      onClick={(e) => handleCopySlug(link, e)}
                      title="Copy full URL"
                    >
                      {copiedSlug === link.slug ? (
                        <FiCheck size={13} />
                      ) : (
                        <FiCopy size={13} />
                      )}
                    </button>
                  </div>
                  <p className={styles.redirectUrl}>{link.redirect}</p>
                  <span className={styles.dateText}>
                    Updated{" "}
                    {new Date(link.updated_at + " UTC").toLocaleDateString()}
                  </span>
                </div>
                <button
                  className={styles.editChevron}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(link);
                  }}
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiLink size={40} className={styles.emptyIcon} />
            <h2>No redirects yet</h2>
            <p>Create your first redirect link to get started.</p>
            <button
              className={styles.createButton}
              onClick={() => navigate("/redirects/new")}
            >
              <FiPlus size={18} />
              <span>New Link</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
