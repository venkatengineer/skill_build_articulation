import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Eye, Check } from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { highContrast, toggleHighContrast } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
          Account & Accessibility Settings
        </h1>
        <p className="text-sm text-[#65605B] mt-0.5">
          Manage profile parameters and high contrast preferences.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="pastel-card p-6 md:p-8 space-y-5 bg-white">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EFE9E0]">
          <User className="w-5 h-5 text-[#382E67]" aria-hidden="true" />
          <h2 className="font-bold text-base text-[#2D2A26]">User Profile</h2>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#65605B]" htmlFor="set-name">
            Full Name
          </label>
          <input
            id="set-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#EFE9E0] text-sm text-[#2D2A26] bg-[#FAF7F2] focus-visible:ring-3 focus-visible:ring-[#7C66DC]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#65605B]" htmlFor="set-email">
            Email Address
          </label>
          <input
            id="set-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#EFE9E0] text-sm text-[#2D2A26] bg-[#FAF7F2] focus-visible:ring-3 focus-visible:ring-[#7C66DC]"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="pastel-btn pastel-btn-lavender">
            Save Profile
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#1E4722] bg-[#D4ECD5] px-3 py-1.5 rounded-lg">
              <Check className="w-4 h-4" /> Profile Updated
            </span>
          )}
        </div>
      </form>

      {/* Accessibility & Visual Settings */}
      <div className="pastel-card p-6 md:p-8 space-y-5 bg-white">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EFE9E0]">
          <Eye className="w-5 h-5 text-[#382E67]" aria-hidden="true" />
          <h2 className="font-bold text-base text-[#2D2A26]">Accessibility Options</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE9E0]">
          <div>
            <span className="font-bold text-sm text-[#2D2A26] block">High Contrast Mode</span>
            <span className="text-xs text-[#65605B]">Enhances border outlines and text contrast</span>
          </div>

          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            className={`
              w-12 h-7 rounded-full p-1 transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-[#7C66DC]
              ${highContrast ? 'bg-[#7C66DC]' : 'bg-[#EFE9E0]'}
            `}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                highContrast ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
