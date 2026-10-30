
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  BookOpen,
  GraduationCap,
  Download,
  ChevronDown,
  Filter,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Eye,
  FileText,
  CheckCircle2,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  matricNumber: string;
  email: string;
  phone: string;
  department: string;
  programme: string;
  faculty: string;
  level: string;
  gender: string;
  status: "Active" | "Inactive";
  dateAdmitted: string;
  courses: string[];
};

const studentsData: Student[] = [
  {
    id: 1,
    firstName: "Daniel",
    lastName: "Adebayo",
    matricNumber: "LAU/SE/21/001",
    email: "daniel.adebayo@student.lautech.edu.ng",
    phone: "08031234567",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Male",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303", "SEN 305"],
  },
  {
    id: 2,
    firstName: "Esther",
    lastName: "Akinola",
    matricNumber: "LAU/SE/21/002",
    email: "esther.akinola@student.lautech.edu.ng",
    phone: "08039876543",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Female",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303", "SEN 305"],
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Adesina",
    matricNumber: "LAU/SE/21/003",
    email: "michael.adesina@student.lautech.edu.ng",
    phone: "08123456789",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Male",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303", "SEN 305"],
  },
  {
    id: 4,
    firstName: "Deborah",
    lastName: "Afolabi",
    matricNumber: "LAU/SE/21/004",
    email: "deborah.afolabi@student.lautech.edu.ng",
    phone: "08056781234",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Female",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303", "SEN 305"],
  },
  {
    id: 5,
    firstName: "Samuel",
    lastName: "Akinyemi",
    matricNumber: "LAU/SE/21/005",
    email: "samuel.akinyemi@student.lautech.edu.ng",
    phone: "08076543210",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Male",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303"],
  },
  {
    id: 6,
    firstName: "Favour",
    lastName: "Ojo",
    matricNumber: "LAU/SE/21/006",
    email: "favour.ojo@student.lautech.edu.ng",
    phone: "08109876543",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Female",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303"],
  },
  {
    id: 7,
    firstName: "Grace",
    lastName: "Oladipo",
    matricNumber: "LAU/SE/22/007",
    email: "grace.oladipo@student.lautech.edu.ng",
    phone: "08045678912",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "200 Level",
    gender: "Female",
    status: "Active",
    dateAdmitted: "2022/2023",
    courses: ["SEN 301"],
  },
  {
    id: 8,
    firstName: "David",
    lastName: "Balogun",
    matricNumber: "LAU/SE/22/008",
    email: "david.balogun@student.lautech.edu.ng",
    phone: "08067891234",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "200 Level",
    gender: "Male",
    status: "Active",
    dateAdmitted: "2022/2023",
    courses: ["SEN 301"],
  },
  {
    id: 9,
    firstName: "Peace",
    lastName: "Ogunleye",
    matricNumber: "LAU/SE/21/009",
    email: "peace.ogunleye@student.lautech.edu.ng",
    phone: "08134567890",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Female",
    status: "Inactive",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303"],
  },
  {
    id: 10,
    firstName: "John",
    lastName: "Adekunle",
    matricNumber: "LAU/SE/21/010",
    email: "john.adekunle@student.lautech.edu.ng",
    phone: "08098765432",
    department: "Software Engineering",
    programme: "B.Tech Software Engineering",
    faculty: "Computing and Informatics",
    level: "300 Level",
    gender: "Male",
    status: "Active",
    dateAdmitted: "2021/2022",
    courses: ["SEN 301", "SEN 303"],
  },
];

const courses = [
  { code: "ALL", title: "All Assigned Courses" },
  { code: "SEN 301", title: "Software Engineering Principles" },
  { code: "SEN 303", title: "Database Management Systems" },
  { code: "SEN 305", title: "Computer Networks" },
];

