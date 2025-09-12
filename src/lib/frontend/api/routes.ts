export const SIGNUP = "/auth/signup";
export const LOGIN = "/auth/login";
export const VERIFY_OTP = "/auth/verify-otp";

export const ADMIN_FORM = "/admin/form";
export const PUBLISH_FORM = "/admin/form";

export const POSTS = "/admin/posts";
export const POST = (id: string) => `/admin/posts?postId=${encodeURIComponent(id)}`;
export const POST_PUBLISH = (id: string) => `/admin/posts?postId=${encodeURIComponent(id)}&action=publish`;

export const SUBSCRIBERS = "/admin/subscribers";

export const TRACK_LINK = "/public/stats/track-link";
export const TRACK_TRAFFIC = "/public/stats/track-traffic";
export const SUBMIT_CONTACT = "/public/stats/contact";

export const SUBSCRIBE_PUBLIC = "/public/subscribe";

export const CHECK_SUBDOMAIN = (subdomain: string) =>
  `/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`;

export const USER_PAGE = (username: string) => `/pages/${encodeURIComponent(username)}`;

export const UPLOAD_IMAGE = "/uploads/image";
export const DELETE_IMAGE = "/uploads/delete";
