
import { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  Download,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Pencil,
  X,
  Filter,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

type Grade = "A" | "B" | "C" | "D" | "E" | "F";

type Student = {
  id: number;
  matricNumber: string;
  name: string;
  department: string;
  ca: number;
  exam: number;
};

type Course = {
  id: number;
  code: string;
  title: string;
  units: number;
  level: string;
  semester: string;
  students: Student[];
};

type ResultStatus = "Draft" | "Submitted";

const initialCourses: Course[] = [
  {
    id: 1,
    code: "SEN 301",
    title: "Software Engineering Principles",
    units: 3,
    level: "300 Level",
    semester: "First Semester",
    students: [
      { id: 1, matricNumber: "LAU/SE/21/001", name: "Adebayo Daniel", department: "Software Engineering", ca: 25, exam: 56 },
      { id: 2, matricNumber: "LAU/SE/21/002", name: "Akinola Esther", department: "Software Engineering", ca: 27, exam: 61 },
      { id: 3, matricNumber: "LAU/SE/21/003", name: "Adesina Michael", department: "Software Engineering", ca: 18, exam: 39 },
      { id: 4, matricNumber: "LAU/SE/21/004", name: "Afolabi Deborah", department: "Software Engineering", ca: 22, exam: 48 },
      { id: 5, matricNumber: "LAU/SE/21/005", name: "Akinyemi Samuel", department: "Software Engineering", ca: 29, exam: 64 },
      { id: 6, matricNumber: "LAU/SE/21/006", name: "Ojo Favour", department: "Software Engineering", ca: 15, exam: 28 },
      { id: 7, matricNumber: "LAU/SE/21/007", name: "Oladipo Grace", department: "Software Engineering", ca: 24, exam: 52 },
      { id: 8, matricNumber: "LAU/SE/21/008", name: "Balogun David", department: "Software Engineering", ca: 20, exam: 42 },
      { id: 9, matricNumber: "LAU/SE/21/009", name: "Ogunleye Peace", department: "Software Engineering", ca: 28, exam: 59 },
      { id: 10, matricNumber: "LAU/SE/21/010", name: "Adekunle John", department: "Software Engineering", ca: 17, exam: 35 },
    ],
  },
  {
    id: 2,
    code: "SEN 303",
    title: "Database Management Systems",
    units: 3,
    level: "300 Level",
    semester: "First Semester",
    students: [
      { id: 11, matricNumber: "LAU/SE/21/001", name: "Adebayo Daniel", department: "Software Engineering", ca: 26, exam: 54 },
      { id: 12, matricNumber: "LAU/SE/21/002", name: "Akinola Esther", department: "Software Engineering", ca: 29, exam: 62 },
      { id: 13, matricNumber: "LAU/SE/21/003", name: "Adesina Michael", department: "Software Engineering", ca: 21, exam: 43 },
      { id: 14, matricNumber: "LAU/SE/21/004", name: "Afolabi Deborah", department: "Software Engineering", ca: 24, exam: 51 },
      { id: 15, matricNumber: "LAU/SE/21/005", name: "Akinyemi Samuel", department: "Software Engineering", ca: 27, exam: 60 },
      { id: 16, matricNumber: "LAU/SE/21/006", name: "Ojo Favour", department: "Software Engineering", ca: 19, exam: 34 },
    ],
  },
  {
    id: 3,
    code: "SEN 305",
    title: "Computer Networks",
    units: 2,
    level: "300 Level",
    semester: "Second Semester",
    students: [
      { id: 17, matricNumber: "LAU/SE/21/001", name: "Adebayo Daniel", department: "Software Engineering", ca: 23, exam: 49 },
      { id: 18, matricNumber: "LAU/SE/21/002", name: "Akinola Esther", department: "Software Engineering", ca: 28, exam: 58 },
      { id: 19, matricNumber: "LAU/SE/21/003", name: "Adesina Michael", department: "Software Engineering", ca: 16, exam: 31 },
      { id: 20, matricNumber: "LAU/SE/21/004", name: "Afolabi Deborah", department: "Software Engineering", ca: 25, exam: 55 },
    ],
  },
];

const academicSessions = ["2025/2026", "2024/2025", "2023/2024"];

function getGrade(total: number): Grade {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function getGradeRemark(grade: Grade) {
  return grade === "F" ? "Fail" : "Pass";
}

function gradeColor(grade: Grade) {
  if (grade === "A") return "bg-green-100 text-green-700";
  if (grade === "B") return "bg-blue-100 text-blue-700";
  if (grade === "C") return "bg-indigo-100 text-indigo-700";
  if (grade === "D") return "bg-yellow-100 text-yellow-700";
  if (grade === "E") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function StaffResults() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [selectedSession, setSelectedSession] = useState("2025/2026");
  const [selectedSemester, setSelectedSemester] = useState("First Semester");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<ResultStatus>("Draft");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

  const visibleCourses = courses.filter(
    (course) => course.semester === selectedSemester
  );

  const students = selectedCourse?.students ?? [];

  const filteredStudents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return students;

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query)
    );
  }, [students, searchTerm]);

  const results = students.map((student) => {
    const total = student.ca + student.exam;
    const grade = getGrade(total);

    return { ...student, total, grade, remark: getGradeRemark(grade) };
  });

  const average =
    results.length > 0
      ? results.reduce((sum, student) => sum + student.total, 0) /
        results.length
      : 0;

  const highest = results.length
    ? Math.max(...results.map((student) => student.total))
    : 0;

  const passCount = results.filter((student) => student.total >= 40).length;

  const updateScore = (
    studentId: number,
    field: "ca" | "exam",
    value: number
  ) => {
    setCourses((previous) =>
      previous.map((course) =>
        course.id !== selectedCourseId
          ? course
          : {
              ...course,
              students: course.students.map((student) =>
                student.id === studentId
                  ? { ...student, [field]: value }
                  : student
              ),
            }
      )
    );
  };

  const handleSave = () => {
    setStatus("Draft");
    setNotice("Results saved as draft successfully.");
    setEditing(false);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const handleSubmit = () => {
    if (!selectedCourse) return;

    const hasInvalidScore = students.some(
      (student) =>
        student.ca < 0 ||
        student.ca > 30 ||
        student.exam < 0 ||
        student.exam > 70
    );

    if (hasInvalidScore) {
      setNotice("Please correct scores outside the allowed limits.");
      return;
    }

    setStatus("Submitted");
    setEditing(false);
    setNotice("Results submitted successfully (demo only).");
    window.setTimeout(() => setNotice(""), 3500);
  };

  const handleExport = () => {
    if (!selectedCourse) return;

    const headers = [
      "Matric Number",
      "Student Name",
      "CA Score",
      "Exam Score",
      "Total",
      "Grade",
      "Remark",
    ];

    const rows = results.map((student) => [
      student.matricNumber,
      student.name,
      student.ca,
      student.exam,
      student.total,
      student.grade,
      student.remark,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selectedCourse.code.replace(/\s/g, "_")}_results.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    setSearchTerm("");
    setStatus("Draft");
    setEditing(false);
    setNotice("");
  };

  return (
    <div className=" overflow-hidden bg-slate-50 text-slate-900">
              <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-hidden lg:block">
                <StaffSidebar />
              </aside>
    
          <div className="ml-0 flex h-full min-w-0 flex-col lg:ml-64">
            <StaffHeader
              
            />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span className="text-blue-700">Results Management</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Results Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage, review and submit students' academic results.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Download size={16} />
                  Export CSV
                </button>

                <button
                  onClick={() => setEditing((previous) => !previous)}
                  disabled={status === "Submitted"}
                  className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editing ? <X size={16} /> : <Pencil size={16} />}
                  {editing ? "Cancel Editing" : "Edit Results"}
                </button>
              </div>
            </div>

            {/* Notification */}
            {notice && (
              <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <CheckCircle2 size={18} />
                {notice}
              </div>
            )}

            {/* Filters */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Filter size={18} className="text-blue-800" />
                <h2 className="font-semibold text-slate-800">
                  Select Academic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Academic Session
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSession}
                      onChange={(event) => setSelectedSession(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    >
                      {academicSessions.map((session) => (
                        <option key={session} value={session}>
                          {session}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Semester
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSemester}
                      onChange={(event) => {
                        const semester = event.target.value;
                        setSelectedSemester(semester);
                        const firstCourse = courses.find(
                          (course) => course.semester === semester
                        );
                        if (firstCourse) handleCourseChange(firstCourse.id);
                      }}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    >
                      <option>First Semester</option>
                      <option>Second Semester</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Course
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourseId}
                      onChange={(event) =>
                        handleCourseChange(Number(event.target.value))
                      }
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    >
                      {visibleCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.code} — {course.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Course details */}
            {selectedCourse && (
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                        {selectedCourse.code}
                      </span>

                      <span
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          status === "Submitted"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {status === "Submitted" ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Clock size={13} />
                        )}
                        {status}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-slate-900">
                      {selectedCourse.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCourse.level} <span className="mx-1">•</span>
                      {selectedCourse.units} Credit Units{" "}
                      <span className="mx-1">•</span>
                      {selectedCourse.semester}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Academic Session</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedSession}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Statistics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Students</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {students.length}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-800">
                    <Users size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Students registered for this course
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Class Average</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {average.toFixed(1)}%
                    </h3>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3 text-purple-700">
                    <TrendingUp size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Average total score
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Highest Score</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {highest}%
                    </h3>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                    <Award size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Highest student total
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Pass Rate</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {students.length
                        ? ((passCount / students.length) * 100).toFixed(0)
                        : 0}
                      %
                    </h3>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3 text-green-700">
                    <CheckCircle2 size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {passCount} students passed
                </p>
              </div>
            </section>

            {/* Results table */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Student Results
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter and review student assessment scores.
                  </p>
                </div>

                <div className="relative w-full md:max-w-xs">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name or matric number..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-700" />
                    CA: 30 marks maximum
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-600" />
                    Examination: 70 marks maximum
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    Total: 100 marks maximum
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Student</th>
                      <th className="px-4 py-4 font-semibold">Matric Number</th>
                      <th className="px-4 py-4 text-center font-semibold">
                        CA <span className="normal-case">(30)</span>
                      </th>
                      <th className="px-4 py-4 text-center font-semibold">
                        Exam <span className="normal-case">(70)</span>
                      </th>
                      <th className="px-4 py-4 text-center font-semibold">
                        Total
                      </th>
                      <th className="px-4 py-4 text-center font-semibold">
                        Grade
                      </th>
                      <th className="px-5 py-4 text-center font-semibold">
                        Remark
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student, index) => {
                      const total = student.ca + student.exam;
                      const grade = getGrade(total);
                      const remark = getGradeRemark(grade);

                      return (
                        <tr
                          key={student.id}
                          className="transition hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">
                                {student.name
                                  .split(" ")
                                  .map((part) => part[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {student.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Student {String(index + 1).padStart(2, "0")}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {student.matricNumber}
                          </td>

                          <td className="px-4 py-4 text-center">
                            {editing ? (
                              <input
                                type="number"
                                min={0}
                                max={30}
                                value={student.ca}
                                onChange={(event) =>
                                  updateScore(
                                    student.id,
                                    "ca",
                                    Math.min(
                                      30,
                                      Math.max(0, Number(event.target.value))
                                    )
                                  )
                                }
                                className="w-16 rounded-md border border-blue-200 bg-white px-2 py-2 text-center font-semibold text-slate-800 outline-none focus:border-blue-700"
                              />
                            ) : (
                              <span className="font-medium text-slate-700">
                                {student.ca}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">
                            {editing ? (
                              <input
                                type="number"
                                min={0}
                                max={70}
                                value={student.exam}
                                onChange={(event) =>
                                  updateScore(
                                    student.id,
                                    "exam",
                                    Math.min(
                                      70,
                                      Math.max(0, Number(event.target.value))
                                    )
                                  )
                                }
                                className="w-16 rounded-md border border-blue-200 bg-white px-2 py-2 text-center font-semibold text-slate-800 outline-none focus:border-blue-700"
                              />
                            ) : (
                              <span className="font-medium text-slate-700">
                                {student.exam}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="font-bold text-slate-900">
                              {total}
                            </span>
                            <span className="text-slate-400">/100</span>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-bold ${gradeColor(
                                grade
                              )}`}
                            >
                              {grade}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`text-xs font-semibold ${
                                remark === "Pass"
                                  ? "text-green-700"
                                  : "text-red-600"
                              }`}
                            >
                              {remark}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <Search
                              size={28}
                              className="mb-3 text-slate-300"
                            />
                            <p className="font-medium text-slate-700">
                              No students found
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              Try searching with another name or matric number.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredStudents.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {students.length}
                  </span>{" "}
                  students
                </p>

                <p className="text-xs text-slate-400">
                  Scores are calculated automatically.
                </p>
              </div>
            </section>

            {/* Grading scale */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-800" />
                <h2 className="font-semibold text-slate-900">
                  Grading Scale
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { grade: "A", range: "70 – 100", point: "5.0" },
                  { grade: "B", range: "60 – 69", point: "4.0" },
                  { grade: "C", range: "50 – 59", point: "3.0" },
                  { grade: "D", range: "45 – 49", point: "2.0" },
                  { grade: "E", range: "40 – 44", point: "1.0" },
                  { grade: "F", range: "0 – 39", point: "0.0" },
                ].map((item) => (
                  <div
                    key={item.grade}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center"
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md font-bold ${gradeColor(
                        item.grade as Grade
                      )}`}
                    >
                      {item.grade}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {item.range}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.point} Grade Point
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Demo grading scale only. Replace with the institution's
                approved grading policy before production use.
              </p>
            </section>

            {/* Actions */}
            <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Result Submission
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review your entries before submitting this course's results.
                </p>
                {status === "Submitted" && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-700">
                    <CheckCircle2 size={14} />
                    This demo result is marked as submitted.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSave}
                  disabled={status === "Submitted"}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />
                  Save Draft
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={status === "Submitted"}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                  Submit Results
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="pb-4 pt-2 text-center text-xs text-slate-400">
              EduNova Staff Portal © {new Date().getFullYear()}.
              All rights reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
