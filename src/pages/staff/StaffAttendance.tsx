import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
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
  Upload,
  RefreshCw,
  FileText,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

import {
  getStaffAttendanceCourses,
  createAttendanceSession,
  getAttendanceSession,
  saveAttendanceSession,
  exportAttendanceSession,
  importAttendanceSession,
} from "../../lib/api";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Unmarked";

interface AttendanceCourse {
  id: string;
  code: string;
  title: string;
  students: number;
}

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

interface AttendanceSession {
  id: string;
  date: string;
  classType: string;
}

const ATTENDANCE_OPTIONS: AttendanceStatus[] = [
  "Present",
  "Absent",
  "Late",
  "Unmarked",
];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-red-50 text-red-700 border-red-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  Unmarked: "bg-slate-100 text-slate-600 border-slate-200",
};

const EMPTY_RECORD: AttendanceRecord = {
  status: "Unmarked",
  note: "",
};

function getObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

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
    return getText(
      value as Record<string, unknown>,
      ["name", "full_name", "title", "code", "label"],
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

  if (typeof value === "string" && value.trim()) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  if (Array.isArray(value)) {
    return value.length;
  }

  return fallback;
}

function unwrapResponse(response: unknown): unknown {
  let current = response;

  // Unwrap common API response structures without repeatedly
  // unwrapping student or course objects.
  for (let i = 0; i < 3; i += 1) {
    const object = getObject(current);

    if (
      object.data !== undefined &&
      Object.keys(object).length <= 4
    ) {
      current = object.data;
      continue;
    }

    break;
  }

  return current;
}

function getRows(
  payload: unknown,
  keys: string[],
): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.map(getObject);
  }

  const object = getObject(payload);

  for (const key of keys) {
    if (Array.isArray(object[key])) {
      return (object[key] as unknown[]).map(getObject);
    }
  }

  return [];
}

function normalizeCourse(
  item: Record<string, unknown>,
  index: number,
): AttendanceCourse {
  const nestedCourse = getObject(
    getValue(item, ["course", "course_offering"]),
  );

  const code =
    getText(item, ["course_code", "code", "courseCode"]) ||
    getText(nestedCourse, ["course_code", "code"], "Course");

  const title =
    getText(item, ["course_title", "course_name", "title", "name"]) ||
    getText(
      nestedCourse,
      ["course_title", "course_name", "title", "name"],
      "Untitled course",
    );

  return {
    id:
      getText(item, [
        "course_offering_id",
        "offering_id",
        "id",
      ]) ||
      getText(nestedCourse, ["course_offering_id", "id"]) ||
      `${code}-${index}`,
    code,
    title,
    students: getNumber(item, [
      "student_count",
      "total_students",
      "students_count",
      "enrolled_students",
      "students",
    ]),
  };
}

function normalizeStudent(
  item: Record<string, unknown>,
  index: number,
): Student {
  const nestedStudent = getObject(
    getValue(item, ["student", "student_profile", "user"]),
  );

  const id =
    getText(item, ["student_id", "id", "user_id"]) ||
    getText(nestedStudent, ["student_id", "id", "user_id"]) ||
    `student-${index}`;

  const firstName =
    getText(item, ["first_name"]) ||
    getText(nestedStudent, ["first_name"]);

  const lastName =
    getText(item, ["last_name"]) ||
    getText(nestedStudent, ["last_name"]);

  const fullName =
    getText(item, [
      "student_name",
      "full_name",
      "student_full_name",
      "name",
    ]) ||
    getText(nestedStudent, ["full_name", "name"]) ||
    `${firstName} ${lastName}`.trim();

  const department =
    getText(item, ["department_name", "department"]) ||
    getText(nestedStudent, ["department_name", "department"]) ||
    "—";

  return {
    id,
    matricNumber:
      getText(item, [
        "matric_number",
        "matric_no",
        "registration_number",
        "student_number",
      ]) ||
      getText(nestedStudent, [
        "matric_number",
        "matric_no",
        "registration_number",
        "student_number",
      ]) ||
      "Not available",
    name: fullName || "Unnamed student",
    department,
    level:
      getText(item, ["level", "student_level"]) ||
      getText(nestedStudent, ["level", "student_level"]) ||
      "—",
  };
}

function normalizeStatus(value: unknown): AttendanceStatus {
  const status = String(value ?? "")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");

  if (status === "PRESENT") return "Present";
  if (status === "ABSENT") return "Absent";
  if (status === "LATE") return "Late";

  return "Unmarked";
}

