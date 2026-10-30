
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Filter,
  Eye,
  X,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  MessageSquare,
  Plus,
  FileText,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

type AcademicStatus = "Good Standing" | "Needs Attention" | "At Risk";

type AdvisingNote = {
  id: number;
  date: string;
  topic: string;
  note: string;
  recommendation: string;
  followUp: string;
};

type Appointment = {
  id: number;
  date: string;
  time: string;
  purpose: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

type Advisee = {
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
  cgpa: number;
  previousCgpa: number;
  registeredUnits: number;
  earnedUnits: number;
  failedCourses: number;
  status: AcademicStatus;
  notes: AdvisingNote[];
  appointments: Appointment[];
};

const initialAdvisees: Advisee[] = [
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
    cgpa: 4.32,
    previousCgpa: 4.18,
    registeredUnits: 21,
    earnedUnits: 21,
    failedCourses: 0,
    status: "Good Standing",
    notes: [
      {
        id: 1,
        date: "2026-09-12",
        topic: "Academic Progress Review",
        note: "Student demonstrated consistent academic improvement.",
        recommendation: "Maintain current study routine and participate in departmental activities.",
        followUp: "Review progress at the end of the semester.",
      },
    ],
    appointments: [
      {
        id: 1,
        date: "2026-11-05",
        time: "10:00 AM",
        purpose: "Semester Progress Review",
        status: "Scheduled",
      },
    ],
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
    cgpa: 4.75,
    previousCgpa: 4.60,
    registeredUnits: 20,
    earnedUnits: 20,
    failedCourses: 0,
    status: "Good Standing",
    notes: [],
    appointments: [],
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
    cgpa: 2.41,
    previousCgpa: 2.78,
    registeredUnits: 19,
    earnedUnits: 16,
    failedCourses: 2,
    status: "At Risk",
    notes: [
      {
        id: 2,
        date: "2026-09-15",
        topic: "Academic Performance Concern",
        note: "Student reported difficulty balancing academic activities and personal commitments.",
        recommendation: "Develop a structured study timetable and seek support in challenging courses.",
        followUp: "Check academic progress in four weeks.",
      },
    ],
    appointments: [
      {
        id: 2,
        date: "2026-11-02",
        time: "12:00 PM",
        purpose: "Academic Intervention",
        status: "Scheduled",
      },
    ],
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
    cgpa: 3.62,
    previousCgpa: 3.58,
    registeredUnits: 21,
    earnedUnits: 21,
    failedCourses: 0,
    status: "Good Standing",
    notes: [],
    appointments: [
      {
        id: 3,
        date: "2026-10-20",
        time: "11:00 AM",
        purpose: "Course Selection Guidance",
        status: "Scheduled",
      },
    ],
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
    cgpa: 1.89,
    previousCgpa: 2.15,
    registeredUnits: 18,
    earnedUnits: 14,
    failedCourses: 3,
    status: "At Risk",
    notes: [
      {
        id: 3,
        date: "2026-09-10",
        topic: "Academic Warning",
        note: "Student's CGPA has declined over consecutive semesters.",
        recommendation: "Prioritise failed courses and attend available academic support sessions.",
        followUp: "Arrange a follow-up meeting before registration.",
      },
    ],
    appointments: [],
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
    cgpa: 3.05,
    previousCgpa: 3.12,
    registeredUnits: 20,
    earnedUnits: 18,
    failedCourses: 1,
    status: "Needs Attention",
    notes: [],
    appointments: [],
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
    cgpa: 3.88,
    previousCgpa: 3.71,
    registeredUnits: 19,
    earnedUnits: 19,
    failedCourses: 0,
    status: "Good Standing",
    notes: [],
    appointments: [],
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
    cgpa: 2.95,
    previousCgpa: 3.10,
    registeredUnits: 20,
    earnedUnits: 19,
    failedCourses: 0,
    status: "Needs Attention",
    notes: [],
    appointments: [],
  },
];

const statusStyles: Record<AcademicStatus, string> = {
  "Good Standing": "bg-green-50 text-green-700",
  "Needs Attention": "bg-amber-50 text-amber-700",
  "At Risk": "bg-red-50 text-red-700",
};

