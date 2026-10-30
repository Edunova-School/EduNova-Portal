
import { useMemo, useRef, useState } from "react";
import {
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Download,
  Trash2,
  Eye,
  X,
  BookOpen,
  FolderOpen,
  Users,
  Lock,
  Globe,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

import StaffHeader from "../../components/staffs/StaffHeader";
import StaffSidebar from "../../components/staffs/StaffSidebar";

type ResourceType =
  | "Lecture Notes"
  | "Slides"
  | "Course Outline"
  | "Past Questions"
  | "Reference Material"
  | "Other";

type Resource = {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  type: ResourceType;
  course: string;
  session: string;
  semester: string;
  visibility: "Students" | "Private";
  uploadedAt: string;
  file?: File;
};

const initialResources: Resource[] = [
  {
    id: 1,
    title: "Introduction to Software Engineering",
    description: "Lecture notes covering software engineering fundamentals and principles.",
    fileName: "Introduction_to_SE.pdf",
    fileSize: "2.4 MB",
    type: "Lecture Notes",
    course: "SEN 301",
    session: "2026/2027",
    semester: "First Semester",
    visibility: "Students",
    uploadedAt: "2026-10-12",
  },
  {
    id: 2,
    title: "Software Development Life Cycle",
    description: "Presentation slides on software development methodologies.",
    fileName: "SDLC_Presentation.pptx",
    fileSize: "4.8 MB",
    type: "Slides",
    course: "SEN 301",
    session: "2026/2027",
    semester: "First Semester",
    visibility: "Students",
    uploadedAt: "2026-10-10",
  },
  {
    id: 3,
    title: "Database Systems Course Outline",
    description: "Course objectives, topics, recommended reading and assessment structure.",
    fileName: "Database_Course_Outline.pdf",
    fileSize: "850 KB",
    type: "Course Outline",
    course: "SEN 303",
    session: "2026/2027",
    semester: "First Semester",
    visibility: "Students",
    uploadedAt: "2026-10-08",
  },
  {
    id: 4,
    title: "Database Systems Past Questions",
    description: "Selected previous examination questions for revision.",
    fileName: "Database_Past_Questions.pdf",
    fileSize: "1.2 MB",
    type: "Past Questions",
    course: "SEN 303",
    session: "2025/2026",
    semester: "Second Semester",
    visibility: "Students",
    uploadedAt: "2026-09-25",
  },
  {
    id: 5,
    title: "Programming Reference Guide",
    description: "Additional reference material for programming concepts.",
    fileName: "Programming_Reference.pdf",
    fileSize: "3.1 MB",
    type: "Reference Material",
    course: "SEN 305",
    session: "2026/2027",
    semester: "First Semester",
    visibility: "Private",
    uploadedAt: "2026-09-20",
  },
  {
    id: 6,
    title: "System Analysis and Design",
    description: "An introductory resource on system analysis and design techniques.",
    fileName: "System_Analysis.pdf",
    fileSize: "1.7 MB",
    type: "Lecture Notes",
    course: "SEN 305",
    session: "2026/2027",
    semester: "First Semester",
    visibility: "Students",
    uploadedAt: "2026-09-18",
  },
];

const resourceTypes: ResourceType[] = [
  "Lecture Notes",
  "Slides",
  "Course Outline",
  "Past Questions",
  "Reference Material",
  "Other",
];

const courses = ["SEN 301", "SEN 303", "SEN 305"];

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
    return FileText;
  }

  if (["xls", "xlsx", "csv"].includes(extension || "")) {
    return FileSpreadsheet;
  }

  if (["png", "jpg", "jpeg"].includes(extension || "")) {
    return FileImage;
  }

  if (["ppt", "pptx"].includes(extension || "")) {
    return FileText;
  }

  return File;
};

