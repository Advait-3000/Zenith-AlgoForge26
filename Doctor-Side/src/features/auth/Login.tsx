import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, loginSuccess } from '../../store';
import logoImg from '../../assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setTimeout(() => {
      dispatch(loginSuccess({ email, name: 'Alexandro', id: 'doc-1' }));
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7FEFE] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background decorations for a dynamic humanised web feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-200/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-primary-300/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[1000px] bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Side: Dynamic Logo & Brand Column */}
        <div className="md:w-5/12 bg-primary-500 p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 opacity-90 z-0"></div>
          {/* Subtle animated background shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary-300 opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                <img src={logoImg} alt="Cura Logo" className="w-full h-full object-contain" />
             </div>
             <span className="text-white text-2xl font-bold tracking-tight">Cura</span>
          </div>

          <div className="relative z-10 mt-16 md:mt-24 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 tracking-tighter">
              Healthcare, <br />
              <span className="text-primary-100">humanised.</span>
            </h2>
            <p className="text-primary-100 text-sm md:text-base leading-relaxed opacity-90 max-w-sm">
              Providing exceptional patient care starts with the right tools. Access your dashboard to manage appointments and medical records effortlessly.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 mt-auto">
             <div className="w-2 h-2 rounded-full bg-white transition-all"></div>
             <div className="w-2 h-2 rounded-full bg-white/40 transition-all"></div>
             <div className="w-2 h-2 rounded-full bg-white/40 transition-all"></div>
          </div>
        </div>

        {/* Right Side: Login Form (Matching Native App) */}
        <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-white relative">
          <div className="mb-10">
            <h1 className="text-[34px] font-bold text-[#212121] mb-2 font-sans tracking-tight">Log in</h1>
            <p className="text-[16px] text-[#717171] leading-[22px]">Nice to have you back!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#212121] block">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3.5 bg-white border ${email.length > 0 && !isEmailValid ? 'border-[#FF7070] focus:border-[#FF7070]' : 'border-slate-200 focus:border-primary-500'} rounded-[0.75rem] border-[1.5px] focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]`}
                />
              </div>
              {email.length > 0 && !isEmailValid && (
                <p className="text-[#FF7070] text-xs mt-1">Email must contain @</p>
              )}
            </div>

            <div className="space-y-2">
               <label className="text-[14px] font-medium text-[#212121] block">Password</label>
               <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-4 pr-12 py-3.5 bg-white border ${password.length > 0 && !isPasswordValid ? 'border-[#FF7070] focus:border-[#FF7070]' : 'border-slate-200 focus:border-primary-500'} rounded-[0.75rem] border-[1.5px] focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#717171] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password.length > 0 && !isPasswordValid && (
                <p className="text-[#FF7070] text-xs mt-1">Incorrect password. Please try again.</p>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <Link to="/forgot-password" className="text-[16px] font-semibold text-primary-500 hover:text-primary-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 bg-primary-500 text-white rounded-[0.75rem] font-semibold text-[16px] shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg mt-4 ${
                loading ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-row items-center justify-center">
            <span className="text-[16px] text-[#717171]">Are you new here? </span>
            <Link to="/signup" className="text-[16px] font-semibold text-primary-500 ml-1 hover:text-primary-600">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
