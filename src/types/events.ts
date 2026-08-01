export interface EventItem {
  eventName: string;
  games: string[];
}

export interface EventsResponse {
  events: EventItem[];
}

export interface EventStatsResponse {
  [gameName: string]: number;
}

export interface EventTeam {
  id: number;
  event_name: string;
  game_name: string;
  team_name: string;
  ticket: string;
  leader_name: string;
  leader_college: string;
  leader_gender: string;
  leader_email: string;
  leader_phone: string;
  payment_screenshot: string;
  upi_id: string;
  total_paid: number;
  is_early_bird: number;
  referral_code: string;
  created_at: string;
}

export interface EventTeamsResponse {
  teams: EventTeam[];
}

export interface EventMember {
  id: number;
  team_id: number;
  name: string;
  gender: string;
  email: string;
  phone: string;
  college: string;
}

export interface EventTeamDetailResponse {
  exists: boolean;
  team: EventTeam;
  members: EventMember[];
}