export default function StaffResources() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedVisibility, setSelectedVisibility] = useState("All");
  const [activeTab, setActiveTab] = useState("All Resources");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [notice, setNotice] = useState("");

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    type: "Lecture Notes" as ResourceType,
    course: "SEN 301",
    session: "2026/2027",
    semester: "First Semester",
    visibility: "Students" as "Students" | "Private",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const studentResources = resources.filter(
    (resource) => resource.visibility === "Students"
  ).length;

  const privateResources = resources.filter(
    (resource) => resource.visibility === "Private"
  ).length;

  const filteredResources = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return resources.filter((resource) => {
      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.fileName.toLowerCase().includes(query) ||
        resource.course.toLowerCase().includes(query);

      const matchesType =
        selectedType === "All Types" || resource.type === selectedType;

      const matchesCourse =
        selectedCourse === "All Courses" || resource.course === selectedCourse;

      const matchesVisibility =
        selectedVisibility === "All" ||
        resource.visibility === selectedVisibility;

      const matchesTab =
        activeTab === "All Resources" ||
        (activeTab === "Shared with Students" &&
          resource.visibility === "Students") ||
        (activeTab === "Private Resources" &&
          resource.visibility === "Private");

      return (
        matchesSearch &&
        matchesType &&
        matchesCourse &&
        matchesVisibility &&
        matchesTab
      );
    });
  }, [
    resources,
    searchTerm,
    selectedType,
    selectedCourse,
    selectedVisibility,
    activeTab,
  ]);

  const resetUploadForm = () => {
    setUploadForm({
      title: "",
      description: "",
      type: "Lecture Notes",
      course: "SEN 301",
      session: "2026/2027",
      semester: "First Semester",
      visibility: "Students",
    });
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!uploadForm.title.trim() || !selectedFile) {
      setNotice("Please provide a resource title and select a file.");
      return;
    }

    const newResource: Resource = {
      id: Date.now(),
      title: uploadForm.title.trim(),
      description: uploadForm.description.trim(),
      fileName: selectedFile.name,
      fileSize: formatSize(selectedFile.size),
      type: uploadForm.type,
      course: uploadForm.course,
      session: uploadForm.session,
      semester: uploadForm.semester,
      visibility: uploadForm.visibility,
      uploadedAt: new Date().toISOString().slice(0, 10),
      file: selectedFile,
    };

    setResources((previous) => [newResource, ...previous]);
    setShowUploadModal(false);
    resetUploadForm();
    setNotice("Resource added to the library.");
  };

  const downloadResource = (resource: Resource) => {
    if (!resource.file) {
      setNotice(
        "This is sample resource data. Connect the backend to access its actual file."
      );
      return;
    }

    const url = URL.createObjectURL(resource.file);
    const link = document.createElement("a");

    link.href = url;
    link.download = resource.fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  const deleteResource = (id: number) => {
    const resource = resources.find((item) => item.id === id);

    if (!resource) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove "${resource.title}"?`
    );

    if (!confirmed) return;

    setResources((previous) => previous.filter((item) => item.id !== id));
    setSelectedResource(null);
    setNotice("Resource removed from the library.");
  };

  const toggleVisibility = (resource: Resource) => {
    setResources((previous) =>
      previous.map((item) =>
        item.id === resource.id
          ? {
              ...item,
              visibility:
                item.visibility === "Students" ? "Private" : "Students",
            }
          : item
      )
    );

    setSelectedResource((previous) =>
      previous?.id === resource.id
        ? {
            ...previous,
            visibility:
              previous.visibility === "Students" ? "Private" : "Students",
          }
        : previous
    );

    setNotice(
      resource.visibility === "Students"
        ? "Resource changed to private."
        : "Resource is now shared with students."
    );
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
                  <span className="text-blue-700">Resources</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Resource Library
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Organise, manage and share academic materials with your students.
                </p>
              </div>

              <button
                onClick={() => {
                  resetUploadForm();
                  setShowUploadModal(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                <Upload size={17} />
                Upload Resource
              </button>
            </div>

            {/* Notification */}
            {notice && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <span>{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Dismiss">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Statistics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Resources</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {resources.length}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-800">
                    <FolderOpen size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Materials in your library
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Shared with Students</p>
                    <h3 className="mt-2 text-2xl font-bold text-green-700">
                      {studentResources}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3 text-green-700">
                    <Users size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Student-accessible materials
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Private Resources</p>
                    <h3 className="mt-2 text-2xl font-bold text-amber-600">
                      {privateResources}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                    <Lock size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Only available to you in this library
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Courses Covered</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {new Set(resources.map((item) => item.course)).size}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-3 text-indigo-700">
                    <BookOpen size={21} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Courses with uploaded materials
                </p>
              </div>
            </section>

            {/* Resource library */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 pt-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Your Resources
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Browse and manage your uploaded academic materials.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                    {filteredResources.length} Resources
                  </span>
                </div>

                <div className="mt-5 flex gap-6 overflow-x-auto">
                  {["All Resources", "Shared with Students", "Private Resources"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 border-b-2 pb-3 text-sm font-semibold transition ${
                          activeTab === tab
                            ? "border-blue-800 text-blue-800"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/70 p-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search resources..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-700"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedCourse}
                    onChange={(event) => setSelectedCourse(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-700"
                  >
                    <option>All Courses</option>
                    {courses.map((course) => (
                      <option key={course}>{course}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-700"
                  >
                    <option>All Types</option>
                    {resourceTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedVisibility}
                    onChange={(event) => setSelectedVisibility(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-700"
                  >
                    <option value="All">All Visibility</option>
                    <option value="Students">Shared with Students</option>
                    <option value="Private">Private</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Resource list */}
              <div className="divide-y divide-slate-100">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => {
                    const Icon = getFileIcon(resource.fileName);

                    return (
                      <div
                        key={resource.id}
                        className="flex flex-col justify-between gap-4 p-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                            <Icon size={23} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-800">
                              {resource.title}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                              {resource.description || "No description provided."}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                              <span className="font-semibold text-blue-800">
                                {resource.course}
                              </span>
                              <span>{resource.fileName}</span>
                              <span>{resource.fileSize}</span>
                              <span className="flex items-center gap-1">
                                <CalendarDays size={12} />
                                {formatDate(resource.uploadedAt)}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                {resource.type}
                              </span>

                              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
                                {resource.session}
                              </span>

                              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                                resource.visibility === "Students"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}>
                                {resource.visibility === "Students" ? (
                                  <Globe size={12} />
                                ) : (
                                  <Lock size={12} />
                                )}
                                {resource.visibility === "Students" ? "Shared" : "Private"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            onClick={() => setSelectedResource(resource)}
                            title="View resource details"
                            className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => downloadResource(resource)}
                            title="Download resource"
                            className="rounded-lg border border-slate-200 p-2.5 text-blue-800 transition hover:bg-blue-50"
                          >
                            <Download size={17} />
                          </button>

                          <button
                            onClick={() => deleteResource(resource.id)}
                            title="Delete resource"
                            className="rounded-lg border border-slate-200 p-2.5 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-16 text-center">
                    <FolderOpen size={35} className="mx-auto mb-3 text-slate-300" />
                    <h3 className="font-semibold text-slate-700">
                      No resources found
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your filters or upload a new resource.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedType("All Types");
                        setSelectedCourse("All Courses");
                        setSelectedVisibility("All");
                        setActiveTab("All Resources");
                      }}
                      className="mt-4 text-sm font-semibold text-blue-800 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">
                Showing {filteredResources.length} of {resources.length} resources
              </div>
            </section>

            <footer className="pb-4 pt-2 text-center text-xs text-slate-400">
              EduNova Staff Portal © {new Date().getFullYear()}. All rights reserved.
            </footer>
          </div>
        </main>
      </div>

      {/* Upload modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-resource-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2
                  id="upload-resource-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Upload Resource
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add academic material to your resource library.
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close upload form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Resource Title *
                </label>
                <input
                  value={uploadForm.title}
                  onChange={(event) =>
                    setUploadForm({ ...uploadForm, title: event.target.value })
                  }
                  placeholder="Enter resource title"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Briefly describe this material..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Resource Type
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(event) =>
                      setUploadForm({
                        ...uploadForm,
                        type: event.target.value as ResourceType,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-700"
                  >
                    {resourceTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Course
                  </label>
                  <select
                    value={uploadForm.course}
                    onChange={(event) =>
                      setUploadForm({ ...uploadForm, course: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-700"
                  >
                    {courses.map((course) => (
                      <option key={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Academic Session
                  </label>
                  <select
                    value={uploadForm.session}
                    onChange={(event) =>
                      setUploadForm({ ...uploadForm, session: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-700"
                  >
                    <option>2026/2027</option>
                    <option>2025/2026</option>
                    <option>2024/2025</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Semester
                  </label>
                  <select
                    value={uploadForm.semester}
                    onChange={(event) =>
                      setUploadForm({
                        ...uploadForm,
                        semester: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-700"
                  >
                    <option>First Semester</option>
                    <option>Second Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload File *
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
                  <div className="mb-3 rounded-full bg-blue-100 p-3 text-blue-800">
                    <Upload size={22} />
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : "Click to select a file"}
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG or JPG
                  </span>

                  {selectedFile && (
                    <span className="mt-2 text-xs text-blue-800">
                      {formatSize(selectedFile.size)}
                    </span>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setSelectedFile(file);
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Resource Visibility
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setUploadForm({ ...uploadForm, visibility: "Students" })
                    }
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
                      uploadForm.visibility === "Students"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Globe size={19} className="mt-0.5 text-blue-800" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Share with Students
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Make this material available to students.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUploadForm({ ...uploadForm, visibility: "Private" })
                    }
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
                      uploadForm.visibility === "Private"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Lock size={19} className="mt-0.5 text-slate-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Keep Private
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Keep this material private to your account.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Upload size={16} />
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource details modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedResource(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="font-bold text-slate-900">Resource Details</h2>
              <button
                onClick={() => setSelectedResource(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-4 text-blue-800">
                  {(() => {
                    const Icon = getFileIcon(selectedResource.fileName);
                    return <Icon size={28} />;
                  })()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">
                    {selectedResource.title}
                  </h3>
                  <p className="mt-1 break-all text-xs text-slate-400">
                    {selectedResource.fileName}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedResource.fileSize}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                {selectedResource.description || "No description provided."}
              </p>

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                {[
                  ["Resource Type", selectedResource.type],
                  ["Course", selectedResource.course],
                  ["Academic Session", selectedResource.session],
                  ["Semester", selectedResource.semester],
                  ["Uploaded", formatDate(selectedResource.uploadedAt)],
                  ["Visibility", selectedResource.visibility],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className="text-right font-medium text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadResource(selectedResource)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={() => toggleVisibility(selectedResource)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {selectedResource.visibility === "Students" ? (
                    <Lock size={16} />
                  ) : (
                    <Globe size={16} />
                  )}
                  {selectedResource.visibility === "Students"
                    ? "Make Private"
                    : "Share with Students"}
                </button>
              </div>

              <button
                onClick={() => deleteResource(selectedResource.id)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
