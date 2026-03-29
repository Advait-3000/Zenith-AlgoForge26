import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, AlertCircle } from 'lucide-react';
import { PatientDetailModal } from '../../dashboard/pages/DashboardPage';
import { APPOINTMENTS } from '../../../data/mockPatients';
import axios from 'axios';

export const PatientsPage: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<any[]>(APPOINTMENTS);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:3000/auth/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = res.data;
                if (data.success && data.patients && data.patients.length > 0) {
                    const mapped = data.patients.map((p: any) => ({
                        id: p._id,
                        patientName: p.full_name || 'Unknown Patient',
                        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Generic default avatar
                        // calculate age roughly if birthday exists
                        age: p.patient_details?.date_of_birth ? new Date().getFullYear() - new Date(p.patient_details.date_of_birth).getFullYear() : 35,
                        gender: p.patient_details?.gender || 'Unspecified',
                        summary: 'Registered via Cura Patient Portal.',
                        risk: p.patient_details?.current_health_score < 50 ? 'High' : (p.patient_details?.current_health_score < 75 ? 'Medium' : 'Low'),
                        time: 'Registered Patient'
                    }));
                    setPatients(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch patients", error);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => p.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Patient Directory</h2>
                    <p className="text-slate-500 font-semibold mt-1">Manage and view all {patients.length} patient profiles.</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cura-text-soft transition-colors group-focus-within:text-cura-primary" size={20} />
                        <input 
                            type="search" 
                            placeholder="Search patients by name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 bg-white border outline-none border-slate-100 shadow-sm rounded-2xl pl-12 pr-6 text-sm font-bold focus:border-cura-primary transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPatients.map((apt, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={apt.id}
                        onClick={() => setSelectedPatient(apt)}
                        className="cura-card p-6 cursor-pointer group hover:bg-white active:scale-98 flex flex-col h-full bg-white border border-slate-50 hover:border-cura-primary/20 hover:shadow-cura-soft transition-all"
                    >
                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden shadow-sm shrink-0 border border-slate-100 p-0.5 bg-white">
                                <img src={apt.avatar} alt={apt.patientName} className="w-full h-full object-cover rounded-2xl" />
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
                                <Clock size={14} /> {apt.time}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredPatients.length === 0 && (
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
