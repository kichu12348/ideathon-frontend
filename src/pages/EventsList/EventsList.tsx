import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../../api/eventService";
import type { EventItem } from "../../types/events";
import styles from "./EventsList.module.css";

export const EventsList = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
              <div className={styles.cardFooter}>
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
    <div className={styles.container}>
      <h1 className={styles.title}>All Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className={styles.grid}>
          {events.map((event) => (
            <div key={event.eventName} className={styles.card}>
              <div className={styles.eventName}>
                {event.eventName.replace(/-/g, " ")}
              </div>
              <div className={styles.gamesInfo}>
                <p>Games Included:</p>
                <div className={styles.gamesList}>
                  {event.games.map((game) => (
                    <span key={game} className={styles.gameBadge}>
                      {game}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <Link
                  to={`/events/${event.eventName}`}
                  className={styles.viewButton}
                >
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
