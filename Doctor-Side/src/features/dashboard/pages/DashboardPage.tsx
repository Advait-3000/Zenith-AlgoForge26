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
const STATS_INIT = [
    { label: 'Total Patients', value: '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+0%' },
    { label: 'Weekly Consults', value: '0', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+0%' },
    { label: 'Reports Analyzed', value: '0', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '+0%' },
    { label: 'Risk Alerts', value: '0', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50', trend: '-0%' },
];

const WEEKLY_DATA = [
  { day: 'Mon', count: 12 }, { day: 'Tue', count: 18 }, { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 }, { day: 'Fri', count: 14 }, { day: 'Sat', count: 8 },
];

const MONTHLY_DATA = [
  { day: 'Week 1', count: 45 }, { day: 'Week 2', count: 52 }, { day: 'Week 3', count: 38 },
  { day: 'Week 4', count: 65 }
];

const RISK_DATA = [
    { name: 'Low', value: 65, color: '#10B981' },
    { name: 'Medium', value: 25, color: '#F59E0B' },
    { name: 'High', value: 10, color: '#EF4444' },
];

import axios from 'axios';

export const DashboardPage: React.FC = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [stats, setStats] = useState(STATS_INIT);
    const [riskData, setRiskData] = useState(RISK_DATA);
    const [weeklyData, setWeeklyData] = useState(WEEKLY_DATA);
    const [monthlyData, setMonthlyData] = useState(MONTHLY_DATA);
    const [loading, setLoading] = useState(true);
    const [volumeView, setVolumeView] = useState('Week');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showRiskModal, setShowRiskModal] = useState<any>(null);
    const [showFullSchedule, setShowFullSchedule] = useState(false);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Fetch Patients
                const patientsRes = await axios.get('http://localhost:3000/auth/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (patientsRes.data.success) {
                    const mapped = patientsRes.data.patients.map((p: any) => ({
                        id: p._id,
                        patientName: p.full_name || 'Unknown Patient',
                        avatar: p.full_name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name)}&background=0D9488&color=fff&bold=true` : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                        age: p.patient_details?.date_of_birth ? new Date().getFullYear() - new Date(p.patient_details.date_of_birth).getFullYear() : 35,
                        gender: p.patient_details?.gender || 'Unspecified',
                        vitals: p.patient_details?.vitals || {},
                        summary: p.patient_details?.disease_history?.length > 0 
                            ? `History of ${p.patient_details.disease_history[0].disease_name}.`
                            : 'New patient registered via Cura Portal.',
                        risk: (p.patient_details?.current_health_score ?? 85) < 40 ? 'High' : ((p.patient_details?.current_health_score ?? 85) < 75 ? 'Medium' : 'Low'),
                        score: p.patient_details?.current_health_score ?? 85,
                        time: 'Clinical Dashboard',
                        status: 'Registered',
                        phone: p.phone_number || p.contact_number || 'N/A'
                    }));
                    setPatients(mapped);
                }

                // 2. Fetch Stats
                const statsRes = await axios.get('http://localhost:3000/auth/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.data.success) {
                    const s = statsRes.data.stats || {};
                    setStats([
                        { ...STATS_INIT[0], value: s.totalPatients?.toLocaleString() || '0', trend: s.totalPatientsTrend || '+0%' },
                        { ...STATS_INIT[1], value: s.weeklyConsults?.toString() || '0', trend: s.weeklyConsultsTrend || '+0%' },
                        { ...STATS_INIT[2], value: s.reportsAnalyzed?.toString() || '0', trend: s.reportsAnalyzedTrend || '+0%' },
                        { ...STATS_INIT[3], value: s.riskStats?.find((rs:any)=>rs.name==='High')?.value?.toString() || '0', trend: s.riskAlertsTrend || '-0%' },
                    ]);
                    if (s.riskStats) {
                        setRiskData(s.riskStats.map((rs: any) => ({
                            name: rs.name,
                            value: rs.value,
                            color: rs.color
                        })));
                    }
                    if (s.weeklyData) setWeeklyData(s.weeklyData);
                    if (s.monthlyData) setMonthlyData(s.monthlyData);
                }

            } catch (error) {
                console.error("Dashboard Fetch Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Upper Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="cura-card p-8 group hover:bg-white"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <stat.icon size={26} />
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-black ${(stat.trend || '').startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{stat.trend}</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-bold text-cura-text-soft uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{loading ? '--' : stat.value}</h3>
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
                            <button onClick={() => setVolumeView('Week')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${volumeView === 'Week' ? 'bg-white shadow-sm text-cura-primary' : 'text-slate-400 hover:text-slate-600'}`}>Week</button>
                            <button onClick={() => setVolumeView('Month')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${volumeView === 'Month' ? 'bg-white shadow-sm text-cura-primary' : 'text-slate-400 hover:text-slate-600'}`}>Month</button>
                        </div>
                    </div>
                    
                    <div className="h-72 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={volumeView === 'Week' ? weeklyData : monthlyData}>
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
                    className="cura-card p-8 flex flex-col"
                >
                    <div className="w-full mb-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">AI Risk Matrix</h3>
                        <p className="text-sm font-medium text-cura-text-soft">Current patient population health</p>
                    </div>
                    
                    <div className="relative w-64 h-64 mx-auto mb-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    animationDuration={1500}
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full shadow-cura-soft flex items-center justify-center">
                                <Activity className="text-cura-primary" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {riskData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-bold text-slate-600">{item.name} Criticality</span>
                                </div>
                                <span className="font-black text-slate-800">{item.value}%</span>
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
                    <Button variant="outline" className="h-12 px-5" onClick={() => setShowFullSchedule(true)}>View Full Schedule <ArrowRight size={18} /></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {patients.length > 0 ? patients.map((apt: any, i: number) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={apt.id} 
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedPatient(apt);
                            }}
                            className="cura-card p-6 cursor-pointer group hover:bg-white active:scale-98 relative"
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
                                <div className="text-xs font-black text-slate-400">Score: {apt.score}</div>
                                <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-cura-primary group-hover:text-white transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center cura-card bg-slate-50/50">
                            <p className="text-slate-400 font-bold">No registered patients found.</p>
                        </div>
                    )}
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

            {/* Risk Detail Modal */}
            <AnimatePresence>
                {showRiskModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRiskModal(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl relative overflow-hidden z-[101] p-8"
                        >
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full" style={{backgroundColor: showRiskModal.color}} />
                                    <h3 className="font-black text-slate-800 text-xl tracking-tight">{showRiskModal.name} Risk</h3>
                                </div>
                                <button onClick={() => setShowRiskModal(null)} className="text-slate-400 hover:text-slate-600"><X /></button>
                            </div>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                                Detailed breakdown of patients currently evaluating as {showRiskModal.name.toLowerCase()} criticality. Focus on proactive care routines.
                            </p>
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl mb-4">
                                <span className="font-bold text-slate-600 text-sm">Patient Population</span>
                                <span className="font-black text-xl" style={{color: showRiskModal.color}}>{showRiskModal.value}%</span>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-3">Patients in Category</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {patients.filter((p: any) => p.risk === showRiskModal.name).map((apt: any) => (
                                        <div 
                                            key={apt.id} 
                                            onClick={() => { setShowRiskModal(null); setSelectedPatient(apt); }} 
                                            className="cursor-pointer flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-cura-primary/10 border border-slate-100 transition-colors"
                                        >
                                            <img src={apt.avatar} alt="Patient" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-xs">{apt.patientName}</h5>
                                                <p className="text-[10px] text-slate-500 font-semibold">{apt.age} Yrs • {apt.time}</p>
                                            </div>
                                            <ChevronRight className="ml-auto text-slate-400" size={16} />
                                        </div>
                                    ))}
                                    {patients.filter((p: any) => p.risk === showRiskModal.name).length === 0 && (
                                        <div className="text-center font-bold text-xs text-slate-400 py-4">No patients detected in this category.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Full Schedule Modal */}
            <AnimatePresence>
                {showFullSchedule && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFullSchedule(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl relative overflow-hidden z-[101] flex flex-col max-h-full"
                        >
                            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Today's Total Schedule</h2>
                                    <p className="text-sm font-semibold text-cura-text-soft mt-1">All upcoming and past appointments for today.</p>
                                </div>
                                <button onClick={() => setShowFullSchedule(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {patients.map((apt) => (
                                        <div 
                                            key={apt.id} 
                                            onClick={() => { setShowFullSchedule(false); setSelectedPatient(apt); }}
                                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-cura-soft transition-all cursor-pointer group hover:border-cura-primary/20"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                                                    <img src={apt.avatar} alt="Patient" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-800 group-hover:text-cura-primary transition-colors">{apt.patientName}</h4>
                                                    <div className="flex items-center gap-1.5 text-cura-text-soft font-black text-xs">
                                                        <Clock size={16} /> {apt.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${apt.risk === 'High' ? 'bg-red-50 text-red-600' : apt.risk === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                                    <AlertCircle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{apt.risk} Risk</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-slate-400">{apt.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Patient Detail Modal Component
export const PatientDetailModal: React.FC<{ patient: any, onClose: () => void }> = ({ patient, onClose }) => {
    const navigate = useNavigate();
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [newTimeSlot, setNewTimeSlot] = useState<string | null>(null);
    const [aiSummary, setAiSummary] = useState<any>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [historyRecords, setHistoryRecords] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchAIInsights = async () => {
            if (!patient.id) return;
            try {
                setIsLoadingAI(true);
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get(`http://localhost:3000/auth/latest/${patient.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if ((res.data.success || res.status === 200) && res.data.records?.length > 0) {
                    const latestRecord = res.data.records[0];
                    const latest = latestRecord.ai_analysis || latestRecord;
                    setAiSummary({
                        summary: latest.concise_summary || "Document parsed successfully. Synthesized insights visible.",
                        findings: latest.detected_abnormalities || latest.findings || [],
                        score: latest.calculated_health_score || patient.score
                    });
                    
                    // Build history data for graph
                    const records = [...res.data.records].reverse().map((r, i) => ({
                        date: new Date(r.upload_date || r.createdAt || Date.now() - (res.data.records.length - i)*86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        score: r.ai_analysis?.calculated_health_score || r.calculated_health_score || patient.score,
                        title: r.document_type || "Clinical Report",
                        id: r._id || i
                    }));
                    setHistoryRecords(records);
                } else {
                    setAiSummary({
                        summary: "Patient records synchronize from the Cura Native App. Awaiting patient upload.",
                        findings: [],
                        score: patient.score
                    });
                    setHistoryRecords([]);
                }
            } catch (err) {
                console.error("AI Insights Error:", err);
            } finally {
                setIsLoadingAI(false);
            }
        };
        fetchAIInsights();
    }, [patient.id, patient.score]);

    const handleReschedule = () => {
        alert(`Appointment rescheduled to ${rescheduleDate} at ${newTimeSlot}`);
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
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-1">Health Score</h5>
                            <div className="text-3xl font-black text-cura-primary">{patient.score || '--'}</div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-2">Blood Group</h5>
                            <p className="text-sm font-bold text-slate-700">{patient.vitals?.blood_group || 'Not Recorded'}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-2">Contact</h5>
                            <p className="text-sm font-bold text-slate-700">{patient.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        {!isRescheduling ? (
                            <Button variant="outline" className="w-full h-12 text-sm" onClick={() => setIsRescheduling(true)}>Reschedule Slot</Button>
                        ) : (
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest text-center">Select New Date & Time</h5>
                                <input 
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:border-cura-primary outline-none transition-colors"
                                />
                                <div className="grid grid-cols-2 gap-2 mt-2">
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
                                    <Button className="flex-1 h-10 text-xs" onClick={handleReschedule} disabled={!newTimeSlot || !rescheduleDate}>Confirm</Button>
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
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                 <TrendingUp size={20} className="text-cura-primary" />
                                 <h4 className="font-black text-cura-primary uppercase tracking-widest text-xs">AI Insight Summary</h4>
                            </div>
                        </div>
                        
                        {isLoadingAI ? (
                            <div className="space-y-3">
                                <div className="h-4 bg-cura-primary/10 rounded-full w-3/4 animate-pulse" />
                                <div className="h-4 bg-cura-primary/10 rounded-full animate-pulse" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-slate-700 font-medium leading-relaxed text-[15px]">
                                    {aiSummary?.summary || "No recent AI analysis available for this patient. Upload a pathology report to begin sync."}
                                </p>
                                {aiSummary?.findings && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {aiSummary.findings.map((f: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-white/60 border border-cura-primary/10 rounded-lg text-[11px] font-bold text-cura-primary">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>



                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Pathology History & Trends</h4>
                        </div>
                        
                        {historyRecords.length > 1 && (
                            <div className="h-40 w-full mb-6 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={historyRecords}>
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 600, fontSize: 10}} dy={10} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}
                                            itemStyle={{color: '#0D9488', fontWeight: 700, fontSize: '12px'}}
                                            labelStyle={{color: '#64748B', fontWeight: 600, fontSize: '10px'}}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="score" 
                                            name="Health Score"
                                            stroke="#0D9488" 
                                            strokeWidth={3} 
                                            dot={{r: 4, fill: '#0D9488', strokeWidth: 2, stroke: '#FFF'}}
                                            activeDot={{r: 6, strokeWidth: 0}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            {historyRecords.length > 0 ? historyRecords.slice().reverse().map((r, i) => (
                                <div key={r.id || i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-cura-primary/30 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-cura-primary/10 group-hover:text-cura-primary transition-all">
                                            <CalendarDays size={18} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm">{r.title}</h5>
                                            <p className="text-[11px] font-semibold text-cura-text-soft">{r.date} • Health Score: {r.score}</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black text-cura-primary h-7 px-3 rounded-lg border border-cura-primary/20 hover:bg-cura-primary hover:text-white transition-all">VIEW</button>
                                </div>
                            )) : (
                                <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400">No clinical reports synced yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                
                    <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-4">
                        <Button className="flex-1 h-14" onClick={() => navigate('/consultation', { state: { patient } })}>Start Consultation</Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
