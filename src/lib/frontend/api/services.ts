import {
  ADMIN_FORM,
  PROFILE_DESIGN,
  POSTS,
  SUBSCRIBERS,
  SUBSCRIBE_PUBLIC,
  TRACK_LINK,
  TRACK_TRAFFIC,
  SUBMIT_CONTACT,
  USER_PAGE,
  CHECK_SUBDOMAIN,
  UPLOAD_IMAGE,
  DELETE_IMAGE,
  SIGNUP,
  LOGIN,
  SEND_OTP,
  VERIFY_OTP,
  CONTACT,
  CHANGE_PASSWORD,
  CHANGE_SUBDOMAIN,
  CREATE_ORDER,
  VERIFY_PAYMENT,
  SUPERADMIN_CONTACT,
  SUPERADMIN_FEATURED_MAKERS,
  SUPERADMIN_USERS,
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
  authRequired?: boolean;
};

const handleApiError = async (res: Response) => {
  let errorMessage = "Something went wrong";
  try {
    const err = await res.json();
    errorMessage = err?.message || errorMessage;
  } catch {}
  throw new Error(errorMessage);
};

async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    headers: providedHeaders = {},
    method = "GET",
    authRequired = true,
  } = options;
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
  if (res.status === 401 && authRequired) {
    if (typeof window !== "undefined") {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      throw new Error("Unauthorized");
    }
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    await handleApiError(res);
  }
  return res.json();
}

