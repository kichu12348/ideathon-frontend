import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { eventService } from "../../api/eventService";
import { buildBucketUrl } from "../../config/redirect";
import type { EventTeamDetailResponse } from "../../types/events";
import ImageModal from "../../components/ImageModal";
import styles from "./EventTeamDetail.module.css";

export const EventTeamDetail = () => {
  const { eventName, id } = useParams<{ eventName: string; id: string }>();
  const [data, setData] = useState<EventTeamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      if (!eventName || !id) return;

      try {
        const teamData = await eventService.getTeamById(eventName, id);
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
  }, [eventName, id]);

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

  if (error || !data || !data.team) {
    return (
      <div className={styles.container}>
        <Link to={`/events/${eventName}`} className={styles.backButton}>
          <FiChevronLeft className={styles.backIcon} size={18} />
          <span>Back to Event</span>
        </Link>
        <div className={styles.error}>Error: {error || "Team not found"}</div>
      </div>
    );
  }

  const { team, members } = data;

  return (
    <div className={styles.container}>
      <Link to={`/events/${eventName}`} className={styles.backButton}>
        <FiChevronLeft className={styles.backIcon} size={18} />
        <span>Back to Event</span>
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{team.team_name}</h1>
        <div className={styles.date}>
          Registered on {new Date(team.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>General Details</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Game</span>
            <span className={styles.value} style={{textTransform: 'capitalize'}}>{team.game_name}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Ticket ID</span>
            <span className={styles.value}>{team.ticket}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Early Bird</span>
            <span className={styles.value}>{team.is_early_bird ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Leader Information</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Name</span>
            <span className={styles.value}>{team.leader_name}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gender</span>
            <span className={styles.value}>{team.leader_gender}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{team.leader_email}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Phone</span>
            <span className={styles.value}>{team.leader_phone}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>College</span>
            <span className={styles.value}>{team.leader_college}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Registration Details</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>UPI ID</span>
            <span className={styles.value}>{team.upi_id}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Total Paid</span>
            <span className={styles.value}>₹{team.total_paid}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Referral Code</span>
            <span className={styles.value}>{team.referral_code || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Payment Screenshot</span>
            <span className={styles.value}>
              {team.payment_screenshot ? (
                <ImageModal
                  src={buildBucketUrl(team.payment_screenshot)}
                  alt="Payment Receipt"
                />
              ) : (
                <span>N/A</span>
              )}
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
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>College</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.gender}</td>
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
    </div>
  );
};
