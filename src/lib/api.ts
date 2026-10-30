const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://edunova-backend-stn1.onrender.com/api/v1";

const TOKEN_KEY = "edunova_portal_token";
const ROLE_KEY = "edunova_portal_role";

export type UserRole = "student" | "staff" | "superadmin";

let sessionEnded = false;
let expiryTimer: number | undefined;
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getAuthRole = (): UserRole | null => {
  const role = sessionStorage.getItem(ROLE_KEY);

  if (
    role === "student" ||
    role === "staff" ||
    role === "superadmin"
  ) {
    return role;
  }

  return null;
};

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionEnded = false;
  scheduleSessionExpiry();
};

export const setAuthRole = (role: UserRole) => {
  sessionStorage.setItem(ROLE_KEY, role);
};

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem("edunova_portal_authenticated");
  sessionStorage.removeItem("edunova_portal_pending_verification");
  sessionStorage.removeItem("edunova_portal_pending_email");

  localStorage.removeItem("application_data");

  clearTimeout(expiryTimer);
  expiryTimer = undefined;
  sessionEnded = false;
};

export function handleSessionExpired(
  message = "Your session has expired. Please login again to continue."
) {
  if (sessionEnded) return;

  sessionEnded = true;
  clearToken();

  window.dispatchEvent(
    new CustomEvent("auth-expired", {
      detail: { message },
    })
  );
}

// --------------------
// TOKEN EXPIRY
// --------------------

function getTokenExpiry(token: string): number | null {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) return null;

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(atob(base64));

    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function scheduleSessionExpiry() {
  clearTimeout(expiryTimer);

  const token = getToken();

  if (!token) return;

  const exp = getTokenExpiry(token);

  if (!exp) return;

  const msLeft = exp - Date.now();

  if (msLeft <= 0) {
    handleSessionExpired();
    return;
  }

  expiryTimer = window.setTimeout(
    () => handleSessionExpired(),
    msLeft
  );
}

// --------------------
// API REQUEST HELPER
// --------------------

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

async function apiFetch(
  path: string,
  options: ApiOptions = {}
): Promise<any> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (rest.body && !(rest.body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();

    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      handleSessionExpired();
      throw new Error("Session expired");
    }

    throw new Error(
      data?.message ||
        data?.error ||
        data?.msg ||
        `Request failed (${res.status})`
    );
  }

  return data;
}

// --------------------
// LOGIN
// --------------------

export async function login(
  email: string,
  password: string,
  role: "student" | "staff"
) {
  const endpoint =
    role === "staff" ? "/staffs/login" : "/students/login";

  // Clear any previous account session before logging in.
  clearToken();

  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    auth: false,
  });

  const data = response?.data ?? response;

  const accessToken =
    data?.access_token ||
    data?.token ||
    data?.accessToken;

  const user = data?.user ?? response?.user;

  const returnedRole = String(
    user?.role ??
      user?.user_type ??
      data?.role ??
      data?.user_type ??
      ""
  ).toUpperCase();

  if (accessToken) {
    setToken(accessToken);
  }

  // Store the selected role for frontend routing.
  // The backend must still enforce permissions on protected endpoints.
  const normalizedRole: UserRole =
    returnedRole.includes("SUPER_ADMIN") ||
    returnedRole.includes("SUPERADMIN")
      ? "superadmin"
      : returnedRole.includes("STAFF") ||
          returnedRole.includes("LECTURER")
        ? "staff"
        : returnedRole.includes("STUDENT")
          ? "student"
          : role;

  setAuthRole(normalizedRole);

  return response;
}

// --------------------
// LOGOUT
// --------------------

export function logout() {
  // The staff logout endpoint has not yet been specified,
  // so this currently clears the local session only.
  clearToken();
}

// --------------------
// STUDENT DASHBOARD
// --------------------

export const getStudentDashboard = () =>
  apiFetch("/students/dashboard", {
    method: "GET",
  });

// --------------------
// STUDENT COURSES
// --------------------

export const getStudentCourses = () =>
  apiFetch("/students/courses", {
    method: "GET",
  });

