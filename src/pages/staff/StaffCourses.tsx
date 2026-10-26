import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
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

type CourseStatus = "In Progress" | "Upcoming" | "Completed";

interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  semester: string;
  academicSession: string;
  students: number;
  credits: number;
  progress: number;
  schedule: string;
  venue: string;
  status: CourseStatus;
}

const courses: Course[] = [
  {
    id: "mee-311",
    code: "MEE 311",
    title: "Thermodynamics II",
    department: "Mechanical Engineering",
    semester: "First Semester",
    academicSession: "2026/2027",
    students: 86,
    credits: 3,
    progress: 68,
    schedule: "Monday, 10:00 AM – 12:00 PM",
    venue: "Engineering Lecture Hall 2",
    status: "In Progress",
  },
  {
    id: "mee-305",
    code: "MEE 305",
    title: "Fluid Mechanics",
    department: "Mechanical Engineering",
    semester: "First Semester",
    academicSession: "2026/2027",
    students: 74,
    credits: 3,
    progress: 52,
    schedule: "Tuesday, 1:00 PM – 3:00 PM",
    venue: "Engineering Lecture Hall 1",
    status: "In Progress",
  },
  {
    id: "mee-401",
    code: "MEE 401",
    title: "Machine Design",
    department: "Mechanical Engineering",
    semester: "First Semester",
    academicSession: "2026/2027",
    students: 88,
    credits: 4,
    progress: 35,
    schedule: "Thursday, 9:00 AM – 11:00 AM",
    venue: "Mechanical Engineering Block",
    status: "In Progress",
  },
  {
    id: "mee-407",
    code: "MEE 407",
    title: "Engineering Materials",
    department: "Mechanical Engineering",
    semester: "First Semester",
    academicSession: "2026/2027",
    students: 62,
    credits: 2,
    progress: 0,
    schedule: "Friday, 11:00 AM – 1:00 PM",
    venue: "Engineering Lecture Hall 3",
    status: "Upcoming",
  },
  {
    id: "mee-302",
    code: "MEE 302",
    title: "Engineering Mathematics III",
    department: "Mechanical Engineering",
    semester: "Second Semester",
    academicSession: "2025/2026",
    students: 91,
    credits: 3,
    progress: 100,
    schedule: "Completed",
    venue: "Engineering Lecture Hall 1",
    status: "Completed",
  },
];

const statusStyles: Record<CourseStatus, string> = {
  "In Progress": "bg-blue-50 text-blue-700",
  Upcoming: "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-blue-900">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
              <BookOpen size={23} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-900">
                {course.code}
              </p>

              <h3 className="mt-1 text-base font-bold leading-6 text-slate-900">
                {course.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {course.credits} credit units
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label={`More options for ${course.code}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mt-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[course.status]}`}
          >
            {course.status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <Users size={15} />
              <span className="text-xs">Students</span>
            </div>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {course.students}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays size={15} />
              <span className="text-xs">Semester</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {course.semester}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">
              Course progress
            </span>
            <span className="text-xs font-bold text-slate-800">
              {course.progress}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label={`${course.code} course progress`}
            aria-valuenow={course.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all ${
                course.status === "Completed"
                  ? "bg-emerald-500"
                  : "bg-blue-900"
              }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Clock3 className="mt-0.5 shrink-0 text-slate-400" size={16} />
            <span>{course.schedule}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-slate-600">
            <GraduationCap
              className="mt-0.5 shrink-0 text-slate-400"
              size={16}
            />
            <span>{course.venue}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <Link
            to={`/staff/attendance?course=${encodeURIComponent(course.code)}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ClipboardCheck size={15} />
            Attendance
          </Link>

          <Link
            to={`/staff/results?course=${encodeURIComponent(course.code)}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900"
          >
            <FileText size={15} />
            Results
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function StaffCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.code.toLowerCase().includes(normalizedSearch) ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.department.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || course.status === statusFilter;

      const matchesSemester =
        semesterFilter === "All" || course.semester === semesterFilter;

      return matchesSearch && matchesStatus && matchesSemester;
    });
  }, [searchTerm, statusFilter, semesterFilter]);

  const totalStudents = courses
    .filter((course) => course.status !== "Completed")
    .reduce((total, course) => total + course.students, 0);

  const activeCourses = courses.filter(
    (course) => course.status === "In Progress",
  ).length;

  const upcomingCourses = courses.filter(
    (course) => course.status === "Upcoming",
  ).length;

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-y-auto lg:block">
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
                  className="transition hover:text-blue-900"
                >
                  Dashboard
                </Link>
                <ChevronRight size={15} />
                <span className="font-medium text-slate-700">My Courses</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My Courses
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your assigned courses, monitor course progress, and
                access attendance and assessment records.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-900">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Academic session</p>
                <p className="text-sm font-bold text-slate-900">2026/2027</p>
                <p className="text-xs text-slate-500">First Semester</p>
              </div>
            </div>
          </div>

          <section
            aria-label="Course statistics"
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total Courses"
              value={courses.length}
              description="All assigned courses"
              icon={BookOpen}
            />

            <StatCard
              title="Active Courses"
              value={activeCourses}
              description="Currently in progress"
              icon={GraduationCap}
            />

            <StatCard
              title="Total Students"
              value={totalStudents}
              description="Across non-completed courses"
              icon={Users}
            />

            <StatCard
              title="Upcoming Courses"
              value={upcomingCourses}
              description="Awaiting commencement"
              icon={CalendarDays}
            />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Assigned Courses
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Browse and filter your courses.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
                <div className="relative min-w-0 xl:w-72">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search courses..."
                    aria-label="Search courses"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by course status"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                >
                  <option value="All">All statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={semesterFilter}
                  onChange={(event) => setSemesterFilter(event.target.value)}
                  aria-label="Filter by semester"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                >
                  <option value="All">All semesters</option>
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {filteredCourses.length}
                </span>{" "}
                of {courses.length} courses
              </p>

              {(searchTerm ||
                statusFilter !== "All" ||
                semesterFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setSemesterFilter("All");
                  }}
                  className="text-sm font-semibold text-blue-900 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </section>

          {filteredCourses.length > 0 ? (
            <section
              aria-label="Assigned course list"
              className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
            >
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </section>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Search size={24} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No courses found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                No courses match your search or selected filters. Try a
                different search term or clear your filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setSemesterFilter("All");
                }}
                className="mt-5 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                Clear filters
              </button>
            </div>
          )}

          <footer className="mt-10 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
            EduNova Staff Portal · Academic Session 2026/2027
          </footer>
         </div>
        </main>
      </div>
    </div>
  );
}
