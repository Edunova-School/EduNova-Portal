import { useState, useMemo } from "react"
import { Search, ChevronDown, X, BookOpen, Layers, CheckSquare, ListChecks, Printer, Download, FileText, User, CalendarClock, MapPin, ShieldCheck, Clock,} from "lucide-react"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
const courses = [
  { code: "MEE401", title: "Machine Design II", units: 3, lecturer: "Dr. Michael Johnson", type: "Core", status: "Registered", department: "Mechanical Engineering", schedule: "Monday & Wednesday, 8:00 AM – 10:00 AM", venue: "Engineering Block A, Room 203", prerequisites: "MEE301",},
  { code: "MEE403", title: "Heat Transfer", units: 3, lecturer: "Prof. A. Bello", type: "Core", status: "Registered", department: "Mechanical Engineering", schedule: "Tuesday & Thursday, 10:00 AM – 12:00 PM", venue: "Engineering Block A, Room 108", prerequisites: "MEE302",},
  { code: "MEE405", title: "Production Engineering", units: 2, lecturer: "Dr. R. Thomas", type: "Core", status: "Registered", department: "Mechanical Engineering", schedule: "Wednesday, 1:00 PM – 3:00 PM", venue: "Engineering Block B, Room 12", prerequisites: "None",},
  { code: "MEE407", title: "Engineering Economics", units: 2, lecturer: "Dr. E. Ibrahim", type: "Elective", status: "Registered", department: "Mechanical Engineering", schedule: "Friday, 9:00 AM – 11:00 AM", venue: "Engineering Block A, Room 301", prerequisites: "None",},
  { code: "MEE409", title: "Fluid Mechanics II", units: 3, lecturer: "Prof. D. Adeyemi", type: "Core", status: "Registered", department: "Mechanical Engineering", schedule: "Monday & Thursday, 2:00 PM – 4:00 PM", venue: "Engineering Block A, Room 203", prerequisites: "MEE305",},
]

const summaryCards = [
  { label: "Registered Courses", value: "8", icon: BookOpen },
  { label: "Total Credit Units", value: "21 Units", icon: Layers },
  { label: "Compulsory Courses", value: "6", icon: CheckSquare },
  { label: "Elective Courses", value: "2", icon: ListChecks },
]

const courseActions = [
  { label: "View Course Outline", icon: FileText },
  { label: "Download Materials", icon: Download },
  { label: "View Lecturer", icon: User },
  { label: "View Timetable", icon: CalendarClock },
]

type Course = typeof courses[number]