export const getAvailableStudentCourses = (search = "") => {
  const query = search.trim();
  const params = new URLSearchParams();

  if (query) {
    params.set("search", query);
  }

  const queryString = params.toString();

  return apiFetch(
    `/students/courses/available${
      queryString ? `?${queryString}` : ""
    }`,
    {
      method: "GET",
    }
  );
};

interface RegisterStudentCoursePayload {
  course_offering_ids: (string | number)[];
}

export const registerStudentCourse = (
  payload: RegisterStudentCoursePayload
) =>
  apiFetch("/students/courses/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const registerStudentCourses = (
  payload: Record<string, any>
) =>
  apiFetch("/students/courses/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const dropStudentCourse = (
  registrationId: string | number
) =>
  apiFetch(
    `/students/courses/registrations/${encodeURIComponent(
      String(registrationId)
    )}/drop`,
    {
      method: "PATCH",
    }
  );

// --------------------
// STUDENT PROGRAMME CHANGE
// --------------------

export interface ProgramChangePayload {
  faculty_id: string | number;
  department_id: string | number;
  programme_id: string | number;
  reason: string;
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
    `/students/programme-change/${encodeURIComponent(
      String(requestId)
    )}`,
    {
      method: "GET",
    }
  );

// --------------------
// STAFF API
// --------------------

export const getStaffDashboard = () =>
  apiFetch("/staffs/dashboard", {
    method: "GET",
  });

