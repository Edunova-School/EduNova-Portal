import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  BookOpen,
  Users,
  CalendarCheck,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

interface ClassSession {
  id: number;
  courseCode: string;
  courseTitle: string;
  day: Day;
  start: string;
  end: string;
  venue: string;
  students: number;
  type: "Lecture" | "Practical";
}

const days: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const sessions: ClassSession[] = [
  {
    id: 1,
    courseCode: "MEE 311",
    courseTitle: "Thermodynamics II",
    day: "Monday",
    start: "10:00",
    end: "12:00",
    venue: "Engineering Lecture Hall 2",
    students: 86,
    type: "Lecture",
  },
  {
    id: 2,
    courseCode: "MEE 305",
    courseTitle: "Fluid Mechanics",
    day: "Tuesday",
    start: "13:00",
    end: "15:00",
    venue: "Engineering Lecture Hall 1",
    students: 74,
    type: "Lecture",
  },
  {
    id: 3,
    courseCode: "MEE 401",
    courseTitle: "Machine Design",
    day: "Thursday",
    start: "09:00",
    end: "11:00",
    venue: "Mechanical Engineering Block",
    students: 88,
    type: "Lecture",
  },
  {
    id: 4,
    courseCode: "MEE 407",
    courseTitle: "Engineering Materials",
    day: "Friday",
    start: "11:00",
    end: "13:00",
    venue: "Engineering Lecture Hall 3",
    students: 62,
    type: "Practical",
  },
  {
    id: 5,
    courseCode: "MEE 311",
    courseTitle: "Thermodynamics II",
    day: "Wednesday",
    start: "14:00",
    end: "15:00",
    venue: "Engineering Laboratory 1",
    students: 35,
    type: "Lecture"
  },
];

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const getMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const typeStyles: Record<ClassSession["type"], string> = {
  Lecture: "border-blue-700 bg-blue-50 text-blue-950",
  Practical: "border-emerald-600 bg-emerald-50 text-emerald-950",
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-blue-900">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function ClassCard({ session }: { session: ClassSession }) {
  return (
    <div
      className={`rounded-lg border-l-4 p-3 ${typeStyles[session.type]}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold">{session.courseCode}</span>
        <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold">
          {session.type}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold">{session.courseTitle}</p>

      <p className="mt-2 flex items-center gap-1.5 text-xs opacity-80">
        <Clock3 size={13} />
        {formatTime(session.start)} – {formatTime(session.end)}
      </p>

      <p className="mt-1 flex items-start gap-1.5 text-xs opacity-80">
        <MapPin size={13} className="mt-0.5 shrink-0" />
        <span>{session.venue}</span>
      </p>

      <p className="mt-1 flex items-center gap-1.5 text-xs opacity-80">
        <Users size={13} />
        {session.students} students
      </p>
    </div>
  );
}

export default function StaffTimetable() {
  const [selectedDay, setSelectedDay] = useState<Day | "All">("All");
  const [selectedType, setSelectedType] = useState("All");
  const [weekOffset, setWeekOffset] = useState(0);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesDay =
        selectedDay === "All" || session.day === selectedDay;

      const matchesType =
        selectedType === "All" || session.type === selectedType;

      return matchesDay && matchesType;
    });
  }, [selectedDay, selectedType]);

  const totalStudents = filteredSessions.reduce(
    (total, session) => total + session.students,
    0,
  );

  const totalHours = filteredSessions.reduce((total, session) => {
    return (
      total +
      (getMinutes(session.end) - getMinutes(session.start)) / 60
    );
  }, 0);

  const weekStart = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);

    monday.setHours(0, 0, 0, 0);
    const day = monday.getDay();
    monday.setDate(
      monday.getDate() - (day === 0 ? 6 : day - 1) + weekOffset * 7,
    );

    return monday;
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    return days.map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return date;
    });
  }, [weekStart]);

  const dateRange = `${weekDates[0].toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${weekDates[4].toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const todayIndex = (() => {
    const today = new Date().getDay();
    return today >= 1 && today <= 5 ? today - 1 : -1;
  })();

  const upcomingSessions = [...filteredSessions].sort((a, b) => {
    const dayA = days.indexOf(a.day);
    const dayB = days.indexOf(b.day);

    if (dayA !== dayB) return dayA - dayB;
    return a.start.localeCompare(b.start);
  });

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-hidden lg:block">
        <StaffSidebar />
      </aside>

      <div className="ml-0 flex h-full min-w-0 flex-col lg:ml-64">
        <StaffHeader
          staffName="Edwin Adeyi-Samuel"
          staffRole="Lecturer"
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                  <Link
                    to="/staff/dashboard"
                    className="hover:text-blue-900"
                  >
                    Dashboard
                  </Link>
                  <ChevronRight size={15} />
                  <span className="font-medium text-slate-700">
                    Timetable
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My Timetable
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View your teaching schedule, class venues, and weekly
                  commitments.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-900">
                  <CalendarDays size={21} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Academic session</p>
                  <p className="text-sm font-bold">2026/2027</p>
                  <p className="text-xs text-slate-500">First Semester</p>
                </div>
              </div>
            </div>

            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Scheduled Classes"
                value={filteredSessions.length}
                description="Matching your filters"
                icon={CalendarCheck}
              />

              <StatCard
                label="Teaching Hours"
                value={totalHours}
                description="Total scheduled duration"
                icon={Clock3}
              />

              <StatCard
                label="Student Seats"
                value={totalStudents}
                description="Across matching sessions"
                icon={Users}
              />

              <StatCard
                label="Courses"
                value={new Set(filteredSessions.map((s) => s.courseCode)).size}
                description="Distinct courses scheduled"
                icon={BookOpen}
              />
            </section>

            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Weekly Schedule
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {dateRange}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((offset) => offset - 1)}
                    aria-label="Previous week"
                    className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeekOffset(0)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    This week
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeekOffset((offset) => offset + 1)}
                    aria-label="Next week"
                    className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="timetable-day"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Filter by day
                  </label>

                  <select
                    id="timetable-day"
                    value={selectedDay}
                    onChange={(event) =>
                      setSelectedDay(event.target.value as Day | "All")
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                  >
                    <option value="All">All weekdays</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="timetable-type"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Filter by class type
                  </label>

                  <select
                    id="timetable-type"
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                  >
                    <option value="All">All class types</option>
                    <option value="Lecture">Lecture</option>
                
                    <option value="Practical">Practical</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
                  Lecture
                </span>
                
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Practical
                </span>
              </div>
            </section>

            <section className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-bold">Weekly Overview</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select a day above to focus on a specific day's classes.
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-[90px_repeat(5,minmax(0,1fr))] border-b border-slate-200 bg-slate-50">
                    <div className="p-3 text-xs font-semibold text-slate-500">
                      Time
                    </div>

                    {days.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          setSelectedDay((current) =>
                            current === day ? "All" : day,
                          )
                        }
                        className={`border-l border-slate-200 p-3 text-left transition ${
                          selectedDay === day
                            ? "bg-blue-50"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <p className="text-xs font-semibold text-slate-600">
                          {day}
                        </p>
                        <p
                          className={`mt-1 text-lg font-bold ${
                            index === todayIndex && weekOffset === 0
                              ? "text-blue-900"
                              : "text-slate-900"
                          }`}
                        >
                          {weekDates[index].getDate()}
                        </p>
                      </button>
                    ))}
                  </div>

                  {timeSlots.slice(0, -1).map((time) => {
                    const slotStart = getMinutes(time);
                    const slotEnd = slotStart + 60;

                    return (
                      <div
                        key={time}
                        className="grid min-h-[92px] grid-cols-[90px_repeat(5,minmax(0,1fr))] border-b border-slate-100 last:border-b-0"
                      >
                        <div className="p-3 text-xs font-medium text-slate-500">
                          {formatTime(time)}
                        </div>

                        {days.map((day) => {
                          const daySessions = filteredSessions.filter(
                            (session) => {
                              const start = getMinutes(session.start);
                              const end = getMinutes(session.end);

                              return (
                                session.day === day &&
                                start < slotEnd &&
                                end > slotStart
                              );
                            },
                          );

                          return (
                            <div
                              key={`${day}-${time}`}
                              className="border-l border-slate-100 p-1.5"
                            >
                              {daySessions.map((session) => {
                                const startsHere =
                                  getMinutes(session.start) >= slotStart &&
                                  getMinutes(session.start) < slotEnd;

                                if (!startsHere) return null;

                                return (
                                  <div
                                    key={session.id}
                                    className="mb-1"
                                  >
                                    <ClassCard session={session} />
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-col justify-between gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-bold">Scheduled Sessions</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    A detailed list of your classes for the selected filters.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {upcomingSessions.length} sessions
                </span>
              </div>

              {upcomingSessions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="min-w-[72px] rounded-lg bg-slate-50 p-3 text-center">
                          <p className="text-xs font-semibold text-slate-500">
                            {session.day.slice(0, 3)}
                          </p>
                          <p className="mt-1 text-lg font-bold text-slate-900">
                            {formatTime(session.start).split(" ")[0]}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatTime(session.start).split(" ")[1]}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              {session.courseTitle}
                            </h3>
                            <span className="text-xs font-semibold text-blue-900">
                              {session.courseCode}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {formatTime(session.start)} –{" "}
                            {formatTime(session.end)}
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <MapPin size={15} />
                            {session.venue}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${typeStyles[session.type]}`}
                        >
                          {session.type}
                        </span>

                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Users size={15} />
                          {session.students}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <CalendarDays
                    size={30}
                    className="mx-auto text-slate-400"
                  />
                  <h3 className="mt-3 font-bold text-slate-900">
                    No classes found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your selected day or class type.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay("All");
                      setSelectedType("All");
                    }}
                    className="mt-4 text-sm font-semibold text-blue-900 hover:text-blue-700"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </section>

            <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
              EduNova Staff Portal · Academic Session 2026/2027
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
