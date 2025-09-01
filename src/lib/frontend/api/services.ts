import { USER_PAGE } from "./routes";

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
  const res = await fetch(url, {
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


export async function getUserPageService(username: string, options?: RequestInit) {
  return apiFetch<any>(`${process.env.NEXT_PUBLIC_API_URL}${USER_PAGE(username)}`, {
    method: "GET",
    ...options,
  });
}
