import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAppDispatch, loginSuccess } from '../../store';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isMinLength = password.length >= 8;
  const hasTwoNumbers = (password.match(/\d/g) || []).length >= 2;
  const hasUppercase = /[A-Z]/.test(password);

  const isPasswordValid = isMinLength && hasTwoNumbers && hasUppercase;
  const isEmailValid = email.includes('@');
  const isFormValid = isEmailValid && isPasswordValid && name.length > 0;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setTimeout(() => {
      dispatch(loginSuccess({ email, name, id: 'doc-1' }));
      setLoading(false);
      navigate('/profile-setup');
    }, 1500);
  };

  const renderRequirement = (text: string, isValid: boolean) => (
    <div className="flex items-center mb-2">
      {isValid ? (
        <Check color="#306F6F" size={16} />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-[#A0A0A0] ml-1 mr-2.5" />
      )}
      <span className={`text-[14px] ml-2 ${isValid ? 'text-[#306F6F]' : 'text-[#A0A0A0]'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7FEFE] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        {/* Header / Back Button */}
        <div className="mb-8 cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft color="#212121" size={24} />
        </div>

        <div>
          <h1 className="text-[34px] font-bold text-[#212121] mb-2 tracking-tight">Create an account</h1>
          <p className="text-[16px] text-[#717171] leading-[22px] mb-10">Excited to have you on board!</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#212121] block">Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[0.75rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#212121] block">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-3.5 bg-white border ${email.length > 0 && !isEmailValid ? 'border-[#FF7070]' : 'border-slate-200'} rounded-[0.75rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]`}
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[14px] font-medium text-[#212121] block">Password</label>
             <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className={`w-full pl-4 pr-12 py-3.5 bg-white border ${
                  password.length === 0 
                  ? 'border-slate-200' 
                  : isPasswordValid 
                  ? 'border-[#306F6F]' 
                  : 'border-[#FF7070]'
                } rounded-[0.75rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#717171] transition-colors"
                title="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mt-3 mb-6">
            {renderRequirement('Min 8 characters length', isMinLength)}
            {renderRequirement('Min 2 number', hasTwoNumbers)}
            {renderRequirement('Min 1 uppercase letter', hasUppercase)}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-4 text-white rounded-[0.75rem] font-semibold text-[16px] flex items-center justify-center gap-3 transition-opacity ${
                !isFormValid || loading ? 'bg-[#A0A0A0] cursor-not-allowed' : 'bg-[#306F6F] hover:opacity-90 active:opacity-80'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Create an account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
           <div className="absolute w-full h-px bg-slate-200"></div>
           <span className="bg-[#F7FEFE] px-4 text-[14px] text-[#A0A0A0] relative z-10 font-medium">Or continue with</span>
        </div>

        <div className="mt-8 space-y-4">
           <button className="w-full py-4 bg-white border border-slate-200 text-[#212121] font-semibold rounded-[0.75rem] text-[15px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
           </button>
           <button className="w-full py-4 bg-white border border-slate-200 text-[#212121] font-semibold rounded-[0.75rem] text-[15px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M16.365 7.043c-.02-.03-.035-.06-.05-.089-1.065-1.967-3.21-3.219-5.46-3.329-1.99-.098-4.105 1.065-5.325 2.505C4.24 7.641 2.871 10.435 3.355 13.565c.535 3.46 2.651 6.83 5.4 9.175.76.65 1.576 1.256 2.451 1.246 1.085-.015 2.02-.635 3.011-1.076.905-.401 1.83-.82 2.84-.79 1.145.035 2.065.59 2.866 1.206.5.385 1.03.805 1.61 1.085.345.165.735.255 1.135.245.905-.025 1.486-.875 1.866-1.581.825-1.531 1.34-3.161 1.76-4.821v-.01c-1.89-1.086-3.081-3.141-2.911-5.302.16-2.025 1.28-3.801 2.921-4.791h.01c-.695-1.025-1.58-1.866-2.61-2.421-1.226-.665-2.686-.98-4.162-.97-1.11.01-2.22.28-3.176.711z" fill="#212121"/>
                 <path d="M12.015 1.25a5.138 5.138 0 0 0-1.14 3.7c1.17 0 2.48-.465 3.3-1.325.865-.9 1.325-2.25 1.12-3.48A4.956 4.956 0 0 0 12.015 1.25z" fill="#212121"/>
              </svg>
              Apple
           </button>
        </div>

        <div className="mt-10 flex flex-row items-center justify-center pb-6">
           <span className="text-[16px] text-[#717171]">Already have an account? </span>
           <Link to="/login" className="text-[16px] font-semibold text-[#306F6F] ml-1">
             Log in
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
