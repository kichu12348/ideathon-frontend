import type { 
  EventsResponse, 
  EventTeamsResponse, 
  EventStatsResponse, 
  EventTeamDetailResponse 
} from "../types/events";

const INTERNAL_API_KEY = import.meta.env.VITE_PUBLIC_INTERNAL_API_KEY!;
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "";

export const eventService = {
  async getAllEvents(): Promise<EventsResponse> {
    const response = await fetch(`${API_BASE_URL}/events/get-all-events`, {
      headers: {
        "x-internal-key": INTERNAL_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return response.json();
  },

  async getEventStats(eventName: string): Promise<EventStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventName}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch event stats: ${response.statusText}`);
    }
    return response.json();
  },

  async getEventTeams(eventName: string): Promise<EventTeamsResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventName}`, {
      headers: {
        "x-internal-key": INTERNAL_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch event teams: ${response.statusText}`);
    }
    return response.json();
  },

  async getTeamById(eventName: string, teamId: string | number): Promise<EventTeamDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventName}/${teamId}`, {
      headers: {
        "x-internal-key": INTERNAL_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch team details: ${response.statusText}`);
    }
    return response.json();
  },

  async getTeamByTicket(eventName: string, ticket: string): Promise<EventTeamDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventName}/ticket/${ticket}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch team details: ${response.statusText}`);
    }
    return response.json();
  }
};
