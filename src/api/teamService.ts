import type { TeamsResponse, TeamDetailResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "";

export const teamService = {
  async getAllTeams(): Promise<TeamsResponse> {
    const response = await fetch(`${API_BASE_URL}/register`);
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }
    return response.json();
  },

  async getTeamById(teamId: number | string): Promise<TeamDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/register/${teamId}`);
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