export interface ChangeStaffPasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const changeStaffPassword = (
  payload: ChangeStaffPasswordPayload
) =>
  apiFetch("/staffs/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
export interface StaffCourseFilters {
  session_id?: string;
  semester_id?: string;
  status?: "IN_PROGRESS" | "UPCOMING" | "COMPLETED";
}

export interface StaffAcademicSession {
  id: string;
  name: string;
  is_current: boolean;
}

export interface StaffSemester {
  id: string;
  name: string;
  order: number;
}

export interface StaffCoursesResponse {
  current_session: {
    id: string;
    name: string;
  } | null;

  selected_session_id: string | null;
  selected_session_name: string;

  sessions: StaffAcademicSession[];
  semesters: StaffSemester[];

  selected_semester_id: string | null;

  summary: {
    total_courses: number;
    active_courses: number;
    total_students: number;
    upcoming_courses: number | null;
    completed_courses: number;
  };

  courses: Record<string, unknown>[];
}

export const getStaffCourses = (
  filters: StaffCourseFilters = {},
): Promise<StaffCoursesResponse> => {
  const params = new URLSearchParams();

  if (filters.session_id) {
    params.set("session_id", filters.session_id);
  }

  if (filters.semester_id) {
    params.set("semester_id", filters.semester_id);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  const query = params.toString();

  return apiFetch(
    `/staffs/courses${query ? `?${query}` : ""}`,
    { method: "GET" },
  );
};
// --------------------
// STAFF ATTENDANCE
// --------------------

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "UNMARKED";

export type AttendanceClassType = string;

export interface StaffAttendanceCourse {
  id: string;
  course_offering_id?: string;
  course_id?: string;
  course_code?: string;
  course_title?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

export interface CreateAttendanceSessionPayload {
  course_offering_id: string | number;
  date: string;
  class_type: AttendanceClassType;
}

export interface AttendanceRecordPayload {
  student_id: string | number;
  status: AttendanceStatus;
  note?: string;
}

export interface SaveAttendancePayload {
  records: AttendanceRecordPayload[];
}

export interface AttendanceReportFilters {
  start_date?: string;
  end_date?: string;
  threshold?: number;
}

/**
 * GET /api/v1/staffs/attendance/courses
 *
 * Get courses eligible for attendance.
 */
export const getStaffAttendanceCourses = () =>
  apiFetch("/staffs/attendance/courses", {
    method: "GET",
  });

/**
 * POST /api/v1/staffs/attendance/sessions
 *
 * Create a new attendance session or reopen an existing one.
 */
export const createAttendanceSession = (
  payload: CreateAttendanceSessionPayload
) =>
  apiFetch("/staffs/attendance/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/**
 * GET /api/v1/staffs/attendance/sessions/{id}
 *
 * Get an attendance session, including its student roster
 * and previously saved attendance statuses.
 */
export const getAttendanceSession = (
  attendanceSessionId: string | number
) =>
  apiFetch(
    `/staffs/attendance/sessions/${encodeURIComponent(
      String(attendanceSessionId)
    )}`,
    {
      method: "GET",
    }
  );

/**
 * PUT /api/v1/staffs/attendance/sessions/{id}
 *
 * Save or submit the complete attendance sheet.
 */
export const saveAttendanceSession = (
  attendanceSessionId: string | number,
  payload: SaveAttendancePayload
) =>
  apiFetch(
    `/staffs/attendance/sessions/${encodeURIComponent(
      String(attendanceSessionId)
    )}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

/**
 * GET /api/v1/staffs/attendance/sessions/{id}/export
 *
 * Download an attendance session as a CSV file.
 *
 * This uses fetch directly because apiFetch() parses JSON,
 * whereas an export endpoint returns a downloadable file.
 */
export const exportAttendanceSession = async (
  attendanceSessionId: string | number
): Promise<void> => {
  const path =
    `/staffs/attendance/sessions/${encodeURIComponent(
      String(attendanceSessionId)
    )}/export`;

  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleSessionExpired();
      throw new Error("Session expired");
    }

    let message = `Export failed (${response.status})`;

    try {
      const data = await response.json();
      message =
        data?.message || data?.error || data?.msg || message;
    } catch {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `attendance-${attendanceSessionId}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);
};

/**
 * POST /api/v1/staffs/attendance/sessions/{id}/import
 *
 * Import an attendance spreadsheet.
 *
 * Do not manually set Content-Type: multipart/form-data.
 * The browser sets the required boundary automatically.
 */
export const importAttendanceSession = (
  attendanceSessionId: string | number,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(
    `/staffs/attendance/sessions/${encodeURIComponent(
      String(attendanceSessionId)
    )}/import`,
    {
      method: "POST",
      body: formData,
    }
  );
};

/**
 * GET /api/v1/staffs/attendance/courses/{course_offering_id}/history
 *
 * Get attendance history for a course offering.
 */
export const getAttendanceHistory = (
  courseOfferingId: string | number
) =>
  apiFetch(
    `/staffs/attendance/courses/${encodeURIComponent(
      String(courseOfferingId)
    )}/history`,
    {
      method: "GET",
    }
  );

/**
 * GET /api/v1/staffs/attendance/courses/{course_offering_id}/student-report
 *
 * Get a student attendance report, optionally filtered by dates
 * and attendance threshold.
 */
export const getAttendanceStudentReport = (
  courseOfferingId: string | number,
  filters: AttendanceReportFilters = {}
) => {
  const params = new URLSearchParams();

  if (filters.start_date) {
    params.set("start_date", filters.start_date);
  }

  if (filters.end_date) {
    params.set("end_date", filters.end_date);
  }

  if (filters.threshold !== undefined) {
    params.set("threshold", String(filters.threshold));
  }

  const query = params.toString();

  return apiFetch(
    `/staffs/attendance/courses/${encodeURIComponent(
      String(courseOfferingId)
    )}/student-report${query ? `?${query}` : ""}`,
    {
      method: "GET",
    }
  );
};

/**
 * GET /api/v1/staffs/attendance/courses/{course_offering_id}/student-report/export
 *
 * Download a student attendance report as a CSV file.
 */
export const exportAttendanceStudentReport = async (
  courseOfferingId: string | number,
  filters: AttendanceReportFilters = {}
): Promise<void> => {
  const params = new URLSearchParams();

  if (filters.start_date) {
    params.set("start_date", filters.start_date);
  }

  if (filters.end_date) {
    params.set("end_date", filters.end_date);
  }

  if (filters.threshold !== undefined) {
    params.set("threshold", String(filters.threshold));
  }

  const query = params.toString();

  const path =
    `/staffs/attendance/courses/${encodeURIComponent(
      String(courseOfferingId)
    )}/student-report/export${query ? `?${query}` : ""}`;

  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleSessionExpired();
      throw new Error("Session expired");
    }

    let message = `Report export failed (${response.status})`;

    try {
      const data = await response.json();
      message =
        data?.message || data?.error || data?.msg || message;
    } catch {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `attendance-report-${courseOfferingId}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);
};