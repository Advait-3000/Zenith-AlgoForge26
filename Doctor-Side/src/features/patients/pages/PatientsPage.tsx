import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, User, TrendingUp } from 'lucide-react';
import { PatientDetailModal } from '../../dashboard/pages/DashboardPage';
import axios from 'axios';

interface Patient {
    id: string;
    patientName: string;
    avatar: string;
    age: number;
    gender: string;
    vitals: any;
    summary: string;
    risk: 'Low' | 'Medium' | 'High';
    score: number;
    time: string;
    phone: string;
}

export const PatientsPage: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>(() => {
        const cached = sessionStorage.getItem('cura_patients_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('cura_patients_cache'));
    const [criticalityFilter, setCriticalityFilter] = useState('All');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:3000/auth/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.data.success && res.data.patients) {
                    const mapped = res.data.patients.map((p: any) => ({
                        id: p._id,
                        patientName: p.full_name || 'Unknown Patient',
                        avatar: p.full_name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name)}&background=0D9488&color=fff&bold=true` : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                        age: p.patient_details?.date_of_birth ? new Date().getFullYear() - new Date(p.patient_details.date_of_birth).getFullYear() : (p.age || 35),
                        gender: p.patient_details?.gender || p.gender || 'Unspecified',
                        vitals: p.patient_details?.vitals || {},
                        summary: p.patient_details?.disease_history?.length > 0 
                            ? `History of ${p.patient_details.disease_history[0].disease_name}.`
                            : 'Patient record active on Cura Network.',
                        risk: (p.patient_details?.current_health_score ?? 85) < 40 ? 'High' : ((p.patient_details?.current_health_score ?? 85) < 75 ? 'Medium' : 'Low'),
                        score: p.patient_details?.current_health_score ?? 85,
                        time: 'Active Profile',
                        phone: p.phone_number || p.contact_number || 'N/A'
                    }));
                    setPatients(mapped);
                    sessionStorage.setItem('cura_patients_cache', JSON.stringify(mapped));
                }
            } catch (error: any) {
                console.error("Failed to fetch patients", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = criticalityFilter === 'All' || p.risk === criticalityFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Patient Directory</h2>
                    <p className="text-slate-500 font-semibold mt-1">Manage and view all {patients.length} patient profiles.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
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

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cura-primary/20 transition-all placeholder:text-slate-300 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading && patients.length === 0 ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="cura-card p-6 border-dashed animate-pulse">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl mb-4" />
                            <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2" />
                            <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                        </div>
                    ))
                ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={patient.id} 
                            onClick={() => setSelectedPatient(patient)}
                            className="cura-card p-6 cursor-pointer group hover:bg-white active:scale-98 transition-all relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-5 transition-opacity group-hover:opacity-10 ${patient.risk === 'High' ? 'bg-red-500' : patient.risk === 'Medium' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                            
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-cura-soft border-2 border-white">
                                    <img src={patient.avatar} alt={patient.patientName} className="w-full h-full object-cover" />
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${patient.risk === 'High' ? 'bg-red-50 text-red-600' : patient.risk === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                    {patient.risk}
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h4 className="text-lg font-black text-slate-800 group-hover:text-cura-primary transition-colors truncate">{patient.patientName}</h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-cura-text-soft">
                                    <span>{patient.age} Yrs</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span>{patient.gender}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-50 mb-6 group-hover:bg-white transition-colors">
                                <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">
                                    {patient.summary}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-5 border-t border-slate-50/50">
                                <div className="flex items-center gap-1.5 text-cura-text-soft font-black text-[10px] uppercase tracking-wider">
                                    <TrendingUp size={14} className="text-cura-primary" /> Score: {patient.score}
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cura-primary group-hover:text-white transition-all shadow-sm">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center cura-card border-dashed bg-slate-50/50">
                         <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <User className="text-slate-300" size={40} />
                         </div>
                         <h3 className="text-xl font-black text-slate-800 mb-2">No patients matching filters</h3>
                         <p className="text-slate-400 font-bold max-w-sm mx-auto">Try adjusting your search criteria or criticality filter to find patients.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedPatient && (
                    <PatientDetailModal 
                        patient={selectedPatient as any} 
                        onClose={() => setSelectedPatient(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
