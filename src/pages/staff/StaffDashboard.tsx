
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    GraduationCap,
    Users,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Clock3,
    MapPin,
    ArrowUpRight,
    CheckCircle2,
    Circle,
    Megaphone,
    CalendarCheck,
    ClipboardList,
    Settings,
    LogOut,
    UserRound,
    BookMarked,
} from "lucide-react";

type IconComponent = typeof LayoutDashboard;

const navigation: {
    label: string;
    icon: IconComponent;
    path: string;
    badge?: string;
}[] = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            path: "/staff/dashboard",
        },
        {
            label: "My Courses",
            icon: BookOpen,
            path: "/staff/courses",
        },
        {
            label: "Timetable",
            icon: CalendarDays,
            path: "/staff/timetable",
        },
        {
            label: "Attendance",
            icon: ClipboardCheck,
            path: "/staff/attendance",
        },
        {
            label: "Results",
            icon: GraduationCap,
            path: "/staff/results",
            badge: "2",
        },
        {
            label: "Students",
            icon: Users,
            path: "/staff/students",
        },
        {
            label: "Academic Advising",
            icon: UserRound,
            path: "/staff/advising",
        },
        {
            label: "Resources",
            icon: BookMarked,
            path: "/staff/resources",
        },
    ];

const tasks = [
    {
        id: 1,
        title: "Submit continuous assessment scores",
        detail: "MEE 311 · 42 students",
        deadline: "Today, 4:00 PM",
        priority: "High",
    },
    {
        id: 2,
        title: "Complete lecture attendance",
        detail: "MEE 305 · Morning lecture",
        deadline: "Today",
        priority: "Medium",
    },
    {
        id: 3,
        title: "Review student advising requests",
        detail: "Department of Mechanical Engineering",
        deadline: "Tomorrow",
        priority: "Normal",
    },
];

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

