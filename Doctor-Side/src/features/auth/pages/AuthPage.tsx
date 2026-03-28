import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/BaseComponents';
import { Mail, Lock, User, AtSign, ChevronRight, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/setup');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-white to-sky-50 flex items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cura-primary/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cura-secondary/5 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Cura Logo Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-14 h-14 bg-white shadow-cura-card rounded-2xl flex items-center justify-center mb-3 ring-8 ring-cura-primary/5">
            <Stethoscope className="text-cura-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Cura <span className="text-cura-primary">Portal</span>
          </h1>
          <p className="text-slate-500 font-medium">Empowering Doctor Workflows with AI</p>
        </motion.div>

        {/* 3D Flip Card Container */}
        <div className="relative h-[530px] auth-perspective">
          <motion.div
            className="w-full h-full relative preserve-3d"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Front: Login */}
            <div className="absolute inset-0 backface-hidden bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-cura-float border border-white/50 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
                  <p className="text-slate-500 font-medium">Continue focusing on care</p>
                </div>
                
                <form className="space-y-5" onSubmit={handleLogin}>
                  <Input 
                    type="email" 
                    placeholder="name@hospital.com" 
                    label="Medical Email"
                    icon={<Mail size={20} />}
                  />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    label="Access Password"
                    icon={<Lock size={20} />}
                  />
                  
                  <div className="flex justify-end">
                    <button type="button" className="text-sm font-semibold text-cura-primary hover:text-cura-primary-dark transition-colors">
                      Forgot Access?
                    </button>
                  </div>
                  
                  <Button className="w-full h-14" isLoading={loading}>
                    Access Dashboard <ChevronRight size={18} />
                  </Button>
                </form>
              </div>

              <div className="pt-6 border-t border-slate-100/50 flex flex-col items-center">
                <p className="text-slate-500 font-medium text-sm mb-2">New to Cura?</p>
                <button 
                  onClick={() => setIsFlipped(true)}
                  className="text-cura-primary font-bold hover:underline transition-all"
                >
                  Join the Network
                </button>
              </div>
            </div>

            {/* Back: Signup */}
            <div className="absolute inset-0 backface-hidden bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-cura-float border border-white/50 rotate-y-180 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Join Cura</h2>
                  <p className="text-slate-500 font-medium">Intelligent patient insights</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSignup}>
                  <Input 
                    placeholder="Dr. Julian Ross" 
                    label="Full Medical Name"
                    icon={<User size={20} />}
                  />
                  <Input 
                    type="email" 
                    placeholder="julian@cura.com" 
                    label="Medical Email"
                    icon={<AtSign size={20} />}
                  />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    label="Security Password"
                    icon={<Lock size={20} />}
                  />
                  
                  <Button className="w-full h-14 mt-4" isLoading={loading}>
                    Register Profile <ChevronRight size={18} />
                  </Button>
                </form>
              </div>

              <div className="pt-6 border-t border-slate-100/50 flex flex-col items-center">
                <p className="text-slate-500 font-medium text-sm mb-2">Already Registered?</p>
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="text-cura-primary font-bold hover:underline transition-all"
                >
                  Return to Login
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
