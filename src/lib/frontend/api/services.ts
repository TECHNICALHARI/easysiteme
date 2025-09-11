import {
  ADMIN_FORM,
  PUBLISH_FORM,
  POSTS,
  POST,
  POST_PUBLISH,
  SUBSCRIBERS,
  SUBSCRIBE_PUBLIC,
  TRACK_LINK,
  TRACK_TRAFFIC,
  SUBMIT_CONTACT,
  USER_PAGE,
  CHECK_SUBDOMAIN,
} from "./routes";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const handleApiError = async (res: Response) => {
  let errorMessage = "Something went wrong";
  try {
    const err = await res.json();
    errorMessage = err.message || errorMessage;
  } catch {}
  throw new Error(errorMessage);
};

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    await handleApiError(res);
  }

  return res.json();
}
export async function getAdminForm() {
  return apiFetch<any>(ADMIN_FORM, { method: "GET" });
}

export async function publishAdminForm(data: any) {
  return apiFetch<any>(PUBLISH_FORM, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function listPosts() {
  return apiFetch<any>(POSTS, { method: "GET" });
}

export async function createPost(data: any) {
  return apiFetch<any>(POSTS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPost(id: string) {
  return apiFetch<any>(POST(id), { method: "GET" });
}

export async function updatePost(id: string, data: any) {
  return apiFetch<any>(POST(id), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: string) {
  return apiFetch<any>(POST(id), { method: "DELETE" });
}

export async function togglePublishPost(id: string, publish: boolean) {
  return apiFetch<any>(POST_PUBLISH(id), {
    method: "POST",
    body: JSON.stringify({ publish }),
  });
}

export async function listSubscribers(siteId?: string) {
  const url = siteId ? `${SUBSCRIBERS}?siteId=${siteId}` : SUBSCRIBERS;
  return apiFetch<any>(url, { method: "GET" });
}

export async function subscribePublic(data: any) {
  return apiFetch<any>(SUBSCRIBE_PUBLIC, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function trackLink(data: any) {
  return apiFetch<any>(TRACK_LINK, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function trackTraffic(data: any) {
  return apiFetch<any>(TRACK_TRAFFIC, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitContact(data: any) {
  return apiFetch<any>(SUBMIT_CONTACT, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function checkSubdomain(subdomain: string) {
  return apiFetch<any>(CHECK_SUBDOMAIN(subdomain), { method: "GET" });
}

export async function getUserPage(username: string) {
  return apiFetch<any>(USER_PAGE(username), { method: "GET" });
}