export function signupApi(data: any) {
  return apiFetch<any>(SIGNUP, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export function loginApi(data: any) {
  return apiFetch<any>(LOGIN, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}
export function sendOtpApi(data: any) {
  return apiFetch<any>(SEND_OTP, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export function verifyOtpApi(data: any) {
  return apiFetch<any>(VERIFY_OTP, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export async function getAdminForm() {
  return apiFetch<any>(ADMIN_FORM, { method: "GET" });
}

export async function publishAdminForm(data: any) {
  return apiFetch<any>(ADMIN_FORM, { method: "POST", body: data });
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
  const url = siteId
    ? `${SUBSCRIBERS}?siteId=${encodeURIComponent(siteId)}`
    : SUBSCRIBERS;
  return apiFetch<any>(url, { method: "GET" });
}

export async function subscribePublic(data: any) {
  return apiFetch<any>(SUBSCRIBE_PUBLIC, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export async function trackLink(data: any) {
  return apiFetch<any>(TRACK_LINK, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export async function trackTraffic(data: any) {
  return apiFetch<any>(TRACK_TRAFFIC, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export async function submitContact(data: any) {
  return apiFetch<any>(SUBMIT_CONTACT, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export async function checkSubdomainApi(subdomain: string) {
  return apiFetch<any>(CHECK_SUBDOMAIN(subdomain), {
    method: "GET",
    authRequired: false,
  });
}
export async function changeSubdomainApi(subdomain: string) {
  return apiFetch<any>(CHANGE_SUBDOMAIN, {
    method: "POST",
    body: { subdomain },
    authRequired: true,
  });
}

export async function getUserPage(username: string) {
  return apiFetch<any>(USER_PAGE(username), {
    method: "GET",
    authRequired: false,
  });
}

export async function uploadImageApi(file: File, prevPublicId?: string) {
  const fd = new FormData();
  fd.append("file", file);
  if (prevPublicId) fd.append("prevPublicId", prevPublicId);
  const res = await apiFetch<any>(UPLOAD_IMAGE, { method: "POST", body: fd });
  const payload = res?.data ?? res ?? {};
  const url = payload?.url ?? payload?.secure_url ?? "";
  const publicId =
    payload?.publicId ?? payload?.public_id ?? payload?.publicId ?? "";
  return { url, publicId };
}

export async function deleteImageApi(publicId: string) {
  await apiFetch<any>(DELETE_IMAGE, { method: "POST", body: { publicId } });
  return true;
}

export async function ContactUsApi(data: any) {
  return apiFetch<any>(CONTACT, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}

export async function listContacts(page: number = 1, limit: number = 20) {
  const url = `${CONTACT}?page=${encodeURIComponent(
    page
  )}&limit=${encodeURIComponent(limit)}`;
  return apiFetch<any>(url, { method: "GET" });
}

export async function ChangePasswordApi(data: any) {
  return apiFetch<any>(CHANGE_PASSWORD, {
    method: "POST",
    body: data,
    authRequired: false,
  });
}
export async function getProfileDesignApi(opts?: { signal?: AbortSignal }) {
  const url = PROFILE_DESIGN;
  return apiFetch<any>(url, {
    method: "GET",
    authRequired: true,
  });
}
export async function saveProfileDesignApi(data: any) {
  return apiFetch<any>(PROFILE_DESIGN, {
    method: "POST",
    authRequired: true,
    body: data,
  });
}
export async function getProfileDesignDraftApi() {
  return apiFetch<any>(`${PROFILE_DESIGN}/draft`, {
    method: "GET",
    authRequired: true,
  });
}

export async function saveProfileDesignDraftApi(data: any) {
  return apiFetch<any>(`${PROFILE_DESIGN}/draft`, {
    method: "POST",
    authRequired: true,
    body: data,
  });
}
export async function getSubscribersServiceAPI() {
  return apiFetch<any>(SUBSCRIBERS, {
    method: "GET",
    authRequired: true,
  });
}
export async function saveSubscribersServiceAPI(data: any) {
  return apiFetch<any>(SUBSCRIBERS, {
    method: "POST",
    authRequired: true,
    body: data,
  });
}

export async function getStatsServiceAPI() {
  return apiFetch<any>("/admin/stats", { method: "GET" });
}
export async function saveStatsServiceAPI(data: any) {
  return apiFetch<any>("/admin/stats", { method: "POST", body: data });
}

export async function createOrderServiceAPI(data: any) {
  return apiFetch<any>(CREATE_ORDER, {
    method: "POST",
    authRequired: true,
    body: data,
  });
}
export async function verifyPaymentServiceAPI(data: any) {
  return apiFetch<any>(VERIFY_PAYMENT, {
    method: "POST",
    authRequired: true,
    body: data,
  });
}

import { FEATURED_MAKERS_PUBLIC } from "./routes";

export type FeaturedMakerPublic = {
  owner: string;
  fullName: string;
  avatar: string;
  bannerImage: string;
  layoutType: "bio" | "website";
  subdomain: string;
  headline: string;
  rank: number;
};

export async function getFeaturedMakersPublicApi(params?: {
  limit?: number;
  skip?: number;
  signal?: AbortSignal;
}) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.skip) qs.set("skip", String(params.skip));
  const url = `${FEATURED_MAKERS_PUBLIC}${
    qs.toString() ? `?${qs.toString()}` : ""
  }`;
  const res = await fetch(`/api${url}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal: params?.signal,
  });
  if (!res.ok) {
    try {
      const e = await res.json();
      throw new Error(e?.message || "Failed");
    } catch {
      throw new Error("Failed");
    }
  }
  const json = await res.json();
  const arr = (json?.data ?? json ?? []) as FeaturedMakerPublic[];
  return Array.isArray(arr) ? arr : [];
}

export async function getContactsSuperAdmin(
  page: number = 1,
  limit: number = 20
) {
  const url = `${SUPERADMIN_CONTACT}?page=${encodeURIComponent(
    page
  )}&limit=${encodeURIComponent(limit)}`;
  return apiFetch<any>(url, { method: "GET" });
}

export async function listFeaturedSuperAdmin() {
  return apiFetch<any>(SUPERADMIN_FEATURED_MAKERS, { method: "GET" });
}

export async function setFeaturedSuperAdmin(payload: {
  subdomain: string;
  featured: boolean;
  rank?: number;
}) {
  return apiFetch<any>(SUPERADMIN_FEATURED_MAKERS, {
    method: "POST",
    body: payload,
  });
}

export async function getUsersSuperAdmin(opts?: {
  page?: number;
  limit?: number;
  q?: string;
  plan?: string;
}) {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (opts?.q) qs.set("q", String(opts.q));
  if (opts?.plan) qs.set("plan", String(opts.plan));
  const url = `${SUPERADMIN_USERS}?${qs.toString()}`;
  return apiFetch<any>(url, { method: "GET" });
}