function FilterDropdown({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(label)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg border transition-colors ${selected !== label? "border-[#1E3A8A]/30 text-[#1E3A8A] bg-[#1E3A8A]/5": "border-black/10 text-black/60 hover:border-black/20"}`}>
        {selected}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden z-20 w-44">
          <button onClick={() => { setSelected(label); setOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-black/50 hover:bg-black/[0.03] transition-colors">All</button>
          {options.map((opt, i) => (
            <button key={i} onClick={() => { setSelected(opt); setOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-black/70 hover:bg-black/[0.03] transition-colors">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Course() {
  const [search, setSearch] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses
    const q = search.toLowerCase()
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="flex">
      <aside className="hidden lg:block w-72">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </aside>
      <div className="bg-[#F6F6F2] min-h-screen flex-1">
        <Header />
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">
            Academic Session 2026/2027 · First Semester
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">
            Course Management
          </h1>
          <p className="font-sans text-black/55 text-sm mt-2 max-w-xl">
            View, manage, and monitor your registered courses for the current semester.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#1E3A8A]/5 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} strokeWidth={1.5} className="text-[#1E3A8A]" />
                </div>
                <div>
                  <p className="font-serif text-xl font-semibold text-black leading-none">{card.value}</p>
                  <p className="text-xs text-black/50 mt-1.5">{card.label}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search course" className="w-full border border-black/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"/>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterDropdown label="Semester" options={["First Semester", "Second Semester"]} />
            <FilterDropdown label="Course Type" options={["Core", "Elective"]} />
            <FilterDropdown label="Faculty" options={["Engineering & Technology"]} />
            <FilterDropdown label="Level" options={["300 Level", "400 Level"]} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.015]">
                  {["Code", "Course Title", "Units", "Lecturer", "Type", "Status"].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] tracking-wide uppercase text-black/40 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, i) => (
                  <tr key={i} onClick={() => setSelectedCourse(course)} className="border-b border-black/5 last:border-b-0 hover:bg-[#1E3A8A]/[0.03] cursor-pointer transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-black/60">{course.code}</td>
                    <td className="px-5 py-3.5 font-medium text-black">{course.title}</td>
                    <td className="px-5 py-3.5 text-black/60">{course.units}</td>
                    <td className="px-5 py-3.5 text-black/60">{course.lecturer}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.type === "Core" ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "bg-[#B8901F]/10 text-[#B8901F]"}`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-black/40 text-sm">
                      No courses match "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <h5 className="font-serif text-lg font-semibold text-black mb-4">Credit Summary</h5>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-black/55">Minimum Units</span>
                <span className="font-medium text-black">15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/55">Maximum Units</span>
                <span className="font-medium text-black">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/55">Registered</span>
                <span className="font-medium text-black">21</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden mt-1">
                <div className="h-full bg-[#1E3A8A] rounded-full" style={{ width: "87.5%" }} />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium mt-1">
                <ShieldCheck size={16} strokeWidth={2} />
                Within Approved Limit
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <h5 className="font-serif text-lg font-semibold text-black mb-4">Registration Status</h5>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck size={20} strokeWidth={1.75} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-black text-sm">Approved</p>
                <p className="text-xs text-black/45">Approved on July 28, 2026</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-black/5">
              <button className="flex items-center gap-1.5 text-xs font-medium text-black/70 border border-black/10 px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors">
                <Printer size={14} /> Print Registered Courses
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-black/70 border border-black/10 px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors">
                <Download size={14} /> Registration Slip
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#14263F] px-3 py-2 rounded-lg hover:-translate-y-0.5 transition-all duration-200">
                <FileText size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setSelectedCourse(null)} className="fixed inset-0 bg-black/40"/>
          <div className="relative z-10 w-full max-w-md bg-white h-screen overflow-y-auto shadow-2xl flex flex-col">
            <div className="bg-[#14263F] px-6 py-6 flex items-start justify-between">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">
                  {selectedCourse.code}
                </p>
                <h2 className="font-serif text-white text-xl font-semibold mt-1 leading-tight">
                  {selectedCourse.title}
                </h2>
              </div>
              <button onClick={() => setSelectedCourse(null)} aria-label="Close" className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Credit Units</p>
                  <p className="text-sm font-medium text-black">{selectedCourse.units}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Course Type</p>
                  <p className="text-sm font-medium text-black">{selectedCourse.type}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Lecturer</p>
                  <p className="text-sm font-medium text-black">{selectedCourse.lecturer}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-1">Department</p>
                  <p className="text-sm font-medium text-black">{selectedCourse.department}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
                <div className="flex items-start gap-3">
                  <Clock size={16} strokeWidth={1.75} className="text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-0.5">Schedule</p>
                    <p className="text-sm text-black/75">{selectedCourse.schedule}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} strokeWidth={1.75} className="text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-0.5">Venue</p>
                    <p className="text-sm text-black/75">{selectedCourse.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={16} strokeWidth={1.75} className="text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-0.5">Prerequisites</p>
                    <p className="text-sm text-black/75">{selectedCourse.prerequisites}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-black/5">
                <p className="font-mono text-[10px] tracking-wide uppercase text-black/40 mb-3">Actions</p>
                <div className="flex flex-col gap-1">
                  {courseActions.map((action, i) => {
                    const Icon = action.icon
                    return (
                      <button key={i} className="flex items-center gap-3 text-sm text-black/70 hover:text-[#14263F] hover:bg-[#14263F]/5 px-3 py-2.5 rounded-lg transition-colors -mx-3">
                        <Icon size={16} strokeWidth={1.75} />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}