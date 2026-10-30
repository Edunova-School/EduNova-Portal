import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Users,
  Clock3,
  MapPin,
  Megaphone,
  CalendarCheck,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";
import { getStaffDashboard } from "../../lib/api";

interface StaffProfile {
  id: string;
  staff_number?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  job_title?: string;
  department?: string | null;
  faculty?: string | null;
}

interface AcademicSession {
  id?: string;
  name?: string;
}

interface ScheduleItem {
  id?: string;
  course_code?: string;
  course_title?: string;
  course_name?: string;
  title?: string;
  start_time?: string;
  end_time?: string;
  time?: string;
  venue?: string;
  location?: string;
  room?: string;
  level?: string | number;
  day?: string;
  status?: string;
}

interface StaffDashboardData {
  staff?: StaffProfile;
  academic_session?: AcademicSession | null;
  summary?: {
    assigned_courses?: number;
    students_taught?: number;
    classes_today?: number;
  };
  today?: {
    date?: string;
    day_of_week?: string;
    schedule?: ScheduleItem[];
  };
  announcements?: Array<{
    id?: string;
    title?: string;
    message?: string;
    content?: string;
    created_at?: string;
  }>;
  generated_at?: string;
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time?: string) {
  if (!time) return "";

  // Handles times such as "09:00:00" without timezone conversion.
  const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (match) {
    const hour = Number(match[1]);
    const minute = match[2];
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
  }

  return time;
}

function getScheduleTime(item: ScheduleItem) {
  if (item.time) return item.time;

  const start = formatTime(item.start_time);
  const end = formatTime(item.end_time);

  if (start && end) return `${start} – ${end}`;

  return start || end || "Time not specified";
}

export default function StaffDashboard() {
  const [dashboard, setDashboard] =
    useState<StaffDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  let cancelled = false;

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await getStaffDashboard();
      const result = response?.data ?? response;
if (!cancelled) {
  setDashboard(result as StaffDashboardData);
}
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your staff dashboard."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadDashboard();

  return () => {
    cancelled = true;
  };
}, []);

  const staff = dashboard?.staff;
  const summary = dashboard?.summary;
  const session = dashboard?.academic_session;
  const schedule = dashboard?.today?.schedule ?? [];
  const announcements = dashboard?.announcements ?? [];

  const staffName =
    staff?.full_name ||
    `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim() ||
    "Staff Member";

  // const today = dashboard?.today?.date
  //   ? formatDate(dashboard.today.date)
  //   : formatDate(new Date().toISOString());

  const stats = [
    {
      label: "Assigned Courses",
      value: summary?.assigned_courses ?? 0,
      icon: BookOpen,
    },
    {
      label: "Students Taught",
      value: summary?.students_taught ?? 0,
      icon: Users,
    },
    {
      label: "Classes Today",
      value: summary?.classes_today ?? schedule.length,
      icon: CalendarCheck,
    },
  ];

  return (
    <div className=" overflow-hidden bg-slate-50 text-slate-900">
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-hidden lg:block">
            <StaffSidebar />
          </aside>

      <div className="ml-0 flex h-full min-w-0 flex-col lg:ml-64">
        <StaffHeader
          staffName={staffName}
          staffRole={staff?.job_title || "Staff"}
        />

        <main className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
          {/* Loading state */}
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
              <p className="text-sm text-slate-600">
                Loading your staff dashboard...
              </p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <h2 className="font-semibold text-red-800">
                Unable to load dashboard
              </h2>

              <p className="mt-2 text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Dashboard content */}
          {!loading && !error && dashboard && (
            dashboard?.staff ? (
            <>
              {/* Staff profile summary */}
              {/* <section className="mb-6 rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                      <GraduationCap size={18} />
                      Staff profile
                    </div>

                    <h2 className="text-xl font-semibold">
                      {staffName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-300">
                      {staff?.job_title || "Staff"}
                      {staff?.staff_number
                        ? ` · ${staff.staff_number}`
                        : ""}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-400">Department: </span>
                      {staff?.department || "Not assigned"}
                    </p>

                    <p>
                      <span className="text-slate-400">Faculty: </span>
                      {staff?.faculty || "Not assigned"}
                    </p>

                    <p>
                      <span className="text-slate-400">Email: </span>
                      {staff?.email || "Not available"}
                    </p>
                  </div>
                </div>
              </section> */}
                        
              {/* Academic session */}
              <section className="mb-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="rounded-lg bg-white p-3 text-blue-700">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-600">
                    Current Academic Session
                  </p>

                  <p className="font-semibold text-slate-900">
                    {session?.name || "No active academic session"}
                  </p>
                </div>
              </section>

              {/* Summary statistics */}
              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          {stat.label}
                        </p>

                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                          <Icon size={20} />
                        </div>
                      </div>

                      <p className="text-3xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </section>

              {/* Today's schedule */}
              <section className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Today's Classes
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your teaching schedule for today
                    </p>
                  </div>

                  <Clock3 size={21} className="text-blue-700" />
                </div>

                {schedule.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {schedule.map((item, index) => (
                      <div
                        key={item.id || `${item.course_code || item.title || "class"}-${index}`}
                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 rounded-lg bg-blue-50 p-2 text-blue-700">
                            <BookOpen size={20} />
                          </div>

                          <div>
                            <h3 className="font-medium text-slate-900">
                              {item.course_title ||
                                item.course_name ||
                                item.title ||
                                "Scheduled Class"}
                            </h3>

                            {item.course_code && (
                              <p className="mt-1 text-sm text-slate-500">
                                {item.course_code}
                              </p>
                            )}

                            {item.level != null && (
                              <p className="mt-1 text-sm text-slate-500">
                                Level {item.level}
                              </p>
                            )}

                            <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                              <MapPin size={15} />
                              {item.venue ||
                                item.location ||
                                item.room ||
                                "Venue not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-blue-700 sm:justify-end">
                          <Clock3 size={16} />
                          {getScheduleTime(item)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <CalendarCheck
                      size={32}
                      className="mx-auto mb-3 text-slate-400"
                    />

                    <p className="font-medium text-slate-700">
                      No classes scheduled for today
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your schedule will appear here when classes are assigned.
                    </p>
                  </div>
                )}
              </section>

              {/* Announcements */}
              <section className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Announcements
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Important academic updates
                    </p>
                  </div>

                  <Megaphone size={21} className="text-blue-700" />
                </div>

                {announcements.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {announcements.map((announcement, index) => (
                      <div
                        key={announcement.id || index}
                        className="p-5"
                      >
                        <h3 className="font-medium text-slate-900">
                          {announcement.title || "Announcement"}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {announcement.message ||
                            announcement.content ||
                            "No announcement details provided."}
                        </p>

                        {announcement.created_at && (
                          <p className="mt-2 text-xs text-slate-400">
                            {formatDate(announcement.created_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No announcements available.
                  </div>
                )}
              </section>
            </>
            ) : (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
      <h2 className="font-semibold text-amber-900">
        Dashboard data is missing
      </h2>
      <p className="mt-2 text-sm text-amber-800">
        The request finished, but the staff profile could not be found
        in the extracted response.
      </p>
    </div>
  )
          )}
        </main>
      </div>
    </div>
  );
}