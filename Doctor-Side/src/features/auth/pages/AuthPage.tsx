import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/BaseComponents';
import { Mail, Lock, User, AtSign, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import appLogo from '../../../assets/applogo.png';

const AuthPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: 'Doctor'
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
           localStorage.setItem('token', data.token);
        }
        if (data.user) {
           localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/dashboard');
      } else {
        console.error("Login failed:", data);
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: regName,
          email: regEmail,
          password: regPassword,
          role: 'Doctor'
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
           localStorage.setItem('token', data.token);
        }
        if (data.user) {
           localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/setup');
      } else {
        console.error("Registration failed:", data);
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
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
          <div className="w-16 h-16 bg-white shadow-cura-card rounded-2xl flex items-center justify-center mb-3 ring-8 ring-cura-primary/5 p-2">
            <img src={appLogo} alt="Cura Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Cura <span className="text-cura-primary">Portal</span>
          </h1>
          <p className="text-slate-500 font-medium">Empowering Doctor Workflows with AI</p>
        </motion.div>

        {/* 3D Flip Card Container */}
        <motion.div 
          className="relative auth-perspective w-full"
          initial={false}
          animate={{ height: isFlipped ? 620 : 540 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Front: Login */}
            <div 
              className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-cura-float border border-white/50 flex flex-col justify-between"
              style={{ backfaceVisibility: 'hidden' }}
            >
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
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    label="Access Password"
                    icon={<Lock size={20} />}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  
                  <div className="flex justify-end">
                    <button type="button" onClick={() => navigate('/forgot-access')} className="text-sm font-semibold text-cura-primary hover:text-cura-primary-dark transition-colors">
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
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="text-cura-primary font-bold hover:underline transition-all"
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Back: Signup */}
            <div 
              className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-cura-float border border-white/50 flex flex-col justify-between"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
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
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                  <Input 
                    type="email" 
                    placeholder="julian@cura.com" 
                    label="Medical Email"
                    icon={<AtSign size={20} />}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    label="Security Password"
                    icon={<Lock size={20} />}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  
                  <Button className="w-full h-14 mt-4" isLoading={loading}>
                    Register Profile <ChevronRight size={18} />
                  </Button>
                </form>
              </div>

              <div className="pt-6 border-t border-slate-100/50 flex flex-col items-center">
                <p className="text-slate-500 font-medium text-sm mb-2">Already Registered?</p>
                <button 
                  type="button"
                  onClick={() => setIsFlipped(false)}
                  className="text-cura-primary font-bold hover:underline transition-all"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
