import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import logo from '../assets/edunova-logo.webp'
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Layers,
  CheckSquare,
  ListChecks,
  ShieldCheck,
  Clock,
  MapPin,
  X,
  Plus,
  Trash2,
  RefreshCw,
  Undo2,
} from "lucide-react";

import Sidebar from "../components/sidebar";
import Header from "../components/header";

import {
  getStudentCourses,
  getAvailableStudentCourses,
  getStudentDashboard,
  registerStudentCourse,
  dropStudentCourse,
} from "../lib/api";

type CourseId = string | number;

interface CourseRecord {
  id?: CourseId;
  course_id?: CourseId;
  registration_id?: CourseId;

  code?: string;
  course_code?: string;
  title?: string;
  course_title?: string;

  credit_units?: number | string | null;
  units?: number | string | null;

  course_type?: string;
  type?: string;
  category?: string;

  status?: string;
  registration_status?: string;

  level?: number | string;
  semester?: number | string;
  semester_name?: string;
  semester_id?: CourseId;

  schedule?: string;
  venue?: string;

  department_id?: CourseId;
  department_name?: string;

  department?: {
    id?: CourseId;
    name?: string;
    department_name?: string;
  };

  programme?: {
    id?: CourseId;
    name?: string;
  };

  course?: {
    id?: CourseId;
    code?: string;
    course_code?: string;
    title?: string;
    course_title?: string;
    credit_units?: number | string | null;
    units?: number | string | null;
    semester?: number | string;
    semester_name?: string;
    level?: number | string;
    department_id?: CourseId;
    department_name?: string;
    department?: {
      id?: CourseId;
      name?: string;
      department_name?: string;
    };
    programme?: {
      id?: CourseId;
      name?: string;
    };
  };

  registration?: {
    id?: CourseId;
  };
}

interface DashboardData {
  minimum_units?: number | string | null;
  maximum_units?: number | string | null;

  academics?: {
    academic_session?: string;
    semester?: string;
    level?: number | string;
    programme_name?: string;
    department_name?: string;
    minimum_units?: number | string | null;
    maximum_units?: number | string | null;
    min_units?: number | string | null;
    max_units?: number | string | null;
    minimum_credit_units?: number | string | null;
    maximum_credit_units?: number | string | null;
  };

  student?: {
    first_name?: string;
    last_name?: string;
    matric_number?: string;
    email?: string;
    status?: string;
  };

  credit_summary?: {
    minimum_units?: number | string | null;
    maximum_units?: number | string | null;
    registered_units?: number;
    status?: string;
  };

  registration_policy?: {
    minimum_units?: number | string | null;
    maximum_units?: number | string | null;
    min_units?: number | string | null;
    max_units?: number | string | null;
    minimum_credit_units?: number | string | null;
    maximum_credit_units?: number | string | null;
  };

  registration_status?: string;
  registrationStatus?: string;
}

const normalize = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred.";
const formatSemester = (semester: string | number | undefined) => {
  if (semester === 1 || semester === "1") return "First Semester";
  if (semester === 2 || semester === "2") return "Second Semester";

  return semester ?? "Not specified";
};
const getDisplayValue = (
  value: string | number | null | undefined,
  fallback = "Not provided"
): string =>
  value !== undefined && value !== null && value !== ""
    ? String(value)
    : fallback;

const getCourseCode = (course: CourseRecord): string =>
  course.code ??
  course.course_code ??
  course.course?.code ??
  course.course?.course_code ??
  "N/A";

const getCourseTitle = (course: CourseRecord): string =>
  course.title ??
  course.course_title ??
  course.course?.title ??
  course.course?.course_title ??
  "Untitled course";

const getUnits = (course: CourseRecord): number => {
  const value =
    course.credit_units ??
    course.units ??
    course.course?.credit_units ??
    course.course?.units ??
    0;

  const units = Number(value);
  return Number.isFinite(units) && units >= 0 ? units : 0;
};

const getCourseType = (course: CourseRecord): string =>
  course.course_type ?? course.type ?? course.category ?? "Course";

const getCourseStatus = (course: CourseRecord): string =>
  course.registration_status ?? course.status ?? "Registered";

const getCourseId = (course: CourseRecord): CourseId | undefined =>
  course.course_id ?? course.course?.id ?? course.id;

const getRegistrationId = (course: CourseRecord): CourseId | undefined =>
  course.registration_id ?? course.registration?.id ?? course.id;

const getDepartmentName = (course: CourseRecord): string =>
  course.department_name ??
  course.department?.department_name ??
  course.department?.name ??
  course.course?.department_name ??
  course.course?.department?.department_name ??
  course.course?.department?.name ??
  "";

