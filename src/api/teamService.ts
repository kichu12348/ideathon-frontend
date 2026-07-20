import type { TeamsResponse, TeamDetailResponse } from "../types/api";

const INTERNAL_API_KEY = import.meta.env.VITE_PUBLIC_INTERNAL_API_KEY!;
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "";

export const teamService = {
  async getAllTeams(): Promise<TeamsResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      headers: {
        "x-internal-key": INTERNAL_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }
    return response.json();
  },

  async getTeamById(teamId: number | string): Promise<TeamDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/register/${teamId}`, {
      headers: {
        "x-internal-key": INTERNAL_API_KEY,
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Team not found");
      }
      if (response.status === 400) {
        throw new Error("Invalid team ID");
      }
      throw new Error(`Failed to fetch team details: ${response.statusText}`);
    }
    return response.json();
  },
};
