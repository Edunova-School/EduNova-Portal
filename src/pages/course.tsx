
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  BookOpen,
  Layers,
  CheckSquare,
  ListChecks,
  ShieldCheck,
  Clock,
  MapPin,
  X,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../components/sidebar";
import Header from "../components/header";

import {
  getStudentCourses,
  getAvailableStudentCourses,
  getStudentDashboard,
  registerStudentCourse,
  dropStudentCourse,
} from "../lib/api";

type CourseId = string | number;
type CourseTab = "registered" | "available";

interface CourseRecord {
  id?: CourseId;
  course_id?: CourseId;
  registration_id?: CourseId;

  code?: string;
  course_code?: string;
  title?: string;
  course_title?: string;

  credit_units?: number | string | null;
  units?: number | string | null;

  course_type?: string;
  type?: string;
  category?: string;

  status?: string;
  registration_status?: string;

  level?: number | string;
  semester?: number | string;
  schedule?: string;
  venue?: string;

  course?: {
    id?: CourseId;
    code?: string;
    course_code?: string;
    title?: string;
    course_title?: string;
    credit_units?: number | string | null;
    units?: number | string | null;
  };

  registration?: {
    id?: CourseId;
  };
}

interface CourseListData {
  courses?: CourseRecord[];
}

interface CourseListResponse {
  data?: CourseRecord[] | CourseListData;
  courses?: CourseRecord[];
}

interface DashboardData {
  academics?: {
    academic_session?: string;
    semester?: string;
    level?: number | string;
    programme_name?: string;
    department_name?: string;
    faculty_name?: string;
    academic_adviser?: string | null;
  };

  student?: {
    first_name?: string;
    last_name?: string;
    matric_number?: string;
    email?: string;
    status?: string;
  };

  course_summary?: {
    registered_courses?: number;
    total_credit_units?: number;
  };

  announcements?: {
    items?: unknown[];
    unread_count?: number;
  };

  examination?: {
    status?: string | null;
    message?: string | null;
  };

  finance?: {
    outstanding_amount?: number;
    payment_status?: string;
  };

  todays_classes?: unknown[];
  registration_status?: string;
  registrationStatus?: string;
}

interface DashboardResponse {
  data?: DashboardData;
  success?: boolean;
  message?: string;
}

interface SummaryCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

const getArray = (result: unknown): CourseRecord[] => {
  if (!result || typeof result !== "object") {
    return [];
  }

  const response = result as CourseListResponse;

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.courses)
  ) {
    return response.data.courses;
  }

  if (Array.isArray(response.courses)) {
    return response.courses;
  }

  return [];
};

const getCourseCode = (course: CourseRecord): string =>
  course.code ??
  course.course_code ??
  course.course?.code ??
  course.course?.course_code ??
  "N/A";

const getCourseTitle = (course: CourseRecord): string =>
  course.title ??
  course.course_title ??
  course.course?.title ??
  course.course?.course_title ??
  "Untitled course";

const getUnits = (course: CourseRecord): number => {
  const value =
    course.credit_units ??
    course.units ??
    course.course?.credit_units ??
    course.course?.units ??
    0;

  const units = Number(value);
  return Number.isFinite(units) ? units : 0;
};

const getRegistrationId = (
  course: CourseRecord
): CourseId | undefined =>
  course.registration_id ??
  course.registration?.id ??
  course.id;

const getCourseType = (course: CourseRecord): string =>
  course.course_type ??
  course.type ??
  course.category ??
  "Course";

const getStatus = (course: CourseRecord): string =>
  course.registration_status ??
  course.status ??
  "Registered";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : "An unexpected error occurred.";

const getDisplayValue = (
  value: string | number | null | undefined,
  fallback = "Not provided"
): string =>
  value !== undefined && value !== null && value !== ""
    ? String(value)
    : fallback;

