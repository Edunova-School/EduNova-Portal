import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  RefreshCw,
} from "lucide-react";

import {
  getProgramChangeData,
  getProgramChangeRequest,
  submitProgramChangeRequest,
  getStudentDashboard,
} from "../lib/api";

type AnyRecord = Record<string, any>;

type ProgrammeId = string | number;

function unwrap(response: any): AnyRecord {
  return response?.data?.data ?? response?.data ?? response ?? {};
}

function pick(
  obj: AnyRecord | null | undefined,
  keys: string[],
  fallback: any = ""
): any {
  for (const key of keys) {
    const value = obj?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function getArray(obj: AnyRecord | null | undefined, keys: string[]): AnyRecord[] {
  if (!obj || typeof obj !== "object") return [];

  for (const key of keys) {
    if (Array.isArray(obj[key])) {
      return obj[key];
    }
  }

  // Support common API wrappers such as { items: [...] } and { results: [...] }.
  for (const containerKey of ["data", "result", "results"]) {
    const container = obj[containerKey];

    if (Array.isArray(container)) {
      return container;
    }

    if (container && typeof container === "object") {
      for (const key of keys) {
        if (Array.isArray(container[key])) {
          return container[key];
        }
      }
    }
  }

  return [];
}

function getId(item: AnyRecord): string {
  return String(
    pick(
      item,
      [
        "id",
        "programme_id",
        "program_id",
        "requested_programme_id",
      ],
      ""
    )
  );
}

function getProgrammeName(item: AnyRecord): string {
  if (typeof item === "string") return item;

  return String(
    pick(
      item,
      [
        "programme_name",
        "program_name",
        "name",
        "title",
        "label",
      ],
      "Unnamed programme"
    )
  );
}

function formatDate(value: any): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string): string {
  return status
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const style =
    normalized.includes("approv") && !normalized.includes("not")
      ? "bg-green-50 text-green-700"
      : normalized.includes("reject") ||
          normalized.includes("declin") ||
          normalized.includes("cancel")
        ? "bg-red-50 text-red-600"
        : normalized.includes("complete")
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {formatStatus(status || "Unknown")}
    </span>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-black/40">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-black">
        {value === null || value === undefined || value === ""
          ? "Not available"
          : String(value)}
      </p>
    </div>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="py-2">
      <p className="mb-1 text-xs text-black/45">{label}</p>
      <p className="break-words text-sm text-black/80">{String(value)}</p>
    </div>
  );
}

