import {
  ADMIN_FORM,
  PUBLISH_FORM,
  POSTS,
  POST,
  SUBSCRIBERS,
  SUBSCRIBE_PUBLIC,
  TRACK_LINK,
  TRACK_TRAFFIC,
  SUBMIT_CONTACT,
  USER_PAGE,
  CHECK_SUBDOMAIN,
} from "./routes";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

const handleApiError = async (res: Response) => {
  let errorMessage = "Something went wrong";
  try {
    const err = await res.json();
    errorMessage = err?.message || errorMessage;
  } catch {}
  throw new Error(errorMessage);
};

async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { body, headers: providedHeaders = {}, method = "GET" } = options;

  const headers: Record<string, string> = { ...providedHeaders };

  let finalBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      finalBody = body;
    } else if (typeof body === "string") {
      finalBody = body;
      headers["Content-Type"] = headers["Content-Type"] ?? "text/plain";
    } else {
      finalBody = JSON.stringify(body);
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    }
  }

  const res = await fetch(`/api${url}`, {
    method,
    headers,
    body: finalBody,
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
  return apiFetch<any>(PUBLISH_FORM, { method: "POST", body: data });
}

export async function listPosts() {
  return apiFetch<any>(POSTS, { method: "GET" });
}

export async function createPost(data: any) {
  return apiFetch<any>(POSTS, { method: "POST", body: data });
}

export async function getPost(postId: string) {
  const url = `${POSTS}?postId=${encodeURIComponent(postId)}`;
  return apiFetch<any>(url, { method: "GET" });
}

export async function updatePost(postId: string, data: any) {
  const payload = { ...data, postId };
  return apiFetch<any>(POSTS, { method: "PUT", body: payload });
}

export async function deletePost(postId: string) {
  const url = `${POSTS}?postId=${encodeURIComponent(postId)}`;
  return apiFetch<any>(url, { method: "DELETE" });
}

export async function togglePublishPost(postId: string, publish: boolean) {
  const payload = { postId, published: Boolean(publish) };
  return apiFetch<any>(POSTS, { method: "PUT", body: payload });
}

export async function listSubscribers(siteId?: string) {
  const url = siteId ? `${SUBSCRIBERS}?siteId=${encodeURIComponent(siteId)}` : SUBSCRIBERS;
  return apiFetch<any>(url, { method: "GET" });
}

export async function subscribePublic(data: any) {
  return apiFetch<any>(SUBSCRIBE_PUBLIC, { method: "POST", body: data });
}

export async function trackLink(data: any) {
  return apiFetch<any>(TRACK_LINK, { method: "POST", body: data });
}

export async function trackTraffic(data: any) {
  return apiFetch<any>(TRACK_TRAFFIC, { method: "POST", body: data });
}

export async function submitContact(data: any) {
  return apiFetch<any>(SUBMIT_CONTACT, { method: "POST", body: data });
}

export async function checkSubdomain(subdomain: string) {
  return apiFetch<any>(CHECK_SUBDOMAIN(subdomain), { method: "GET" });
}

export async function getUserPage(username: string) {
  return apiFetch<any>(USER_PAGE(username), { method: "GET" });
}
