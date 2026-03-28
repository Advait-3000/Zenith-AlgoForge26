import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/BaseComponents';
import { Mail, Smartphone, Lock, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import appLogo from '../../../assets/applogo.png';

type Step = 'METHOD' | 'OTP' | 'RESET' | 'SUCCESS';

export const ForgotAccessPage: React.FC = () => {
  const [step, setStep] = useState<Step>('METHOD');
  const [method, setMethod] = useState<'email' | 'mobile'>('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step === 'METHOD') setStep('OTP');
      else if (step === 'OTP') setStep('RESET');
      else if (step === 'RESET') setStep('SUCCESS');
    }, 1000);
  };

  const getStepContent = () => {
    switch(step) {
      case 'METHOD':
        return (
          <motion.div key="METHOD" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">Recover Access</h2>
              <p className="text-slate-500 font-medium">How would you like to receive your code?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMethod('email')}
                className={`flex flex-col items-center justify-center p-4 sm:p-6 border-2 rounded-2xl transition-all outline-none ${method === 'email' ? 'border-cura-primary bg-cura-primary/5 text-cura-primary shadow-cura-soft' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-cura-primary/30 hover:bg-white'}`}
              >
                <Mail size={32} className="mb-2 sm:mb-3" />
                <span className="font-bold text-xs sm:text-sm">Email Link</span>
              </button>
              <button 
                onClick={() => setMethod('mobile')}
                className={`flex flex-col items-center justify-center p-4 sm:p-6 border-2 rounded-2xl transition-all outline-none ${method === 'mobile' ? 'border-cura-primary bg-cura-primary/5 text-cura-primary shadow-cura-soft' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-cura-primary/30 hover:bg-white'}`}
              >
                <Smartphone size={32} className="mb-2 sm:mb-3" />
                <span className="font-bold text-xs sm:text-sm">SMS OTP</span>
              </button>
            </div>

            <Input 
              placeholder={method === 'email' ? 'Enter registered email' : 'Enter mobile number'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              icon={method === 'email' ? <Mail size={20} /> : <Smartphone size={20} />}
            />

            <Button className="w-full h-14" onClick={handleNext} disabled={!contact} isLoading={loading}>
              Send Recovery Code <ArrowRight size={18} />
            </Button>
          </motion.div>
        );
      case 'OTP':
        return (
          <motion.div key="OTP" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">Verify Identity</h2>
              <p className="text-slate-500 font-medium">Enter the 6-digit code sent to <br/><span className="text-slate-700 font-bold">{contact}</span></p>
            </div>
            
            <div className="flex justify-between gap-1 sm:gap-2 py-4">
              {otp.map((digit, i) => (
                <input 
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:bg-white focus:border-cura-primary focus:ring-4 focus:ring-cura-primary/20 outline-none transition-all flex-1 mx-0.5 sm:flex-none sm:mx-0"
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[i] = e.target.value;
                    setOtp(newOtp);
                    // Extremely simple auto-focus hack for demo
                    if (e.target.value && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                />
              ))}
            </div>

            <Button className="w-full h-14" onClick={handleNext} isLoading={loading}>
              Verify Code <ArrowRight size={18} />
            </Button>
            <p className="text-center text-sm font-bold text-cura-primary hover:underline cursor-pointer">Resend Code</p>
          </motion.div>
        );
      case 'RESET':
        return (
          <motion.div key="RESET" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">Secure Account</h2>
              <p className="text-slate-500 font-medium">Create a strong, new access password</p>
            </div>
            
            <div className="space-y-4 pt-2">
              <Input 
                type="password"
                placeholder="New Password" 
                icon={<Lock size={20} />}
              />
              <Input 
                type="password"
                placeholder="Confirm Password" 
                icon={<ShieldCheck size={20} />}
              />
            </div>

            <Button className="w-full h-14 mt-4" onClick={handleNext} isLoading={loading}>
              Update Password
            </Button>
          </motion.div>
        );
      case 'SUCCESS':
        return (
          <motion.div key="SUCCESS" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-sm ring-8 ring-emerald-500/10">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restored</h2>
              <p className="text-slate-500 font-medium leading-relaxed px-4">Your password has been successfully updated. You can now access your dashboard.</p>
            </div>
            <Button className="w-full h-14 mt-4 bg-slate-800 hover:bg-slate-900 border-none group" onClick={() => navigate('/')}>
              Return to Login <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-white to-sky-50 flex flex-col p-4 sm:p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cura-primary/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cura-secondary/5 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      <button onClick={() => navigate('/')} className="relative z-20 flex items-center gap-2 text-slate-500 hover:text-cura-primary font-bold self-start transition-colors bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
        <ChevronLeft size={20} /> Back to Sign In
      </button>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-10"
          >
            <div className="w-16 h-16 bg-white shadow-cura-card rounded-2xl flex items-center justify-center mb-3 ring-8 ring-cura-primary/5 p-2 border border-slate-50">
              <img src={appLogo} alt="Cura Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Cura <span className="text-cura-primary">Recovery</span>
            </h1>
          </motion.div>

          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-cura-float border border-white/50 relative overflow-hidden min-h-[450px] sm:min-h-[500px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {getStepContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
