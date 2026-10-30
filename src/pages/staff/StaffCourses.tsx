import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Search,
  Users,
  ClipboardCheck,
  FileText,
  MoreHorizontal,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";
import { getStaffCourses } from "../../lib/api";

type CourseStatus = "IN_PROGRESS" | "UPCOMING" | "COMPLETED";

interface AcademicSession {
  id: string;
  name: string;
  is_current?: boolean;
}

interface Semester {
  id: string;
  name: string;
  order?: number;
}

interface StaffCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  semester: string;
  semesterId: string;
  academicSession: string;
  students: number;
  credits: number;
  progress: number;
  schedule: string;
  venue: string;
  status: CourseStatus;
  raw: Record<string, unknown>;
}

interface CoursesSummary {
  total_courses: number;
  active_courses: number;
  total_students: number;
  upcoming_courses: number | null;
  completed_courses: number;
}

interface CoursesResponse {
  current_session: { id: string; name: string } | null;
  selected_session_id: string | null;
  selected_session_name?: string;
  selected_semester_id?: string | null;
  sessions: AcademicSession[];
  semesters: Semester[];
  summary: CoursesSummary;
  courses: Record<string, unknown>[];
}

const EMPTY_SUMMARY: CoursesSummary = {
  total_courses: 0,
  active_courses: 0,
  total_students: 0,
  upcoming_courses: 0,
  completed_courses: 0,
};

const STATUS_STYLES: Record<
  CourseStatus,
  { label: string; className: string }
> = {
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  UPCOMING: {
    label: "Upcoming",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
  },
};

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Completed", value: "COMPLETED" },
];

