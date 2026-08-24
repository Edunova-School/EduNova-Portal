import Sidebar from "../components/sidebar"
import Header from "../components/header"
import { useState } from "react"
import { ChevronDown, Lock, CheckCircle2, MessageSquare, ShieldCheck, Lightbulb, BookMarked, MessagesSquare, ListChecks, Users, Clock3, FileStack, ThumbsUp, ThumbsDown, HelpCircle, Sparkles,} from "lucide-react"
const courseOptions = [
  { code: "MEE 401", title: "Machine Design II", lecturer: "Dr. Michael A. Johnson", department: "Mechanical Engineering", semester: "First Semester, 2026/2027" },
  { code: "MEE 403", title: "Heat Transfer", lecturer: "Prof. A. Bello", department: "Mechanical Engineering", semester: "First Semester, 2026/2027" },
  { code: "MEE 405", title: "Production Engineering", lecturer: "Dr. R. Thomas", department: "Mechanical Engineering", semester: "First Semester, 2026/2027" },
]
const teachingCriteria = [
  { key: "teachingQuality", label: "Teaching Quality", question: "How clearly does the lecturer explain concepts?", icon: Lightbulb },
  { key: "courseKnowledge", label: "Course Knowledge", question: "How well does the lecturer demonstrate knowledge of the subject?", icon: BookMarked },
  { key: "communication", label: "Communication", question: "How effectively does the lecturer communicate with students?", icon: MessagesSquare },
  { key: "organization", label: "Organization", question: "How well organized are lectures and course materials?", icon: ListChecks },
  { key: "engagement", label: "Engagement", question: "How effectively does the lecturer encourage student participation?", icon: Users },
  { key: "availability", label: "Availability", question: "How accessible is the lecturer when students need academic assistance?", icon: Clock3 },
]

const materialsOptions = ["Very Poor", "Poor", "Average", "Good", "Excellent"]

const evaluationHistory = [
  { course: "MEE 401", lecturer: "Dr. Johnson", semester: "2026/27", status: "Submitted" },
  { course: "MEE 403", lecturer: "Prof. Adeyemi", semester: "2026/27", status: "Pending" },
  { course: "MEE 405", lecturer: "Dr. Thomas", semester: "2026/27", status: "Submitted" },
]
const scaleColors: Record<number, { bg: string; ring: string }> = {
  1: { bg: "#ef4444", ring: "#ef444430" },
  2: { bg: "#f97316", ring: "#f9731630" },
  3: { bg: "#B8901F", ring: "#B8901F30" },
  4: { bg: "#65a30d", ring: "#65a30d30" },
  5: { bg: "#16a34a", ring: "#16a34a30" },
}
function RatingScale({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels?: [string, string] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2\">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n
          const color = scaleColors[n]
          return (
            <button key={n} type="button" onClick={() => onChange(n)} style={active ? { backgroundColor: color.bg, boxShadow: `0 0 0 4px ${color.ring}` } : {}} className={`w-10 h-10 rounded-full text-sm font-semibold border transition-all duration-200 ${active ? "text-white border-transparent scale-110" : "bg-white text-black/40 border-black/15 hover:border-black/30 hover:scale-105"}`}>{n}</button>
          )
        })}
      </div>
      {labels && (
        <div className="flex justify-between text-[11px] text-black/40 px-0.5">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  )
}

