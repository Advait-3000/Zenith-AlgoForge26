import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, AlertCircle } from 'lucide-react';
import { PatientDetailModal } from '../../dashboard/pages/DashboardPage';
import axios from 'axios';

export const PatientsPage: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
<<<<<<< Updated upstream
    const [patients, setPatients] = useState<any[]>(() => {
        const cached = sessionStorage.getItem('cura_patients_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('cura_patients_cache'));
    const [criticalityFilter, setCriticalityFilter] = useState('All');
=======
    const [patients, setPatients] = useState<any[]>([]);
>>>>>>> Stashed changes

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:3000/auth/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
<<<<<<< Updated upstream
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
=======
                const data = res.data;
                if (data.success && data.patients) {
                    const mapped = data.patients.map((p: any) => {
                        const birthYear = p.patient_details?.date_of_birth ? new Date(p.patient_details.date_of_birth).getFullYear() : null;
                        const age = birthYear ? new Date().getFullYear() - birthYear : "??";
                        const initial = p.full_name ? p.full_name.charAt(0).toUpperCase() : "P";
                        
                        return {
                            id: p._id,
                            patientName: p.full_name || 'Unknown Patient',
                            initial: initial,
                            age: age,
                            gender: p.patient_details?.gender || 'Unspecified',
                            height: p.patient_details?.height || 'N/A',
                            weight: p.patient_details?.weight || 'N/A',
                            bloodGroup: p.patient_details?.blood_group || 'N/A',
                            vitals: p.patient_details?.vitals || {},
                            summary: p.patient_details?.ai_summary || (p.patient_details?.disease_history?.[0]?.disease_name ? `History of ${p.patient_details.disease_history[0].disease_name}` : 'Registered via Cura Patient Portal.'),
                            risk: p.patient_details?.current_health_score < 40 ? 'High' : (p.patient_details?.current_health_score < 70 ? 'Medium' : 'Low'),
                            time: 'Registered Patient'
                        };
                    });
>>>>>>> Stashed changes
                    setPatients(mapped);
                    sessionStorage.setItem('cura_patients_cache', JSON.stringify(mapped));
                }
            } catch (error: any) {
                console.error("Failed to fetch patients", error);
                if (error.response?.status === 401) {
                    // Unauthorized - token might be expired
                }
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
                    <div className="relative group flex-1 md:w-80 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cura-text-soft transition-colors group-focus-within:text-cura-primary" size={20} />
                        <input
                            type="search"
                            placeholder="Search names..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 bg-white border border-slate-100 shadow-sm rounded-2xl pl-12 pr-6 text-sm font-bold focus:border-cura-primary outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="cura-card p-6 h-64 bg-slate-50 animate-pulse border-none" />
                    ))
                ) : filteredPatients.map((apt, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={apt.id}
                        onClick={() => setSelectedPatient(apt)}
                        className="cura-card p-6 cursor-pointer group hover:bg-white active:scale-98 flex flex-col h-full bg-white border border-slate-50 hover:border-cura-primary/20 hover:shadow-cura-soft transition-all"
                    >
                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-cura-primary/10 flex items-center justify-center shadow-sm shrink-0 border border-white text-2xl font-black text-cura-primary shadow-cura-soft">
                                {apt.initial}
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-800 group-hover:text-cura-primary transition-colors leading-tight tracking-tight">{apt.patientName}</h4>
                                <div className="text-[11px] font-black text-slate-400 mt-1.5 uppercase tracking-widest">{apt.age} YRS <span className="text-slate-300 mx-1">•</span> {apt.gender}</div>
                            </div>
                        </div>

                        <p className="text-[14px] font-medium text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-1">
                            {apt.summary}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${apt.risk === 'High' ? 'bg-red-50 text-red-600' : apt.risk === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-tight">{apt.risk}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-cura-text-soft font-black text-[11px] uppercase tracking-wider">
                                <Clock size={14} /> {apt.score}/100
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && filteredPatients.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">No patients found</h3>
                    <p className="text-slate-500 font-medium mt-2 text-sm">We couldn't find any patients matching "{searchTerm}"</p>
                </div>
            )}

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
