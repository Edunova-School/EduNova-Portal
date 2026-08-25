import Header from "../components/header"
import Sidebar from "../components/sidebar"
import { useState } from "react"
import { ChevronDown, Upload, FileText, CheckCircle2, Circle, Clock} from "lucide-react"
const currentInfo = [
  { label: "Student Name", value: "Edwin Adeyi-Samuel" },
  { label: "Student ID", value: "EDU/2026/UG/001245" },
  { label: "Faculty", value: "Faculty of Engineering & Technology" },
  { label: "Department", value: "Mechanical Engineering" },
  { label: "Current Level", value: "200 Level" },
  { label: "CGPA", value: "4.12" },
  { label: "Academic Session", value: "2026/2027" },
]
const faculties = ["Faculty of Computing & AI", "Faculty of Business & Management", "Faculty of Health Sciences"]
const departments = ["Computer Science", "Software Engineering", "Artificial Intelligence"]
const programmes = ["B.Sc. Computer Science", "B.Sc. Software Engineering"]
const eligibilityChecklist = [
  { label: "Minimum CGPA of 3.00", met: true },
  { label: "No outstanding fees", met: true },
  { label: "Programme accepts transfers", met: true },
  { label: "Departmental approval required", met: true },
]
const requestHistory = [
  { id: "PCR-2026-001", date: "Jul 20, 2026", from: "Mechanical Eng.", to: "Computer Science", status: "Pending" },
  { id: "PCR-2025-002", date: "Feb 12, 2025", from: "Civil Eng.", to: "Mechanical Eng.", status: "Approved" },
]
const timelineSteps = [
  { label: "Submitted", state: "done" },
  { label: "Department Review", state: "active" },
  { label: "Faculty Approval", state: "pending" },
  { label: "Registrar Approval", state: "pending" },
  { label: "Completed", state: "pending" },
]
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-600",
    Approved: "bg-green-50 text-green-600",
    Rejected: "bg-red-50 text-red-500",
  }
  const dots: Record<string, string> = {
    Pending: "bg-amber-500",
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} /> {status}
    </span>
  )
}
function Dropdown({ label, value, options, onChange }: {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative flex flex-col gap-2">
      <label className="font-mono text-xs tracking-wide uppercase text-black/50">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center justify-between border border-black/15 rounded-lg px-4 py-3 text-sm text-left focus:outline-none hover:border-black/25 transition-colors" >
        <span className={value ? "text-black" : "text-black/40"}>{value || "Select..."}</span>
        <ChevronDown size={16} className={`text-black/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden z-20">
          {options.map((opt, i) => (
            <button key={i} type="button" onClick={() => { onChange(opt); setOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-black/75 hover:bg-black/[0.03] transition-colors"> {opt} </button>
          ))}
        </div>
      )}
    </div>
  )
}
export default function ProgramChange() {
  const [hasPending, setHasPending] = useState(true)
  const [faculty, setFaculty] = useState("")
  const [department, setDepartment] = useState("")
  const [programme, setProgramme] = useState("")
  const [reason, setReason] = useState("")
  const [fileName, setFileName] = useState("")
  const [agreeAccurate, setAgreeAccurate] = useState(false)
  const [agreeNoGuarantee, setAgreeNoGuarantee] = useState(false)
  const canSubmit = faculty && department && programme && reason.trim() && agreeAccurate && agreeNoGuarantee
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileName(e.target.files[0].name)
  }
  const handleSubmit = () => {
    if (!canSubmit) return
    setHasPending(true)
  }
  return (
    <div className="bg-[#F6F6F2] min-h-screen">   
      <div className="flex">
        <aside className="hidden lg:block w-72">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </aside>
        <div className="flex-1">
          <Header />
          <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Academics</span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">
            Program Change Request
          </h1>
          <p className="font-sans text-black/55 text-sm mt-2 max-w-xl leading-relaxed">
            Submit a request to transfer from your current programme to another eligible programme.
            All requests are subject to approval by the Admissions Office and the receiving department.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Current Programme</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {currentInfo.map((item, i) => (
              <div key={i}>
                <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        {hasPending ? (
          <>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h5 className="font-serif text-lg font-semibold text-black">Current Request</h5>
                <StatusBadge status="Pending" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Status</p>
                  <p className="text-sm font-medium text-black">Pending Review</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Submitted</p>
                  <p className="text-sm font-medium text-black">August 5, 2026</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Expected Review</p>
                  <p className="text-sm font-medium text-black">Within 10 working days</p>
                </div>
              </div>
              <div className="relative flex justify-between pt-2">
                <div className="absolute top-[15px] left-0 right-0 h-px bg-black/10" />
                {timelineSteps.map((step, i) => (
                  <div key={i} className="relative flex flex-col items-center gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${ step.state === "done"? "bg-green-500 border-green-500": step.state === "active"? "bg-white border-[#1E3A8A]": "bg-white border-black/15"}`}>
                      {step.state === "done" && <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />}
                      {step.state === "active" && <Clock size={14} className="text-[#1E3A8A]" strokeWidth={2.5} />}
                      {step.state === "pending" && <Circle size={8} className="text-black/20 fill-black/20" />}
                    </div>
                    <span className={`text-[11px] text-center leading-tight max-w-[70px] ${step.state === "pending" ? "text-black/35" : "text-black/70 font-medium"}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setHasPending(false)} className="text-sm text-[#1E3A8A] hover:underline w-fit">
              View form to submit a new request instead →
            </button>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Requested Programme</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Dropdown label="Faculty" value={faculty} options={faculties} onChange={setFaculty} />
                <Dropdown label="Department" value={department} options={departments} onChange={setDepartment} />
                <Dropdown label="Programme" value={programme} options={programmes} onChange={setProgramme} />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <label className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4 block">
                Reason for Request
              </label>
              <textarea rows={5} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="I am requesting to transfer to the Computer Science programme because..."className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors resize-none"/>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Supporting Documents</p>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/15 rounded-xl py-8 cursor-pointer hover:border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/[0.02] transition-colors">
                <Upload size={22} strokeWidth={1.5} className="text-black/30" />
                <span className="text-sm text-black/60">
                  {fileName ? (
                    <span className="flex items-center gap-2 text-[#1E3A8A] font-medium">
                      <FileText size={14} /> {fileName}
                    </span>
                  ) : (
                    "Click to choose a file"
                  )}
                </span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-xs text-black/40 mt-3">
                Accepted formats: PDF, JPG, PNG · Maximum size: 5MB
              </p>
              <p className="text-xs text-black/40 mt-1">
                Examples: academic transcript, recommendation letter, medical report (if applicable)
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Eligibility Checklist</p>
              <div className="flex flex-col gap-3">
                {eligibilityChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} strokeWidth={2} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-black/75">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Terms & Declaration</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreeAccurate} onChange={() => setAgreeAccurate(!agreeAccurate)} className="w-4 h-4 mt-0.5 rounded border-black/20 accent-[#1E3A8A]"/>
                  <span className="text-sm text-black/70">I confirm that the information provided is accurate.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreeNoGuarantee} onChange={() => setAgreeNoGuarantee(!agreeNoGuarantee)} className="w-4 h-4 mt-0.5 rounded border-black/20 accent-[#1E3A8A]"/>
                  <span className="text-sm text-black/70">I understand that submitting this request does not guarantee approval.</span>
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button className="px-6 py-3 rounded-xl text-sm font-medium text-black/60 border border-black/10 hover:bg-black/[0.03] transition-colors order-3 sm:order-1">
                Cancel
              </button>
              <button className="px-6 py-3 rounded-xl text-sm font-medium text-[#1E3A8A] border border-[#1E3A8A]/20 hover:bg-[#1E3A8A]/5 transition-colors order-2">
                Save Draft
              </button>
              <button onClick={handleSubmit} disabled={!canSubmit} className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#14263F] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none order-1 sm:order-3">
                Submit Request
              </button>
            </div>
          </>
        )}
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mt-2">
          <div className="px-6 py-5 border-b border-black/5">
            <h5 className="font-serif text-lg font-semibold text-black">Request History</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.015]">
                  {["Request ID", "Date", "From", "To", "Status"].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requestHistory.map((req, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-b-0">
                    <td className="px-6 py-3.5 font-mono text-xs text-black/60">{req.id}</td>
                    <td className="px-6 py-3.5 text-black/60">{req.date}</td>
                    <td className="px-6 py-3.5 text-black/75">{req.from}</td>
                    <td className="px-6 py-3.5 text-black/75 font-medium">{req.to}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div><div className="px-4 md:px-8 py-8 max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Academics</span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">
            Program Change Request
          </h1>
          <p className="font-sans text-black/55 text-sm mt-2 max-w-xl leading-relaxed">
            Submit a request to transfer from your current programme to another eligible programme.
            All requests are subject to approval by the Admissions Office and the receiving department.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Current Programme</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {currentInfo.map((item, i) => (
              <div key={i}>
                <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        {hasPending ? (
          <>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h5 className="font-serif text-lg font-semibold text-black">Current Request</h5>
                <StatusBadge status="Pending" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Status</p>
                  <p className="text-sm font-medium text-black">Pending Review</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Submitted</p>
                  <p className="text-sm font-medium text-black">August 5, 2026</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Expected Review</p>
                  <p className="text-sm font-medium text-black">Within 10 working days</p>
                </div>
              </div>
              <div className="relative flex justify-between pt-2">
                <div className="absolute top-[15px] left-0 right-0 h-px bg-black/10" />
                {timelineSteps.map((step, i) => (
                  <div key={i} className="relative flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${step.state === "done"? "bg-green-500 border-green-500": step.state === "active"? "bg-white border-[#1E3A8A]" : "bg-white border-black/15"}`}>
                      {step.state === "done" && <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />}
                      {step.state === "active" && <Clock size={14} className="text-[#1E3A8A]" strokeWidth={2.5} />}
                      {step.state === "pending" && <Circle size={8} className="text-black/20 fill-black/20" />}
                    </div>
                    <span className={`text-[11px] text-center leading-tight max-w-[70px] ${
                      step.state === "pending" ? "text-black/35" : "text-black/70 font-medium"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setHasPending(false)} className="text-sm text-[#1E3A8A] hover:underline w-fit">
              View form to submit a new request instead →
            </button>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Requested Programme</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Dropdown label="Faculty" value={faculty} options={faculties} onChange={setFaculty} />
                <Dropdown label="Department" value={department} options={departments} onChange={setDepartment} />
                <Dropdown label="Programme" value={programme} options={programmes} onChange={setProgramme} />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <label className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4 block">
                Reason for Request
              </label>
              <textarea rows={5} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="I am requesting to transfer to the Computer Science programme because..." className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors resize-none"/>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Supporting Documents</p>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/15 rounded-xl py-8 cursor-pointer hover:border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/[0.02] transition-colors">
                <Upload size={22} strokeWidth={1.5} className="text-black/30" />
                <span className="text-sm text-black/60">
                  {fileName ? (
                    <span className="flex items-center gap-2 text-[#1E3A8A] font-medium">
                      <FileText size={14} /> {fileName}
                    </span>
                  ) : (
                    "Click to choose a file"
                  )}
                </span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-xs text-black/40 mt-3">
                Accepted formats: PDF, JPG, PNG · Maximum size: 5MB
              </p>
              <p className="text-xs text-black/40 mt-1">
                Examples: academic transcript, recommendation letter, medical report (if applicable)
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Eligibility Checklist</p>
              <div className="flex flex-col gap-3">
                {eligibilityChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} strokeWidth={2} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-black/75">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Terms & Declaration</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreeAccurate} onChange={() => setAgreeAccurate(!agreeAccurate)} className="w-4 h-4 mt-0.5 rounded border-black/20 accent-[#1E3A8A]"/>
                  <span className="text-sm text-black/70">I confirm that the information provided is accurate.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreeNoGuarantee} onChange={() => setAgreeNoGuarantee(!agreeNoGuarantee)} className="w-4 h-4 mt-0.5 rounded border-black/20 accent-[#1E3A8A]"/>
                  <span className="text-sm text-black/70">I understand that submitting this request does not guarantee approval.</span>
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button className="px-6 py-3 rounded-xl text-sm font-medium text-black/60 border border-black/10 hover:bg-black/[0.03] transition-colors order-3 sm:order-1">
                Cancel
              </button>
              <button className="px-6 py-3 rounded-xl text-sm font-medium text-[#1E3A8A] border border-[#1E3A8A]/20 hover:bg-[#1E3A8A]/5 transition-colors order-2">
                Save Draft
              </button>
              <button onClick={handleSubmit} disabled={!canSubmit} className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#14263F] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none order-1 sm:order-3">
                Submit Request
              </button>
            </div>
          </>
        )}
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mt-2">
          <div className="px-6 py-5 border-b border-black/5">
            <h5 className="font-serif text-lg font-semibold text-black">Request History</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.015]">
                  {["Request ID", "Date", "From", "To", "Status"].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requestHistory.map((req, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-b-0">
                    <td className="px-6 py-3.5 font-mono text-xs text-black/60">{req.id}</td>
                    <td className="px-6 py-3.5 text-black/60">{req.date}</td>
                    <td className="px-6 py-3.5 text-black/75">{req.from}</td>
                    <td className="px-6 py-3.5 text-black/75 font-medium">{req.to}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}