function CardRadioGroup({ options, value, onChange, columns = 1 }: {
  options: string[]
  value: string
  onChange: (v: string) => void
  columns?: number
}) {
  return (
    <div className={`grid gap-2.5 ${columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-5"}`}>
      {options.map((opt, i) => {
        const active = value === opt
        return (
          <button key={i} type="button" onClick={() => onChange(opt)} className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${active ? "border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]": "border-black/10 text-black/60 hover:border-black/20"}`}>{opt}</button>
        )
      })}
    </div>
  )
}
const stepSections = ["Course", "Overall", "Teaching", "Materials", "Feedback", "Submit"]
export default function RateLecturer() {
  const [courseOpen, setCourseOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(courseOptions[0])
  const [overall, setOverall] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [materials, setMaterials] = useState("")
  const [appreciated, setAppreciated] = useState("")
  const [improve, setImprove] = useState("")
  const [comments, setComments] = useState("")
  const [recommend, setRecommend] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const allTeachingRated = teachingCriteria.every((c) => ratings[c.key] > 0)
  const canSubmit = overall > 0 && allTeachingRated && materials && recommend && confirmed

  const completedSteps = [true, overall > 0, allTeachingRated, !!materials, !!recommend, canSubmit]
  const progressPercent = (completedSteps.filter(Boolean).length / stepSections.length) * 100

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A] min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B8901F]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="relative bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={30} strokeWidth={1.75} className="text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-black mb-2">Evaluation Submitted</h2>
          <p className="text-sm text-black/55 leading-relaxed mb-6">
            Thank you for helping EduNova improve the student learning experience.
            Your feedback has been successfully recorded.
          </p>
          <button onClick={() => setSubmitted(false)} className="text-sm text-[#1E3A8A] font-medium hover:underline">Rate another lecturer</button>
        </div>
      </div>
    )
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
            <div>
              <div className="relative bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#B8901F]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative px-4 md:px-8 py-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-3">
              <Sparkles size={13} />
              Feedback
            </span>
            <h1 className="font-serif text-white text-3xl md:text-4xl font-semibold">
              Rate Your Lecturers
            </h1>
            <p className="font-sans text-white/70 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
              Your feedback helps EduNova improve teaching quality and the student learning experience.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/45 mt-4">
              <Lock size={12} />
              Your responses are confidential and used for academic quality improvement.
            </p>
            <div className="mt-6">
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#B8901F] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}/>
              </div>
              <p className="text-[11px] text-white/40 mt-2">{Math.round(progressPercent)}% complete</p>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto flex flex-col gap-6 -mt-4">
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <label className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-3 block">
              Select Course
            </label>
            <div className="relative">
              <button type="button" onClick={() => setCourseOpen(!courseOpen)} className="w-full flex items-center justify-between border-2 border-black/10 rounded-xl px-4 py-3.5 text-sm text-left hover:border-[#1E3A8A]/30 transition-colors">
                <span className="text-black font-medium">{selectedCourse.code} — {selectedCourse.title}</span>
                <ChevronDown size={16} className={`text-black/40 transition-transform ${courseOpen ? "rotate-180" : ""}`} />
              </button>
              {courseOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-20">
                  {courseOptions.map((c, i) => (
                    <button key={i} type="button" onClick={() => { setSelectedCourse(c); setCourseOpen(false) }} className="w-full text-left px-4 py-3 text-sm text-black/75 hover:bg-[#1E3A8A]/5 transition-colors">
                      {c.code} — {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-black/5">
              {[
                { label: "Lecturer", value: selectedCourse.lecturer },
                { label: "Department", value: selectedCourse.department },
                { label: "Semester", value: selectedCourse.semester },
              ].map((item, i) => (
                <div key={i}>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#B8901F]/10 flex items-center justify-center">
                <ThumbsUp size={16} strokeWidth={1.75} className="text-[#B8901F]" />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">Overall Rating</p>
            </div>
            <p className="text-sm text-black/70 mb-4 mt-3">Overall, how would you rate this lecturer?</p>
            <RatingScale value={overall} onChange={setOverall} labels={["Poor", "Excellent"]} />
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                <FileStack size={16} strokeWidth={1.75} className="text-[#1E3A8A]" />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">Teaching Evaluation</p>
            </div>
            <div className="flex flex-col gap-6">
              {teachingCriteria.map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-black/5 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3 sm:max-w-[55%]">
                      <Icon size={18} strokeWidth={1.75} className="text-[#1E3A8A]/60 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-black">{c.label}</p>
                        <p className="text-xs text-black/50 mt-0.5">{c.question}</p>
                      </div>
                    </div>
                    <RatingScale value={ratings[c.key] || 0} onChange={(v) => setRatings({ ...ratings, [c.key]: v })} />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-1">Course Materials</p>
            <p className="text-sm text-black/70 mb-4 mt-2">Course materials provided by the lecturer are:</p>
            <CardRadioGroup options={materialsOptions} value={materials} onChange={setMaterials} />
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                <MessageSquare size={16} strokeWidth={1.75} className="text-[#1E3A8A]" />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">
                Open Feedback <span className="text-black/30 normal-case">(optional)</span>
              </p>
            </div>
            {[
              { label: "What did you appreciate most about this lecturer?", value: appreciated, set: setAppreciated },
              { label: "What could be improved?", value: improve, set: setImprove },
              { label: "Additional Comments", value: comments, set: setComments },
            ].map((field, i) => (
              <div key={i} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black">{field.label}</label>
                <textarea rows={3} value={field.value} onChange={(e) => field.set(e.target.value)} className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]/40 transition-colors resize-none"/>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="text-sm font-medium text-black mb-4">
              Would you recommend this lecturer for this course?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Yes", icon: ThumbsUp, color: "#16a34a" },
                { label: "No", icon: ThumbsDown, color: "#ef4444" },
                { label: "Not sure", icon: HelpCircle, color: "#B8901F" },
              ].map((opt, i) => {
                const Icon = opt.icon
                const active = recommend === opt.label
                return (
                  <button key={i} type="button" onClick={() => setRecommend(opt.label)} style={active ? { borderColor: opt.color, backgroundColor: `${opt.color}0D`, color: opt.color } : {}}className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${!active && "border-black/10 text-black/50 hover:border-black/20"}`}>
                    <Icon size={20} strokeWidth={1.75} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-3 bg-gradient-to-br from-[#1E3A8A]/[0.04] to-[#B8901F]/[0.04] rounded-xl p-4 mb-5 border border-black/5">
              <ShieldCheck size={20} strokeWidth={1.75} className="text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-black">Confidential Feedback</p>
                <p className="text-xs text-black/55 mt-1 leading-relaxed">
                  Your individual responses will be treated confidentially and used for teaching evaluation and academic quality improvement.
                </p>
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} className="w-4 h-4 mt-0.5 rounded border-black/20 accent-[#1E3A8A]"/>
              <span className="text-sm text-black/70">
                I confirm that my feedback is honest and based on my experience in this course.
              </span>
            </label>
            <button onClick={handleSubmit} disabled={!canSubmit} className="w-full bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none">Submit Evaluation</button>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-black/5">
              <h5 className="font-serif text-lg font-semibold text-black">My Evaluation History</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.015]">
                    {["Course", "Lecturer", "Semester", "Status"].map((h) => (
                      <th key={h} className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-6 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluationHistory.map((item, i) => (
                    <tr key={i} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.015] transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-black/60">{item.course}</td>
                      <td className="px-6 py-3.5 text-black/75">{item.lecturer}</td>
                      <td className="px-6 py-3.5 text-black/60">{item.semester}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          item.status === "Submitted" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Submitted" ? "bg-green-500" : "bg-amber-500"}`} />
                          {item.status}
                        </span>
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
    </div>
  )
}