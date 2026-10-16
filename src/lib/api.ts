const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://edunova-backend-stn1.onrender.com/api/v1"

const TOKEN_KEY = "edunova_portal_token"

let sessionEnded = false
let expiryTimer: number | undefined

export const getToken = () =>
  sessionStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionEnded = false
  scheduleSessionExpiry()
}

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem("edunova_portal_authenticated")
  sessionStorage.removeItem("edunova_portal_pending_verification")
  sessionStorage.removeItem("edunova_portal_pending_email")
  localStorage.removeItem("application_data")
  clearTimeout(expiryTimer)
}

export function handleSessionExpired(
  message = "Your session has expired. Please login again to continue."
) {
  if (sessionEnded) return

  sessionEnded = true
  clearToken()

  window.dispatchEvent(
    new CustomEvent("auth-expired", {
      detail: { message },
    })
  )
}

function getTokenExpiry(token: string): number | null {
  try {
    const base64 = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const payload = JSON.parse(atob(base64))

    return payload.exp
      ? payload.exp * 1000
      : null
  } catch {
    return null
  }
}

export function scheduleSessionExpiry() {
  clearTimeout(expiryTimer)

  const token = getToken()

  if (!token) return

  const exp = getTokenExpiry(token)

  if (!exp) return

  const msLeft = exp - Date.now()

  if (msLeft <= 0) {
    handleSessionExpired()
    return
  }

  expiryTimer = window.setTimeout(
    () => handleSessionExpired(),
    msLeft
  )
}

interface ApiOptions extends RequestInit {
  auth?: boolean
}

async function apiFetch(
  path: string,
  options: ApiOptions = {}
): Promise<any> {
  const { auth = true, headers, ...rest } = options

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  if (
    rest.body &&
    !(rest.body instanceof FormData)
  ) {
    finalHeaders["Content-Type"] =
      "application/json"
  }

  if (auth) {
    const token = getToken()

    if (token) {
      finalHeaders["Authorization"] =
        `Bearer ${token}`
    }
  }

  const res = await fetch(
    `${BASE_URL}${path}`,
    {
      ...rest,
      headers: finalHeaders,
    }
  )

  let data: any = null

  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      handleSessionExpired()
      throw new Error("Session expired")
    }

    throw new Error(
      data?.message ||
        data?.error ||
        data?.msg ||
        `Request failed (${res.status})`
    )
  }

  return data
}
export async function login(
  email: string,
  password: string
) {
  const data = await apiFetch("/students/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
  });

  const accessToken =
    data?.data?.access_token ||
    data?.access_token ||
    data?.data?.token ||
    data?.token;

  if (accessToken) {
    setToken(accessToken);
  }

  return data;
}

export function logout() {
  return apiFetch("/students/logout", {
    method: "POST",
  }).finally(clearToken);
}

export const registerStudentCourses = (
  payload: Record<string, any>
) =>
  apiFetch("/students/courses/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })


  export const getStudentDashboard = () =>
  apiFetch("/students/dashboard", {
    method: "GET",
  });
  

// GET /api/v1/students/courses
export const getStudentCourses = () =>
  apiFetch("/students/courses", {
    method: "GET",
  });

// GET /api/v1/students/courses/available
export const getAvailableStudentCourses = (search = "") => {
  const query = search.trim();

  const params = new URLSearchParams();

  if (query) {
    params.set("search", query);
  }

  const queryString = params.toString();

  return apiFetch(
    `/students/courses/available${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
    }
  );
};
interface RegisterStudentCoursePayload {
  course_offering_ids: (string | number)[];
}

// POST /api/v1/students/courses/register
export const registerStudentCourse = (
  payload: RegisterStudentCoursePayload
) =>
  apiFetch("/students/courses/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// PATCH /api/v1/students/courses/:registration_id/drop
export const dropStudentCourse = (
  registrationId: string | number
) =>
  apiFetch(
    `/students/courses/registrations/${encodeURIComponent(String(registrationId))}/drop`,
    {
      method: "PATCH",
    }
  );

// GET /api/v1/students/dashboard

export interface ProgramChangePayload {
  faculty_id: string | number;
  department_id: string | number;
  programme_id: string | number;
  reason: string;
  // Add any other fields required by the backend.
}

export const getProgramChangeData = () =>
  apiFetch("/students/programme-change", {
    method: "GET",
  });

export const submitProgramChangeRequest = (payload: {
  requested_programme_id: string | number;
  reason: string;
}) =>
  apiFetch("/students/programme-change", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProgramChangeRequest = (
  requestId: string | number
) =>
  apiFetch(
    `/students/programme-change/${encodeURIComponent(String(requestId))}`,
    {
      method: "GET",
    }
  );