export default function Course() {
  const [registeredCourses, setRegisteredCourses] = useState<
    CourseRecord[]
  >([]);

  const [availableCourses, setAvailableCourses] = useState<
    CourseRecord[]
  >([]);

  const [dashboard, setDashboard] = useState<DashboardData | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CourseTab>("registered");
  const [selectedCourse, setSelectedCourse] =
    useState<CourseRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [registeredResult, availableResult, dashboardResult] =
        await Promise.all([
          getStudentCourses(),
          getAvailableStudentCourses(),
          getStudentDashboard(),
        ]);

      const nextRegistered = getArray(registeredResult);
      const nextAvailable = getArray(availableResult);

      const result = dashboardResult as DashboardResponse;

      // Update the page only after all three requests succeed.
      setRegisteredCourses(nextRegistered);
      setAvailableCourses(nextAvailable);
      setDashboard(result?.data ?? null);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const courses =
    activeTab === "registered"
      ? registeredCourses
      : availableCourses;

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return courses;

    return courses.filter(
      (course) =>
        getCourseCode(course).toLowerCase().includes(query) ||
        getCourseTitle(course).toLowerCase().includes(query)
    );
  }, [courses, search]);

  const totalUnits = registeredCourses.reduce(
    (total, course) => total + getUnits(course),
    0
  );

  const coreCount = registeredCourses.filter((course) =>
    /core|compulsory/i.test(getCourseType(course))
  ).length;

  const electiveCount = registeredCourses.filter((course) =>
    /elective/i.test(getCourseType(course))
  ).length;

  const summaryCards: SummaryCard[] = [
    {
      label: "Registered Courses",
      value: registeredCourses.length,
      icon: BookOpen,
    },
    {
      label: "Total Credit Units",
      value: `${totalUnits} Units`,
      icon: Layers,
    },
    {
      label: "Compulsory Courses",
      value: coreCount,
      icon: CheckSquare,
    },
    {
      label: "Elective Courses",
      value: electiveCount,
      icon: ListChecks,
    },
  ];

  async function handleRegister(course: CourseRecord): Promise<void> {
    const courseId =
      course.course_id ??
      course.course?.id ??
      course.id;

    if (
      courseId === undefined ||
      courseId === null ||
      courseId === ""
    ) {
      setError(
        "This course has no identifiable course ID. Check the available-courses API response."
      );
      return;
    }

    setActionId(String(courseId));
    setError("");
    setNotice("");

    try {
      await registerStudentCourse({ course_id: courseId });

      setNotice(`${getCourseCode(course)} registered successfully.`);
      setSelectedCourse(null);

      await loadCourses();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  async function handleDrop(course: CourseRecord): Promise<void> {
    const registrationId = getRegistrationId(course);

    if (
      registrationId === undefined ||
      registrationId === null ||
      registrationId === ""
    ) {
      setError(
        "This registered course has no registration ID. Check the courses API response."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to drop ${getCourseCode(course)} — ${getCourseTitle(course)}?`
    );

    if (!confirmed) return;

    setActionId(String(registrationId));
    setError("");
    setNotice("");

    try {
      await dropStudentCourse(registrationId);

      setNotice(`${getCourseCode(course)} dropped successfully.`);
      setSelectedCourse(null);

      await loadCourses();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  const academics = dashboard?.academics ?? {};

  const session =
    academics.academic_session ?? "Current Academic Session";

  const semester = academics.semester ?? "";

  const registrationStatus =
    dashboard?.registration_status ??
    dashboard?.registrationStatus ??
    "Check registration status";

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      <main className="min-h-screen min-w-0 flex-1 bg-[#F6F6F2]">
        <Header />

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/40">
                {session}
                {semester ? ` · ${semester}` : ""}
              </span>

              <h1 className="mt-2 font-serif text-2xl font-semibold text-black md:text-3xl">
                Course Management
              </h1>

              <p className="mt-2 max-w-xl text-sm text-black/55">
                View registered courses, explore available courses,
                and manage your course registration.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadCourses()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm hover:bg-black/[0.03] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <span>{notice}</span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A]/5">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <p className="font-serif text-xl font-semibold leading-none text-black">
                      {card.value}
                    </p>

                    <p className="mt-1.5 text-xs text-black/50">
                      {card.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="rounded-2xl border border-black/5 bg-white p-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex w-fit gap-1 rounded-xl bg-black/[0.035] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("registered")}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    activeTab === "registered"
                      ? "bg-white font-medium text-[#1E3A8A] shadow-sm"
                      : "text-black/55"
                  }`}
                >
                  Registered ({registeredCourses.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("available")}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    activeTab === "available"
                      ? "bg-white font-medium text-[#1E3A8A] shadow-sm"
                      : "text-black/55"
                  }`}
                >
                  Available ({availableCourses.length})
                </button>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search code or course title"
                  className="w-full rounded-lg border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.015]">
                    {[
                      "Code",
                      "Course Title",
                      "Units",
                      "Type",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wide text-black/40"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {!loading &&
                    filteredCourses.map((course, index) => {
                      const code = getCourseCode(course);
                      const title = getCourseTitle(course);
                      const type = getCourseType(course);
                      const status = getStatus(course);

                      const registrationId = getRegistrationId(course);

                      const courseId =
                        course.course_id ??
                        course.course?.id ??
                        course.id;

                      const rowKey =
                        registrationId ??
                        courseId ??
                        `${code}-${index}`;

                      return (
                        <tr
                          key={rowKey}
                          className="border-b border-black/5 last:border-0 hover:bg-[#1E3A8A]/[0.03]"
                        >
                          <td className="px-4 py-4 font-mono text-xs text-black/60">
                            {code}
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedCourse(course)}
                              className="text-left font-medium text-black hover:text-[#1E3A8A]"
                            >
                              {title}
                            </button>
                          </td>

                          <td className="px-4 py-4 text-black/60">
                            {getUnits(course)}
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-[#1E3A8A]/10 px-2.5 py-1 text-xs text-[#1E3A8A]">
                              {type}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-xs text-black/60">
                              {status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {activeTab === "available" ? (
                              <button
                                type="button"
                                onClick={() => void handleRegister(course)}
                                disabled={actionId !== null}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#14263F] px-3 py-2 text-xs text-white hover:bg-[#1E3A8A] disabled:opacity-50"
                              >
                                <Plus size={14} />
                                {actionId === String(courseId)
                                  ? "Registering..."
                                  : "Register"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => void handleDrop(course)}
                                disabled={actionId !== null}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 size={14} />
                                {actionId === String(registrationId)
                                  ? "Dropping..."
                                  : "Drop"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                  {!loading && filteredCourses.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-black/40"
                      >
                        {search
                          ? `No courses match "${search}".`
                          : activeTab === "registered"
                            ? "You have no registered courses yet."
                            : "No courses are currently available."}
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-black/45"
                      >
                        Loading courses...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-black">
                Credit Summary
              </h2>

              <div className="mb-3 flex justify-between text-sm">
                <span className="text-black/55">Registered courses</span>
                <span className="font-medium">
                  {registeredCourses.length}
                </span>
              </div>

              <div className="mb-3 flex justify-between text-sm">
                <span className="text-black/55">Total credit units</span>
                <span className="font-medium">{totalUnits}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/55">Academic session</span>
                <span className="text-right font-medium">{session}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-black">
                Registration Overview
              </h2>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A]/5">
                  <ShieldCheck
                    size={20}
                    className="text-[#1E3A8A]"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-black">
                    {registrationStatus}
                  </p>

                  <p className="mt-1 text-xs text-black/50">
                    Registration status is shown when the API provides it.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close course details"
            onClick={() => setSelectedCourse(null)}
            className="absolute inset-0 cursor-default bg-black/40"
          />

          <aside className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-[#14263F] px-6 py-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#B8901F]">
                  {getCourseCode(selectedCourse)}
                </p>

                <h2 className="mt-1 font-serif text-xl font-semibold text-white">
                  {getCourseTitle(selectedCourse)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close"
                className="rounded-full p-2 text-white/70 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Credit units
                  </p>
                  <p className="text-sm font-medium">
                    {getUnits(selectedCourse)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Course type
                  </p>
                  <p className="text-sm font-medium">
                    {getCourseType(selectedCourse)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Semester
                  </p>
                  <p className="text-sm font-medium">
                    {getDisplayValue(selectedCourse.semester)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Level
                  </p>
                  <p className="text-sm font-medium">
                    {getDisplayValue(selectedCourse.level)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-black/5 pt-4">
                <div className="flex gap-3">
                  <Clock
                    className="mt-0.5 shrink-0 text-[#1E3A8A]"
                    size={16}
                  />

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                      Schedule
                    </p>
                    <p className="text-sm text-black/70">
                      {selectedCourse.schedule ||
                        "Not provided by the API"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 shrink-0 text-[#1E3A8A]"
                    size={16}
                  />

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                      Venue
                    </p>
                    <p className="text-sm text-black/70">
                      {selectedCourse.venue ||
                        "Not provided by the API"}
                    </p>
                  </div>
                </div>
              </div>

              {activeTab === "available" ? (
                <button
                  type="button"
                  onClick={() => void handleRegister(selectedCourse)}
                  disabled={actionId !== null}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14263F] px-4 py-3 text-sm text-white disabled:opacity-50"
                >
                  <Plus size={16} />
                  Register for this course
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleDrop(selectedCourse)}
                  disabled={actionId !== null}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Drop this course
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
