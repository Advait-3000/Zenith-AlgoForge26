import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';
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
import toast from 'react-hot-toast';
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
<<<<<<< Updated upstream
import { Button } from '@/components/BaseComponents';

// Mock Data
const STATS_INIT = [
    { label: 'Total Patients', value: '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+0%' },
    { label: 'Weekly Consults', value: '0', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+0%' },
    { label: 'Reports Analyzed', value: '0', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '+0%' },
    { label: 'Risk Alerts', value: '0', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50', trend: '-0%' },
];

=======
>>>>>>> Stashed changes
const WEEKLY_DATA = [
  { day: 'Mon', count: 12 }, { day: 'Tue', count: 18 }, { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 }, { day: 'Fri', count: 14 }, { day: 'Sat', count: 8 },
];

const MONTHLY_DATA = [
  { day: 'Week 1', count: 45 }, { day: 'Week 2', count: 52 }, { day: 'Week 3', count: 38 },
  { day: 'Week 4', count: 65 }
];

<<<<<<< Updated upstream
const RISK_DATA = [
    { name: 'Low', value: 65, color: '#10B981' },
    { name: 'Medium', value: 25, color: '#F59E0B' },
    { name: 'High', value: 10, color: '#EF4444' },
];

=======
import { Button } from '@/components/BaseComponents';
import { APPOINTMENTS } from '../../../data/mockPatients';
>>>>>>> Stashed changes
import axios from 'axios';

export const DashboardPage: React.FC = () => {
    const [patients, setPatients] = useState<any[]>(() => {
        const cached = sessionStorage.getItem('cura_patients_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [stats, setStats] = useState(STATS_INIT);
    const [riskData, setRiskData] = useState(RISK_DATA);
    const [weeklyData, setWeeklyData] = useState(WEEKLY_DATA);
    const [monthlyData, setMonthlyData] = useState(MONTHLY_DATA);
    const [loading, setLoading] = useState(!sessionStorage.getItem('cura_patients_cache'));
    const [volumeView, setVolumeView] = useState('Week');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showRiskModal, setShowRiskModal] = useState<any>(null);
    const [showFullSchedule, setShowFullSchedule] = useState(false);
    const [criticalityFilter, setCriticalityFilter] = useState('All');

    // Dynamic Calculations
    const highRiskCount = patients.filter(p => p.risk === 'High').length;
    const mediumRiskCount = patients.filter(p => p.risk === 'Medium').length;
    const lowRiskCount = patients.filter(p => p.risk === 'Low').length;
    const totalCount = patients.length;

    const dynamicStats = [
      { label: 'Total Patients', value: totalCount.toLocaleString(), change: '+12%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { label: 'Weekly Consults', value: '48', change: '+5%', icon: Calendar, color: 'text-cura-primary', bg: 'bg-cura-primary/10' },
      { label: 'Reports Analyzed', value: '154', change: '+18%', icon: Activity, color: 'text-sky-500', bg: 'bg-sky-50' },
      { label: 'Risk Alerts', value: highRiskCount.toString(), change: '+2', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    const dynamicRiskData = [
      { name: 'Low', value: totalCount > 0 ? Math.round((lowRiskCount / totalCount) * 100) : 65, color: '#10B981' },
      { name: 'Medium', value: totalCount > 0 ? Math.round((mediumRiskCount / totalCount) * 100) : 25, color: '#F59E0B' },
      { name: 'High', value: totalCount > 0 ? Math.round((highRiskCount / totalCount) * 100) : 10, color: '#EF4444' },
    ];

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Fetch Patients and Stats Concurrently
                const [patientsRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:3000/auth/patients', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:3000/auth/stats', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                if (patientsRes.data.success) {
                    const mapped = patientsRes.data.patients.map((p: any) => ({
                        id: p._id,
                        patientName: p.full_name || 'Unknown Patient',
                        avatar: p.full_name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name)}&background=0D9488&color=fff&bold=true` : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                        age: p.patient_details?.date_of_birth ? new Date().getFullYear() - new Date(p.patient_details.date_of_birth).getFullYear() : 35,
                        gender: p.patient_details?.gender || 'Unspecified',
<<<<<<< Updated upstream
                        vitals: p.patient_details?.vitals || {},
                        summary: p.patient_details?.disease_history?.length > 0 
                            ? `History of ${p.patient_details.disease_history[0].disease_name}.`
                            : 'New patient registered via Cura Portal.',
                        risk: (p.patient_details?.current_health_score ?? 85) < 40 ? 'High' : ((p.patient_details?.current_health_score ?? 85) < 75 ? 'Medium' : 'Low'),
                        score: p.patient_details?.current_health_score ?? 85,
                        time: 'Clinical Dashboard',
                        status: 'Registered',
                        phone: p.phone_number || p.contact_number || 'N/A'
=======
                        summary: 'Registered via Cura Patient Portal.',
                        risk: p.patient_details?.current_health_score < 50 ? 'High' : (p.patient_details?.current_health_score < 75 ? 'Medium' : 'Low'),
                        time: 'Registered Patient',
                        status: 'Scheduled',
                        vitals: p.patient_details?.vitals || {}
>>>>>>> Stashed changes
                    }));
                    setPatients(mapped);
                    sessionStorage.setItem('cura_patients_cache', JSON.stringify(mapped));
                }

                // 2. Process Stats
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
<<<<<<< Updated upstream
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicStats.map((stat, i) => (
>>>>>>> Stashed changes
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="cura-card p-6 md:p-8 group hover:bg-white"
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
<<<<<<< Updated upstream
                    </div>

                    <div className="space-y-4">
                        {riskData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-bold text-slate-600">{item.name} Criticality</span>
                                </div>
                                <span className="font-black text-slate-800">{item.value}%</span>
=======
                        <div className="relative z-10 w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dynamicRiskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={85}
                                        paddingAngle={10}
                                        dataKey="value"
                                        onClick={(data, index) => setShowRiskModal(dynamicRiskData[index])}
                                        className="cursor-pointer hover:opacity-80 transition-opacity outline-none focus:outline-none"
                                        stroke="none"
                                    >
                                        {dynamicRiskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 mt-1.5 w-full">
                        {dynamicRiskData.map((data) => (
                            <div key={data.name} className="flex items-center justify-between group p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                                    <span className="text-sm font-bold text-cura-text-soft">{data.name} Criticality</span>
                                </div>
                                <span className="text-sm font-black text-slate-800">{data.value}%</span>
>>>>>>> Stashed changes
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row - Appointments */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Today's Appointments</h3>
                        <p className="text-slate-500 font-semibold mt-1">Ready for consultation • {patients.filter(p => criticalityFilter === 'All' || p.risk === criticalityFilter).length} slots filtered</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar flex-1 md:flex-none">
                            {['All', 'High', 'Medium', 'Low'].map((cat) => (
                                <button 
                                    key={cat}
                                    onClick={() => setCriticalityFilter(cat)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap transition-all ${criticalityFilter === cat ? 'bg-cura-primary text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <Button variant="outline" className="h-12 px-5 hidden sm:flex shrink-0" onClick={() => setShowFullSchedule(true)}>Schedule <ArrowRight size={18} /></Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {patients.filter(p => criticalityFilter === 'All' || p.risk === criticalityFilter).length > 0 ? 
                     patients.filter(p => criticalityFilter === 'All' || p.risk === criticalityFilter).map((apt: any, i: number) => (
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
                                    <div className="w-14 h-14 rounded-2xl bg-cura-primary/10 flex items-center justify-center shadow-cura-soft border-2 border-white text-xl font-black text-cura-primary shrink-0">
                                        {apt.patientName?.charAt(0).toUpperCase() || 'P'}
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
                        <div className="col-span-full py-20 text-center cura-card bg-slate-50/50 border-dashed">
                            <p className="text-slate-400 font-bold">No patients found in {criticalityFilter} category.</p>
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
                                                <div className="w-14 h-14 rounded-2xl bg-cura-primary/10 flex items-center justify-center shadow-sm text-xl font-black text-cura-primary shrink-0">
                                                    {apt.patientName?.charAt(0).toUpperCase() || 'P'}
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
    const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [newTimeSlot, setNewTimeSlot] = useState<string | null>(null);
    const [aiSummary, setAiSummary] = useState<any>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [historyRecords, setHistoryRecords] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any>(null);

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
                        id: r._id || i,
                        ocrText: r.ocr_extracted_text || "No raw OCR text successfully extracted.",
                        summary: r.ai_analysis?.concise_summary || "No AI summary generated for this document.",
                        fileUrl: r.s3_file_url || null,
                        findings: r.ai_analysis?.detected_abnormalities || r.ai_analysis?.findings || [],
                        fullAnalysis: r.ai_analysis || null
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
        toast.success(`Appointment rescheduled to ${format(rescheduleDate, 'MMM dd, yyyy')} at ${newTimeSlot}`);
        setIsRescheduling(false);
        onClose();
    };

    // Calendar Helper Logic
    const today = startOfDay(new Date());
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

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
                className="w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden z-[101] flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh]"
            >
                {/* Left Personal Context Panel */}
<<<<<<< Updated upstream
                <div className="w-full md:w-80 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden shadow-cura-float border-4 border-white mx-auto mb-4 md:mb-6 shrink-0">
                        <img src={patient.avatar} alt="Patient" className="w-full h-full object-cover" />
=======
                <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
                    <div className="w-32 h-32 rounded-[2rem] bg-cura-primary/10 flex items-center justify-center shadow-cura-float border-4 border-white mx-auto mb-6 text-4xl font-black text-cura-primary">
                        {patient.patientName?.charAt(0).toUpperCase() || 'P'}
>>>>>>> Stashed changes
                    </div>
                    
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-1">{patient.patientName}</h2>
                        <div className="flex items-center justify-center gap-3 text-xs md:text-sm font-bold text-cura-text-soft uppercase tracking-wider">
                            <span>{patient.age} Yrs</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            <span>{patient.gender}</span>
                        </div>
                    </div>

<<<<<<< Updated upstream
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:space-y-4">
                        <div className="p-3 md:p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-center col-span-2 md:col-span-1">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-1">Health Score</h5>
                            <div className="text-2xl md:text-3xl font-black text-cura-primary">{patient.score || '--'}</div>
                        </div>
                        <div className="p-3 md:p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-1 md:mb-2">Blood</h5>
                            <p className="text-xs md:text-sm font-bold text-slate-700">{patient.vitals?.blood_group || 'N/A'}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mb-1 md:mb-2">Contact</h5>
                            <p className="text-[10px] md:text-sm font-bold text-slate-700 truncate">{patient.phone || 'N/A'}</p>
                        </div>
=======
                    <div className="space-y-4 py-6 border-y border-slate-100/50">
                         <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height</span>
                             <span className="font-bold text-slate-700">{patient.vitals?.height_cm ? `${patient.vitals.height_cm} cm` : '--'}</span>
                         </div>
                         <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</span>
                             <span className="font-bold text-slate-700">{patient.vitals?.weight_kg ? `${patient.vitals.weight_kg} kg` : '--'}</span>
                         </div>
                         <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Grp</span>
                             <span className="font-bold text-cura-primary">{patient.vitals?.blood_group || '--'}</span>
                         </div>
>>>>>>> Stashed changes
                    </div>

                    <div className="flex-1" />

                    <div className="mt-auto pt-8">
                        {!isRescheduling ? (
                            <Button variant="outline" className="w-full h-12 text-sm" onClick={() => setIsRescheduling(true)}>Reschedule Slot</Button>
                        ) : (
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest text-center">Select New Date & Time</h5>
                                
                                <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors"><ChevronRight className="rotate-180" size={18} /></button>
                                        <div className="font-black text-sm text-slate-800">{format(currentMonth, 'MMMM, yyyy')}</div>
                                        <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                            <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                                            <div key={`empty-${i}`} className="p-2" />
                                        ))}
                                        {daysInMonth.map(date => {
                                            const isPast = isBefore(startOfDay(date), today);
                                            const isSelected = isSameDay(date, rescheduleDate);
                                            return (
                                                <button
                                                    key={date.toISOString()}
                                                    disabled={isPast}
                                                    onClick={() => setRescheduleDate(date)}
                                                    className={`
                                                        p-2 text-xs font-bold rounded-lg flex items-center justify-center transition-all
                                                        ${isPast ? 'text-slate-300 cursor-not-allowed hidden md:flex' : 'hover:bg-cura-primary/10 text-slate-700'}
                                                        ${isSelected ? 'bg-cura-primary text-white hover:bg-cura-primary shadow-md shadow-teal-500/20' : ''}
                                                    `}
                                                >
                                                    {format(date, 'd')}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

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
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
                    {selectedReport ? (
                        <div className="absolute inset-0 bg-white z-10 flex flex-col p-10 animate-in fade-in zoom-in-95 duration-300">
                             <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{selectedReport.title}</h3>
                                    <p className="text-sm font-semibold text-cura-text-soft">{selectedReport.date} • Insight Score: {selectedReport.score}</p>
                                </div>
                                <button onClick={() => setSelectedReport(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-400"><X /></button>
                             </div>
                             
                             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                  <div className="bg-cura-primary/5 rounded-2xl p-6 border border-cura-primary/10">
                                      <h4 className="font-black text-cura-primary uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1.5"><TrendingUp size={14}/> Synthesized Context</h4>
                                      <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{selectedReport.summary}</p>
                                      {selectedReport.findings?.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                              {selectedReport.findings.map((f: string, idx: number) => (
                                                  <span key={idx} className="px-3 py-1 bg-white/60 border border-cura-primary/10 rounded-lg text-[11px] font-bold text-cura-primary">{f}</span>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                                  {selectedReport.fullAnalysis?.primary_clinical_concerns?.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-black text-rose-500 uppercase tracking-widest text-[10px] mb-2">Priority Clinical Concerns</h4>
                                        <div className="grid gap-3">
                                            {selectedReport.fullAnalysis.primary_clinical_concerns.map((c: any, i: number) => (
                                                <div key={i} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-bold text-slate-800 text-sm">{c.test_name}</h5>
                                                        <span className="bg-white px-2 py-0.5 rounded text-xs font-black text-rose-600 shadow-sm border border-rose-100">{c.result} {c.unit}</span>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-rose-600 mb-1">Ref: {c.reference_range}</p>
                                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{c.implication}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                  )}

                                  {selectedReport.fullAnalysis?.keyMetrics && Object.keys(selectedReport.fullAnalysis.keyMetrics).length > 0 && (
                                      <div>
                                          <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-3">Key Extracted Metrics</h4>
                                          <div className="grid grid-cols-3 gap-3">
                                              {Object.entries(selectedReport.fullAnalysis.keyMetrics).map(([k, v]) => (
                                                  <div key={k} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-center flex flex-col justify-center">
                                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{k}</span>
                                                      <span className="text-sm font-black text-slate-800">{v as React.ReactNode}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                                  
                                  {selectedReport.fullAnalysis?.patient_translation && (
                                      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                                          <h4 className="font-black text-emerald-600 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1.5">For The Patient</h4>
                                          <p className="text-sm font-medium text-emerald-900 leading-relaxed">{selectedReport.fullAnalysis.patient_translation}</p>
                                      </div>
                                  )}

                                  <div>
                                      <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-3">Logs & Extracted Raw Text (OCR)</h4>
                                      <div className="bg-[#fcfdfd] border-2 border-dashed border-slate-100 p-10 rounded-[2.5rem] shadow-inner relative overflow-hidden group">
                                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                              <FileText size={80} />
                                          </div>
                                          <div className="relative z-10">
                                              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100/50">
                                                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Clinical Transcript</span>
                                              </div>
                                              <p className="text-[13px] font-mono text-slate-600 whitespace-pre-wrap leading-[1.8] tracking-tight selection:bg-cura-primary/10">
                                                  {selectedReport.ocrText || "No raw text extracted for this record."}
                                              </p>
                                          </div>
                                          {/* Subtle paper decorative line */}
                                          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100/50" />
                                      </div>
                                  </div>

                                  {selectedReport.fileUrl && (
                                      <div className="pt-4">
                                          <a href={selectedReport.fileUrl} target="_blank" rel="noreferrer">
                                              <Button variant="outline" className="w-full text-xs h-12">Open Original Document Location</Button>
                                          </a>
                                      </div>
                                  )}
                             </div>
                        </div>
                    ) : (
                        <>
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
                        
<<<<<<< Updated upstream
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
=======
                        <p className="text-slate-700 font-medium leading-relaxed text-[15px]">
                            {patient.summary || "Patient shows symptoms of progressive physical exertion fatigue. Last laboratory analysis (Feb 20) indicated borderline high LDL and slightly elevated glucose. Genetic risk factors for Type 2 Diabetes are noted in lineage."}
                        </p>
>>>>>>> Stashed changes
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
                                    <button onClick={() => setSelectedReport(r)} className="text-[10px] font-black text-cura-primary h-7 px-3 rounded-lg border border-cura-primary/20 hover:bg-cura-primary hover:text-white transition-all">VIEW</button>
                                </div>
                            )) : (
                                <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400">No clinical reports synced yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                
                    <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-4">
<<<<<<< Updated upstream
                        <Button className="flex-1 h-14" onClick={() => navigate('/consultation', { state: { patient } })}>Start Consultation</Button>
=======
                        <Button 
                            className="flex-1 h-14" 
                            onClick={() => {
                                localStorage.setItem('selectedPatient', JSON.stringify(patient));
                                navigate('/consultation');
                            }}
                        >
                            Start Consultation
                        </Button>
>>>>>>> Stashed changes
                    </div>
                    </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