export default function ProgramChange() {
  const [pageData, setPageData] = useState<AnyRecord>({});
  const [dashboardData, setDashboardData] = useState<AnyRecord>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [requestedProgrammeId, setRequestedProgrammeId] = useState("");
  const [reason, setReason] = useState("");

  const [agreeAccurate, setAgreeAccurate] = useState(false);
  const [agreeNoGuarantee, setAgreeNoGuarantee] = useState(false);

  const [requestDetails, setRequestDetails] =
    useState<AnyRecord | null>(null);

  const [showForm, setShowForm] = useState(false);

  const loadProgramChangeData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [programmeResult, dashboardResult] = await Promise.allSettled([
      getProgramChangeData(),
      getStudentDashboard(),
    ]);

    const errors: string[] = [];

    if (programmeResult.status === "fulfilled") {
      setPageData(unwrap(programmeResult.value));
    } else {
      console.error(
        "Failed to load programme change data:",
        programmeResult.reason
      );

      errors.push(
        "Unable to load programme change requests. Please refresh the page."
      );
    }

    if (dashboardResult.status === "fulfilled") {
      setDashboardData(unwrap(dashboardResult.value));
    } else {
      console.error(
        "Failed to load student dashboard:",
        dashboardResult.reason
      );

      errors.push(
        "Student academic information could not be loaded."
      );
    }

    setError(errors.join(" "));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProgramChangeData();
  }, [loadProgramChangeData]);

  // Dashboard API: data.student and data.academics.
  const student = pick(
    dashboardData,
    ["student", "student_info", "profile"],
    {}
  );

  const academics = pick(
    dashboardData,
    ["academics", "academic", "academic_info"],
    {}
  );

  // Some programme-change responses may also include current programme data.
  const currentProgramme = pick(
    pageData,
    [
      "current_programme",
      "current_program",
      "currentProgramme",
      "programme",
    ],
    academics
  );

  const studentName =
    [
      student?.first_name,
      student?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    pick(student, ["full_name", "name", "student_name"], "Not available");

  const studentId = pick(
    student,
    ["matric_number", "student_id", "registration_number"],
    "Not available"
  );

  const currentFaculty = pick(
    academics,
    ["faculty_name", "faculty"],
    pick(currentProgramme, ["faculty_name", "faculty"], "Not available")
  );

  const currentDepartment = pick(
    academics,
    ["department_name", "department"],
    pick(currentProgramme, ["department_name", "department"], "Not available")
  );

  const currentProgrammeName = pick(
    academics,
    ["programme_name", "program_name", "name", "title"],
    pick(
      currentProgramme,
      ["programme_name", "program_name", "name", "title"],
      "Not available"
    )
  );

  const currentLevel = pick(
    academics,
    ["level", "current_level"],
    pick(student, ["level", "current_level"], "Not available")
  );

  // CGPA is not present in the dashboard response supplied.
  const cgpa = pick(
    academics,
    ["cgpa", "cumulative_gpa"],
    pick(student, ["cgpa", "cumulative_gpa"], "Not available")
  );

  const academicSession = pick(
    academics,
    ["academic_session", "academic_year", "session"],
    pick(
      pageData,
      ["academic_session", "academic_year", "session"],
      "Not available"
    )
  );

  const activeRequest = pick(
    pageData,
    [
      "active_request",
      "current_request",
      "pending_request",
      "activeRequest",
    ],
    null
  );

  const programmes = useMemo(
    () =>
      getArray(pageData, [
        "eligible_programmes",
        "available_programmes",
        "programmes",
        "available_programs",
        "eligible_programs",
      ]),
    [pageData]
  );

  const history = getArray(pageData, [
    "request_history",
    "history",
    "requests",
  ]);

  const currentRequestStatus = String(
    pick(
      activeRequest,
      ["status", "request_status", "approval_status"],
      ""
    )
  );

  const terminalStatuses = [
    "rejected",
    "declined",
    "cancelled",
    "canceled",
    "completed",
    "approved",
  ];

  const hasActiveRequest =
    Boolean(activeRequest) &&
    !terminalStatuses.includes(currentRequestStatus.toLowerCase());

  const selectedProgramme = programmes.find(
    (programme) => getId(programme) === requestedProgrammeId
  );

  const canSubmit =
    Boolean(requestedProgrammeId) &&
    Boolean(reason.trim()) &&
    agreeAccurate &&
    agreeNoGuarantee &&
    !submitting &&
    !hasActiveRequest;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (!selectedProgramme || !getId(selectedProgramme)) {
      setError("Please select a valid programme from the available options.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const id = getId(selectedProgramme);

      // Send numeric IDs as numbers, while preserving UUID/string IDs.
      const requestedProgrammeIdValue: ProgrammeId =
        /^\d+$/.test(id) ? Number(id) : id;

      await submitProgramChangeRequest({
        requested_programme_id: requestedProgrammeIdValue,
        reason: reason.trim(),
      });

      setSuccessMessage(
        "Your programme change request was submitted successfully."
      );

      setRequestedProgrammeId("");
      setReason("");
      setAgreeAccurate(false);
      setAgreeNoGuarantee(false);
      setShowForm(false);
      setRequestDetails(null);

      await loadProgramChangeData();
    } catch (err) {
      console.error("Programme change submission failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit your programme change request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewRequest = async (requestId: string) => {
    if (!requestId) return;

    setDetailsLoading(true);
    setError("");
    setRequestDetails(null);

    try {
      const response = await getProgramChangeRequest(requestId);
      setRequestDetails(unwrap(response));
    } catch (err) {
      console.error("Failed to load request details:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the request details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const currentRequestId = String(
    pick(
      activeRequest,
      ["id", "request_id", "reference", "request_number"],
      ""
    )
  );

  const detailRecord = requestDetails
    ? pick(
        requestDetails,
        ["request", "details", "program_change_request"],
        requestDetails
      )
    : null;

  const requestStages = getArray(
    detailRecord ?? activeRequest,
    ["timeline", "stages", "approval_steps", "progress"]
  );

  return (
    <div className="min-h-screen bg-[#F6F6F2]">
      <div className="flex">
        <aside className="hidden w-72 lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Header />

          <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/40">
                Academics
              </span>

              <h1 className="mt-2 font-serif text-2xl font-semibold text-black md:text-3xl">
                Programme Change Request
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/55">
                Submit a request to transfer from your current programme to
                another eligible programme. All requests are subject to the
                required approvals.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
              >
                {successMessage}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-black/5 bg-white p-8 text-sm text-black/60">
                Loading programme information...
              </div>
            ) : (
              <>
                {/* Current student and academic information */}
                <section className="rounded-2xl border border-black/5 bg-white p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#B8901F]">
                      Current Programme
                    </p>

                    <button
                      type="button"
                      onClick={() => void loadProgramChangeData()}
                      disabled={loading}
                      title="Refresh information"
                      aria-label="Refresh information"
                      className="rounded-lg p-2 text-black/50 transition hover:bg-black/5 disabled:opacity-40"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    <InfoItem
                      label="Student Name"
                      value={studentName}
                    />

                    <InfoItem
                      label="Student ID"
                      value={studentId}
                    />

                    <InfoItem
                      label="Current Programme"
                      value={currentProgrammeName}
                    />

                    <InfoItem
                      label="Faculty"
                      value={currentFaculty}
                    />

                    <InfoItem
                      label="Department"
                      value={currentDepartment}
                    />

                    <InfoItem
                      label="Current Level"
                      value={currentLevel}
                    />

                    <InfoItem
                      label="CGPA"
                      value={cgpa}
                    />

                    <InfoItem
                      label="Academic Session"
                      value={academicSession}
                    />
                  </div>
                </section>

                {/* Existing active request */}
                {hasActiveRequest && !showForm ? (
                  <section className="rounded-2xl border border-black/5 bg-white p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-serif text-lg font-semibold text-black">
                        Current Request
                      </h2>

                      <StatusBadge
                        status={currentRequestStatus || "Pending"}
                      />
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <InfoItem
                        label="Request ID"
                        value={currentRequestId || "Not available"}
                      />

                      <InfoItem
                        label="Submitted"
                        value={formatDate(
                          pick(activeRequest, [
                            "created_at",
                            "submitted_at",
                            "request_date",
                          ])
                        )}
                      />

                      <InfoItem
                        label="Requested Programme"
                        value={pick(activeRequest, [
                          "requested_programme_name",
                          "programme_name",
                          "requested_program_name",
                        ], "Not available")}
                      />
                    </div>

                    {requestStages.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-black/45">
                          Approval Progress
                        </h3>

                        {requestStages.map((stage, index) => {
                          const stageStatus = String(
                            pick(stage, ["status", "state"], "pending")
                          ).toLowerCase();

                          const completed = [
                            "approved",
                            "completed",
                            "complete",
                            "done",
                            "passed",
                          ].includes(stageStatus);

                          const inProgress = [
                            "active",
                            "in_progress",
                            "in progress",
                            "under_review",
                            "under review",
                          ].includes(stageStatus);

                          return (
                            <div
                              key={stage.id ?? index}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-0.5">
                                {completed ? (
                                  <CheckCircle2
                                    size={19}
                                    className="text-green-600"
                                  />
                                ) : inProgress ? (
                                  <Clock
                                    size={19}
                                    className="text-[#1E3A8A]"
                                  />
                                ) : (
                                  <Circle
                                    size={19}
                                    className="text-black/25"
                                  />
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-medium text-black">
                                  {pick(
                                    stage,
                                    ["label", "name", "stage", "title"],
                                    "Approval stage"
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-black/45">
                                  {formatStatus(stageStatus)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-black/55">
                        {pick(
                          activeRequest,
                          ["message", "description"],
                          "Your request is being processed. View the request details for any additional information."
                        )}
                      </p>
                    )}

                    <div className="mt-6">
                      {currentRequestId && (
                        <button
                          type="button"
                          onClick={() =>
                            void handleViewRequest(currentRequestId)
                          }
                          disabled={detailsLoading}
                          className="text-sm font-medium text-[#1E3A8A] hover:underline disabled:opacity-50"
                        >
                          {detailsLoading
                            ? "Loading details..."
                            : "View latest request details"}
                        </button>
                      )}
                    </div>

                    {detailRecord && (
                      <div className="mt-5 rounded-xl bg-black/[0.025] p-4">
                        <h3 className="mb-3 text-sm font-semibold text-black">
                          Request Details
                        </h3>

                        <DetailLine
                          label="Status"
                          value={pick(detailRecord, [
                            "status",
                            "request_status",
                          ])}
                        />

                        <DetailLine
                          label="Reason"
                          value={pick(detailRecord, [
                            "reason",
                            "request_reason",
                          ])}
                        />

                        <DetailLine
                          label="Submitted"
                          value={formatDate(
                            pick(detailRecord, [
                              "created_at",
                              "submitted_at",
                              "request_date",
                            ])
                          )}
                        />

                        <DetailLine
                          label="Last Updated"
                          value={formatDate(
                            pick(detailRecord, [
                              "updated_at",
                              "last_updated",
                            ])
                          )}
                        />

                        <DetailLine
                          label="Message"
                          value={pick(detailRecord, [
                            "message",
                            "description",
                          ])}
                        />
                      </div>
                    )}
                  </section>
                ) : (
                  <>
                    {hasActiveRequest && showForm && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        You already have an active programme change request.
                        You cannot submit another request while it is pending.

                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="ml-2 font-semibold underline"
                        >
                          Return to current request
                        </button>
                      </div>
                    )}

                    {/* Programme selection */}
                    <section className="rounded-2xl border border-black/5 bg-white p-6">
                      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#B8901F]">
                        Requested Programme
                      </p>

                      <label
                        htmlFor="requested-programme"
                        className="mb-2 block text-sm font-medium text-black/70"
                      >
                        Select the programme you want to transfer to
                      </label>

                      <select
                        id="requested-programme"
                        value={requestedProgrammeId}
                        onChange={(event) =>
                          setRequestedProgrammeId(event.target.value)
                        }
                        disabled={hasActiveRequest || submitting}
                        className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] disabled:cursor-not-allowed disabled:bg-black/[0.03]"
                      >
                        <option value="">Choose a programme</option>

                        {programmes.map((programme, index) => {
                          const id = getId(programme);

                          return (
                            <option
                              key={id || index}
                              value={id}
                              disabled={!id}
                            >
                              {getProgrammeName(programme)}
                            </option>
                          );
                        })}
                      </select>

                      {programmes.length === 0 && (
                        <p className="mt-3 text-sm text-amber-700">
                          No available programmes were returned by the API.
                          Check the programme-change endpoint response and
                          the backend eligibility rules.
                        </p>
                      )}
                    </section>

                    {/* Request reason */}
                    <section className="rounded-2xl border border-black/5 bg-white p-6">
                      <label
                        htmlFor="reason"
                        className="mb-4 block font-mono text-xs uppercase tracking-widest text-[#B8901F]"
                      >
                        Reason for Request
                      </label>

                      <textarea
                        id="reason"
                        rows={5}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        disabled={hasActiveRequest || submitting}
                        maxLength={2000}
                        placeholder="Explain why you are requesting a programme change..."
                        className="w-full resize-y rounded-lg border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] disabled:cursor-not-allowed disabled:bg-black/[0.03]"
                      />

                      <p className="mt-2 text-xs text-black/40">
                        Provide a clear explanation to support your request.
                      </p>
                    </section>

                    {/* Declarations */}
                    <section className="rounded-2xl border border-black/5 bg-white p-6">
                      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#B8901F]">
                        <FileText
                          size={14}
                          className="mr-2 inline"
                        />
                        Terms &amp; Declaration
                      </p>

                      <div className="flex flex-col gap-4">
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={agreeAccurate}
                            onChange={(event) =>
                              setAgreeAccurate(event.target.checked)
                            }
                            disabled={hasActiveRequest || submitting}
                            className="mt-0.5 h-4 w-4 accent-[#1E3A8A]"
                          />

                          <span className="text-sm text-black/70">
                            I confirm that the information provided is
                            accurate.
                          </span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={agreeNoGuarantee}
                            onChange={(event) =>
                              setAgreeNoGuarantee(event.target.checked)
                            }
                            disabled={hasActiveRequest || submitting}
                            className="mt-0.5 h-4 w-4 accent-[#1E3A8A]"
                          />

                          <span className="text-sm text-black/70">
                            I understand that submitting this request does not
                            guarantee approval.
                          </span>
                        </label>
                      </div>
                    </section>

                    {/* Submit */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => void handleSubmit()}
                        disabled={!canSubmit}
                        className="rounded-xl bg-[#14263F] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                      >
                        {submitting ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </>
                )}

                {/* Request history */}
                <section className="mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white">
                  <div className="border-b border-black/5 px-6 py-5">
                    <h2 className="font-serif text-lg font-semibold text-black">
                      Request History
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-black/5 bg-black/[0.015]">
                          {[
                            "Request ID",
                            "Date",
                            "Requested Programme",
                            "Status",
                            "",
                          ].map((heading, index) => (
                            <th
                              key={`${heading}-${index}`}
                              className="whitespace-nowrap px-6 py-3 font-mono text-[10px] uppercase tracking-wide text-black/40"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {history.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-sm text-black/45"
                            >
                              No previous programme change requests found.
                            </td>
                          </tr>
                        ) : (
                          history.map((request, index) => {
                            const id = String(
                              pick(request, [
                                "id",
                                "request_id",
                                "reference",
                                "request_number",
                              ], "")
                            );

                            const status = String(
                              pick(
                                request,
                                ["status", "request_status"],
                                "Unknown"
                              )
                            );

                            return (
                              <tr
                                key={id || index}
                                className="border-b border-black/5 last:border-b-0"
                              >
                                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-black/60">
                                  {id || "—"}
                                </td>

                                <td className="whitespace-nowrap px-6 py-4 text-black/60">
                                  {formatDate(
                                    pick(request, [
                                      "created_at",
                                      "submitted_at",
                                      "request_date",
                                    ])
                                  )}
                                </td>

                                <td className="px-6 py-4 font-medium text-black/75">
                                  {pick(
                                    request,
                                    [
                                      "requested_programme_name",
                                      "programme_name",
                                      "requested_program_name",
                                    ],
                                    "—"
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  <StatusBadge status={status} />
                                </td>

                                <td className="whitespace-nowrap px-6 py-4">
                                  {id && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void handleViewRequest(id)
                                      }
                                      disabled={detailsLoading}
                                      className="text-xs font-medium text-[#1E3A8A] hover:underline disabled:opacity-50"
                                    >
                                      {detailsLoading
                                        ? "Loading..."
                                        : "View details"}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {detailRecord && (
                    <div className="border-t border-black/5 p-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="font-serif font-semibold text-black">
                          Selected Request Details
                        </h3>

                        <button
                          type="button"
                          onClick={() => setRequestDetails(null)}
                          className="text-xs text-black/50 hover:text-black"
                        >
                          Close
                        </button>
                      </div>

                      <div className="divide-y divide-black/5">
                        <DetailLine
                          label="Request ID"
                          value={pick(detailRecord, [
                            "id",
                            "request_id",
                            "reference",
                            "request_number",
                          ])}
                        />

                        <DetailLine
                          label="Status"
                          value={pick(detailRecord, [
                            "status",
                            "request_status",
                            "approval_status",
                          ])}
                        />

                        <DetailLine
                          label="Requested Programme"
                          value={pick(detailRecord, [
                            "requested_programme_name",
                            "programme_name",
                            "requested_program_name",
                          ])}
                        />

                        <DetailLine
                          label="Reason"
                          value={pick(detailRecord, [
                            "reason",
                            "request_reason",
                          ])}
                        />

                        <DetailLine
                          label="Submitted"
                          value={formatDate(
                            pick(detailRecord, [
                              "created_at",
                              "submitted_at",
                              "request_date",
                            ])
                          )}
                        />

                        <DetailLine
                          label="Last Updated"
                          value={formatDate(
                            pick(detailRecord, [
                              "updated_at",
                              "last_updated",
                            ])
                          )}
                        />

                        <DetailLine
                          label="Message"
                          value={pick(detailRecord, [
                            "message",
                            "description",
                          ])}
                        />
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}