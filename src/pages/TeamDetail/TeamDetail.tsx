import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import * as Tooltip from "@radix-ui/react-tooltip";
import { teamService } from "../../api/teamService";
import { buildBucketUrl } from "../../config/redirect";
import type { TeamDetailResponse } from "../../types/api";
import ImageModal from "../../components/ImageModal";
import styles from "./TeamDetail.module.css";

const TooltipValue = ({ value }: { value: string }) => (
  <Tooltip.Provider delayDuration={300}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span className={styles.value}>{value}</span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.tooltipContent} sideOffset={6}>
          {value}
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [data, setData] = useState<TeamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      if (!teamId) return;

      try {
        const teamData = await teamService.getTeamById(teamId);
        setData(teamData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetail();
  }, [teamId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={`skeleton ${styles.skeletonTitle}`} />
        <div className={styles.section}>
          <div className={`skeleton ${styles.skeletonSubtitle}`} />
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.field}>
                <div className={`skeleton ${styles.skeletonLabel}`} />
                <div className={`skeleton ${styles.skeletonValue}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.backButton}>
          &larr; Back to Teams
        </Link>
        <div className={styles.error}>Error: {error || "Team not found"}</div>
      </div>
    );
  }

  const { team, members } = data;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        &larr; Back to Teams
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{team.team_name}</h1>
        <div className={styles.date}>
          Registered on {new Date(team.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Leader Information</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Name</span>
            <TooltipValue value={team.leader_name} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <TooltipValue value={team.leader_email} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Phone</span>
            <TooltipValue value={team.leader_phone} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>College</span>
            <TooltipValue value={team.leader_college} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Registration Details</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>UPI ID</span>
            <TooltipValue value={team.upi_id} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Referral Code</span>
            <TooltipValue value={team.referral_code || "N/A"} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Submission</span>
            <span className={styles.value}>
              {team.submission && team.submission.trim() !== "" ? (
                <div className={styles.submissionRow}>
                  <span className={styles.submissionDomain}>
                    {new URL(team.submission).hostname.replace(/^www\./, "")}
                  </span>
                  <a
                    href={team.submission}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.submissionBtn}
                  >
                    <FiExternalLink size={14} />
                    Open
                  </a>
                </div>
              ) : (
                <span className={styles.noSubmission}>No submission yet</span>
              )}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Payment Screenshot</span>
            <span className={styles.value}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
              >
                <img
                  src={buildBucketUrl(team.payment_screenshot)}
                  alt="Payment Receipt"
                  className={styles.screenshot}
                />
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Team Members ({members.length})</h2>
        {members.length === 0 ? (
          <p>No members found for this team.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>College</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.college}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {team && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={buildBucketUrl(team.payment_screenshot)}
        />
      )}
    </div>
  );
};