function normalizeAttendanceRecord(
  item: Record<string, unknown>,
): AttendanceRecord {
  const nestedAttendance = getObject(
    getValue(item, ["attendance", "attendance_record"]),
  );

  const statusValue =
    getValue(item, ["status", "attendance_status"]) ??
    getValue(nestedAttendance, ["status", "attendance_status"]);

  const note =
    getText(item, ["note", "remarks", "comment"]) ||
    getText(nestedAttendance, ["note", "remarks", "comment"]);

  return {
    status: normalizeStatus(statusValue),
    note,
  };
}

function normalizeSession(
  response: unknown,
  date: string,
  classType: string,
): AttendanceSession | null {
  const payload = getObject(unwrapResponse(response));

  const nestedSession = getObject(
    getValue(payload, ["session", "attendance_session"]),
  );

  const source =
    Object.keys(nestedSession).length > 0
      ? nestedSession
      : payload;

  const id = getText(source, [
    "attendance_session_id",
    "session_id",
    "id",
  ]);

  if (!id) return null;

  return {
    id,
    date: getText(
      source,
      ["date", "attendance_date", "class_date"],
      date,
    ),
    classType: getText(
      source,
      ["class_type", "session_type", "type"],
      classType,
    ),
  };
}

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
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
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
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export default function StaffAttendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const importInputRef = useRef<HTMLInputElement>(null);

  const [courses, setCourses] = useState<AttendanceCourse[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<
    Record<string, AttendanceRecord>
  >({});
  const [savedRecords, setSavedRecords] = useState<
    Record<string, AttendanceRecord>
  >({});

  const [selectedCourseId, setSelectedCourseId] = useState(
    searchParams.get("course_id") ?? "",
  );

  const [attendanceDate, setAttendanceDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [sessionType, setSessionType] = useState("Lecture");
  const [attendanceSession, setAttendanceSession] =
    useState<AttendanceSession | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(records) !== JSON.stringify(savedRecords),
    [records, savedRecords],
  );

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    setError("");

    try {
      const response = await getStaffAttendanceCourses();
      const payload = unwrapResponse(response);

      const courseRows = getRows(payload, [
        "courses",
        "items",
        "results",
        "data",
      ]).map(normalizeCourse);

      setCourses(courseRows);

      const requestedId = searchParams.get("course_id");
      const requestedCode = searchParams.get("course");

      const matchingCourse =
        courseRows.find((course) => course.id === requestedId) ||
        courseRows.find(
          (course) =>
            course.code.toLowerCase() ===
            (requestedCode ?? "").toLowerCase(),
        );

      setSelectedCourseId((current) => {
        if (current && courseRows.some((course) => course.id === current)) {
          return current;
        }

        return matchingCourse?.id ?? courseRows[0]?.id ?? "";
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load attendance courses.",
      );
    } finally {
      setLoadingCourses(false);
    }
  }, [searchParams]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses, retryKey]);

  useEffect(() => {
    if (!selectedCourseId) return;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("course_id", selectedCourseId);
        return next;
      },
      { replace: true },
    );
  }, [selectedCourseId, setSearchParams]);

  const loadAttendanceSession = useCallback(async () => {
    if (!selectedCourseId || !attendanceDate) {
      setAttendanceSession(null);
      setStudents([]);
      setRecords({});
      setSavedRecords({});
      return;
    }

    setLoadingRoster(true);
    setError("");
    setSaveMessage("");
    setAttendanceSession(null);
    setStudents([]);
    setRecords({});
    setSavedRecords({});

    try {
      const sessionResponse = await createAttendanceSession({
        course_offering_id: selectedCourseId,
        date: attendanceDate,
        class_type: sessionType,
      });

      const session = normalizeSession(
        sessionResponse,
        attendanceDate,
        sessionType,
      );

      if (!session) {
        throw new Error(
          "The attendance session response did not include a session ID.",
        );
      }

      setAttendanceSession(session);

      const detailResponse = await getAttendanceSession(session.id);
      const detail = unwrapResponse(detailResponse);
      const detailObject = getObject(detail);

      const studentRows = getRows(detail, [
        "students",
        "roster",
        "records",
        "attendance",
        "items",
        "results",
      ]);

      // Some APIs return the roster nested inside the session.
      const nestedSession = getObject(
        getValue(detailObject, ["session", "attendance_session"]),
      );

      const finalRows =
        studentRows.length > 0
          ? studentRows
          : getRows(nestedSession, [
              "students",
              "roster",
              "records",
              "attendance",
              "items",
              "results",
            ]);

      const normalizedStudents = finalRows.map(normalizeStudent);
      const nextRecords: Record<string, AttendanceRecord> = {};

      finalRows.forEach((row, index) => {
        const student = normalizedStudents[index];
        nextRecords[student.id] = normalizeAttendanceRecord(row);
      });

      setStudents(normalizedStudents);
      setRecords(nextRecords);
      setSavedRecords(
        JSON.parse(JSON.stringify(nextRecords)) as Record<
          string,
          AttendanceRecord
        >,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the attendance roster.",
      );
      setAttendanceSession(null);
      setStudents([]);
      setRecords({});
      setSavedRecords({});
    } finally {
      setLoadingRoster(false);
    }
  }, [selectedCourseId, attendanceDate, sessionType]);

  useEffect(() => {
    void loadAttendanceSession();
  }, [loadAttendanceSession]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const record = records[student.id] ?? EMPTY_RECORD;

      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, records, searchTerm, statusFilter]);

  const attendanceCounts = useMemo(() => {
    const counts: Record<AttendanceStatus, number> = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Unmarked: 0,
    };

    students.forEach((student) => {
      const status = records[student.id]?.status ?? "Unmarked";
      counts[status] += 1;
    });

    return counts;
  }, [students, records]);

  const markedCount =
    attendanceCounts.Present +
    attendanceCounts.Absent +
    attendanceCounts.Late;

  const attendanceRate =
    markedCount > 0
      ? Math.round(
          ((attendanceCounts.Present + attendanceCounts.Late) /
            markedCount) *
            100,
        )
      : 0;

  const updateStatus = (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    setRecords((current) => ({
      ...current,
      [studentId]: {
        ...(current[studentId] ?? EMPTY_RECORD),
        status,
      },
    }));

    setSaveMessage("");
  };

  const updateNote = (studentId: string, note: string) => {
    setRecords((current) => ({
      ...current,
      [studentId]: {
        ...(current[studentId] ?? EMPTY_RECORD),
        note,
      },
    }));

    setSaveMessage("");
  };

  const markAllPresent = () => {
    setRecords((current) => {
      const updated = { ...current };

      students.forEach((student) => {
        updated[student.id] = {
          ...(updated[student.id] ?? EMPTY_RECORD),
          status: "Present",
        };
      });

      return updated;
    });

    setSaveMessage("");
  };

  const resetAttendance = () => {
    const confirmed = window.confirm(
      "Reset every student's attendance status and note for this session?",
    );

    if (!confirmed) return;

    const resetRecords: Record<string, AttendanceRecord> = {};

    students.forEach((student) => {
      resetRecords[student.id] = { ...EMPTY_RECORD };
    });

    setRecords(resetRecords);
    setSaveMessage("");
  };

  const saveAttendance = async () => {
    if (!attendanceSession?.id) {
      setError("Open an attendance session before saving.");
      return;
    }

    const unmarked = students.filter(
      (student) =>
        (records[student.id]?.status ?? "Unmarked") === "Unmarked",
    );

    if (unmarked.length > 0) {
      const confirmed = window.confirm(
        `${unmarked.length} student(s) are still unmarked. Save the attendance sheet anyway?`,
      );

      if (!confirmed) return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const attendanceRecords = students.map((student) => {
        const status = records[student.id]?.status ?? "Unmarked";

        return {
          student_id: student.id,
          status: status.toUpperCase() as
            | "PRESENT"
            | "ABSENT"
            | "LATE"
            | "UNMARKED",
          note: records[student.id]?.note ?? "",
        };
      });

      await saveAttendanceSession(attendanceSession.id, {
        records: attendanceRecords,
      });

      setSavedRecords(
        JSON.parse(JSON.stringify(records)) as Record<
          string,
          AttendanceRecord
        >,
      );

      setSaveMessage("Attendance was submitted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  const exportAttendance = async () => {
    if (!attendanceSession?.id) {
      setError("Open an attendance session before exporting.");
      return;
    }

    setExporting(true);
    setError("");
    setSaveMessage("");

    try {
      await exportAttendanceSession(attendanceSession.id);
      setSaveMessage("Attendance export started.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export attendance.",
      );
    } finally {
      setExporting(false);
    }
  };

  const importAttendance = async (file?: File) => {
    if (!file) return;

    if (!attendanceSession?.id) {
      setError("Open an attendance session before importing a file.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Please select an .xlsx file.");
      return;
    }

    setImporting(true);
    setError("");
    setSaveMessage("");

    try {
      await importAttendanceSession(attendanceSession.id, file);

      // Reload from the backend so the page reflects imported data.
      await loadAttendanceSession();

      setSaveMessage("Attendance file imported successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to import the attendance file.",
      );
    } finally {
      setImporting(false);

      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

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
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  disabled={
                    importing ||
                    loadingRoster ||
                    !attendanceSession
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {importing ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Upload size={17} />
                  )}
                  Import XLSX
                </button>

                <input
                  ref={importInputRef}
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(event) =>
                    void importAttendance(event.target.files?.[0])
                  }
                />

                <button
                  type="button"
                  onClick={() => void exportAttendance()}
                  disabled={exporting || !attendanceSession}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {exporting ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Download size={17} />
                  )}
                  Export CSV
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <div className="flex-1">{error}</div>

                <button
                  type="button"
                  onClick={() => setRetryKey((value) => value + 1)}
                  className="shrink-0 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Students"
                value={students.length}
                description="Students on this class roster"
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
                  Choose the course, date, and class type to open its
                  attendance session.
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
                    value={selectedCourseId}
                    onChange={(event) => {
                      setSelectedCourseId(event.target.value);
                      setSaveMessage("");
                    }}
                    disabled={loadingCourses || courses.length === 0}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 disabled:bg-slate-50"
                  >
                    <option value="">
                      {loadingCourses
                        ? "Loading courses..."
                        : courses.length
                          ? "Select a course"
                          : "No eligible courses"}
                    </option>

                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
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

              {selectedCourse && (
                <div className="mt-5 flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedCourse.code}: {selectedCourse.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {students.length} students loaded from the roster
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
                    Mark attendance for each student and save the complete
                    sheet.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={markAllPresent}
                    disabled={loadingRoster || students.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    Mark All Present
                  </button>

                  <button
                    type="button"
                    onClick={resetAttendance}
                    disabled={loadingRoster || students.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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
                  {ATTENDANCE_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 p-4 sm:grid-cols-4">
                {(
                  [
                    ["Present", "text-emerald-700"],
                    ["Absent", "text-red-700"],
                    ["Late", "text-amber-700"],
                    ["Unmarked", "text-slate-700"],
                  ] as const
                ).map(([status, color]) => (
                  <div key={status}>
                    <p className="text-xs text-slate-500">{status}</p>
                    <p className={`mt-1 font-bold ${color}`}>
                      {attendanceCounts[status]}
                    </p>
                  </div>
                ))}
              </div>

              {loadingRoster ? (
                <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-slate-500">
                  <RefreshCw size={18} className="animate-spin" />
                  Loading attendance roster...
                </div>
              ) : filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
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
                        <th className="px-5 py-4 font-semibold">Note</th>
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
                                {ATTENDANCE_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="px-5 py-4">
                              <input
                                type="text"
                                value={records[student.id]?.note ?? ""}
                                onChange={(event) =>
                                  updateNote(student.id, event.target.value)
                                }
                                placeholder="Optional note"
                                aria-label={`Attendance note for ${student.name}`}
                                className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-900"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <FileText
                    size={28}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-3 font-bold text-slate-900">
                    {students.length === 0
                      ? "No students in this roster"
                      : "No students found"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {students.length === 0
                      ? "Choose an eligible course and open an attendance session to load its roster."
                      : "Try a different search term or attendance filter."}
                  </p>
                </div>
              )}

              <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:px-5">
                <div className="text-sm text-slate-500">
                  Showing {filteredStudents.length} of {students.length} students

                  {hasUnsavedChanges && (
                    <span className="ml-2 font-semibold text-amber-700">
                      · Unsaved changes
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void saveAttendance()}
                  disabled={
                    saving ||
                    loadingRoster ||
                    !attendanceSession ||
                    students.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>

              {saveMessage && (
                <div
                  role="status"
                  className="flex items-start gap-2 border-t border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
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
                  Review student statuses before submitting the sheet.
                  Unmarked students are not counted as present or absent.
                </p>
              </div>
            </div>

            <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
              EduNova Staff Portal
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}