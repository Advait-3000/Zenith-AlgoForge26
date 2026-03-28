import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Heart,
  Droplets,
  FileText,
  AlertCircle,
  CalendarDays,
  X,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Button } from '@/components/BaseComponents';

// Mock Data
const STATS = [
  { label: 'Total Patients', value: '2,482', change: '+12%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Weekly Consults', value: '48', change: '+5%', icon: Calendar, color: 'text-cura-primary', bg: 'bg-cura-primary/10' },
  { label: 'Reports Analyzed', value: '154', change: '+18%', icon: Activity, color: 'text-sky-500', bg: 'bg-sky-50' },
  { label: 'Risk Alerts', value: '3', change: '-2%', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50' },
];

const WEEKLY_DATA = [
  { day: 'Mon', count: 12 }, { day: 'Tue', count: 18 }, { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 }, { day: 'Fri', count: 14 }, { day: 'Sat', count: 8 },
];

const RISK_DATA = [
  { name: 'Low', value: 65, color: '#10B981' },
  { name: 'Medium', value: 25, color: '#F59E0B' },
  { name: 'High', value: 10, color: '#EF4444' },
];

const APPOINTMENTS = [
  { 
    id: 1, 
    patientName: 'Sarah Jenkins', 
    age: 28, 
    gender: 'Female',
    time: '10:30 AM', 
    status: 'Confirmed', 
    summary: 'Follow-up on recent lipid profile results. Patient reports mild fatigue.',
    risk: 'Medium',
    avatar: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg'
  },
  { 
    id: 2, 
    patientName: 'Robert Vance', 
    age: 54, 
    gender: 'Male',
    time: '11:15 AM', 
    status: 'Arrived', 
    summary: 'Hypertension screening. AI marked elevated systolic readings in last 3 weeks.',
    risk: 'High',
    avatar: 'https://img.freepik.com/free-photo/bearded-smiling-man-white-shirt-looking-confident_176420-18860.jpg'
  },
  { 
    id: 3, 
    patientName: 'Emma Watson', 
    age: 22, 
    gender: 'Female',
    time: '12:00 PM', 
    status: 'Pending', 
    summary: 'Regular heart health checkup. Previous records show stable vitals.',
    risk: 'Low',
    avatar: 'https://img.freepik.com/free-photo/attractive-curly-woman-white-t-shirt-smiling-against-white-background_273609-20154.jpg'
  },
];

export const DashboardPage: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Upper Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="cura-card p-6 flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-cura-text-soft uppercase tracking-wider mb-1">{stat.label}</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                                <span className={`text-xs font-black ${stat.change.startsWith('+') ? 'text-cura-primary' : 'text-red-500'} mb-1.5`}>{stat.change}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Middle Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Interaction Activity Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 cura-card p-8 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Patient Volume</h3>
                            <p className="text-sm font-medium text-cura-text-soft">Weekly appointment analytics</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                            <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-black text-cura-primary">Week</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600">Month</button>
                        </div>
                    </div>
                    
                    <div className="h-72 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={WEEKLY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 600, fontSize: 13}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 600, fontSize: 13}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#FFF', borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}}
                                    itemStyle={{color: '#0D9488', fontWeight: 700}}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#0D9488" 
                                    strokeWidth={4} 
                                    dot={{r: 6, fill: '#0D9488', strokeWidth: 3, stroke: '#FFF'}}
                                    activeDot={{r: 8, strokeWidth: 0}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Risk Distribution Pie */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="cura-card p-8 flex flex-col items-center"
                >
                    <div className="w-full mb-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">AI Risk Matrix</h3>
                        <p className="text-sm font-medium text-cura-text-soft">Current patient population health</p>
                    </div>
                    
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={RISK_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {RISK_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3 mt-6">
                        {RISK_DATA.map(item => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                                    <span className="text-sm font-bold text-slate-600">{item.name} Criticality</span>
                                </div>
                                <span className="text-sm font-black text-slate-800">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row - Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Today's Appointments</h3>
                        <p className="text-slate-500 font-semibold mt-1">Ready for consultation • 8 slots remaining</p>
                    </div>
                    <Button variant="outline" className="h-12 px-5">View Full Schedule <ArrowRight size={18} /></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {APPOINTMENTS.map((apt, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={apt.id} 
                            onClick={() => setSelectedPatient(apt)}
                            className="cura-card p-6 cursor-pointer group hover:bg-white active:scale-98"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-cura-soft border-2 border-white">
                                        <img src={apt.avatar} alt="Patient" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 group-hover:text-cura-primary transition-colors">{apt.patientName}</h4>
                                        <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">{apt.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 text-cura-text-soft font-black text-xs">
                                        <Clock size={16} /> {apt.time}
                                    </div>
                                </div>
                            </div>

                            <p className="text-[15px] font-medium text-slate-600 line-clamp-2 leading-relaxed mb-6">
                                {apt.summary}
                            </p>

                            <div className="flex items-center justify-between pt-5 border-t border-slate-50/50">
                                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${apt.risk === 'High' ? 'bg-red-50 text-red-600' : apt.risk === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                    <AlertCircle size={14} />
                                    <span className="text-xs font-black uppercase tracking-tight">{apt.risk} Risk</span>
                                </div>
                                <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-cura-primary group-hover:text-white transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Patient Detail Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <PatientDetailModal 
                        patient={selectedPatient} 
                        onClose={() => setSelectedPatient(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Patient Detail Modal Component
const PatientDetailModal: React.FC<{ patient: any, onClose: () => void }> = ({ patient, onClose }) => {
    const navigate = useNavigate();
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [newTimeSlot, setNewTimeSlot] = useState<string | null>(null);

    const handleReschedule = () => {
        // In a real app, make API call here.
        alert(`Appointment rescheduled to ${newTimeSlot}`);
        setIsRescheduling(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl relative overflow-hidden z-[101] flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Left Personal Context Panel */}
                <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-cura-float border-4 border-white mx-auto mb-6">
                        <img src={patient.avatar} alt="Patient" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800 mb-1">{patient.patientName}</h2>
                        <div className="flex items-center justify-center gap-3 text-sm font-bold text-cura-text-soft uppercase tracking-wider">
                            <span>{patient.age} Yrs</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            <span>{patient.gender}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-2">Primary Symptom</h5>
                            <p className="text-sm font-bold text-slate-700">Persistent Chronic Fatigue</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-2">Appointment Contact</h5>
                            <p className="text-sm font-bold text-slate-700">+1 (555) 092-2342</p>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        {!isRescheduling ? (
                            <Button variant="outline" className="w-full h-12 text-sm" onClick={() => setIsRescheduling(true)}>Reschedule Slot</Button>
                        ) : (
                            <div className="space-y-3">
                                <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest text-center">Select New Time</h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {['09:00 AM', '01:30 PM', '04:00 PM', '05:15 PM'].map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setNewTimeSlot(t)}
                                            className={`py-2 text-xs font-bold rounded-xl border transition-all ${newTimeSlot === t ? 'bg-cura-primary text-white border-cura-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-cura-primary/50'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1 h-10 text-xs" onClick={() => setIsRescheduling(false)}>Cancel</Button>
                                    <Button className="flex-1 h-10 text-xs" onClick={handleReschedule} disabled={!newTimeSlot}>Confirm</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Clinical Insights Panel */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cura-primary/10 rounded-xl flex items-center justify-center">
                                <FileText className="text-cura-primary" size={22} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Clinical Portfolio</h3>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-400"><X /></button>
                    </div>

                    {/* AI Generated Highlight */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-cura-primary/5 border border-cura-primary/10 rounded-[2rem] p-8 mb-8 relative overflow-hidden group shadow-sm shadow-teal-500/5 transition-all hover:shadow-teal-500/10"
                    >
                        <div className="absolute top-0 right-0 p-6 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-all">
                            <div className="w-2 h-2 rounded-full bg-cura-primary animate-pulse" />
                            <span className="text-[10px] font-black text-cura-primary tracking-widest uppercase">Live AI Sync</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                             <TrendingUp size={20} className="text-cura-primary" />
                             <h4 className="font-black text-cura-primary uppercase tracking-widest text-xs">AI Insight Summary</h4>
                        </div>
                        
                        <p className="text-slate-700 font-medium leading-relaxed text-[15px]">
                            Patient shows symptoms of progressive physical exertion fatigue. Last laboratory analysis (Feb 20) indicated **borderline high LDL** and slightly elevated glucose. Genetic risk factors for Type 2 Diabetes are noted in lineage.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="cura-card p-6 bg-white border border-slate-50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-red-500/10 shadow-sm"><Heart size={24} /></div>
                            <div>
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Avg Pulse</p>
                                <h4 className="text-lg font-black text-slate-800">72 BPM</h4>
                            </div>
                        </div>
                        <div className="cura-card p-6 bg-white border border-slate-50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center shadow-sky-500/10 shadow-sm"><Droplets size={24} /></div>
                            <div>
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">BP Level</p>
                                <h4 className="text-lg font-black text-slate-800">128/84</h4>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Pathology History</h4>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-cura-primary/30 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-cura-primary/10 group-hover:text-cura-primary transition-all">
                                            <CalendarDays size={20} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800">Blood Glucose & Thyroid L1</h5>
                                            <p className="text-xs font-semibold text-cura-text-soft">Feb 15, 2026 • General Screening</p>
                                        </div>
                                    </div>
                                    <button className="text-[11px] font-black text-cura-primary h-8 px-4 rounded-xl border border-cura-primary/20 hover:bg-cura-primary hover:text-white transition-all">VIEW REPORT</button>
                                </div>
                            ))}
                        </div>
                    </div>
                
                    <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-4">
                        <Button className="flex-1 h-14" onClick={() => navigate('/consultation')}>Start Consultation</Button>
                        <Button variant="outline" className="flex-1 h-14">Request New Lab Lab</Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
