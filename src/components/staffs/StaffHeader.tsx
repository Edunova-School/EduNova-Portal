<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  DownloadIcon,
  SettingsIcon,
>>>>>>> origin/main
  HelpCircle,
  KeyRound,
  UserRound,
} from "lucide-react";
<<<<<<< HEAD
import StaffSidebar from "./StaffSidebar";
import { getStaffDashboard } from "../../lib/api";
=======

import StaffSidebar from "./StaffSidebar";
>>>>>>> origin/main

interface StaffHeaderProps {
  staffName?: string;
  staffRole?: string;
  onLogout?: () => Promise<void> | void;
}

<<<<<<< HEAD
interface StaffProfile {
  id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  staff_number?: string;
  department?: string | null;
  faculty?: string | null;
  email?: string;
}

export default function StaffHeader({
  staffName: initialName,
  staffRole: initialRole,
=======
export default function StaffHeader({
  staffName = "Staff Member",
  staffRole = "Lecturer",
>>>>>>> origin/main
  onLogout,
}: StaffHeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

<<<<<<< HEAD
  const [staff, setStaff] = useState<StaffProfile | null>(null);
  const [staffName, setStaffName] = useState(
    initialName || "Staff Member"
  );
  const [staffRole, setStaffRole] = useState(
    initialRole || "Staff"
  );

  const navigate = useNavigate();

  // Fetch authenticated staff information from the backend.
  useEffect(() => {
    let active = true;

    async function loadStaffDetails() {
      try {
        const response = await getStaffDashboard();
        const data = response?.data ?? response;
        const profile = data?.staff as StaffProfile | undefined;

        if (!active || !profile) return;

        setStaff(profile);

        const name =
          profile.full_name ||
          `${profile.first_name ?? ""} ${
            profile.last_name ?? ""
          }`.trim();

        if (name) {
          setStaffName(name);
        }

        if (profile.job_title) {
          setStaffRole(profile.job_title);
        }
      } catch (error) {
        console.error(
          "Unable to load staff header details:",
          error
        );
      }
    }

    loadStaffDetails();

    return () => {
      active = false;
    };
  }, []);

  // Keep header details synchronized with props supplied by the parent.
  useEffect(() => {
    if (initialName) setStaffName(initialName);
    if (initialRole) setStaffRole(initialRole);
  }, [initialName, initialRole]);

=======
  const navigate = useNavigate();

>>>>>>> origin/main
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const settingsItems = [
    {
      icon: UserRound,
      label: "My Profile",
      path: "/staff/profile",
    },
    {
      icon: KeyRound,
      label: "Change Password",
      path: "/staff/change-password",
    },
    {
      icon: HelpCircle,
      label: "Help",
      path: "/staff/help",
    },
  ];

  const initials =
    staffName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "ST";

  return (
    <>
      <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-white/10 bg-[#14263F] px-2 py-4 sm:px-4 md:px-6 lg:px-6">
        {/* Welcome and mobile menu */}
        <div className="flex min-w-0 items-center gap-4">
          <button
<<<<<<< HEAD
            type="button"
=======
>>>>>>> origin/main
            onClick={() => setShowSidebar(true)}
            aria-label="Open menu"
            aria-expanded={showSidebar}
            className="cursor-pointer text-white/70 transition-colors duration-200 hover:text-white lg:hidden"
          >
            <Menu size={24} strokeWidth={1.75} />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <p className="font-sans text-sm text-white/70">
                Welcome,
              </p>

              <p className="truncate font-serif text-sm font-semibold leading-none text-white md:text-lg">
                {staffName}
              </p>
            </div>

            <p className="mt-1 truncate font-mono text-xs text-white/60">
              {formattedDate}
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Staff information and header actions */}
        <div className="flex min-w-0 items-center gap-2 md:gap-4">
          {/* Staff details */}
          <div className="hidden min-w-0 text-right xl:block">
            <p className="truncate text-sm font-medium text-white">
              {staffRole}
              {staff?.staff_number
                ? ` · ${staff.staff_number}`
                : ""}
            </p>

            <p className="truncate text-xs text-white/60">
              {staff?.department || "Department not assigned"}
              {" · "}
              {staff?.faculty || "Faculty not assigned"}
            </p>
          </div>

          {/* Settings dropdown */}
          <div className="relative">
            
            {showSettings && (
              <>
                <button
                  type="button"
=======
        {/* Header actions */}
        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <button
            aria-label="Download"
            onClick={() => {
              // Connect to a download action when required.
            }}
            className="cursor-pointer rounded-full p-2 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <DownloadIcon size={20} strokeWidth={1.75} />
          </button>

          {/* Settings dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setShowSettings((previous) => !previous)
              }
              aria-label="Settings"
              aria-expanded={showSettings}
              className="cursor-pointer rounded-full p-2 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <SettingsIcon size={20} strokeWidth={1.75} />
            </button>

            {showSettings && (
              <>
                {/* Close dropdown when clicking outside */}
                <button
>>>>>>> origin/main
                  aria-label="Close settings menu"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() => setShowSettings(false)}
                />

                <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-black/5 bg-white shadow-lg">
                  {settingsItems.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <button
<<<<<<< HEAD
                        type="button"
=======
>>>>>>> origin/main
                        key={item.label}
                        onClick={() => {
                          setShowSettings(false);
                          navigate(item.path);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-black/70 transition-colors hover:bg-black/[0.03]"
                      >
                        <ItemIcon
                          size={16}
                          strokeWidth={1.75}
                        />
                        {item.label}
                      </button>
                    );
                  })}
<<<<<<< HEAD

                  {onLogout && (
                    <button
                      type="button"
                      onClick={async () => {
                        setShowSettings(false);
                        await onLogout();
                      }}
                      className="w-full border-t border-slate-100 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  )}
=======
>>>>>>> origin/main
                </div>
              </>
            )}
          </div>

          {/* Staff identity */}
          <div className="ml-1 hidden h-9 w-px bg-white/15 sm:block" />

          <button
<<<<<<< HEAD
            type="button"
=======
>>>>>>> origin/main
            onClick={() => navigate("/staff/profile")}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-white/10"
            aria-label="Open staff profile"
          >
<<<<<<< HEAD
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
=======
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
>>>>>>> origin/main
              {initials}
            </div>

            <div className="hidden max-w-40 text-left sm:block">
              <p className="truncate text-sm font-semibold text-white">
                {staffName}
              </p>

              <p className="truncate text-xs text-white/60">
                {staffRole}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
<<<<<<< HEAD
            type="button"
=======
>>>>>>> origin/main
            aria-label="Close navigation"
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/40"
          />

          <div className="relative z-10 h-full">
            <StaffSidebar
              onClose={() => setShowSidebar(false)}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}
    </>
  );
}