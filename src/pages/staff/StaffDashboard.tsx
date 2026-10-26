import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Users,
  Clock3,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Megaphone,
  CalendarCheck,
  ClipboardList,
  ChevronRight
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

const staff = {
  name: "Edwin Adeyi-Samuel",
  role: "Lecturer",
  department: "Mechanical Engineering",
  faculty: "Faculty of Engineering",
};

const academicSession = {
  session: "2026/2027",
  semester: "First Semester",
};

const courses = [
  {
    code: "MEE 311",
    title: "Thermodynamics II",
    students: 42,
    time: "09:00 AM – 11:00 AM",
    venue: "Engineering Block · Room 204",
    status: "Completed",
    progress: 75,
  },
  {
    code: "MEE 305",
    title: "Fluid Mechanics",
    students: 56,
    time: "11:30 AM – 01:30 PM",
    venue: "Lecture Theatre B",
    status: "Next class",
    progress: 60,
  },
  {
    code: "MEE 401",
    title: "Machine Design",
    students: 38,
    time: "02:00 PM – 04:00 PM",
    venue: "Engineering Block · Room 108",
    status: "Upcoming",
    progress: 45,
  },
];

const tasks = [
  {
    id: 1,
    title: "Submit continuous assessment scores",
    detail: "MEE 311 · 42 students",
    deadline: "Today, 4:00 PM",
    priority: "High",
    path: "/staff/results",
  },
  {
    id: 2,
    title: "Complete lecture attendance",
    detail: "MEE 305 · Morning lecture",
    deadline: "Today",
    priority: "Medium",
    path: "/staff/attendance",
  },
  {
    id: 3,
    title: "Review student advising requests",
    detail: "Mechanical Engineering Department",
    deadline: "Tomorrow",
    priority: "Normal",
    path: "/staff/advising",
  },
];

