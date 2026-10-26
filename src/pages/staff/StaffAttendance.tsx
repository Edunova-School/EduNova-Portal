import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Save,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Unmarked";

interface Student {
  id: string;
  matricNumber: string;
  name: string;
  department: string;
  level: string;
}

interface AttendanceRecord {
  status: AttendanceStatus;
  note: string;
}

const courses = [
  {
    code: "MEE 311",
    title: "Thermodynamics II",
    students: 86,
  },
  {
    code: "MEE 305",
    title: "Fluid Mechanics",
    students: 74,
  },
  {
    code: "MEE 401",
    title: "Machine Design",
    students: 88,
  },
  {
    code: "MEE 407",
    title: "Engineering Materials",
    students: 62,
  },
];

const students: Student[] = [
  {
    id: "stu-001",
    matricNumber: "ENG/2024/001",
    name: "Adebayo Oluwaseun",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-002",
    matricNumber: "ENG/2024/002",
    name: "Akinyemi Daniel",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-003",
    matricNumber: "ENG/2024/003",
    name: "Adeola Favour",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-004",
    matricNumber: "ENG/2024/004",
    name: "Balogun Samuel",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-005",
    matricNumber: "ENG/2024/005",
    name: "Bamidele Esther",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-006",
    matricNumber: "ENG/2024/006",
    name: "Eze Chidera",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-007",
    matricNumber: "ENG/2024/007",
    name: "Ibrahim Mustapha",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-008",
    matricNumber: "ENG/2024/008",
    name: "Ojo Temitope",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-009",
    matricNumber: "ENG/2024/009",
    name: "Okafor Chisom",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
  {
    id: "stu-010",
    matricNumber: "ENG/2024/010",
    name: "Yusuf Ibrahim",
    department: "Mechanical Engineering",
    level: "300 Level",
  },
];

const initialRecords: Record<string, AttendanceRecord> = {
  "stu-001": { status: "Present", note: "" },
  "stu-002": { status: "Present", note: "" },
  "stu-003": { status: "Late", note: "" },
  "stu-004": { status: "Absent", note: "" },
  "stu-005": { status: "Present", note: "" },
  "stu-006": { status: "Unmarked", note: "" },
  "stu-007": { status: "Present", note: "" },
  "stu-008": { status: "Unmarked", note: "" },
  "stu-009": { status: "Absent", note: "" },
  "stu-010": { status: "Unmarked", note: "" },
};

const attendanceOptions: AttendanceStatus[] = [
  "Present",
  "Absent",
  "Late",
  "Unmarked",
];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-red-50 text-red-700 border-red-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  Unmarked: "bg-slate-100 text-slate-600 border-slate-200",
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
  icon: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
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

function StatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default function StaffAttendance() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].code);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [sessionType, setSessionType] = useState("Lecture");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [records, setRecords] =
    useState<Record<string, AttendanceRecord>>(initialRecords);
  const [savedRecords, setSavedRecords] =
    useState<Record<string, AttendanceRecord>>(initialRecords);
  const [saveMessage, setSaveMessage] = useState("");

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const record = records[student.id] ?? {
        status: "Unmarked" as AttendanceStatus,
        note: "",
      };

      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, records]);

  const attendanceCounts = useMemo(() => {
    const counts = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Unmarked: 0,
    };

    students.forEach((student) => {
      const status = records[student.id]?.status ?? "Unmarked";
      counts[status]++;
    });

    return counts;
  }, [records]);

  const markedCount =
    attendanceCounts.Present +
    attendanceCounts.Absent +
    attendanceCounts.Late;

  const attendanceRate =
    markedCount > 0
      ? Math.round(
          ((attendanceCounts.Present + attendanceCounts.Late) / markedCount) *
            100,
        )
      : 0;

  const hasUnsavedChanges =
    JSON.stringify(records) !== JSON.stringify(savedRecords);

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setRecords((current) => ({
      ...current,
      [studentId]: {
        ...(current[studentId] ?? { note: "" }),
        status,
      },
    }));

    setSaveMessage("");
  };

  const markAllPresent = () => {
    setRecords((current) => {
      const updated = { ...current };

      students.forEach((student) => {
        updated[student.id] = {
          ...(updated[student.id] ?? { note: "" }),
          status: "Present",
        };
      });

      return updated;
    });

    setSaveMessage("");
  };

  const resetAttendance = () => {
    setRecords(
      Object.fromEntries(
        students.map((student) => [
          student.id,
          { status: "Unmarked", note: "" },
        ]),
      ),
    );

    setSaveMessage("");
  };

  const saveAttendance = () => {
    setSavedRecords({ ...records });
    setSaveMessage(
      "Attendance marked as saved in this page. Connect the save handler to your API to persist it.",
    );
  };

  const exportAttendance = () => {
    const headers = [
      "Matric Number",
      "Student Name",
      "Course Code",
      "Date",
      "Session",
      "Status",
    ];

    const rows = students.map((student) => [
      student.matricNumber,
      student.name,
      selectedCourse,
      attendanceDate,
      sessionType,
      records[student.id]?.status ?? "Unmarked",
    ]);

    const csvCell = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `attendance-${selectedCourse.replace(/\s+/g, "-")}-${attendanceDate}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const selectedCourseDetails = courses.find(
    (course) => course.code === selectedCourse,
  );

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
                    Attendance
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Attendance Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Record attendance, review class participation, and manage
                  student attendance for your courses.
                </p>
              </div>

              <button
                type="button"
                onClick={exportAttendance}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Download size={17} />
                Export CSV
              </button>
            </div>

            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Students"
                value={students.length}
                description="Students in the sample roster"
                icon={Users}
              />

              <StatCard
                label="Present"
                value={attendanceCounts.Present}
                description="Marked present"
                icon={CheckCircle2}
              />

              <StatCard
                label="Absent"
                value={attendanceCounts.Absent}
                description="Marked absent"
                icon={XCircle}
              />

              <StatCard
                label="Attendance Rate"
                value={attendanceRate}
                description={`${attendanceCounts.Unmarked} records unmarked`}
                icon={ClipboardCheck}
              />
            </section>

            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">
                  Select Class Session
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the course, date, and type of class before recording
                  attendance.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label
                    htmlFor="attendance-course"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Course
                  </label>

                  <select
                    id="attendance-course"
                    value={selectedCourse}
                    onChange={(event) => {
                      setSelectedCourse(event.target.value);
                      setSaveMessage("");
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  >
                    {courses.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code} — {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="attendance-date"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Class date
                  </label>

                  <input
                    id="attendance-date"
                    type="date"
                    value={attendanceDate}
                    onChange={(event) => {
                      setAttendanceDate(event.target.value);
                      setSaveMessage("");
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="attendance-session"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Class type
                  </label>

                  <select
                    id="attendance-session"
                    value={sessionType}
                    onChange={(event) => {
                      setSessionType(event.target.value);
                      setSaveMessage("");
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>
              </div>

              {selectedCourseDetails && (
                <div className="mt-5 flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedCourseDetails.code}:{" "}
                      {selectedCourseDetails.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCourseDetails.students} students on the course
                      roster
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={17} />
                    <span>{attendanceDate || "Select a date"}</span>
                  </div>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-4 sm:p-5 xl:flex-row xl:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Student Attendance
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Mark each student's attendance for the selected session.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={markAllPresent}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <CheckCircle2 size={16} />
                    Mark All Present
                  </button>

                  <button
                    type="button"
                    onClick={resetAttendance}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name or matric number..."
                    aria-label="Search students"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-900"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter attendance by status"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                >
                  <option value="All">All statuses</option>
                  {attendanceOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 p-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Present</p>
                  <p className="mt-1 font-bold text-emerald-700">
                    {attendanceCounts.Present}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Absent</p>
                  <p className="mt-1 font-bold text-red-700">
                    {attendanceCounts.Absent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Late</p>
                  <p className="mt-1 font-bold text-amber-700">
                    {attendanceCounts.Late}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Unmarked</p>
                  <p className="mt-1 font-bold text-slate-700">
                    {attendanceCounts.Unmarked}
                  </p>
                </div>
              </div>

              {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-4 font-semibold">Student</th>
                        <th className="px-5 py-4 font-semibold">
                          Matric Number
                        </th>
                        <th className="px-5 py-4 font-semibold">Level</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">
                          Mark Attendance
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((student) => {
                        const status =
                          records[student.id]?.status ?? "Unmarked";

                        return (
                          <tr
                            key={student.id}
                            className="transition hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-900">
                                {student.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {student.department}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {student.matricNumber}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {student.level}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={status} />
                            </td>

                            <td className="px-5 py-4">
                              <select
                                value={status}
                                onChange={(event) =>
                                  updateStatus(
                                    student.id,
                                    event.target.value as AttendanceStatus,
                                  )
                                }
                                aria-label={`Attendance status for ${student.name}`}
                                className="w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-900"
                              >
                                {attendanceOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-slate-400"
                  />
                  <h3 className="mt-3 font-bold text-slate-900">
                    No students found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try a different search term or attendance filter.
                  </p>
                </div>
              )}

              <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:px-5">
                <div className="text-sm text-slate-500">
                  Showing {filteredStudents.length} of {students.length} sample
                  students
                  {hasUnsavedChanges && (
                    <span className="ml-2 font-semibold text-amber-700">
                      · Unsaved changes
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={saveAttendance}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                  <Save size={17} />
                  Save Attendance
                </button>
              </div>

              {saveMessage && (
                <div
                  role="status"
                  className="flex items-start gap-2 border-t border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{saveMessage}</p>
                </div>
              )}
            </section>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <Clock3
                size={20}
                className="mt-0.5 shrink-0 text-blue-900"
              />
              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  Attendance reminder
                </h3>
                <p className="mt-1 text-sm leading-6 text-blue-900/80">
                  Review all student statuses before saving. Students left
                  unmarked are not counted as present or absent.
                </p>
              </div>
            </div>

            <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
              EduNova Staff Portal · Academic Session 2026/2027
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}