import { useState } from "react"
import { ChevronDown, Download, Printer, Lock, CheckCircle2, Clock, TrendingUp, MessageSquareQuote,} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts"
import Sidebar from "../components/sidebar"
import Header from "../components/header"

const summaryCards = [
  { label: "Current CGPA", value: "4.32" },
  { label: "Current GPA", value: "4.58" },
  { label: "Credits Earned", value: "124" },
]
const academicStanding = "Good Standing"
const standingStyles: Record<string, { bg: string; text: string; dot: string }> = {
  "Good Standing": { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  "Academic Warning": { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  "Probation": { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-500" },
}
const studentInfo = [
  { label: "Student Name", value: "Edwin Adeyi-Samuel" },
  { label: "Student ID", value: "EDU/2026/UG/001245" },
  { label: "Faculty", value: "Engineering & Technology" },
  { label: "Department", value: "Mechanical Engineering" },
  { label: "Programme", value: "B.Eng. Mechanical Engineering" },
  { label: "Level", value: "400 Level" },
]
const results = [
  { code: "MEE401", title: "Machine Design II", units: 3, score: 82, grade: "A", point: 5.0 },
  { code: "MEE403", title: "Heat Transfer", units: 3, score: 76, grade: "A", point: 5.0 },
  { code: "MEE405", title: "Production Engineering", units: 2, score: 69, grade: "B", point: 4.0 },
  { code: "MEE407", title: "Engineering Economics", units: 2, score: 64, grade: "B", point: 4.0 },
  { code: "MEE409", title: "Fluid Mechanics II", units: 3, score: 88, grade: "A", point: 5.0 },
]
const semesterSummary = [
  { label: "Courses Registered", value: "8" },
  { label: "Courses Passed", value: "8" },
  { label: "Courses Failed", value: "0" },
  { label: "Credits Attempted", value: "21" },
  { label: "Credits Earned", value: "21" },
  { label: "Semester GPA", value: "4.58" },
]
const cgpaByLevel = [
  { level: "100L", cgpa: 4.12 },
  { level: "200L", cgpa: 4.25 },
  { level: "300L", cgpa: 4.30 },
  { level: "400L", cgpa: 4.32 },
]
const gradeScale = [
  { grade: "A", range: "70–100", point: "5.00" },
  { grade: "B", range: "60–69", point: "4.00" },
  { grade: "C", range: "50–59", point: "3.00" },
  { grade: "D", range: "45–49", point: "2.00" },
  { grade: "E", range: "40–44", point: "1.00" },
  { grade: "F", range: "0–39", point: "0.00" },
]

const gradeColors: Record<string, string> = {
  A: "text-green-600 bg-green-50",
  B: "text-[#1E3A8A] bg-[#1E3A8A]/10",
  C: "text-[#B8901F] bg-[#B8901F]/10",
  D: "text-orange-600 bg-orange-50",
  E: "text-red-500 bg-red-50",
  F: "text-red-600 bg-red-100",
}
const resultReleased = true
const isGraduated = false
function Dropdown({ label, value, options }: { label: string; value: string; options: string[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)
  return (
    <div className="relative flex flex-col gap-1.5">
      <label className="font-mono text-[10px] tracking-wide uppercase text-black/40">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center justify-between gap-6 border border-black/15 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-black/25 transition-colors min-w-[180px]">
        {selected}
        <ChevronDown size={14} className={`text-black/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden z-20">
          {options.map((opt, i) => (
            <button key={i} type="button" onClick={() => { setSelected(opt); setOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-black/75 hover:bg-black/[0.03] transition-colors">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export default function Results() {
  const standing = standingStyles[academicStanding]
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
          <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Academics</span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">Results</h1>
          <p className="font-sans text-black/55 text-sm mt-2 max-w-xl">
            View your semester results, academic performance, and cumulative GPA.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="font-serif text-2xl font-semibold text-black leading-none">{card.value}</p>
              <p className="text-xs text-black/50 mt-2">{card.label}</p>
            </div>
          ))}
          <div className={`rounded-2xl p-5 ${standing.bg}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${standing.dot}`} />
              <p className={`font-serif text-lg font-semibold leading-none ${standing.text}`}>{academicStanding}</p>
            </div>
            <p className="text-xs text-black/45 mt-2">Academic Standing</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4 flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Dropdown label="Academic Session" value="2026/2027" options={["2026/2027", "2025/2026"]} />
            <Dropdown label="Semester" value="First Semester" options={["First Semester", "Second Semester"]} />
          </div>
          <button className="bg-[#14263F] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 h-fit">
            View Result
          </button>
        </div>
        {!resultReleased ? (
          <div className="bg-white rounded-2xl border border-black/5 p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <Clock size={24} strokeWidth={1.75} className="text-amber-500" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-black mb-1">Result Pending</h3>
            <p className="text-sm text-black/55 max-w-sm">
              Your result has not yet been released. Please check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-4">Student Information</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                {studentInfo.map((item, i) => (
                  <div key={i}>
                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/[0.015]">
                      {["Code", "Course Title", "Units", "Score", "Grade", "Grade Point", "Status"].map((h) => (
                        <th key={h} className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-5 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="border-b border-black/5 last:border-b-0">
                        <td className="px-5 py-3.5 font-mono text-xs text-black/60">{r.code}</td>
                        <td className="px-5 py-3.5 font-medium text-black">{r.title}</td>
                        <td className="px-5 py-3.5 text-black/60">{r.units}</td>
                        <td className="px-5 py-3.5 text-black/60">{r.score}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold w-6 h-6 inline-flex items-center justify-center rounded-md ${gradeColors[r.grade]}`}>
                            {r.grade}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-black/60">{r.point.toFixed(1)}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Pass
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-black/[0.02]">
                      <td colSpan={2} className="px-5 py-3.5 font-semibold text-black text-sm">Total</td>
                      <td className="px-5 py-3.5 font-semibold text-black text-sm">21</td>
                      <td colSpan={3} className="px-5 py-3.5"></td>
                      <td className="px-5 py-3.5 font-semibold text-[#1E3A8A] text-sm">GPA: 4.58</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-2xl border border-black/5 p-6 lg:col-span-2">
                <h5 className="font-serif text-lg font-semibold text-black mb-4">Semester Summary</h5>
                <div className="grid grid-cols-2 gap-4">
                  {semesterSummary.map((item, i) => (
                    <div key={i}>
                      <p className="font-serif text-xl font-semibold text-black leading-none">{item.value}</p>
                      <p className="text-xs text-black/50 mt-1.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-black/5 p-6 lg:col-span-3">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} strokeWidth={1.75} className="text-[#1E3A8A]" />
                  <h5 className="font-serif text-lg font-semibold text-black">Cumulative Academic Record</h5>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={cgpaByLevel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                    <XAxis dataKey="level" tick={{ fontSize: 12, fill: "#00000060" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[3.5, 5]} tick={{ fontSize: 11, fill: "#00000060" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #00000010", fontSize: 12 }} formatter={(value) => [Number(value).toFixed(2), "CGPA"]}/>
                    <Line type="monotone" dataKey="cgpa" stroke="#B8901F" strokeWidth={2.5} dot={{ fill: "#B8901F", r: 4 }} activeDot={{ r: 6 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <h5 className="font-serif text-lg font-semibold text-black mb-4">Grade Scale</h5>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {gradeScale.map((g, i) => (
                  <div key={i} className="border border-black/5 rounded-xl p-3 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-semibold mb-2 ${gradeColors[g.grade]}`}>
                      {g.grade}
                    </span>
                    <p className="text-xs text-black/60">{g.range}</p>
                    <p className="text-xs text-black/40">{g.point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-black/5 p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} strokeWidth={1.75} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-black text-sm">Official Result</p>
                  <p className="text-xs text-black/50 mt-1">Released: July 30, 2026</p>
                  <p className="text-xs text-black/50">Approved by: Office of the Registrar</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-black/5 p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#B8901F]/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquareQuote size={20} strokeWidth={1.75} className="text-[#B8901F]" />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Faculty Remark</p>
                  <p className="text-sm text-black/75 italic leading-relaxed">
                    "Excellent academic performance. Keep maintaining your CGPA above 4.00."
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-[#14263F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <Download size={16} strokeWidth={2} />
                Download Result (PDF)
              </button>
              <button className="flex items-center gap-2 border border-black/10 text-black/70 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors">
                <Printer size={16} strokeWidth={2} />
                Print Result
              </button>
              <button disabled={!isGraduated} className="flex items-center gap-2 border border-black/10 text-black/40 text-sm font-medium px-5 py-2.5 rounded-lg cursor-not-allowed disabled:opacity-60" title={!isGraduated ? "Available after graduation" : ""}>
                <Lock size={16} strokeWidth={2} />
                Download Transcript
              </button>
            </div>
          </>
        )}
      </div>
        </div>
      </div>
    </div>
  )
}