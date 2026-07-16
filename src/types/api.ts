export interface Team {
  id: number;
  team_name: string;
  leader_name: string;
  leader_college: string;
  leader_email: string;
  leader_phone: string;
  payment_screenshot: string;
  upi_id: string;
  referral_code: string;
  created_at: string;
}

export interface Member {
  id: number;
  team_id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
}

export interface TeamsResponse {
  teams: Team[];
}

export interface TeamDetailResponse {
  team: Team;
  members: Member[];
}