const getInitials = (student: Student) =>
  `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

export default function StaffStudents() {
  const [students] = useState<Student[]>(studentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(query) ||
        student.matricNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);

      const matchesCourse =
        selectedCourse === "ALL" ||
        student.courses.includes(selectedCourse);

      const matchesLevel =
        selectedLevel === "All Levels" ||
        student.level === selectedLevel;

      const matchesStatus =
        selectedStatus === "All Status" ||
        student.status === selectedStatus;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [students, searchTerm, selectedCourse, selectedLevel, selectedStatus]);

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const levels = [...new Set(students.map((student) => student.level))];

  const exportStudents = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Matric Number",
      "Email",
      "Phone",
      "Department",
      "Programme",
      "Faculty",
      "Level",
      "Status",
      "Courses",
    ];

    const rows = filteredStudents.map((student) => [
      student.firstName,
      student.lastName,
      student.matricNumber,
      student.email,
      student.phone,
      student.department,
      student.programme,
      student.faculty,
      student.level,
      student.status,
      student.courses.join("; "),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "edunova_students.csv";
    link.click();

    URL.revokeObjectURL(url);
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
                  <span className="text-blue-700">Students</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Students
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage students enrolled in your assigned courses.
                </p>
              </div>

              <button
                onClick={exportStudents}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
              >
                <Download size={17} />
                Export Students
              </button>
            </div>

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
                  Across your assigned courses
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Active Students</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {activeStudents}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3 text-green-700">
                    <UserCheck size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Currently active students
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Assigned Courses</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {courses.length - 1}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3 text-purple-700">
                    <BookOpen size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Courses under your responsibility
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Levels</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {levels.length}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                    <GraduationCap size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Academic levels represented
                </p>
              </div>
            </section>

            {/* Filters */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Filter size={18} className="text-blue-800" />
                <h2 className="font-semibold text-slate-800">
                  Find Students
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Name, matric number or email"
                      className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Assigned Course
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourse}
                      onChange={(event) =>
                        setSelectedCourse(event.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    >
                      {courses.map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.title}
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
                    Academic Level
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLevel}
                      onChange={(event) => setSelectedLevel(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    >
                      <option>All Levels</option>
                      {levels.map((level) => (
                        <option key={level}>{level}</option>
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
                    Student Status
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(event) => setSelectedStatus(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Students table */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Student Directory
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Students registered in your assigned courses.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                  {filteredStudents.length} Students
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Student</th>
                      <th className="px-4 py-4 font-semibold">
                        Matric Number
                      </th>
                      <th className="px-4 py-4 font-semibold">Department</th>
                      <th className="px-4 py-4 font-semibold">Level</th>
                      <th className="px-4 py-4 font-semibold">Courses</th>
                      <th className="px-4 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-center font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-800">
                              {getInitials(student)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-600">
                          {student.matricNumber}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {student.department}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {student.level}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {student.courses.length} Courses
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              student.status === "Active"
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                student.status === "Active"
                                  ? "bg-green-600"
                                  : "bg-slate-400"
                              }`}
                            />
                            {student.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-800 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-14 text-center">
                          <Users
                            size={30}
                            className="mx-auto mb-3 text-slate-300"
                          />
                          <p className="font-semibold text-slate-700">
                            No students found
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Try changing your search or filter criteria.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
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
                  EduNova Staff Portal
                </p>
              </div>
            </section>

            {/* Student profile modal */}
            {selectedStudent && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                onClick={() => setSelectedStudent(null)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="student-profile-title"
                  onClick={(event) => event.stopPropagation()}
                  className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2
                        id="student-profile-title"
                        className="text-lg font-bold text-slate-900"
                      >
                        Student Profile
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Student information and course enrolment.
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close profile"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-900">
                        {getInitials(selectedStudent)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedStudent.firstName}{" "}
                          {selectedStudent.lastName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {selectedStudent.matricNumber}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            selectedStudent.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {selectedStudent.status} Student
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="mb-4 text-sm font-bold text-slate-900">
                        Personal Information
                      </h4>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <Mail size={18} className="mt-0.5 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Email</p>
                            <p className="mt-1 break-all text-sm font-medium text-slate-700">
                              {selectedStudent.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone size={18} className="mt-0.5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Phone</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedStudent.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="mt-0.5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Department</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedStudent.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <GraduationCap
                            size={18}
                            className="mt-0.5 text-slate-400"
                          />
                          <div>
                            <p className="text-xs text-slate-400">Programme</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedStudent.programme}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <BookOpen
                            size={18}
                            className="mt-0.5 text-slate-400"
                          />
                          <div>
                            <p className="text-xs text-slate-400">Faculty</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedStudent.faculty}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarDays
                            size={18}
                            className="mt-0.5 text-slate-400"
                          />
                          <div>
                            <p className="text-xs text-slate-400">
                              Admission Session
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedStudent.dateAdmitted}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 border-t border-slate-100 pt-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">
                          Enrolled Courses
                        </h4>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                          {selectedStudent.courses.length} Courses
                        </span>
                      </div>

                      <div className="space-y-2">
                        {selectedStudent.courses.map((courseCode) => {
                          const course = courses.find(
                            (item) => item.code === courseCode
                          );

                          return (
                            <div
                              key={courseCode}
                              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-800">
                                  <FileText size={17} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {courseCode}
                                  </p>
                                  <p className="truncate text-xs text-slate-500">
                                    {course?.title ?? "Course details unavailable"}
                                  </p>
                                </div>
                              </div>

                              <CheckCircle2
                                size={17}
                                className="shrink-0 text-green-600"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                      >
                        Close Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <footer className="pb-4 pt-2 text-center text-xs text-slate-400">
              EduNova Staff Portal © {new Date().getFullYear()}. All rights
              reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