const announcements = [
    {
        id: 1,
        category: "ACADEMIC",
        title: "First semester assessment submissions",
        body: "All lecturers are reminded to complete their continuous assessment entries before the departmental deadline.",
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
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"
                }`}
        >
            {status}
        </span>
    );
}

export default function StaffDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<number[]>([]);

    const today = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const toggleTask = (id: number) => {
        setCompletedTasks((previous) =>
            previous.includes(id)
                ? previous.filter((taskId) => taskId !== id)
                : [...previous, id]
        );
    };

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
            {sidebarOpen && (
                <button
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
                    <Link to="/staff/dashboard" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-white">
                            <GraduationCap size={23} />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold tracking-tight text-blue-950">
                                EduNova
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Staff portal
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 pt-6">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Workspace
                    </p>

                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = item.path === "/staff/dashboard";

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                            ? "bg-blue-950 text-white shadow-sm shadow-blue-950/10"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span className="flex-1">{item.label}</span>

                                    {item.badge && (
                                        <span
                                            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${active
                                                    ? "bg-white/15 text-white"
                                                    : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-8 px-4">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Account
                    </p>

                    <nav className="space-y-1">
                        <Link
                            to="/staff/profile"
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <UserRound size={18} />
                            My Profile
                        </Link>
                        <Link
                            to="/staff/settings"
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Settings size={18} />
                            Settings
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-blue-950">
                            <CalendarCheck size={18} />
                            <span className="text-xs font-bold">Academic session</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                            2026/2027
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            First semester
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            // Connect this to your actual logout handler.
                            window.location.href = "/login";
                        }}
                        className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0 lg:pl-[260px]">
                {/* Top navigation */}
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
                            aria-label="Open navigation"
                        >
                            <Menu size={21} />
                        </button>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                                Staff Workspace
                            </p>
                            <p className="hidden text-xs text-slate-500 sm:block">
                                Academic affairs and teaching
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <label className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex">
                            <Search size={17} className="shrink-0 text-slate-400" />
                            <input
                                aria-label="Search portal"
                                placeholder="Search portal..."
                                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />
                            <span className="text-[10px] text-slate-400">⌘ K</span>
                        </label>

                        <button
                            aria-label="Notifications"
                            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
                        >
                            <Bell size={19} />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                        </button>

                        <div className="hidden h-9 w-px bg-slate-200 sm:block" />

                        <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-950">
                                EA
                            </div>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-semibold text-slate-800">
                                    Edwin Adeyi-Samuel
                                </p>
                                <p className="text-xs text-slate-500">Lecturer</p>
                            </div>
                            <ChevronDown
                                size={16}
                                className="hidden text-slate-400 sm:block"
                            />
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    {/* Welcome */}
                    <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <CalendarDays size={15} />
                                {today}
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-blue-950 sm:text-3xl">
                                Good morning, Edwin
                                <span className="ml-2 inline-block">👋</span>
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Welcome back to your workspace. Here&apos;s what&apos;s
                                happening with your teaching and academic responsibilities.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                                    Lecturer
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                                    Mechanical Engineering
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/staff/timetable"
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:self-auto"
                        >
                            <CalendarDays size={17} />
                            View timetable
                            <ArrowUpRight size={16} />
                        </Link>
                    </section>

                    {/* Summary statistics */}
                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                title: "Assigned courses",
                                value: "6",
                                detail: "Across current semester",
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
                                value: String(
                                    tasks.filter((task) => !completedTasks.includes(task.id))
                                        .length
                                ),
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
                        ].map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {stat.title}
                                            </p>
                                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                                                {stat.value}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                                        >
                                            <Icon size={21} strokeWidth={1.8} />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-slate-500">{stat.detail}</p>
                                </div>
                            );
                        })}
                    </section>

                    {/* Main columns */}
                    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
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
                                            Full timetable <ChevronRight size={15} />
                                        </Link>
                                    }
                                />

                                <div className="space-y-4">
                                    {courses.map((course, index) => (
                                        <div
                                            key={course.code}
                                            className="flex gap-3 sm:gap-4"
                                        >
                                            <div className="w-[78px] shrink-0 pt-1">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {course.time.split(" – ")[0]}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {course.time.split(" – ")[1]}
                                                </p>
                                            </div>

                                            <div
                                                className={`w-1 shrink-0 rounded-full ${index === 0
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

                            {/* Assigned courses */}
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                                <SectionHeading
                                    title="My courses"
                                    subtitle="An overview of your teaching assignments"
                                    action={
                                        <Link
                                            to="/staff/courses"
                                            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
                                        >
                                            All courses <ChevronRight size={15} />
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
                                                    Manage course <ArrowUpRight size={14} />
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
                                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-800"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right column */}
                        <div className="min-w-0 space-y-6">
                            {/* Tasks */}
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                                <SectionHeading
                                    title="Pending tasks"
                                    subtitle="Stay on top of your responsibilities"
                                    action={
                                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                            {tasks.filter((t) => !completedTasks.includes(t.id)).length}{" "}
                                            left
                                        </span>
                                    }
                                />

                                <div className="space-y-4">
                                    {tasks.map((task) => {
                                        const done = completedTasks.includes(task.id);

                                        return (
                                            <div key={task.id} className="flex items-start gap-3">
                                                <button
                                                    onClick={() => toggleTask(task.id)}
                                                    aria-label={
                                                        done
                                                            ? "Mark task as incomplete"
                                                            : "Mark task as complete"
                                                    }
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
                                                    <p
                                                        className={`text-sm font-semibold ${done
                                                                ? "text-slate-400 line-through"
                                                                : "text-slate-800"
                                                            }`}
                                                    >
                                                        {task.title}
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {task.detail}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                            <Clock3 size={12} />
                                                            {task.deadline}
                                                        </span>
                                                        <span
                                                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${task.priority === "High"
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
                                    View all tasks <ChevronRight size={16} />
                                </Link>
                            </section>

                            {/* Announcements */}
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                                <SectionHeading
                                    title="Announcements"
                                    subtitle="Updates from your faculty and university"
                                    action={
                                        <button
                                            aria-label="View all announcements"
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            <ArrowUpRight size={17} />
                                        </button>
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

                            {/* Quick actions */}
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
                                <SectionHeading
                                    title="Quick actions"
                                    subtitle="Get things done faster"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        {
                                            label: "Take attendance",
                                            icon: ClipboardCheck,
                                            path: "/staff/attendance",
                                        },
                                        {
                                            label: "Enter results",
                                            icon: GraduationCap,
                                            path: "/staff/results",
                                        },
                                        {
                                            label: "View students",
                                            icon: Users,
                                            path: "/staff/students",
                                        },
                                        {
                                            label: "My timetable",
                                            icon: CalendarDays,
                                            path: "/staff/timetable",
                                        },
                                    ].map((action) => {
                                        const Icon = action.icon;

                                        return (
                                            <Link
                                                key={action.label}
                                                to={action.path}
                                                className="group rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                                            >
                                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-blue-100 group-hover:text-blue-900">
                                                    <Icon size={18} />
                                                </div>
                                                <p className="text-xs font-semibold leading-5 text-slate-700 group-hover:text-blue-950">
                                                    {action.label}
                                                </p>
                                                <ChevronRight
                                                    size={14}
                                                    className="mt-1 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-800"
                                                />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Helpful reminder */}
                            <div className="rounded-2xl bg-blue-950 p-5 text-white">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl bg-white/10 p-2.5">
                                        <Megaphone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">
                                            Teaching tip
                                        </p>
                                        <p className="mt-2 text-xs leading-5 text-blue-100/80">
                                            Keep your attendance records and assessment scores
                                            up to date to make end-of-semester processing easier.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
                        <p>© 2026 EduNova University Portal</p>
                        <p>Staff Workspace · 2026/2027 Academic Session</p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
