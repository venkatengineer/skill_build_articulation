import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as apiSignup } from '../api/client';
import { Mic, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required');
    if (!email.includes('@')) return setError('Valid email is required');
    if (password.length < 3) return setError('Password must be at least 3 characters');

    setLoading(true);
    try {
      const res = await apiSignup(name, email, password);
      login(res.user, res.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#E8E5F8] border border-[#D1CBEF] flex items-center justify-center text-[#382E67] mx-auto shadow-xs">
            <Mic className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
            Create Account
          </h1>
          <p className="text-sm text-[#65605B]">
            Start practicing speech articulation with AI feedback
          </p>
        </div>

        <form onSubmit={handleSubmit} className="pastel-card p-6 md:p-8 space-y-4 bg-white">
          {error && (
            <div className="p-3 bg-[#FCE4EC] border border-[#F8BBD0] rounded-xl text-xs font-bold text-[#6A1B38] text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#65605B]" htmlFor="signup-name">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EFE9E0] text-sm text-[#2D2A26] bg-[#FAF7F2] focus-visible:ring-3 focus-visible:ring-[#7C66DC]"
              placeholder="Alex Johnson"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#65605B]" htmlFor="signup-email">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EFE9E0] text-sm text-[#2D2A26] bg-[#FAF7F2] focus-visible:ring-3 focus-visible:ring-[#7C66DC]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#65605B]" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EFE9E0] text-sm text-[#2D2A26] bg-[#FAF7F2] focus-visible:ring-3 focus-visible:ring-[#7C66DC]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pastel-btn pastel-btn-lavender w-full py-3.5 text-base mt-2 shadow-xs"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-[#65605B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#382E67] font-bold underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