const announcements = [
  {
    id: 1,
    category: "ACADEMIC",
    title: "First semester assessment submissions",
    body: "Lecturers are reminded to complete their continuous assessment entries before the departmental deadline.",
    date: "Today",
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    category: "FACULTY",
    title: "Faculty board meeting",
    body: "The next faculty board meeting is scheduled for Thursday at 10:00 AM in the faculty conference room.",
    date: "Yesterday",
    color: "bg-amber-50 text-amber-700",
  },
];

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-emerald-50 text-emerald-700",
    "Next class": "bg-blue-50 text-blue-700",
    Upcoming: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: typeof BookOpen;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export default function StaffDashboard() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const pendingTasks = tasks.filter(
    (task) => !completedTasks.includes(task.id)
  ).length;

  const toggleTask = (id: number) => {
    setCompletedTasks((previous) =>
      previous.includes(id)
        ? previous.filter((taskId) => taskId !== id)
        : [...previous, id]
    );
  };

  const stats = [
    {
      title: "Assigned courses",
      value: "6",
      detail: "Across the current semester",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-800",
    },
    {
      title: "Students taught",
      value: "248",
      detail: "Across your assigned courses",
      icon: Users,
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Pending tasks",
      value: pendingTasks,
      detail: "Require your attention",
      icon: ClipboardList,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Classes today",
      value: "3",
      detail: "One class completed",
      icon: CalendarCheck,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  const quickActions = [
    {
      label: "Take attendance",
      description: "Record class attendance",
      icon: ClipboardCheck,
      path: "/staff/attendance",
    },
    {
      label: "Enter results",
      description: "Manage student scores",
      icon: GraduationCap,
      path: "/staff/results",
    },
    {
      label: "View students",
      description: "Browse your students",
      icon: Users,
      path: "/staff/students",
    },
    {
      label: "My timetable",
      description: "Check your schedule",
      icon: CalendarDays,
      path: "/staff/timetable",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden shrink-0 lg:block">
        <StaffSidebar />
      </div>

      {/* Main workspace */}
      <div className="min-w-0 flex-1">
        <StaffHeader
          staffName={staff.name}
          staffRole={staff.role}
        />

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Welcome section */}
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CalendarDays size={15} />
                {today}
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-blue-950 sm:text-3xl">
                Good day, {staff.name.split(" ")[0]}
                <span className="ml-2 inline-block">👋</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Welcome back to your workspace. Here&apos;s an overview
                of your teaching activities and academic responsibilities.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                  {staff.role}
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                  {staff.department}
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                  {academicSession.session}
                </span>
              </div>
            </div>

            <Link
              to="/staff/timetable"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#14263F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d3657] sm:self-auto"
            >
              <CalendarDays size={17} />
              View timetable
              <ArrowUpRight size={16} />
            </Link>
          </section>

          {/* Summary statistics */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </section>

          {/* Dashboard columns */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
            {/* Left column */}
            <div className="min-w-0 space-y-6">
              {/* Today's schedule */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                <SectionHeading
                  title="Today's schedule"
                  subtitle="Your teaching timetable for today"
                  action={
                    <Link
                      to="/staff/timetable"
                      className="flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
                    >
                      Full timetable
                      <ChevronRight size={15} />
                    </Link>
                  }
                />

                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={course.code} className="flex gap-3 sm:gap-4">
                      <div className="w-[78px] shrink-0 pt-1">
                        <p className="text-sm font-bold text-slate-800">
                          {course.time.split(" – ")[0]}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {course.time.split(" – ")[1]}
                        </p>
                      </div>

                      <div
                        className={`w-1 shrink-0 rounded-full ${
                          index === 0
                            ? "bg-emerald-400"
                            : index === 1
                              ? "bg-blue-700"
                              : "bg-amber-400"
                        }`}
                      />

                      <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-bold tracking-wide text-blue-800">
                              {course.code}
                            </p>

                            <h3 className="mt-1 text-sm font-bold text-slate-900">
                              {course.title}
                            </h3>
                          </div>

                          <StatusBadge status={course.status} />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {course.venue}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Users size={14} />
                            {course.students} students
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* My courses */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                <SectionHeading
                  title="My courses"
                  subtitle="An overview of your teaching assignments"
                  action={
                    <Link
                      to="/staff/courses"
                      className="flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
                    >
                      All courses
                      <ChevronRight size={15} />
                    </Link>
                  }
                />

                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.code}
                      className="rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/20"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                            <BookOpen size={20} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[11px] font-bold tracking-wide text-blue-800">
                              {course.code}
                            </p>

                            <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                              {course.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {course.students} enrolled students
                            </p>
                          </div>
                        </div>

                        <Link
                          to="/staff/courses"
                          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
                        >
                          Manage course
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-slate-500">
                            Teaching progress
                          </span>

                          <span className="font-semibold text-slate-700">
                            {course.progress}%
                          </span>
                        </div>

                        <div
                          className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-label={`${course.code} teaching progress`}
                          aria-valuenow={course.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-[#14263F]"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick actions */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                <SectionHeading
                  title="Quick actions"
                  subtitle="Shortcuts to your everyday tasks"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <Link
                        key={action.label}
                        to={action.path}
                        className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-100 group-hover:text-blue-900">
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-950">
                            {action.label}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {action.description}
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-800"
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="min-w-0 space-y-6">
              {/* Pending tasks */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                <SectionHeading
                  title="Pending tasks"
                  subtitle="Stay on top of your responsibilities"
                  action={
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      {pendingTasks} left
                    </span>
                  }
                />

                <div className="space-y-5">
                  {tasks.map((task) => {
                    const done = completedTasks.includes(task.id);

                    return (
                      <div key={task.id} className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          aria-label={
                            done
                              ? `Mark ${task.title} incomplete`
                              : `Mark ${task.title} complete`
                          }
                          aria-pressed={done}
                          className="mt-0.5 shrink-0 rounded-full text-slate-300 transition hover:text-blue-800"
                        >
                          {done ? (
                            <CheckCircle2
                              size={21}
                              className="text-emerald-600"
                            />
                          ) : (
                            <Circle size={21} />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <Link
                            to={task.path}
                            className={`text-sm font-semibold hover:text-blue-800 ${
                              done
                                ? "text-slate-400 line-through"
                                : "text-slate-800"
                            }`}
                          >
                            {task.title}
                          </Link>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {task.detail}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock3 size={12} />
                              {task.deadline}
                            </span>

                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                task.priority === "High"
                                  ? "bg-red-50 text-red-600"
                                  : task.priority === "Medium"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/staff/tasks"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View all tasks
                  <ChevronRight size={16} />
                </Link>
              </section>

              {/* Announcements */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                <SectionHeading
                  title="Announcements"
                  subtitle="Updates from your faculty and university"
                  action={
                    <Link
                      to="/staff/announcements"
                      aria-label="View all announcements"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <ArrowUpRight size={17} />
                    </Link>
                  }
                />

                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <article
                      key={announcement.id}
                      className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wide ${announcement.color}`}
                        >
                          {announcement.category}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {announcement.date}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold leading-5 text-slate-900">
                        {announcement.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {announcement.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              {/* Academic session */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                    <CalendarCheck size={21} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Academic session
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Current academic period
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-lg font-extrabold text-blue-950">
                    {academicSession.session}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {academicSession.semester}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {staff.faculty}
                  </p>
                </div>
              </section>

              {/* Teaching reminder */}
              <section className="rounded-2xl bg-[#14263F] p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white/10 p-2.5">
                    <Megaphone size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">Teaching reminder</p>

                    <p className="mt-2 text-xs leading-5 text-blue-100/80">
                      Keep your attendance records and assessment scores
                      up to date to make end-of-semester processing easier.
                    </p>

                    <Link
                      to="/staff/results"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition hover:text-blue-200"
                    >
                      Manage assessments
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 EduNova University Portal</p>

            <p>
              Staff Workspace · {academicSession.session} Academic Session
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