const getProgrammeName = (course: CourseRecord): string =>
  course.programme?.name ?? course.course?.programme?.name ?? "";

const getArray = (result: unknown): CourseRecord[] => {
  let current: unknown = result;

  for (let depth = 0; depth < 5; depth++) {
    if (Array.isArray(current)) {
      return current as CourseRecord[];
    }

    if (!current || typeof current !== "object") {
      return [];
    }

    const record = current as Record<string, unknown>;

    if (Array.isArray(record.courses)) {
      return record.courses as CourseRecord[];
    }

    if (Array.isArray(record.items)) {
      return record.items as CourseRecord[];
    }

    if (record.data !== undefined) {
      current = record.data;
      continue;
    }

    return [];
  }

  return [];
};

const getDashboardData = (result: unknown): DashboardData | null => {
  const findDashboard = (
    value: unknown,
    depth = 0
  ): DashboardData | null => {
    if (!value || typeof value !== "object" || depth > 8) {
      return null;
    }

    if (Array.isArray(value)) {
      return null;
    }

    const record = value as Record<string, unknown>;

    if (
      record.credit_summary ||
      record.registration_policy ||
      record.academics ||
      record.minimum_units !== undefined ||
      record.maximum_units !== undefined
    ) {
      return record as DashboardData;
    }

    for (const key of ["data", "dashboard", "result"]) {
      if (record[key] !== undefined) {
        const found = findDashboard(record[key], depth + 1);

        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  return findDashboard(result);
};

const readLimit = (...values: unknown[]): number | null => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const number = Number(value);

    if (Number.isFinite(number) && number >= 0) {
      return number;
    }
  }

  return null;
};

/**
 * Course IDs are preferred when available. Course codes provide a fallback
 * for registered records whose response shape differs from the catalogue.
 */
const isSameCourse = (a: CourseRecord, b: CourseRecord): boolean => {
  const aCode = normalize(getCourseCode(a));
  const bCode = normalize(getCourseCode(b));

  const aId = getCourseId(a);
  const bId = getCourseId(b);

  if (aId != null && bId != null && String(aId) === String(bId)) {
    return true;
  }

  return aCode !== "" && aCode !== "n/a" && aCode === bCode;
};
const EDU_NOVA_LOGO = "../assets/edunova-logo.webp";

const getImageData = async (
  src: string | undefined
): Promise<{ data: string; format: "PNG" | "JPEG" } | null> => {
  if (!src) return null;

  try {
    const response = await fetch(src);
    if (!response.ok) return null;

    const blob = await response.blob();

    if (!["image/png", "image/jpeg"].includes(blob.type)) {
      return null;
    }

    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return {
      data,
      format: blob.type === "image/png" ? "PNG" : "JPEG",
    };
  } catch {
    // A missing logo or inaccessible profile photo should not stop the PDF.
    return null;
  }
};

const getFirstText = (...values: unknown[]): string => {
  for (const value of values) {
    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      const text = String(value).trim();
      if (text) return text;
    }
  }

  return "Not provided";
};
export default function Course() {
  const [registeredCourses, setRegisteredCourses] = useState<CourseRecord[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseRecord[]>([]);
  const [pendingAdditions, setPendingAdditions] = useState<CourseRecord[]>([]);
  const [pendingDrops, setPendingDrops] = useState<CourseRecord[]>([]);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);

  const [creditSummary, setCreditSummary] = useState<{
  minimum_units?: number | string | null;
  maximum_units?: number | string | null;
} | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

const loadCourses = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const [registeredResult, availableResult, dashboardResult] =
      await Promise.all([
        getStudentCourses(),
        getAvailableStudentCourses(),
        getStudentDashboard(),
      ]);

    setRegisteredCourses(getArray(registeredResult));
    setAvailableCourses(getArray(availableResult));
    setDashboard(getDashboardData(dashboardResult));

    const courseData = registeredResult?.data ?? registeredResult;

    setCreditSummary(
  courseData?.credit_summary
    ? {
        ...courseData.credit_summary,
        academic_session: courseData.academic_session,
        semester: courseData.semester,
      }
    : null
);
  } catch (err: unknown) {
    setError(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const academics = dashboard?.academics ?? {};

  const session = academics.academic_session ?? "Current Academic Session";
  const semester = academics.semester ?? "";

  const registrationStatus =
    dashboard?.registration_status ??
    dashboard?.registrationStatus ??
    "Check registration status";

const minimumUnits = readLimit(
  creditSummary?.minimum_units
);

const maximumUnits = readLimit(
  creditSummary?.maximum_units
);

  const visibleRegisteredCourses = useMemo(
    () =>
      registeredCourses
        .filter(
          (course) =>
            !pendingDrops.some((pending) => isSameCourse(pending, course))
        )
        .sort((a, b) => getCourseCode(a).localeCompare(getCourseCode(b))),
    [registeredCourses, pendingDrops]
  );

 const displayedAvailableCourses = useMemo(() => {
  const query = normalize(search);

  return availableCourses
    .filter((course) => {
      const alreadyRegistered = registeredCourses.some(
        (registered) =>
          normalize(getCourseCode(registered)) ===
            normalize(getCourseCode(course)) ||
          (getCourseId(registered) != null &&
            getCourseId(registered) === getCourseId(course))
      );

      const alreadyQueued = pendingAdditions.some(
        (pending) =>
          normalize(getCourseCode(pending)) ===
            normalize(getCourseCode(course)) ||
          (getCourseId(pending) != null &&
            getCourseId(pending) === getCourseId(course))
      );

      if (alreadyRegistered || alreadyQueued) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        normalize(getCourseCode(course)).includes(query) ||
        normalize(getCourseTitle(course)).includes(query)
      );
    })
    .sort((a, b) =>
      getCourseCode(a).localeCompare(getCourseCode(b))
    );
}, [
  availableCourses,
  registeredCourses,
  pendingAdditions,
  search,
]);

  const totalUnits = registeredCourses.reduce(
    (total, course) => total + getUnits(course),
    0
  );

  const pendingAdditionUnits = pendingAdditions.reduce(
    (total, course) => total + getUnits(course),
    0
  );

  const pendingDropUnits = pendingDrops.reduce(
    (total, course) => total + getUnits(course),
    0
  );

  const projectedUnits = totalUnits + pendingAdditionUnits - pendingDropUnits;

  // const unitsRemaining =
  //   maximumUnits !== null ? Math.max(0, maximumUnits - totalUnits) : null;

  const coreCount = registeredCourses.filter((course) =>
    /core|compulsory/i.test(getCourseType(course))
  ).length;

  const electiveCount = registeredCourses.filter((course) =>
    /elective/i.test(getCourseType(course))
  ).length;

  const belowMinimum = minimumUnits !== null && totalUnits < minimumUnits;
  const aboveMaximum =
  maximumUnits !== null && projectedUnits > maximumUnits;

  const hasPendingChanges =
    pendingAdditions.length > 0 || pendingDrops.length > 0;

  const handleAddCourse = (course: CourseRecord) => {
    if (getCourseId(course) == null) {
      setError(
        `Cannot add ${getCourseCode(course)} because its course ID is missing.`
      );
      return;
    }

    const alreadyRegistered = registeredCourses.some((registered) =>
      isSameCourse(registered, course)
    );

    if (alreadyRegistered) {
      const queuedDrop = pendingDrops.some((pending) =>
        isSameCourse(pending, course)
      );

      if (queuedDrop) {
        setPendingDrops((previous) =>
          previous.filter((pending) => !isSameCourse(pending, course))
        );
        setNotice(`${getCourseCode(course)} will remain registered.`);
      }

      return;
    }

    if (
      pendingAdditions.some((pending) => isSameCourse(pending, course))
    ) {
      return;
    }

    setError("");
    setNotice("");
    const nextProjectedUnits = projectedUnits + getUnits(course);

if (
  maximumUnits !== null &&
  nextProjectedUnits > maximumUnits
) {
  setError(
    `Adding ${getCourseCode(course)} would bring your planned total to ${nextProjectedUnits} units, exceeding the maximum of ${maximumUnits}. Remove another course or queue a course drop first.`
  );
  return;
}
    setPendingAdditions((previous) => [...previous, course]);
  };

  const handleRemovePendingCourse = (course: CourseRecord) => {
    setPendingAdditions((previous) =>
      previous.filter((pending) => !isSameCourse(pending, course))
    );
  };

  const handleQueueDrop = (course: CourseRecord) => {
    setError("");
    setNotice("");

    setPendingDrops((previous) =>
      previous.some((pending) => isSameCourse(pending, course))
        ? previous
        : [...previous, course]
    );
  };

  const handleUndoDrop = (course: CourseRecord) => {
    setPendingDrops((previous) =>
      previous.filter((pending) => !isSameCourse(pending, course))
    );
  };

  
const handleSaveChanges = async () => {
  if (savingChanges || !hasPendingChanges) {
    return;
  }

  if (minimumUnits !== null && projectedUnits < minimumUnits) {
    const unitsNeeded = minimumUnits - projectedUnits;

    setError(
      `Your planned total is ${projectedUnits} units, below the required minimum of ${minimumUnits}. Please add at least ${unitsNeeded} more credit units before submitting.`
    );
    setNotice("");
    return;
  }

  if (maximumUnits !== null && projectedUnits > maximumUnits) {
    const unitsToRemove = projectedUnits - maximumUnits;

    setError(
      `Your planned total is ${projectedUnits} units, exceeding the maximum of ${maximumUnits} by ${unitsToRemove} units. Remove courses or queue course drops before submitting.`
    );
    setNotice("");
    return;
  }

  setSavingChanges(true);
  setError("");
  setNotice("");

  let changesCompleted = 0;

  try {
    // Process drops first.
    for (const course of pendingDrops) {
      const registrationId = getRegistrationId(course);

      if (registrationId == null) {
        throw new Error(
          `Cannot drop ${getCourseCode(course)} because its registration ID is missing.`
        );
      }

      await dropStudentCourse(registrationId);
      changesCompleted++;
    }

    // Register new courses.
    for (const course of pendingAdditions) {
      const courseId = getCourseId(course);

if (courseId === null || courseId === undefined) {
  throw new Error(
    `Cannot register ${getCourseCode(course)} because its course ID is missing.`
  );
}

await registerStudentCourse({
  course_offering_ids: [courseId],
});
      changesCompleted++;
    }

    setPendingAdditions([]);
    setPendingDrops([]);
    setSelectedCourse(null);

    await loadCourses();

    setNotice(
      "Your course registration changes were submitted successfully."
    );
  } catch (err: unknown) {
    const message = getErrorMessage(err);

    setError(
      changesCompleted > 0
        ? `${message} Some changes may already have been saved. Refresh and check your registrations before trying again.`
        : message
    );

    await loadCourses();
  } finally {
    setSavingChanges(false);
  }
};


  const summaryCards = [
    {
      label: "Registered Courses",
      value: registeredCourses.length,
      icon: BookOpen,
    },
    {
      label: "Total Credit Units",
      value: `${totalUnits} Units`,
      icon: Layers,
    },
    {
      label: "Compulsory Courses",
      value: coreCount,
      icon: CheckSquare,
    },
    {
      label: "Elective Courses",
      value: electiveCount,
      icon: ListChecks,
    },
  ];

  const selectedIsRegistered =
    selectedCourse !== null &&
    registeredCourses.some((course) => isSameCourse(course, selectedCourse));

  const selectedIsPending =
    selectedCourse !== null &&
    pendingAdditions.some((course) => isSameCourse(course, selectedCourse));

  const selectedIsQueuedForDrop =
    selectedCourse !== null &&
    pendingDrops.some((course) => isSameCourse(course, selectedCourse));
  const handleDownloadRegistrationPdf = async () => {
  if (loading || savingChanges) return;

  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const dashboardData =
      dashboard as unknown as Record<string, any> | null;

    const student = dashboardData?.student ?? {};
    const academics = dashboardData?.academics ?? {};
    const faculty = dashboardData?.faculty ?? student.faculty;
    const department =
      dashboardData?.department ?? student.department;
    const programme =
      dashboardData?.programme ??
      dashboardData?.program ??
      student.programme;

    const fullName = getFirstText(
      student.full_name,
      student.name,
      [student.first_name, student.last_name]
        .filter(Boolean)
        .join(" ")
    );

    const matricNumber = getFirstText(
      student.matric_number,
      student.registration_number,
      student.reg_number,
      dashboardData?.matric_number
    );

    const facultyName = getFirstText(
      academics.faculty_name,
      dashboardData?.faculty_name,
      typeof faculty === "string" ? faculty : faculty?.name
    );

    const departmentName = getFirstText(
      academics.department_name,
      dashboardData?.department_name,
      typeof department === "string"
        ? department
        : department?.name ?? department?.department_name
    );

    const programmeName = getFirstText(
      academics.programme_name,
      dashboardData?.programme_name,
      typeof programme === "string" ? programme : programme?.name
    );

    const level = getFirstText(
      academics.level,
      dashboardData?.level,
      student.level
    );

    const academicSession = getFirstText(
      // creditSummary?.academic_session,
      academics.academic_session,
      dashboardData?.academic_session
    );

    const semesterName = getFirstText(
      // creditSummary?.semester,
      academics.semester,
      dashboardData?.semester,
      registeredCourses[0]?.semester_name,
      registeredCourses[0]?.semester
    );

    const profilePhotoUrl = getFirstText(
      student.profile_photo_url,
      student.profile_photo,
      student.profile_picture,
      student.photo_url,
      student.avatar_url,
      student.passport_photo,
      dashboardData?.profile_photo_url
    );

    const generatedAt = new Date();
    const logo = await getImageData(EDU_NOVA_LOGO);
    const profilePhoto =
      profilePhotoUrl !== "Not provided"
        ? await getImageData(profilePhotoUrl)
        : null;

    // Header
    if (logo) {
      doc.addImage(
        logo.data,
        logo.format,
        margin,
        12,
        20,
        20
      );
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(20, 38, 63);
    doc.text("EDUNOVA", logo ? 39 : margin, 19);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text("COURSE REGISTRATION FORM", logo ? 39 : margin, 26);

    doc.setFontSize(8);
    doc.text(
      `Generated: ${generatedAt.toLocaleString()}`,
      pageWidth - margin,
      18,
      { align: "right" }
    );

    doc.setDrawColor(184, 144, 31);
    doc.setLineWidth(0.7);
    doc.line(margin, 37, pageWidth - margin, 37);

    // Student information table
    autoTable(doc, {
      startY: 42,
      margin: {
        left: margin,
        right: profilePhoto ? 49 : margin,
      },
      tableWidth: profilePhoto ? 143 : pageWidth - margin * 2,
      theme: "grid",
      head: [["Student Information", "Details"]],
      body: [
        ["Registration / Matric No.", matricNumber],
        ["Full Name", fullName],
        ["Faculty", facultyName],
        ["Department", departmentName],
        ["Programme", programmeName],
        ["Current Level", level],
        ["Academic Session", academicSession],
        ["Semester", formatSemester(semesterName)],
      ],
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2.2,
        lineColor: [215, 215, 215],
        textColor: [35, 35, 35],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [20, 38, 63],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 48, fontStyle: "bold" },
      },
    });

    if (profilePhoto) {
      try {
        doc.addImage(
          profilePhoto.data,
          profilePhoto.format,
          pageWidth - margin - 32,
          44,
          32,
          37
        );

        doc.setDrawColor(200, 200, 200);
        doc.rect(
          pageWidth - margin - 32,
          44,
          32,
          37
        );
      } catch {
        // Continue generating the form if the photo cannot be embedded.
      }
    }

    const studentTableEnd =
      (doc as jsPDF & {
        lastAutoTable?: { finalY: number };
      }).lastAutoTable?.finalY ?? 85;

    const courseRows = registeredCourses.map((course) => {
      const type = getCourseType(course);

      const status = /elective/i.test(type)
        ? "E"
        : /core|compulsory/i.test(type)
          ? "C"
          : "—";

      return [
        getCourseCode(course),
        getCourseTitle(course),
        String(getUnits(course)),
        status,
      ];
    });

    const courseTotal = registeredCourses.reduce(
      (sum, course) => sum + getUnits(course),
      0
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 38, 63);
    doc.text(
      "REGISTERED COURSES",
      margin,
      studentTableEnd + 11
    );

    autoTable(doc, {
      startY: studentTableEnd + 14,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [[
        "Course Code",
        "Course Title",
        "Credit Units",
        "Status",
      ]],
      body: courseRows,
      foot: [[
        "",
        "TOTAL CREDIT UNITS",
        String(courseTotal),
        "",
      ]],
      showFoot: "lastPage",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [210, 210, 210],
        textColor: [35, 35, 35],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [20, 38, 63],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [242, 244, 247],
        textColor: [20, 38, 63],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 28, halign: "center" },
        3: { cellWidth: 22, halign: "center" },
      },
    });

    const courseTableEnd =
      (doc as jsPDF & {
        lastAutoTable?: { finalY: number };
      }).lastAutoTable?.finalY ?? studentTableEnd + 25;

    let signatureY = courseTableEnd + 12;

    // Keep the signatures together on the same page.
    if (signatureY + 35 > doc.internal.pageSize.getHeight() - 12) {
      doc.addPage();
      signatureY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 38, 63);
    doc.text("SIGNATURES AND APPROVAL", margin, signatureY);

    autoTable(doc, {
      startY: signatureY + 4,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [["Required Signature", "Signature", "Date"]],
      body: [
        ["Student's Signature", "", ""],
        ["Level Adviser's Signature", "", ""],
        ["Faculty Officer's Signature", "", ""],
      ],
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 5,
        minCellHeight: 12,
        lineColor: [190, 190, 190],
        textColor: [35, 35, 35],
      },
      headStyles: {
        fillColor: [20, 38, 63],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 65, fontStyle: "bold" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 35 },
      },
    });

    const safeName =
      matricNumber !== "Not provided"
        ? matricNumber
        : fullName.replace(/[^a-z0-9]+/gi, "_");

    doc.save(`EduNova_Course_Registration_${safeName}.pdf`);
  } catch (error) {
    console.error("Failed to generate registration PDF:", error);
    setError("Unable to generate the registration PDF. Please try again.");
  }
};
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      <main className="min-h-screen min-w-0 flex-1 bg-[#F6F6F2]">
        <Header />

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/40">
                {session}
                {semester ? ` · ${semester}` : ""}
              </span>

              <h1 className="mt-2 font-serif text-2xl font-semibold text-black md:text-3xl">
                Course Management
              </h1>

              <p className="mt-2 max-w-xl text-sm text-black/55">
                Add courses to your selection, review your registration, and
                submit your changes when you're ready.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadCourses()}
              disabled={loading || savingChanges}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm hover:bg-black/[0.03] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A]/5">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <p className="font-serif text-xl font-semibold leading-none text-black">
                      {card.value}
                    </p>
                    <p className="mt-1.5 text-xs text-black/50">
                      {card.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg font-semibold text-black">
                  Credit Unit Summary
                </h2>
                <p className="mt-1 text-sm text-black/50">
                  Review your current units and the units after your planned changes.
                </p>
              </div>

              <span className="rounded-full bg-[#1E3A8A]/5 px-3 py-1.5 text-xs text-[#1E3A8A]">
                Level {getDisplayValue(academics.level)}
              </span>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-black/50">Registered units</p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {totalUnits}
                </p>
              </div>

              <div>
                <p className="text-xs text-black/50">Planned total</p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {projectedUnits}
                </p>
              </div>

              <div>
                <p>
  Minimum required:{" "}
  {minimumUnits !== null ? `${minimumUnits} units` : "Not provided"}
</p>
              </div>

              <div>
                <p>
  Maximum allowed:{" "}
  {maximumUnits !== null ? `${maximumUnits} units` : "Not provided"}
</p>
              </div>
            </div>

            {maximumUnits !== null && (
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-black/50">
                  <span>Planned credit-unit usage</span>
                  <span>
                    {projectedUnits} / {maximumUnits}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-[#1E3A8A] transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        maximumUnits > 0
                          ? (projectedUnits / maximumUnits) * 100
                          : projectedUnits > 0
                            ? 100
                            : 0
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-black/50">
                  {Math.max(0, maximumUnits - projectedUnits)} units remaining
                  after planned changes.
                </p>
              </div>
            )}

            {belowMinimum && (
  <div className="mt-4 rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-800">
    <p className="font-semibold">More courses required</p>
    <p className="mt-1">
      Your planned total is {projectedUnits} units, but you need at
      least {minimumUnits} units. Add another{" "}
      {minimumUnits! - projectedUnits} credit units before submitting.
    </p>
  </div>
)}
{aboveMaximum && (
  <div className="mt-4 rounded-lg bg-red-50 px-3 py-3 text-sm text-red-700">
    <p className="font-semibold">Maximum credit units exceeded</p>
    <p className="mt-1">
      Your planned total is {projectedUnits} units, above the
      maximum of {maximumUnits}. Remove courses or queue course
      drops before submitting.
    </p>
  </div>
)}

            {minimumUnits === null && maximumUnits === null && (
              <p className="mt-4 text-xs text-black/50">
                Minimum and maximum units have not been provided by the
                dashboard. The backend will still validate registration.
              </p>
            )}

            {hasPendingChanges && (
              <p className="mt-4 text-xs text-[#1E3A8A]">
                You have unsaved course changes. They will not reach the
                backend until you submit them.
              </p>
            )}
          </section>

          {/* Available courses */}
          <section className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-lg font-semibold text-black">
                  Available Courses
                </h2>
                <p className="mt-1 text-sm text-black/50">
                  Add the courses you want to register. Adding a course here
                  does not submit it yet.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by course code or title..."
                  className="w-full rounded-lg border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-black/45">
              {search.trim()
                ? `Search results: ${displayedAvailableCourses.length} course(s).`
                : `${displayedAvailableCourses.length} course(s) available to add.`}
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.015]">
                    {["Code", "Course Title", "Units", "Type", "Semester", "Action"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wide text-black/40"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {!loading &&
                    displayedAvailableCourses.map((course, index) => {
                      const code = getCourseCode(course);
                      const courseId = getCourseId(course);

                      return (
                        <tr
                          key={courseId ?? `${code}-${index}`}
                          className="border-b border-black/5 last:border-0 hover:bg-[#1E3A8A]/[0.03]"
                        >
                          <td className="px-4 py-4 font-mono text-xs text-black/60">
                            {code}
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedCourse(course)}
                              className="text-left font-medium text-black hover:text-[#1E3A8A]"
                            >
                              {getCourseTitle(course)}
                            </button>
                            {getProgrammeName(course) && (
                              <p className="mt-1 text-xs text-black/40">
                                {getProgrammeName(course)}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4 text-black/60">
                            {getUnits(course)}
                          </td>

                          <td className="px-4 py-4">
                            {getCourseType(course)}
                          </td>

                          <td className="px-4 py-4 text-black/60">
                            {getDisplayValue(
                              course.semester_name ?? formatSemester(course.semester)
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleAddCourse(course)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#14263F] px-3 py-2 text-xs text-white hover:bg-[#1E3A8A]"
                            >
                              <Plus size={14} />
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                  {!loading && displayedAvailableCourses.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-black/40"
                      >
                        {search.trim()
                          ? `No available courses match "${search}".`
                          : "There are no more available courses to add."}
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-black/45"
                      >
                        Loading courses...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Selected courses */}
          <section className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-black">
                  Selected Courses
                </h2>
                <p className="mt-1 text-sm text-black/50">
                  New courses waiting to be submitted.
                </p>
              </div>

              <span className="rounded-full bg-[#1E3A8A]/5 px-3 py-1.5 text-xs text-[#1E3A8A]">
                {pendingAdditions.length} selected
              </span>
            </div>

            {pendingAdditions.length === 0 ? (
              <p className="mt-4 rounded-lg bg-black/[0.025] px-4 py-6 text-center text-sm text-black/45">
                No new courses selected. Use the Add buttons above to select
                courses.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-black/5">
                {pendingAdditions.map((course) => (
                  <div
                    key={String(getCourseId(course) ?? getCourseCode(course))}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-medium text-black">
                        {getCourseCode(course)} — {getCourseTitle(course)}
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        {getUnits(course)} credit units · {getCourseType(course)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePendingCourse(course)}
                      disabled={savingChanges}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Registered courses */}
          <section className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-black">
                  Registered Courses
                </h2>
                <p className="mt-1 text-sm text-black/50">
                  Existing registrations. Drops remain pending until submitted.
                </p>
              </div>

              <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-black/60">
                {visibleRegisteredCourses.length} registered
              </span>
            </div>

            {visibleRegisteredCourses.length === 0 && pendingDrops.length === 0 ? (
              <p className="mt-4 rounded-lg bg-black/[0.025] px-4 py-6 text-center text-sm text-black/45">
                You have no registered courses yet.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-black/5">
                {visibleRegisteredCourses.map((course, index) => (
                  <div
                    key={String(
                      getRegistrationId(course) ??
                        getCourseId(course) ??
                        `${getCourseCode(course)}-${index}`
                    )}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCourse(course)}
                      className="text-left"
                    >
                      <p className="font-medium text-black">
                        {getCourseCode(course)} — {getCourseTitle(course)}
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        {getUnits(course)} credit units ·{" "}
                        {getCourseType(course)} · {getCourseStatus(course)}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQueueDrop(course)}
                      disabled={savingChanges}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Drop
                    </button>
                  </div>
                ))}

                {pendingDrops.map((course) => (
                  <div
                    key={`pending-drop-${String(
                      getCourseId(course) ?? getCourseCode(course)
                    )}`}
                    className="flex flex-wrap items-center justify-between gap-3 bg-red-50/70 py-3"
                  >
                    <div>
                      <p className="font-medium text-red-700">
                        {getCourseCode(course)} — {getCourseTitle(course)}
                      </p>
                      <p className="mt-1 text-xs text-red-600">
                        Pending drop · {getUnits(course)} credit units
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUndoDrop(course)}
                      disabled={savingChanges}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs text-black/70 hover:bg-black/[0.03] disabled:opacity-50"
                    >
                      <Undo2 size={14} />
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit all queued changes */}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5">
            <div>
              <h2 className="font-serif text-lg font-semibold text-black">
                Submit Registration Changes
              </h2>
              <p className="mt-1 text-sm text-black/50">
                {pendingAdditions.length} addition(s), {pendingDrops.length} drop(s)
                {" · "}planned total: {projectedUnits} units
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleSaveChanges()}
              disabled={savingChanges || loading || !hasPendingChanges}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-3 text-sm font-medium text-white hover:bg-[#14263F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingChanges ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Updating registration...
                </>
              ) : (
                <>
                  <CheckSquare size={15} />
                  Register / Update Courses
                </>
              )}
            </button>
          </section>
              <div className="flex flex-wrap items-center gap-2">
  <button
    type="button"
    onClick={() => void handleDownloadRegistrationPdf()}
    disabled={loading || savingChanges}
    className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm text-white hover:bg-[#14263F] disabled:opacity-50"
  >
    <FileDown size={15} />
    Download Registration Form (PDF)
  </button>

  <button
    type="button"
    onClick={() => void loadCourses()}
    disabled={loading || savingChanges}
    className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm hover:bg-black/[0.03] disabled:opacity-50"
  >
    <RefreshCw
      size={15}
      className={loading ? "animate-spin" : ""}
    />
    Refresh
  </button>
</div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-black">
                Credit Summary
              </h2>

              <div className="mb-3 flex justify-between text-sm">
                <span className="text-black/55">Registered courses</span>
                <span className="font-medium">{registeredCourses.length}</span>
              </div>

              <div className="mb-3 flex justify-between text-sm">
                <span className="text-black/55">Total registered units</span>
                <span className="font-medium">{totalUnits}</span>
              </div>

              <div className="mb-3 flex justify-between text-sm">
                <span className="text-black/55">Academic session</span>
                <span className="text-right font-medium">{session}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/55">Semester</span>
                <span className="text-right font-medium">
                  {getDisplayValue(semester)}
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-black">
                Registration Overview
              </h2>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A]/5">
                  <ShieldCheck size={20} className="text-[#1E3A8A]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-black">
                    {registrationStatus}
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    The registration status is provided by the dashboard API.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close course details"
            onClick={() => setSelectedCourse(null)}
            className="absolute inset-0 cursor-default bg-black/40"
          />

          <aside className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-[#14263F] px-6 py-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#B8901F]">
                  {getCourseCode(selectedCourse)}
                </p>

                <h2 className="mt-1 font-serif text-xl font-semibold text-white">
                  {getCourseTitle(selectedCourse)}
                </h2>

                {(getDepartmentName(selectedCourse) ||
                  getProgrammeName(selectedCourse)) && (
                  <p className="mt-2 text-xs text-white/60">
                    {getDepartmentName(selectedCourse) ||
                      getProgrammeName(selectedCourse)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close"
                className="rounded-full p-2 text-white/70 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Credit units
                  </p>
                  <p className="text-sm font-medium">
                    {getUnits(selectedCourse)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Course type
                  </p>
                  <p className="text-sm font-medium">
                    {getCourseType(selectedCourse)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Semester
                  </p>
                  <p className="text-sm font-medium">
                    {getDisplayValue(
                      selectedCourse.semester_name ?? selectedCourse.semester
                    )}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                    Level
                  </p>
                  <p className="text-sm font-medium">
                    {getDisplayValue(
                      selectedCourse.level ?? selectedCourse.course?.level
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-black/5 pt-4">
                <div className="flex gap-3">
                  <Clock
                    className="mt-0.5 shrink-0 text-[#1E3A8A]"
                    size={16}
                  />
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                      Schedule
                    </p>
                    <p className="text-sm text-black/70">
                      {selectedCourse.schedule || "Not provided by the API"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 shrink-0 text-[#1E3A8A]"
                    size={16}
                  />
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-black/40">
                      Venue
                    </p>
                    <p className="text-sm text-black/70">
                      {selectedCourse.venue || "Not provided by the API"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedIsPending ? (
                <button
                  type="button"
                  onClick={() => handleRemovePendingCourse(selectedCourse)}
                  disabled={savingChanges}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Remove from selection
                </button>
              ) : selectedIsRegistered && selectedIsQueuedForDrop ? (
                <button
                  type="button"
                  onClick={() => handleUndoDrop(selectedCourse)}
                  disabled={savingChanges}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm hover:bg-black/[0.03] disabled:opacity-50"
                >
                  <Undo2 size={16} />
                  Undo pending drop
                </button>
              ) : selectedIsRegistered ? (
                <button
                  type="button"
                  onClick={() => handleQueueDrop(selectedCourse)}
                  disabled={savingChanges}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Queue course drop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAddCourse(selectedCourse)}
                  disabled={savingChanges}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14263F] px-4 py-3 text-sm text-white hover:bg-[#1E3A8A] disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add to selected courses
                </button>
              )}

              <p className="text-xs text-black/45">
                Changes are saved only when you click Register / Update Courses.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}