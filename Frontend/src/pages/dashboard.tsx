import ed from '../assets/ed.webp'
import Header from "../components/header"
import Sidebar from '../components/sidebar'
import {Megaphone, Clock, CheckCircle2, Download, BookOpenCheck, FileText, Wallet, CalendarDays, FileSignature, ArrowUpRight, Sparkles,} from 'lucide-react'
const studentInfo = [
  { label: 'Programme', value: 'B.Eng. Mechanical Engineering' },
  { label: 'Faculty', value: 'Engineering & Technology' },
  { label: 'Level', value: '500 Level' },
  { label: 'Academic Adviser', value: 'Dr. Michael A. Johnson' },
]

const announcements = [
  { text: 'Mid-Semester Examination Timetable Released', tag: 'Exams', date: 'Aug 1' },
  { text: 'Course Registration Closes August 15', tag: 'Deadline', date: 'Jul 28' },
  { text: 'Scholarship Applications Now Open', tag: 'Finance', date: 'Jul 25' },
]

const todaysClasses = [
  { time: '08:00', code: 'MEG 401', title: 'Machine Design II', color: '#1E3A8A' },
  { time: '10:00', code: 'MEG 403', title: 'Heat Transfer', color: '#B8901F' },
  { time: '14:00', code: 'MEG 405', title: 'Engineering Management', color: '#2E5A4A' },
]

const quickActions = [
  { label: 'Register Courses', icon: BookOpenCheck },
  { label: 'View Results', icon: FileText },
  { label: 'Pay Fees', icon: Wallet },
  { label: 'Download Exam Card', icon: Download },
  { label: 'View Timetable', icon: CalendarDays },
  { label: 'Request Transcript', icon: FileSignature },
]

