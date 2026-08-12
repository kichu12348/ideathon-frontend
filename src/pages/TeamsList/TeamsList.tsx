import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { teamService } from "../../api/teamService";
import type { Team } from "../../types/api";
import styles from "./TeamsList.module.css";

export const TeamsList = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAllTeams();
        setTeams(data.teams);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={`skeleton ${styles.skeletonTitle}`} />
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.card}>
              <div className={`skeleton ${styles.skeletonCardTitle}`} />
              <div className={`skeleton ${styles.skeletonCardText}`} />
              <div className={`skeleton ${styles.skeletonCardText}`} />
              <div className={styles.cardFooter}>
                <div className={`skeleton ${styles.skeletonCardDate}`} />
                <div className={`skeleton ${styles.skeletonCardButton}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Registered Teams ({teams.length})</h1>
        {teams.length === 0 ? (
          <p>No teams registered yet.</p>
        ) : (
          <div className={styles.grid}>
            {teams.map((team) => (
              <div key={team.id} className={styles.card}>
                {team.submission.trim() !== "" && (
                  <span className={styles.hasSubmission}>✓ Submitted</span>
                )}
                <div className={styles.teamName}>{team.team_name}</div>
                <div className={styles.leaderInfo}>
                  <p>Leader: {team.leader_name}</p>
                  <p>{team.leader_college}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    {new Date(team.created_at).toLocaleDateString()}
                  </span>
                  <Link to={`/team/${team.id}`} className={styles.viewButton}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