function getValue(
  object: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of keys) {
    const value = object[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function getText(
  object: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  const value = getValue(object, keys);

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const nested = value as Record<string, unknown>;

    return getText(
      nested,
      ["name", "title", "code", "label"],
      fallback,
    );
  }

  return fallback;
}

function getNumber(
  object: Record<string, unknown>,
  keys: string[],
  fallback = 0,
): number {
  const value = getValue(object, keys);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeStatus(value: unknown): CourseStatus {
  const status = String(value ?? "")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");

  if (status === "UPCOMING") return "UPCOMING";
  if (status === "COMPLETED") return "COMPLETED";

  return "IN_PROGRESS";
}

function normalizeCourse(
  item: Record<string, unknown>,
  index: number,
): StaffCourse {
  const semesterObject = getValue(item, [
    "semester",
    "academic_semester",
  ]);

  const semesterData =
    semesterObject &&
    typeof semesterObject === "object" &&
    !Array.isArray(semesterObject)
      ? (semesterObject as Record<string, unknown>)
      : {};

  const sessionObject = getValue(item, [
    "academic_session",
    "session",
  ]);

  const sessionData =
    sessionObject &&
    typeof sessionObject === "object" &&
    !Array.isArray(sessionObject)
      ? (sessionObject as Record<string, unknown>)
      : {};

  const departmentObject = getValue(item, [
    "department",
    "academic_department",
  ]);

  const departmentData =
    departmentObject &&
    typeof departmentObject === "object" &&
    !Array.isArray(departmentObject)
      ? (departmentObject as Record<string, unknown>)
      : {};

  const offeringObject = getValue(item, [
    "course_offering",
    "course",
  ]);

  const courseData =
    offeringObject &&
    typeof offeringObject === "object" &&
    !Array.isArray(offeringObject)
      ? (offeringObject as Record<string, unknown>)
      : {};

  const code =
    getText(item, [
      "course_code",
      "code",
      "courseCode",
    ]) ||
    getText(courseData, ["course_code", "code"], "COURSE");

  const title =
    getText(item, [
      "course_title",
      "course_name",
      "title",
      "name",
    ]) ||
    getText(courseData, ["title", "name", "course_title"], "Untitled Course");

  const semester =
    getText(item, ["semester_name"]) ||
    getText(semesterData, ["name", "title"]) ||
    getText(item, ["semester"], "Semester not specified");

  const department =
    getText(item, ["department_name"]) ||
    getText(departmentData, ["name", "title"]) ||
    getText(item, ["faculty_name"]) ||
    "Department not specified";

  const academicSession =
    getText(item, ["session_name", "academic_session_name"]) ||
    getText(sessionData, ["name", "title"]) ||
    "Academic session";

  const rawStatus = getValue(item, [
    "status",
    "course_status",
    "offering_status",
  ]);

  return {
    id: getText(item, [
      "id",
      "course_offering_id",
      "offering_id",
    ], `${code}-${index}`),

    code,
    title,
    department,
    semester,
    semesterId:
      getText(item, ["semester_id"]) ||
      getText(semesterData, ["id"]),

    academicSession,

    students: getNumber(item, [
      "student_count",
      "total_students",
      "students_count",
      "enrolled_students",
    ]),

    credits: getNumber(item, [
      "credit_units",
      "credits",
      "units",
      "course_units",
    ]),

    progress: Math.min(
      100,
      Math.max(0, getNumber(item, ["progress", "progress_percentage"])),
    ),

    schedule:
      getText(item, [
        "schedule",
        "class_schedule",
        "schedule_text",
      ]) || "Schedule not available",

    venue:
      getText(item, [
        "venue",
        "classroom",
        "location",
        "room",
      ]) || "Venue not specified",

    status: normalizeStatus(rawStatus),
    raw: item,
  };
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-800">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: StaffCourse }) {
  const status = STATUS_STYLES[course.status];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
            <BookOpen size={23} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {course.code}
            </p>
            <h3 className="mt-1 break-words text-base font-bold text-slate-900">
              {course.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          aria-label={`More options for ${course.code}`}
          title="More options"
          className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {course.department}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Users size={15} />
            <span className="text-xs">Students</span>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {course.students}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <GraduationCap size={15} />
            <span className="text-xs">Credit units</span>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {course.credits || "—"}
          </p>
        </div>
      </div>

      {course.status === "IN_PROGRESS" && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              Course progress
            </span>
            <span className="font-semibold text-slate-700">
              {course.progress}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={course.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div
              className="h-full rounded-full bg-blue-700 transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-start gap-3 text-sm text-slate-600">
          <CalendarDays
            size={17}
            className="mt-0.5 shrink-0 text-slate-400"
          />
          <span>{course.semester}</span>
        </div>

        <div className="flex items-start gap-3 text-sm text-slate-600">
          <Clock3
            size={17}
            className="mt-0.5 shrink-0 text-slate-400"
          />
          <span>{course.schedule}</span>
        </div>

        <div className="flex items-start gap-3 text-sm text-slate-600">
          <GraduationCap
            size={17}
            className="mt-0.5 shrink-0 text-slate-400"
          />
          <span>{course.venue}</span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        <Link
          to={`/staff/attendance?course=${encodeURIComponent(course.code)}&course_id=${encodeURIComponent(course.id)}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ClipboardCheck size={16} />
          Attendance
        </Link>

        <Link
          to={`/staff/results?course=${encodeURIComponent(course.code)}&course_id=${encodeURIComponent(course.id)}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          <FileText size={16} />
          Results
        </Link>
      </div>
    </article>
  );
}

export default function StaffCourses() {
  const [data, setData] = useState<CoursesResponse | null>(null);

  const [loading, setLoading] = useState(true);
  // const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [sessionId, setSessionId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  // const loadCourses = useCallback(async () => {
  //   setError("");

  //   try {
  //     const response = await getStaffCourses({
  //       session_id: sessionId || undefined,
  //       semester_id: semesterId || undefined,
  //       status:
  //         statusFilter === "All"
  //           ? undefined
  //           : (statusFilter as CourseStatus),
  //     });

  //     // Support either a direct response or a standard { data: ... } wrapper.
  //     const payload = (
  //       response as unknown as {
  //         data?: CoursesResponse;
  //       } & Partial<CoursesResponse>
  //     ).data ?? (response as unknown as CoursesResponse);

  //     setData(payload);

  //     if (!sessionId) {
  //       const defaultSession =
  //         payload.selected_session_id ??
  //         payload.current_session?.id ??
  //         "";

  //       if (defaultSession) setSessionId(defaultSession);
  //     }

  //     if (!semesterId && payload.selected_semester_id) {
  //       setSemesterId(payload.selected_semester_id);
  //     }
  //   } catch (err) {
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "Unable to load your courses. Please try again.",
  //     );
  //   }
  // }, [sessionId, semesterId, statusFilter]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getStaffCourses({
          session_id: sessionId || undefined,
          semester_id: semesterId || undefined,
          status:
            statusFilter === "All"
              ? undefined
              : (statusFilter as CourseStatus),
        });

        if (cancelled) return;

        const payload = (
          response as unknown as {
            data?: CoursesResponse;
          } & Partial<CoursesResponse>
        ).data ?? (response as unknown as CoursesResponse);

        setData(payload);

        if (!sessionId) {
          const defaultSession =
            payload.selected_session_id ??
            payload.current_session?.id ??
            "";

          if (defaultSession) setSessionId(defaultSession);
        }

        if (!semesterId && payload.selected_semester_id) {
          setSemesterId(payload.selected_semester_id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your courses. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [sessionId, semesterId, statusFilter, retryKey]);

  const courses = useMemo(
    () =>
      (data?.courses ?? []).map((course, index) =>
        normalizeCourse(course, index),
      ),
    [data?.courses],
  );

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      if (!query) return true;

      return [
        course.code,
        course.title,
        course.department,
        course.semester,
        course.academicSession,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [courses, searchTerm]);

  const summary = data?.summary ?? EMPTY_SUMMARY;
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <StaffSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <StaffHeader
          staffName="Edwin Adeyi-Samuel"
          staffRole="Lecturer"
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">
            {/* Page heading */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-800">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Selected academic session
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    {data?.selected_session_name ||
                      data?.sessions.find(
                        (session) => session.id === sessionId,
                      )?.name ||
                      data?.current_session?.name ||
                      "Select an academic session"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  aria-label="Academic session"
                  value={sessionId}
                  onChange={(event) => {
                    setSessionId(event.target.value);
                    setSemesterId("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select session</option>
                  {(data?.sessions ?? []).map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name}
                      {session.is_current ? " (Current)" : ""}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Semester"
                  value={semesterId}
                  onChange={(event) =>
                    setSemesterId(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Semesters</option>
                  {(data?.semesters ?? []).map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Courses"
                value={summary.total_courses}
                subtitle="Courses in this selection"
                icon={BookOpen}
              />

              <StatCard
                title="Active Courses"
                value={summary.active_courses}
                subtitle="Currently in progress"
                icon={GraduationCap}
              />

              <StatCard
                title="Students"
                value={summary.total_students}
                subtitle="Students across your courses"
                icon={Users}
              />

              <StatCard
                title="Upcoming Courses"
                value={summary.upcoming_courses ?? "—"}
                subtitle="Scheduled to begin"
                icon={CalendarDays}
              />
            </div>

            {/* Search and status filters */}
            <section>
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Course assignments
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Browse and manage your assigned courses.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 sm:min-w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Search courses..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <select
                    aria-label="Course status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() => setRetryKey((value) => value + 1)}
                    className="self-start rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold hover:bg-red-100 sm:self-auto"
                  >
                    Try again
                  </button>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="h-5 w-24 rounded bg-slate-200" />
                      <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                      <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                      <div className="mt-6 h-20 rounded-xl bg-slate-100" />
                      <div className="mt-5 h-10 rounded-xl bg-slate-100" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && filteredCourses.length > 0 && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Showing{" "}
                      <span className="font-semibold text-slate-900">
                        {filteredCourses.length}
                      </span>{" "}
                      {filteredCourses.length === 1
                        ? "course"
                        : "courses"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                      />
                    ))}
                  </div>
                </>
              )}

              {!loading && !error && filteredCourses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <BookOpen size={26} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {courses.length === 0
                      ? "No courses assigned"
                      : "No matching courses"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {courses.length === 0
                      ? "There are no courses to display for the selected academic session and filters."
                      : "Try another search term or change the status filter to find your courses."}
                  </p>

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="mt-5 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </section>

            <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
              EduNova Staff Portal
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}