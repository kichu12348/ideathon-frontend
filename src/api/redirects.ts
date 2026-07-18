import type {
  Link,
  LinkWithSubs,
  CreateLinkPayload,
  UpdateLinkPayload,
  SubLink,
  CreateSubLinkPayload,
  UpdateSubLinkPayload,
} from "../types/redirect";

// Fallback to empty string for safety, but typically should be provided in env
const API_BASE_URL = import.meta.env.VITE_PUBLIC_REDIRECT_API_URL;

class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function fetchWithHandler(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const data = await response.json();
      errorMessage = data.error || errorMessage;
    } catch {
      // Ignored if response is not JSON
    }
    throw new ApiError(response.status, errorMessage);
  }

  // 204 No Content has no body to parse
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const RedirectsService = {
  // Main Links
  getLinks: (): Promise<Link[]> => {
    return fetchWithHandler("/api/links");
  },

  createLink: (payload: CreateLinkPayload): Promise<Link> => {
    return fetchWithHandler("/api/links", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getLinkDetails: (slug: string): Promise<LinkWithSubs> => {
    return fetchWithHandler(`/api/links/${slug}`);
  },

  updateLink: (slug: string, payload: UpdateLinkPayload): Promise<Link> => {
    return fetchWithHandler(`/api/links/${slug}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteLink: (slug: string): Promise<void> => {
    return fetchWithHandler(`/api/links/${slug}`, {
      method: "DELETE",
    });
  },

  // Sub Links
  getSubLinks: (slug: string): Promise<SubLink[]> => {
    return fetchWithHandler(`/api/links/${slug}/subs`);
  },

  createSubLink: (
    slug: string,
    payload: CreateSubLinkPayload,
  ): Promise<SubLink> => {
    return fetchWithHandler(`/api/links/${slug}/subs`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateSubLink: (
    slug: string,
    subSlug: string,
    payload: UpdateSubLinkPayload,
  ): Promise<SubLink> => {
    return fetchWithHandler(`/api/links/${slug}/subs/${subSlug}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteSubLink: (slug: string, subSlug: string): Promise<void> => {
    return fetchWithHandler(`/api/links/${slug}/subs/${subSlug}`, {
      method: "DELETE",
    });
  },
};