const getInitials = (student: Advisee) =>
  `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StaffAdvising() {
  const [advisees, setAdvisees] = useState<Advisee[]>(initialAdvisees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAdvisee, setSelectedAdvisee] = useState<Advisee | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "appointments">("overview");

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const [noteForm, setNoteForm] = useState({
    topic: "",
    note: "",
    recommendation: "",
    followUp: "",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "10:00",
    purpose: "",
  });

  const [notice, setNotice] = useState("");

  const levels = [...new Set(advisees.map((student) => student.level))];

  const filteredAdvisees = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return advisees.filter((student) => {
      const matchesSearch =
        !query ||
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(query) ||
        student.matricNumber.toLowerCase().includes(query);

      const matchesLevel =
        selectedLevel === "All Levels" || student.level === selectedLevel;

      const matchesStatus =
        selectedStatus === "All Status" || student.status === selectedStatus;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [advisees, searchTerm, selectedLevel, selectedStatus]);

  const goodStanding = advisees.filter(
    (student) => student.status === "Good Standing"
  ).length;

  const needsAttention = advisees.filter(
    (student) => student.status === "Needs Attention"
  ).length;

  const atRisk = advisees.filter(
    (student) => student.status === "At Risk"
  ).length;

  const allAppointments = advisees.flatMap((student) =>
    student.appointments.map((appointment) => ({
      ...appointment,
      studentName: `${student.firstName} ${student.lastName}`,
      matricNumber: student.matricNumber,
      studentId: student.id,
    }))
  );

  const pendingAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Scheduled"
  );

  const updateStudent = (updated: Advisee) => {
    setAdvisees((previous) =>
      previous.map((student) =>
        student.id === updated.id ? updated : student
      )
    );
    setSelectedAdvisee(updated);
  };

  const saveNote = () => {
    if (
      !selectedAdvisee ||
      !noteForm.topic.trim() ||
      !noteForm.note.trim()
    ) {
      setNotice("Please provide a topic and advising note.");
      return;
    }

    const updated: Advisee = {
      ...selectedAdvisee,
      notes: [
        {
          id: Date.now(),
          date: new Date().toISOString().slice(0, 10),
          topic: noteForm.topic.trim(),
          note: noteForm.note.trim(),
          recommendation: noteForm.recommendation.trim() || "No recommendation added.",
          followUp: noteForm.followUp.trim() || "No follow-up specified.",
        },
        ...selectedAdvisee.notes,
      ],
    };

    updateStudent(updated);
    setNoteForm({
      topic: "",
      note: "",
      recommendation: "",
      followUp: "",
    });
    setShowNoteForm(false);
    setNotice("Advising note added successfully.");
  };

  const saveAppointment = () => {
    if (
      !selectedAdvisee ||
      !appointmentForm.date ||
      !appointmentForm.purpose.trim()
    ) {
      setNotice("Please provide an appointment date and purpose.");
      return;
    }

    const updated: Advisee = {
      ...selectedAdvisee,
      appointments: [
        ...selectedAdvisee.appointments,
        {
          id: Date.now(),
          date: appointmentForm.date,
          time: new Date(
            `2000-01-01T${appointmentForm.time}:00`
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          purpose: appointmentForm.purpose.trim(),
          status: "Scheduled",
        },
      ],
    };

    updateStudent(updated);
    setAppointmentForm({
      date: "",
      time: "10:00",
      purpose: "",
    });
    setShowAppointmentForm(false);
    setNotice("Advising appointment scheduled successfully.");
  };

  const updateAppointmentStatus = (
    studentId: number,
    appointmentId: number,
    status: Appointment["status"]
  ) => {
    setAdvisees((previous) =>
      previous.map((student) =>
        student.id !== studentId
          ? student
          : {
              ...student,
              appointments: student.appointments.map((appointment) =>
                appointment.id === appointmentId
                  ? { ...appointment, status }
                  : appointment
              ),
            }
      )
    );

    if (selectedAdvisee?.id === studentId) {
      setSelectedAdvisee(
        advisees
          .find((student) => student.id === studentId)
          ? {
              ...advisees.find((student) => student.id === studentId)!,
              appointments: advisees
                .find((student) => student.id === studentId)!
                .appointments.map((appointment) =>
                  appointment.id === appointmentId
                    ? { ...appointment, status }
                    : appointment
                ),
            }
          : null
      );
    }

    setNotice(`Appointment marked as ${status.toLowerCase()}.`);
  };

  const exportAdvisees = () => {
    const headers = [
      "Name",
      "Matric Number",
      "Department",
      "Level",
      "CGPA",
      "Registered Units",
      "Earned Units",
      "Failed Courses",
      "Academic Status",
    ];

    const rows = filteredAdvisees.map((student) => [
      `${student.firstName} ${student.lastName}`,
      student.matricNumber,
      student.department,
      student.level,
      student.cgpa.toFixed(2),
      student.registeredUnits,
      student.earnedUnits,
      student.failedCourses,
      student.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "edunova_advisees.csv";
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
                  <span className="text-blue-700">Academic Advising</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Academic Advising
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor student progress, provide guidance and manage advising activities.
                </p>
              </div>

              <button
                onClick={exportAdvisees}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
              >
                <FileText size={17} />
                Export Advisees
              </button>
            </div>

            {/* Notice */}
            {notice && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} />
                  {notice}
                </span>
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Statistics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Advisees</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {advisees.length}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-800">
                    <Users size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Students assigned to you
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Good Standing</p>
                    <h3 className="mt-2 text-2xl font-bold text-green-700">
                      {goodStanding}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3 text-green-700">
                    <CheckCircle2 size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Students progressing well
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Needs Attention</p>
                    <h3 className="mt-2 text-2xl font-bold text-amber-600">
                      {needsAttention}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                    <AlertTriangle size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Students requiring monitoring
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">At Risk</p>
                    <h3 className="mt-2 text-2xl font-bold text-red-600">
                      {atRisk}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3 text-red-700">
                    <TrendingDown size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Students requiring intervention
                </p>
              </div>
            </section>

            {/* Academic attention */}
            {atRisk > 0 && (
              <section className="flex flex-col justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2 text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">
                      Academic attention required
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      {atRisk} students in your advisee list are flagged as at risk.
                      Review their academic records and arrange appropriate support.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStatus("At Risk")}
                  className="flex shrink-0 items-center gap-2 text-sm font-semibold text-red-800 hover:text-red-950"
                >
                  View students
                  <ArrowUpRight size={16} />
                </button>
              </section>
            )}

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("overview")}
                className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                  activeTab === "overview"
                    ? "border-blue-800 text-blue-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Advisee Overview
              </button>

              <button
                onClick={() => setActiveTab("appointments")}
                className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                  activeTab === "appointments"
                    ? "border-blue-800 text-blue-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Appointments
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-800">
                  {pendingAppointments.length}
                </span>
              </button>
            </div>

            {activeTab === "overview" ? (
              <>
                {/* Filters */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Filter size={18} className="text-blue-800" />
                    <h2 className="font-semibold text-slate-800">
                      Find Advisees
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Search Student
                      </label>
                      <div className="relative">
                        <Search
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Name or matric number..."
                          className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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
                          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700"
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
                        Academic Standing
                      </label>
                      <div className="relative">
                        <select
                          value={selectedStatus}
                          onChange={(event) => setSelectedStatus(event.target.value)}
                          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-700"
                        >
                          <option>All Status</option>
                          <option>Good Standing</option>
                          <option>Needs Attention</option>
                          <option>At Risk</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Advisee table */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Advisee Directory
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Academic performance and student information.
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                      {filteredAdvisees.length} Students
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-4 font-semibold">Student</th>
                          <th className="px-4 py-4 font-semibold">Level</th>
                          <th className="px-4 py-4 text-center font-semibold">CGPA</th>
                          <th className="px-4 py-4 text-center font-semibold">Units</th>
                          <th className="px-4 py-4 text-center font-semibold">Failed Courses</th>
                          <th className="px-4 py-4 font-semibold">Academic Standing</th>
                          <th className="px-5 py-4 text-center font-semibold">Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredAdvisees.map((student) => (
                          <tr key={student.id} className="transition hover:bg-slate-50/80">
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
                                    {student.matricNumber}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {student.level}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <div className="font-bold text-slate-800">
                                {student.cgpa.toFixed(2)}
                              </div>
                              <div className={`mt-1 inline-flex items-center gap-1 text-xs ${
                                student.cgpa >= student.previousCgpa
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}>
                                {student.cgpa >= student.previousCgpa
                                  ? <TrendingUp size={12} />
                                  : <TrendingDown size={12} />}
                                {Math.abs(student.cgpa - student.previousCgpa).toFixed(2)}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-center text-slate-600">
                              {student.earnedUnits}/{student.registeredUnits}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <span className={`font-semibold ${
                                student.failedCourses > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}>
                                {student.failedCourses}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[student.status]}`}>
                                {student.status}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedAdvisee(student);
                                  setShowNoteForm(false);
                                  setShowAppointmentForm(false);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-800 transition hover:border-blue-200 hover:bg-blue-50"
                              >
                                <Eye size={14} />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}

                        {filteredAdvisees.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-5 py-14 text-center">
                              <Users size={30} className="mx-auto mb-3 text-slate-300" />
                              <p className="font-semibold text-slate-700">No advisees found</p>
                              <p className="mt-1 text-sm text-slate-400">
                                Try changing your search or filters.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
                    Showing {filteredAdvisees.length} of {advisees.length} advisees
                  </div>
                </section>
              </>
            ) : (
              /* Appointments */
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Advising Appointments
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review and manage your scheduled student meetings.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                    {pendingAppointments.length} Upcoming
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {allAppointments.length > 0 ? (
                    allAppointments
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-800">
                              <CalendarDays size={20} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">
                                {appointment.purpose}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {appointment.studentName}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {appointment.matricNumber}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <CalendarDays size={13} />
                                  {formatDate(appointment.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={13} />
                                  {appointment.time}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              appointment.status === "Scheduled"
                                ? "bg-blue-50 text-blue-700"
                                : appointment.status === "Completed"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-slate-100 text-slate-500"
                            }`}>
                              {appointment.status}
                            </span>

                            {appointment.status === "Scheduled" && (
                              <button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.studentId,
                                    appointment.id,
                                    "Completed"
                                  )
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="px-5 py-14 text-center">
                      <CalendarDays size={30} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-700">No appointments yet</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Appointments will appear here when scheduled from a student profile.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Student advising profile modal */}
            {selectedAdvisee && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                onClick={() => setSelectedAdvisee(null)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="advising-profile-title"
                  onClick={(event) => event.stopPropagation()}
                  className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2 id="advising-profile-title" className="text-lg font-bold text-slate-900">
                        Student Advising Profile
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Academic information, advising history and appointments.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedAdvisee(null)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      aria-label="Close profile"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6 p-6">
                    {/* Profile summary */}
                    <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-900">
                        {getInitials(selectedAdvisee)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedAdvisee.firstName} {selectedAdvisee.lastName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {selectedAdvisee.matricNumber}
                        </p>
                        <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[selectedAdvisee.status]}`}>
                          {selectedAdvisee.status}
                        </span>
                      </div>
                    </div>

                    {/* Academic summary */}
                    <div>
                      <h4 className="mb-3 text-sm font-bold text-slate-900">
                        Academic Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { label: "Current CGPA", value: selectedAdvisee.cgpa.toFixed(2) },
                          { label: "Previous CGPA", value: selectedAdvisee.previousCgpa.toFixed(2) },
                          { label: "Units Registered", value: selectedAdvisee.registeredUnits },
                          { label: "Units Earned", value: selectedAdvisee.earnedUnits },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg border border-slate-100 p-3">
                            <p className="text-xs text-slate-400">{item.label}</p>
                            <p className="mt-2 text-xl font-bold text-slate-800">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                        <span className="text-sm font-medium text-red-800">
                          Failed Courses
                        </span>
                        <span className="font-bold text-red-700">
                          {selectedAdvisee.failedCourses}
                        </span>
                      </div>
                    </div>

                    {/* Student information */}
                    <div>
                      <h4 className="mb-3 text-sm font-bold text-slate-900">
                        Student Information
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <Mail size={17} className="mt-0.5 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Email</p>
                            <p className="mt-1 break-all text-sm font-medium text-slate-700">
                              {selectedAdvisee.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone size={17} className="mt-0.5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Phone</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedAdvisee.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen size={17} className="mt-0.5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Department</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedAdvisee.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <GraduationCap size={17} className="mt-0.5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Programme / Level</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedAdvisee.programme} · {selectedAdvisee.level}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advising notes */}
                    <div className="border-t border-slate-100 pt-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            Advising Notes
                          </h4>
                          <p className="mt-1 text-xs text-slate-400">
                            Record discussions and academic recommendations.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowNoteForm((previous) => !previous);
                            setShowAppointmentForm(false);
                          }}
                          className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                        >
                          <Plus size={15} />
                          Add Note
                        </button>
                      </div>

                      {showNoteForm && (
                        <div className="mb-5 space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Discussion Topic
                            </label>
                            <input
                              value={noteForm.topic}
                              onChange={(event) =>
                                setNoteForm({ ...noteForm, topic: event.target.value })
                              }
                              placeholder="e.g. Academic performance review"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Discussion Notes
                            </label>
                            <textarea
                              rows={3}
                              value={noteForm.note}
                              onChange={(event) =>
                                setNoteForm({ ...noteForm, note: event.target.value })
                              }
                              placeholder="Record the key points discussed..."
                              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Recommendations
                            </label>
                            <textarea
                              rows={2}
                              value={noteForm.recommendation}
                              onChange={(event) =>
                                setNoteForm({
                                  ...noteForm,
                                  recommendation: event.target.value,
                                })
                              }
                              placeholder="What should the student do next?"
                              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Follow-up Action
                            </label>
                            <input
                              value={noteForm.followUp}
                              onChange={(event) =>
                                setNoteForm({ ...noteForm, followUp: event.target.value })
                              }
                              placeholder="e.g. Review progress in four weeks"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setShowNoteForm(false)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveNote}
                              className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {selectedAdvisee.notes.length ? (
                          selectedAdvisee.notes.map((note) => (
                            <div key={note.id} className="rounded-lg border border-slate-100 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h5 className="text-sm font-semibold text-slate-800">
                                  {note.topic}
                                </h5>
                                <span className="text-xs text-slate-400">
                                  {formatDate(note.date)}
                                </span>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {note.note}
                              </p>
                              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-slate-500">
                                  Recommendation
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  {note.recommendation}
                                </p>
                              </div>
                              <p className="mt-3 text-xs text-slate-500">
                                <span className="font-semibold">Follow-up:</span>{" "}
                                {note.followUp}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
                            <MessageSquare size={24} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-sm font-medium text-slate-600">
                              No advising notes yet
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Add a note after your next advising discussion.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Appointments */}
                    <div className="border-t border-slate-100 pt-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            Appointments
                          </h4>
                          <p className="mt-1 text-xs text-slate-400">
                            Manage advising meetings with this student.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowAppointmentForm((previous) => !previous);
                            setShowNoteForm(false);
                          }}
                          className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                        >
                          <Plus size={15} />
                          Schedule Meeting
                        </button>
                      </div>

                      {showAppointmentForm && (
                        <div className="mb-5 space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                Meeting Date
                              </label>
                              <input
                                type="date"
                                min={new Date().toISOString().slice(0, 10)}
                                value={appointmentForm.date}
                                onChange={(event) =>
                                  setAppointmentForm({
                                    ...appointmentForm,
                                    date: event.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                Meeting Time
                              </label>
                              <input
                                type="time"
                                value={appointmentForm.time}
                                onChange={(event) =>
                                  setAppointmentForm({
                                    ...appointmentForm,
                                    time: event.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Meeting Purpose
                            </label>
                            <input
                              value={appointmentForm.purpose}
                              onChange={(event) =>
                                setAppointmentForm({
                                  ...appointmentForm,
                                  purpose: event.target.value,
                                })
                              }
                              placeholder="e.g. Academic progress review"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setShowAppointmentForm(false)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveAppointment}
                              className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                            >
                              Schedule Meeting
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedAdvisee.appointments.length ? (
                        <div className="space-y-2">
                          {selectedAdvisee.appointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex flex-col justify-between gap-3 rounded-lg border border-slate-100 p-3 sm:flex-row sm:items-center"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {appointment.purpose}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {formatDate(appointment.date)} · {appointment.time}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  appointment.status === "Scheduled"
                                    ? "bg-blue-50 text-blue-700"
                                    : appointment.status === "Completed"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-slate-100 text-slate-500"
                                }`}>
                                  {appointment.status}
                                </span>

                                {appointment.status === "Scheduled" && (
                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        selectedAdvisee.id,
                                        appointment.id,
                                        "Completed"
                                      )
                                    }
                                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                  >
                                    Mark Completed
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
                          <CalendarDays size={24} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-sm font-medium text-slate-600">
                            No appointments scheduled
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-5">
                      <button
                        onClick={() => setSelectedAdvisee(null)}
                        className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                      >
                        Close Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <footer className="pb-4 pt-2 text-center text-xs text-slate-400">
              EduNova Staff Portal © {new Date().getFullYear()}. All rights reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