export default function Dashboard() {
  return (
    <div className='bg-[#F6F6F2] min-h-screen '>
      
      <div className='flex'>
        <aside className="hidden lg:block w-72">
    <div className="sticky top-0 h-screen">
      <Sidebar />
    </div>
  </aside>
        <div className="flex-1" >
            <Header />
          <div className='px-4 md:px-8 py-6 max-w-6xl mx-auto flex flex-col gap-6'>
          <div className='relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A]'>
            <div className='absolute -top-24 -right-24 w-64 h-64 bg-[#B8901F]/20 rounded-full blur-3xl' />
            <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-[#1E3A8A]/30 rounded-full blur-3xl' />
            <div className='relative px-6 md:px-8 py-8 flex flex-col sm:flex-row sm:items-center gap-6'>
              <div className='relative flex-shrink-0'>
                <img src={ed} alt="Edwin Adeyi-Samuel" className='w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover ring-4 ring-white/10'/>
                <span className='absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full border-2 border-[#14263F]'>
                  Active
                </span>
              </div>
              <div className='flex-1'>
                <p className='font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-1'>
                  2026/2027 · First Semester
                </p>
                <h1 className='font-serif text-white text-2xl md:text-3xl font-semibold'>
                  Edwin Adeyi-Samuel
                </h1>
                <p className='font-mono text-white/50 text-sm mt-1'>EDU/2026/UG/001245</p>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/10'>
                  {studentInfo.map((item, index) => (
                    <div key={index}>
                      <p className='font-mono text-[10px] tracking-wide uppercase text-white/35 mb-1'>
                        {item.label}
                      </p>
                      <p className='font-sans text-sm text-white/85 font-medium leading-snug'>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-white rounded-2xl border border-black/5 p-6 hover:shadow-lg transition-shadow duration-300'>
              <div className='flex items-center justify-between mb-5'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full bg-[#B8901F]/10 flex items-center justify-center'>
                    <Megaphone size={16} strokeWidth={1.75} className='text-[#B8901F]' />
                  </div>
                  <h5 className='font-serif text-lg font-semibold text-black'>Announcements</h5>
                </div>
                <span className='text-xs font-medium text-[#B8901F] bg-[#B8901F]/10 px-2.5 py-1 rounded-full'>
                  {announcements.length} new
                </span>
              </div>
              <div className='flex flex-col gap-1'>
                {announcements.map((item, index) => (
                  <div key={index} className='group flex items-start justify-between gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-black/[0.02] transition-colors cursor-pointer'>
                    <div className='flex items-start gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-[#B8901F] mt-2 flex-shrink-0' />
                      <div>
                        <p className='text-sm text-black/75 leading-relaxed group-hover:text-black transition-colors'>{item.text}</p>
                        <span className='inline-block mt-1 text-[10px] font-mono uppercase tracking-wide text-black/35'>
                          {item.tag} · {item.date}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className='text-black/20 group-hover:text-[#B8901F] transition-colors flex-shrink-0 mt-1' />
                  </div>
                ))}
              </div>
            </div>
            <div className='bg-white rounded-2xl border border-black/5 p-6 hover:shadow-lg transition-shadow duration-300'>
              <div className='flex items-center gap-2 mb-5'>
                <div className='w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center'>
                  <Clock size={16} strokeWidth={1.75} className='text-[#1E3A8A]' />
                </div>
                <h5 className='font-serif text-lg font-semibold text-black'>Today's Classes</h5>
              </div>
              <div className='relative flex flex-col gap-5 pl-4'>
                <div className='absolute left-[7px] top-2 bottom-2 w-px bg-black/10' />
                {todaysClasses.map((cls, index) => (
                  <div key={index} className='relative flex items-start gap-4'>
                    <span className='absolute -left-4 top-1 w-3 h-3 rounded-full ring-4 ring-white' style={{ backgroundColor: cls.color }}/>
                    <span className='font-mono text-xs text-black/40 w-12 flex-shrink-0 pt-0.5'>{cls.time}</span>
                    <div className='flex-1 pb-1'>
                      <p className='font-sans text-sm font-medium text-black'>{cls.title}</p>
                      <span className='inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full' style={{ backgroundColor: `${cls.color}15`, color: cls.color }}>{cls.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-2xl border border-black/5 p-6 flex flex-col hover:shadow-lg transition-shadow duration-300'>
              <h5 className='font-serif text-lg font-semibold text-black mb-5'>Examination Status</h5>
              <div className='flex-1 flex flex-col items-center justify-center text-center py-4'>
                <div className='relative w-20 h-20 mb-4'>
                  <svg className='w-20 h-20 -rotate-90'>
                    <circle cx='40' cy='40' r='34' stroke='#00000010' strokeWidth='6' fill='none' />
                    <circle cx='40' cy='40' r='34' stroke='#22c55e' strokeWidth='6' fill='none' strokeDasharray={214} strokeDashoffset={0} strokeLinecap='round' />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <CheckCircle2 size={28} strokeWidth={1.75} className='text-green-500' />
                  </div>
                </div>
                <p className='font-serif text-lg font-semibold text-black'>Eligible</p>
                <p className='text-xs text-black/45 mt-1'>All requirements met</p>
              </div>
              <button className='w-full flex items-center justify-center gap-2 bg-[#14263F] text-white text-sm font-medium py-3 rounded-xl mt-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300'>
                <Download size={16} strokeWidth={2} />
                Download Exam Card
              </button>
            </div>
            <div className='bg-white rounded-2xl border border-black/5 p-6 lg:col-span-2 hover:shadow-lg transition-shadow duration-300'>
              <div className='flex items-center gap-2 mb-5'>
                <Sparkles size={18} strokeWidth={1.75} className='text-[#B8901F]' />
                <h5 className='font-serif text-lg font-semibold text-black'>Quick Actions</h5>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button key={index} className='group relative flex flex-col items-center justify-center gap-2.5 py-6 px-3 rounded-2xl border border-black/5 hover:border-transparent overflow-hidden transition-all duration-300 text-center'>
                      <span className='absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#14263F] opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                      <Icon size={22} strokeWidth={1.5} className='relative text-[#1E3A8A] group-hover:text-white group-hover:scale-110 transition-all duration-300' />
                      <span className='relative text-xs font-medium text-black/70 group-hover:text-white leading-tight transition-colors duration-300'>
                        {action.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}