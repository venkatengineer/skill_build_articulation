import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Mic,
  FileCheck,
  BarChart2,
  History,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/practice', label: 'Practice Core', icon: Mic, badge: 'Core' },
    { to: '/assessment', label: 'Assessment', icon: FileCheck },
    { to: '/progress', label: 'Progress Graphs', icon: BarChart2 },
    { to: '/history', label: 'Session History', icon: History },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Accessible Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#EFE9E0] flex flex-col p-4
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        `}
        aria-label="Main application sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-[#EFE9E0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8E5F8] border border-[#D1CBEF] flex items-center justify-center text-[#382E67]">
              <Mic className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-['Lexend',sans-serif] font-bold text-lg text-[#2D2A26] block leading-none">
                Articulate
              </span>
              <span className="text-xs text-[#65605B] font-medium">Speech Trainer</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#65605B] rounded-lg lg:hidden hover:bg-[#FAF7F2] focus-visible:ring-2 focus-visible:ring-[#7C66DC]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === '/'}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-150
                  focus-visible:ring-3 focus-visible:ring-[#7C66DC]
                  ${
                    isActive
                      ? 'bg-[#E8E5F8] text-[#382E67] border border-[#D1CBEF] shadow-2xs'
                      : 'text-[#65605B] hover:bg-[#FAF7F2] hover:text-[#2D2A26]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4ECD5] text-[#1E4722]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="pt-4 mt-auto border-t border-[#EFE9E0]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#D4ECD5] border border-[#B2D8B5] flex items-center justify-center font-bold text-sm text-[#1E4722] shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2D2A26] truncate">
                  {user?.name || 'Alex Johnson'}
                </p>
                <p className="text-[11px] text-[#65605B] truncate">
                  {user?.email || 'alex@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#65605B] hover:text-[#6A1B38] hover:bg-[#FCE4EC] rounded-lg transition-colors"
              title="Sign out"
              aria-label="Sign out of account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
