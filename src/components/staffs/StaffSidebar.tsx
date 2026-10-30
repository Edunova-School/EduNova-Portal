import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Users,
  UserRound,
  BookMarked,
  Settings,
  LogOut,
} from "lucide-react";

import logoVertical from "../../assets/EDUNOVA VERTICAL.webp";

interface StaffSidebarProps {
  onClose?: () => void;
  onLogout?: () => Promise<void> | void;
}

const navigation = [
  {
    label: "Overview",
    path: "/staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Courses",
    path: "/staff/courses",
    icon: BookOpen,
  },
  {
    label: "Timetable",
    path: "/staff/timetable",
    icon: CalendarDays,
  },
  {
    label: "Attendance",
    path: "/staff/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Results",
    path: "/staff/results",
    icon: GraduationCap,
    badge: "2",
  },
  {
    label: "Students",
    path: "/staff/students",
    icon: Users,
  },
  {
    label: "Academic Advising",
    path: "/staff/advising",
    icon: UserRound,
  },
  {
    label: "Resources",
    path: "/staff/resources",
    icon: BookMarked,
  },
];

const accountNavigation = [
  {
    label: "My Profile",
    path: "/staff/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    path: "/staff/settings",
    icon: Settings,
  },
];

export default function StaffSidebar({
  onClose,
  onLogout,
}: StaffSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === "/staff/dashboard") {
      return location.pathname === path;
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      if (onLogout) {
        await onLogout();
      } else {
        // Connect your staff logout API here.
        // Do not use the student logout endpoint unless
        // your backend explicitly supports it for staff.
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Staff logout failed:", error);
    } finally {
      setLoggingOut(false);
      setConfirmingLogout(false);
      onClose?.();
    }
  };

  const renderNavigationLink = (
    item: {
      label: string;
      path: string;
      icon: typeof LayoutDashboard;
      badge?: string;
    }
  ) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors duration-200 ${
          active
            ? "bg-[#14263F] font-medium text-white"
            : "text-black/65 hover:bg-[#14263F]/5 hover:text-[#14263F]"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#B8901F]" />
        )}

        <Icon
          size={18}
          strokeWidth={1.75}
          className={active ? "text-white" : "text-black/40"}
        />

        <span className="flex-1">{item.label}</span>

        {item.badge && (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              active
                ? "bg-white/15 text-white"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-black/5 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
        <Link
          to="/staff/dashboard"
          onClick={onClose}
          className="inline-flex items-center"
        >
          <img
            src={logoVertical}
            alt="EduNova"
            className="h-20 w-auto"
          />
        </Link>

        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Workspace navigation */}
      <div className="px-6 pb-2 pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35">
          Staff Portal
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
        {navigation.map(renderNavigationLink)}

        <div className="mb-2 mt-7 px-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35">
            Account
          </span>
        </div>

        {accountNavigation.map(renderNavigationLink)}
      </nav>

      {/* Logout */}
      <div className="border-t border-black/5 px-3 pb-3 pt-3">
        {!confirmingLogout ? (
          <button
            onClick={() => setConfirmingLogout(true)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-500 transition-colors duration-200 hover:bg-red-50"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Log Out
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg bg-red-50 px-4 py-3">
            <p className="text-xs leading-5 text-black/60">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 rounded-md bg-red-500 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Yes, Log Out"}
              </button>

              <button
                onClick={() => setConfirmingLogout(false)}
                disabled={loggingOut}
                className="flex-1 rounded-md border border-black/10 bg-white py-2 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-black/5 px-6 py-4">
        <p className="font-mono text-[10px] tracking-wide text-black/30">
          © 2026 EduNova University
        </p>
      </div>
    </aside>
  );
}