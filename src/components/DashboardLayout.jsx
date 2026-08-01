import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Mic } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#2D2A26]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/90 backdrop-blur-md border-b border-[#EFE9E0] lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#FAF7F2] focus-visible:ring-2 focus-visible:ring-[#7C66DC]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#382E67]" aria-hidden="true" />
              <span className="font-['Lexend',sans-serif] font-bold text-base text-[#2D2A26]">
                Articulate
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
