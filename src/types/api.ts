type GenderTypes = string | "";

export interface Team {
  id: number;
  team_name: string;
  leader_name: string;
  leader_college: string;
  leader_email: string;
  leader_phone: string;
  gender: GenderTypes;
  payment_screenshot: string;
  submission: string;
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
  gender: GenderTypes;
}

export interface TeamsResponse {
  teams: Team[];
}

export interface TeamDetailResponse {
  team: Team;
  members: Member[];
}
