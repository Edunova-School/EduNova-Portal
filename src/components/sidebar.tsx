import logoVertical from '../assets/EDUNOVA VERTICAL.webp'
import {
  X,
  Home,
  BookOpen,
  Repeat,
  FileText,
  Star,
  Receipt,
  ShieldCheck,
  Vote,
  LogOut,
} from 'lucide-react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const barLists = [
  { list: 'Dashboard', path: '/dashboard', icon: Home },
  { list: 'Course Management', path: '/dashboard/courses', icon: BookOpen },
  { list: 'Program Change Request', path: '/dashboard/program-change', icon: Repeat },
  { list: 'Results', path: '/dashboard/results', icon: FileText },
  { list: 'Rate Lecturer', path: '/dashboard/rate-lecturer', icon: Star },
  { list: 'Fees & Receipts', path: '/dashboard/fees', icon: Receipt },
  { list: 'Transaction Validation', path: '/dashboard/transactions', icon: ShieldCheck },
  { list: 'Elections', path: '/dashboard/elections', icon: Vote },
]

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className='bg-white h-screen w-72 flex flex-col shadow-2xl'>
      <div className='flex items-center justify-between px-6 py-6 border-b border-black/5'>
        <img src={logoVertical} alt="EduNova" className='h-20 w-auto' />
        <button onClick={onClose} aria-label='Close menu' className='p-1.5 lg:hidden rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-colors'>
          <X size={18} />
        </button>
      </div>
      <div className='px-6 pt-6 pb-2'>
        <span className='font-mono text-[10px] tracking-[0.2em] uppercase text-black/35'>
          Student Portal
        </span>
      </div>
      <nav className='flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto'>
        {barLists.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link key={index} to={item.path} onClick={onClose} className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors duration-200 ${ isActive ? 'bg-[#14263F] text-white font-medium' : 'text-black/65 hover:bg-[#14263F]/5 hover:text-[#14263F]'}`}>
              {isActive && (
                <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#B8901F] rounded-r-full' />
              )}
              <Icon size={18} strokeWidth={1.75} className={isActive ? 'text-white' : 'text-black/40'} />
              {item.list}
            </Link>
          )
        })}
      </nav>
      <div className='px-3 pb-3 pt-2 border-t border-black/5'>
        {!confirmingLogout ? (
          <button onClick={() => setConfirmingLogout(true)} className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors duration-200'>
            <LogOut size={18} strokeWidth={1.75} />
            Log Out
          </button>) : (
          <div className='px-4 py-3 rounded-lg bg-red-50 flex flex-col gap-2.5'>
            <p className='text-xs text-black/60'>Are you sure you want to log out?</p>
            <div className='flex gap-2'>
              <button onClick={handleLogout} className='flex-1 bg-red-500 text-white text-xs font-medium py-2 rounded-md hover:bg-red-600 transition-colors'>
                Yes, Log Out
              </button>
              <button onClick={() => setConfirmingLogout(false)} className='flex-1 bg-white text-black/60 text-xs font-medium py-2 rounded-md border border-black/10 hover:bg-black/5 transition-colors'>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className='px-6 py-4 border-t border-black/5'>
        <p className='font-mono text-[10px] text-black/30 tracking-wide'>
          © 2026 EduNova University
        </p>
      </div>
    </div>
  )
}