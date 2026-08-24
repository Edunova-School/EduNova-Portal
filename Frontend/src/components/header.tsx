import { useState } from "react";
import { Menu, DownloadIcon, SettingsIcon, LogOutIcon, HelpCircle, KeyRound } from "lucide-react"
import Sidebar from "./sidebar";
export default function Header() {
    const [showSettings, setShowSettings] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const settingDropdowns = [
        {icon: HelpCircle, action:'Help', color: 'text-black/70'},
        {icon: KeyRound, action:'Change Password', color: 'text-black/70' },
        {icon: LogOutIcon, action:'LogOut',  color: 'text-red-500' },
    ]
    return (
      <div className="lg:flex w-full">
      <header className="bg-[#14263F] flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center gap-4">
            <button onClick={() => setShowSidebar(true)} aria-label="Open menu" aria-expanded={showSidebar} className="text-white/70 lg:hidden hover:text-white transition-colors duration-200 cursor-pointer">
              <Menu size={24} strokeWidth={1.75} />
            </button>
            <div>
            <div className="flex items-baseline gap-1.5">
                <p className="font-sans text-white/70 text-sm">Welcome,</p>
                <p className="font-serif font-semibold text-white text-lg leading-none">Edwin</p>
            </div>
            <p className="font-mono text-white/60 text-xs mt-1 ">
                {formattedDate}
            </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button aria-label="Download" className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer">
            <DownloadIcon size={20} strokeWidth={1.75} />
            </button>
            <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)} aria-label="Settings" aria-expanded={showSettings}className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer">
            <SettingsIcon size={20} strokeWidth={1.75} />
          </button>
          {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden z-20">
              {settingDropdowns.map((item, index) => {
                const ItemIcon = item.icon
                return (
                  <button key={index} onClick={() => setShowSettings(false)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/[0.03] transition-colors ${item.color}`}>
                    <ItemIcon size={16} strokeWidth={1.75} />
                    {item.action}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        </div>
        </header>
        <div>
           {showSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          
          <div
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/40"
          />
          {/* Drawer */}
          <div className="relative z-10">
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>
      )}
        </div>
      </div>
    );
}