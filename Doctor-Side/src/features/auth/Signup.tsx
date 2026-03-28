import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, User, ChevronRight } from 'lucide-react';
import { useAppDispatch, loginSuccess } from '../../store';
import logoImg from '../../assets/logo.png';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch(loginSuccess({ ...formData, id: 'doc-1' }));
      setLoading(false);
      navigate('/profile-setup');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-30"></div>

      <div className="w-full max-w-[480px] bg-white p-16 rounded-[2.5rem] border border-slate-100/50 shadow-2xl relative z-10 animate-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="w-16 h-16 bg-primary-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary-200 p-3 mb-6">
            <img src={logoImg} alt="Cura Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Cura</h1>
          <p className="text-[11px] font-black text-slate-400 mt-2 tracking-[0.2em] uppercase">Doctor Registration</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
           <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block ml-1">Full Name</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Alexandro"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block ml-1">Medical Email</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@cura.hospital"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-400 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block ml-1">Primary Password</label>
             <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-400 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group/btn ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus size={18} className="group-hover/btn:translate-x-1 duration-300" />
                Initialize License
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 duration-300" />
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Already registered in Cura?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 hover:underline underline-offset-4 decoration-2">
            Access Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
