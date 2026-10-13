
import { useQuery } from "@tanstack/react-query";
import {
  Megaphone,
  Clock,
  CheckCircle2,
  Download,
  BookOpenCheck,
  FileText,
  Wallet,
  CalendarDays,
  FileSignature,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { getStudentDashboard } from "../lib/api";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import ed from "../assets/ed.webp";

const quickActions = [
  { label: "Register Courses", icon: BookOpenCheck },
  { label: "View Results", icon: FileText },
  { label: "Pay Fees", icon: Wallet },
  { label: "Download Exam Card", icon: Download },
  { label: "View Timetable", icon: CalendarDays },
  { label: "Request Transcript", icon: FileSignature },
];
interface Announcement {
  id?: string | number;
  title?: string;
  text?: string;
  date?: string;
}

interface TodayClass {
  id?: string | number;
  time?: string;
  start_time?: string;
  title?: string;
  course_title?: string;
  code?: string;
  course_code?: string;
}
export default function Dashboard() {
  const {
  data: dashboard,
  isPending,
  isFetching,
  error,
  refetch,
} = useQuery({
  queryKey: ["studentDashboard"],

  queryFn: async () => {
    const response = await getStudentDashboard();
    const dashboardData = response?.data ?? response;

    
    return dashboardData;
  },

  select: (result: any) => result?.data ?? result,

  staleTime: 60_000,
  refetchOnWindowFocus: false,
  retry: 1,
});

  // Show the full-page loader only before the first successful response.
  // Background refetches must not replace the existing dashboard.
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F6F6F2] flex items-center justify-center">
        <p className="text-sm text-black/50">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // If the initial request fails, show an error and allow retrying.
  if (error && !dashboard) {
    return (
      <div className="min-h-screen bg-[#F6F6F2] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-md w-full text-center">
          <p className="text-sm text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load your dashboard."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="bg-[#14263F] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1E3A8A] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Safely handle optional fields from the API.
  const academics = dashboard?.academics ?? {};
  const student = dashboard?.student ?? {};
  const announcementsData = dashboard?.announcements ?? {};
  const examination = dashboard?.examination ?? {};
  const finance = dashboard?.finance ?? {};
  const courseSummary = dashboard?.course_summary ?? {};
  const announcements: Announcement[] = Array.isArray(
  announcementsData.items
)
  ? announcementsData.items
  : [];

  const todaysClasses: TodayClass[] = Array.isArray(
  dashboard?.todays_classes
)
  ? dashboard.todays_classes
  : [];

  const studentInfo = [
    {
      label: "Programme",
      value: academics.programme_name ?? "Not available",
    },
    {
      label: "Faculty",
      value: academics.faculty_name ?? "Not available",
    },
    {
      label: "Level",
      value:
        academics.level != null
          ? `${academics.level} Level`
          : "Not available",
    },
    {
      label: "Academic Adviser",
      value: academics.academic_adviser ?? "Not assigned",
    },
  ];

  const studentName =
    [student.first_name, student.last_name]
      .filter(Boolean)
      .join(" ") || "Student";

  const studentStatus = student.status ?? "ACTIVE";

  return (
    <div className="min-h-screen bg-[#F6F6F2]">
      <div className="flex">
        <aside className="hidden lg:block w-72">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <Header />

          <main className="px-4 md:px-8 py-6 max-w-6xl mx-auto flex flex-col gap-6">
            {/* Student profile */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A]">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#B8901F]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1E3A8A]/30 rounded-full blur-3xl" />

              <div className="relative px-6 md:px-8 py-8 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={student.passport_url || ed}
                    alt={studentName}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = ed;
                    }}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover ring-4 ring-white/10"
                  />

                  <span className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full border-2 border-[#14263F]">
                    {studentStatus}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-1">
                    {academics.academic_session ??
                      "Academic session unavailable"}
                    {" · "}
                    {academics.semester ?? "Semester unavailable"}
                  </p>

                  <h1 className="font-serif text-white text-2xl md:text-3xl font-semibold">
                    {studentName}
                  </h1>

                  <p className="font-mono text-white/50 text-sm mt-1 break-words">
                    {student.matric_number ??
                      "Matric number unavailable"}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/10">
                    {studentInfo.map((item) => (
                      <div key={item.label}>
                        <p className="font-mono text-[10px] tracking-wide uppercase text-white/35 mb-1">
                          {item.label}
                        </p>
                        <p className="font-sans text-sm text-white/85 font-medium leading-snug">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Show a subtle message during background refetches.
                The existing dashboard remains visible. */}
            {isFetching && (
              <p
                role="status"
                className="text-xs text-black/40 text-right"
              >
                Updating dashboard...
              </p>
            )}

            {/* Announcements and today's classes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#B8901F]/10 flex items-center justify-center">
                      <Megaphone
                        size={16}
                        strokeWidth={1.75}
                        className="text-[#B8901F]"
                      />
                    </div>

                    <h2 className="font-serif text-lg font-semibold text-black">
                      Announcements
                    </h2>
                  </div>

                  <span className="text-xs font-medium text-[#B8901F] bg-[#B8901F]/10 px-2.5 py-1 rounded-full">
                    {announcementsData.unread_count ??
                      announcements.length}{" "}
                    new
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {announcements.length > 0 ? (
                    announcements.map((item, index) => (
                      <div
                        key={item.id ?? index}
                        className="flex items-start justify-between gap-3 py-3 px-3"
                      >
                        <div>
                          <p className="text-sm text-black/75">
                            {item.title ??
                              item.text ??
                              "Announcement"}
                          </p>

                          {item.date && (
                            <span className="text-xs text-black/40">
                              {item.date}
                            </span>
                          )}
                        </div>

                        <ArrowUpRight
                          size={14}
                          className="text-black/30 flex-shrink-0"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-black/45 py-6 text-center">
                      No announcements available.
                    </p>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                    <Clock
                      size={16}
                      strokeWidth={1.75}
                      className="text-[#1E3A8A]"
                    />
                  </div>

                  <h2 className="font-serif text-lg font-semibold text-black">
                    Today's Classes
                  </h2>
                </div>

                <div className="relative flex flex-col gap-5 pl-4">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-black/10" />

                  {todaysClasses.length > 0 ? (
                    todaysClasses.map((cls, index) => (
                      <div
                        key={cls.id ?? index}
                        className="relative flex items-start gap-4"
                      >
                        <span className="font-mono text-xs text-black/40 w-12 flex-shrink-0">
                          {cls.time ??
                            cls.start_time ??
                            "--:--"}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black">
                            {cls.title ??
                              cls.course_title ??
                              "Untitled class"}
                          </p>

                          <span className="text-xs text-black/45">
                            {cls.code ?? cls.course_code ?? ""}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-black/45 py-6 text-center">
                      No classes scheduled for today.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Examination and quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-serif text-lg font-semibold text-black">
                  {examination.status ?? "Examination"}
                </h2>

                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="relative w-20 h-20 mb-4">
                    <svg
                      className="w-20 h-20 -rotate-90"
                      viewBox="0 0 80 80"
                      aria-hidden="true"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#00000010"
                        strokeWidth="6"
                        fill="none"
                      />

                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#22c55e"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={214}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2
                        size={28}
                        strokeWidth={1.75}
                        className="text-green-500"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-black/45 mt-1">
                    {examination.message ??
                      "Examination eligibility has not been provided."}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-[#14263F] text-white text-sm font-medium py-3 rounded-xl mt-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  <Download size={16} strokeWidth={2} />
                  Download Exam Card
                </button>
              </section>

              <section className="bg-white rounded-2xl border border-black/5 p-6 lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles
                    size={18}
                    strokeWidth={1.75}
                    className="text-[#B8901F]"
                  />

                  <h2 className="font-serif text-lg font-semibold text-black">
                    Quick Actions
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        type="button"
                        key={action.label}
                        className="group relative flex flex-col items-center justify-center gap-2.5 py-6 px-3 rounded-2xl border border-black/5 hover:border-transparent overflow-hidden transition-all duration-300 text-center"
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#14263F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <Icon
                          size={22}
                          strokeWidth={1.5}
                          className="relative text-[#1E3A8A] group-hover:text-white group-hover:scale-110 transition-all duration-300"
                        />

                        <span className="relative text-xs font-medium text-black/70 group-hover:text-white leading-tight transition-colors duration-300">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Keep these available for future dashboard sections. */}
            <div className="hidden">
              {String(courseSummary.registered_courses ?? 0)}
              {String(finance.payment_status ?? "")}
              {String(finance.outstanding_amount ?? 0)}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
