import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiTrash2,
  FiPlus,
  FiSave,
  FiEdit2,
  FiX,
  FiCopy,
  FiCheck,
  FiLink,
} from "react-icons/fi";
import { RedirectsService } from "../../api/redirects";
import { buildRedirectUrl, buildSubRedirectUrl } from "../../config/redirect";
import type { Link as LinkType, SubLink } from "../../types/redirect";
import styles from "./RedirectEdit.module.css";

const cleanSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64);

const cleanEndSlug = (value: string) => {
  let newval = value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64);

  if (newval.endsWith("-") || newval.endsWith("_")) {
    newval = newval.slice(0, -1);
  }

  if (newval.startsWith("-") || newval.startsWith("_")) {
    newval = newval.slice(1);
  }

  return newval;
};

export const RedirectEdit = () => {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Pre-populate from router state to avoid a refetch on landing
  const passedLink =
    (location.state as { link?: LinkType } | null)?.link ?? null;

  const isNew = !slug;

  // Main link fields
  const [mainSlug, setMainSlug] = useState(passedLink?.slug ?? "");
  const [mainRedirect, setMainRedirect] = useState(passedLink?.redirect ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Sub-links
  const [subLinks, setSubLinks] = useState<SubLink[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  // Sub-link form
  const [subFormVisible, setSubFormVisible] = useState(false);
  const [editingSubSlug, setEditingSubSlug] = useState<string | null>(null);
  const [subSlugInput, setSubSlugInput] = useState("");
  const [subRedirectInput, setSubRedirectInput] = useState("");
  const [subSaving, setSubSaving] = useState(false);

  // Copy state
  const [copiedSub, setCopiedSub] = useState<string | null>(null);
  const [mainCopied, setMainCopied] = useState(false);

  // If editing, load sub-links (main link data is passed via state).
  // On a direct landing (no router state) fetch the link details too.
  useEffect(() => {
    if (!isNew && slug) {
      if (passedLink) {
        loadSubLinks(slug);
      } else {
        loadLinkDetails(slug);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, slug]);

  const loadLinkDetails = async (linkSlug: string) => {
    try {
      setSubsLoading(true);
      const data = await RedirectsService.getLinkDetails(linkSlug);
      setMainSlug(data.slug);
      setMainRedirect(data.redirect);
      setSubLinks(data.subs);
    } catch (err: any) {
      toast.error(err.message || "Failed to load link");
    } finally {
      setSubsLoading(false);
    }
  };

  const loadSubLinks = async (parentSlug: string) => {
    try {
      setSubsLoading(true);
      const data = await RedirectsService.getSubLinks(parentSlug);
      setSubLinks(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load sub-links");
    } finally {
      setSubsLoading(false);
    }
  };

  // ── Main link handlers ──────────────────────────────────────
  const handleSaveMain = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!mainSlug || !mainRedirect) {
      toast.error("Slug and redirect URL are required");
      return;
    }

    try {
      setIsSaving(true);
      if (isNew) {
        await RedirectsService.createLink({
          slug: mainSlug,
          redirect: mainRedirect,
        });
        toast.success("Link created!");
        navigate(`/redirects/${mainSlug}`, { replace: true });
      } else {
        const renamed = mainSlug !== slug;
        const updated = await RedirectsService.updateLink(slug!, {
          redirect: mainRedirect,
          ...(renamed && { slug: mainSlug }),
        });
        toast.success(renamed ? "Link renamed & updated!" : "Link updated!");
        if (renamed) {
          // Sub-links move with the rename (cascade) — land on the new URL
          navigate(`/redirects/${updated.slug}`, {
            replace: true,
            state: { link: updated },
          });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMain = async () => {
    if (!slug) return;
    if (!window.confirm("Delete this link and all its sub-links?")) return;
    try {
      setIsSaving(true);
      await RedirectsService.deleteLink(slug);
      toast.success("Link deleted");
      navigate("/redirects", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete link");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Sub-link handlers ───────────────────────────────────────
  const openSubForm = (sub?: SubLink) => {
    if (sub) {
      setEditingSubSlug(sub.slug);
      setSubSlugInput(sub.slug);
      setSubRedirectInput(sub.redirect);
    } else {
      setEditingSubSlug(null);
      setSubSlugInput("");
      setSubRedirectInput("");
    }
    setSubFormVisible(true);
  };

  const closeSubForm = () => {
    setSubFormVisible(false);
    setEditingSubSlug(null);
    setSubSlugInput("");
    setSubRedirectInput("");
  };

  const handleSaveSub = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!slug) return;
    if (!subSlugInput || !subRedirectInput) {
      toast.error("Both fields are required");
      return;
    }
    try {
      setSubSaving(true);
      if (editingSubSlug) {
        const renamed = subSlugInput !== editingSubSlug;
        await RedirectsService.updateSubLink(slug, editingSubSlug, {
          redirect: subRedirectInput,
          ...(renamed && { slug: subSlugInput }),
        });
        toast.success(
          renamed ? "Sub-link renamed & updated" : "Sub-link updated",
        );
      } else {
        await RedirectsService.createSubLink(slug, {
          slug: subSlugInput,
          redirect: subRedirectInput,
        });
        toast.success("Sub-link created");
      }
      closeSubForm();
      loadSubLinks(slug);
    } catch (err: any) {
      toast.error(err.message || "Failed to save sub-link");
    } finally {
      setSubSaving(false);
    }
  };

  const handleDeleteSub = async (subSlug: string) => {
    if (!slug) return;
    if (!window.confirm(`Delete sub-link "/${subSlug}"?`)) return;
    try {
      await RedirectsService.deleteSubLink(slug, subSlug);
      toast.success("Sub-link deleted");
      loadSubLinks(slug);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete sub-link");
    }
  };

  const handleCopySub = (subSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slug) return;
    navigator.clipboard
      .writeText(buildSubRedirectUrl(slug, subSlug))
      .then(() => {
        setCopiedSub(subSlug);
        setTimeout(() => setCopiedSub(null), 2000);
      });
  };

  const handleCopyMain = () => {
    if (!slug) return;
    navigator.clipboard.writeText(buildRedirectUrl(slug)).then(() => {
      setMainCopied(true);
      setTimeout(() => setMainCopied(false), 2000);
    });
  };

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link to="/redirects" className={styles.backBtn}>
            <FiChevronLeft className={styles.backIcon} size={18} />
            <span>Redirects</span>
          </Link>
          <span className={styles.topBarTitle}>
            {isNew ? "New Link" : `/${slug}`}
          </span>
        </div>
      </div>

      <div className="pageContainer">
        <div className={styles.container}>
          {/* Main link form */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isNew ? "Create Link" : "Main Link"}
            </h2>

            {/* Public URL — visible & copyable when editing */}
            {!isNew && slug && (
              <div className={styles.publicUrlBar}>
                <FiLink size={14} className={styles.publicUrlIcon} />
                <span className={styles.publicUrlText}>
                  {buildRedirectUrl(slug)}
                </span>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={handleCopyMain}
                  title="Copy URL"
                >
                  {mainCopied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                </button>
              </div>
            )}

            <form onSubmit={handleSaveMain} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="slug">
                    Slug
                  </label>
                  <div className={styles.inputPrefix}>
                    <span className={styles.prefix}>/</span>
                    <input
                      id="slug"
                      className={styles.input}
                      type="text"
                      value={mainSlug}
                      onChange={(e) => setMainSlug(cleanSlug(e.target.value))}
                      onBlur={(e) => setMainSlug(cleanEndSlug(e.target.value))}
                      disabled={isSaving}
                      placeholder="my-link"
                      pattern="[a-zA-Z0-9_\-]{1,64}"
                      title="Letters, numbers, dashes and underscores only (max 64)"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="redirect">
                    Redirect URL
                  </label>
                  <input
                    id="redirect"
                    className={styles.input}
                    type="url"
                    value={mainRedirect}
                    onChange={(e) => setMainRedirect(e.target.value.trim())}
                    onBlur={(e) => setMainRedirect(e.target.value.trim())}
                    disabled={isSaving}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSaving}
                >
                  <FiSave size={16} />
                  <span>{isNew ? "Create" : "Save Changes"}</span>
                </button>
                {!isNew && (
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={handleDeleteMain}
                    disabled={isSaving}
                  >
                    <FiTrash2 size={16} />
                    <span>Delete Link</span>
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Sub-links section — only when editing */}
          {!isNew && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Sub Links</h2>
                {!subFormVisible && (
                  <button
                    className={styles.addSubBtn}
                    onClick={() => openSubForm()}
                  >
                    <FiPlus size={15} />
                    <span>Add Sub Link</span>
                  </button>
                )}
              </div>

              {/* Sub-link form (inline) */}
              {subFormVisible && (
                <div className={styles.subForm}>
                  <div className={styles.subFormHeader}>
                    <h3>
                      {editingSubSlug
                        ? `Edit /${editingSubSlug}`
                        : "New Sub Link"}
                    </h3>
                    <button className={styles.closeBtn} onClick={closeSubForm}>
                      <FiX size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleSaveSub}>
                    <div
                      className={styles.formRow}
                      style={{
                        marginBottom: "1rem",
                      }}
                    >
                      <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="subSlug">
                          Sub Slug
                        </label>
                        <div className={styles.inputPrefix}>
                          <span className={styles.prefix}>/{slug}/</span>
                          <input
                            id="subSlug"
                            className={styles.input}
                            type="text"
                            value={subSlugInput}
                            onChange={(e) =>
                              setSubSlugInput(cleanSlug(e.target.value))
                            }
                            onBlur={(e) =>
                              setSubSlugInput(cleanEndSlug(e.target.value))
                            }
                            disabled={subSaving}
                            placeholder="sub"
                            pattern="[a-zA-Z0-9_\-]{1,64}"
                            title="Letters, numbers, dashes and underscores only (max 64)"
                            required
                          />
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="subRedirect">
                          Redirect URL
                        </label>
                        <input
                          id="subRedirect"
                          className={styles.input}
                          type="url"
                          value={subRedirectInput}
                          onChange={(e) =>
                            setSubRedirectInput(e.target.value.trim())
                          }
                          onBlur={(e) =>
                            setSubRedirectInput(e.target.value.trim())
                          }
                          disabled={subSaving}
                          placeholder="https://example.com/sub"
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button
                        type="submit"
                        className={styles.primaryBtn}
                        disabled={subSaving}
                      >
                        <FiSave size={16} />
                        <span>{editingSubSlug ? "Update" : "Create"}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={closeSubForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-links list */}
              {subsLoading ? (
                <div className={styles.subList}>
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className={`${styles.subCard} skeleton`}
                      style={{ height: "62px" }}
                    />
                  ))}
                </div>
              ) : subLinks.length > 0 ? (
                <div className={styles.subList}>
                  {subLinks.map((sub) => (
                    <div key={sub.slug} className={styles.subCard}>
                      <div className={styles.subLeft}>
                        <div className={styles.subSlugRow}>
                          <span
                            className={styles.subSlugBadge}
                            title={buildSubRedirectUrl(slug!, sub.slug)}
                          >
                            <span className={styles.subSlugBase}>
                              {buildRedirectUrl(slug!)}
                            </span>
                            /{sub.slug}
                          </span>
                          <button
                            className={styles.copyBtn}
                            onClick={(e) => handleCopySub(sub.slug, e)}
                            title="Copy URL"
                          >
                            {copiedSub === sub.slug ? (
                              <FiCheck size={12} />
                            ) : (
                              <FiCopy size={12} />
                            )}
                          </button>
                        </div>
                        <p className={styles.subRedirectUrl}>{sub.redirect}</p>
                      </div>
                      <div className={styles.subActions}>
                        <button
                          className={styles.iconActionBtn}
                          onClick={() => openSubForm(sub)}
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className={`${styles.iconActionBtn} ${styles.danger}`}
                          onClick={() => handleDeleteSub(sub.slug)}
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !subFormVisible && (
                  <p className={styles.emptyText}>
                    No sub-links yet. Add one above.
                  </p>
                )
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
