import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  FiCheck as Check,
  FiChevronDown as ChevronDown,
  FiChevronLeft,
} from "react-icons/fi";
import { eventService } from "../../api/eventService";
import type { EventTeam, EventStatsResponse } from "../../types/events";
import styles from "./EventDetail.module.css";

export const EventDetail = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const [stats, setStats] = useState<EventStatsResponse | null>(null);
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering
  const [selectedGame, setSelectedGame] = useState<string>("All Games");

  useEffect(() => {
    const fetchData = async () => {
      if (!eventName) return;
      try {
        const [statsData, teamsData] = await Promise.all([
          eventService.getEventStats(eventName),
          eventService.getEventTeams(eventName),
        ]);
        setStats(statsData);
        setTeams(teamsData.teams || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventName]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Link to="/events" className={styles.backButton}>
          <FiChevronLeft className={styles.backIcon} size={18} />
          <span>Back to Events</span>
        </Link>
        <div
          className={`skeleton ${styles.skeletonTitle}`}
          style={{ marginBottom: "2rem" }}
        />
        <div className={styles.statsGrid}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`skeleton ${styles.skeletonStat}`} />
          ))}
        </div>
        <div className={`skeleton ${styles.skeletonTable}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Link to="/events" className={styles.backButton}>
          <FiChevronLeft className={styles.backIcon} size={18} />
          <span>Back to Events</span>
        </Link>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  const gamesList = ["All Games", ...(stats ? Object.keys(stats) : [])];

  const filteredTeams =
    selectedGame === "All Games"
      ? teams
      : teams.filter(
          (t) => t.game_name.toLowerCase() === selectedGame.toLowerCase(),
        );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <Link to="/events" className={styles.backButton}>
          <FiChevronLeft className={styles.backIcon} size={18} />
          <span>Back to Events</span>
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>
            {eventName?.replace(/-/g, " ")} Registrations
          </h1>
        </div>

        {stats && (
          <div className={styles.statsGrid}>
            {Object.entries(stats).map(([game, count]) => (
              <div key={game} className={styles.statCard}>
                <div className={styles.statGame}>{game}</div>
                <div className={styles.statCount}>{count}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.filterSection}>
          <h2>Registered Teams ({filteredTeams.length})</h2>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className={styles.dropdownTrigger}>
              {selectedGame}
              <ChevronDown size={16} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={styles.dropdownContent}
                sideOffset={5}
              >
                <DropdownMenu.RadioGroup
                  value={selectedGame}
                  onValueChange={setSelectedGame}
                >
                  {gamesList.map((game) => (
                    <DropdownMenu.RadioItem
                      key={game}
                      value={game}
                      className={styles.dropdownItem}
                    >
                      <DropdownMenu.ItemIndicator
                        className={styles.dropdownItemIndicator}
                      >
                        <Check size={14} />
                      </DropdownMenu.ItemIndicator>
                      {game}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {filteredTeams.length === 0 ? (
          <p>No teams found for {selectedGame}.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Team ID</th>
                  <th>Team Name</th>
                  <th>Game</th>
                  <th>Leader</th>
                  <th>College</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td>#{team.id}</td>
                    <td>{team.team_name}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {team.game_name}
                    </td>
                    <td>{team.leader_name}</td>
                    <td>{team.leader_college}</td>
                    <td>
                      <Link
                        to={`/events/${eventName}/${team.id}`}
                        className={styles.viewLink}
                      >
                        View
                      </Link>
                    </td>
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
