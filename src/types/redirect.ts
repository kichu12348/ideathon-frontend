export interface Link {
  slug: string;
  redirect: string;
  created_at: string;
  updated_at: string;
}

export interface SubLink {
  slug: string;
  redirect: string;
  created_at: string;
  updated_at: string;
}

export interface LinkWithSubs extends Link {
  subs: SubLink[];
}

export interface CreateLinkPayload {
  slug: string;
  redirect: string;
}

export interface UpdateLinkPayload {
  slug?: string;
  redirect?: string;
}

export interface CreateSubLinkPayload {
  slug: string;
  redirect: string;
}

export interface UpdateSubLinkPayload {
  slug?: string;
  redirect?: string;
}
