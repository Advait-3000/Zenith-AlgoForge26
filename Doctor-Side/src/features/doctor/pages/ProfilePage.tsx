import React, { useState, useRef, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Edit, 
  CheckCircle2, 
  Calendar,
  Zap,
  Phone,
  MoreVertical,
  Mail,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/BaseComponents';
import axios from 'axios';

export const ProfilePage: React.FC = () => {
    const [isEditingSlots, setIsEditingSlots] = useState(false);
    const [slots, setSlots] = useState<Record<string, string>>({
        Mon: '9 AM - 5 PM',
        Tue: '9 AM - 5 PM',
        Wed: '9 AM - 5 PM',
        Thu: '9 AM - 5 PM',
        Fri: '9 AM - 5 PM'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [credentials, setCredentials] = useState([
        { id: 1, title: 'MBBS Certificate', status: 'Verified • 2008', icon: Award },
        { id: 2, title: 'Board Certification', status: 'Renewal Due 2028', icon: ShieldCheck }
    ]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('medical_document', file);

            try {
                const token = localStorage.getItem('token');
                const res = await axios.post('http://localhost:3000/ocr/upload-scan', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (res.data.success) {
                    setCredentials(prev => [...prev, {
                        id: Date.now(),
                        title: file.name.replace(/\.[^/.]+$/, "").substring(0, 20) + (file.name.length > 20 ? '...' : ''),
                        status: 'Verified • OCR Analyzed',
                        icon: ShieldCheck
                    }]);
                }
            } catch (error) {
                console.error("OCR Upload failed", error);
            }
            e.target.value = '';
            toast.success('Credential uploaded successfully');
        }
    };

    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [basicInfo, setBasicInfo] = useState(() => {
        const savedUserStr = localStorage.getItem('user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
        
        return {
            name: savedUser?.full_name || 'Dr. Julian Ross',
            specialization: savedUser?.doctor_details?.specialization || 'Chief Cardiologist',
            email: savedUser?.email || 'julian.ross@cura.com',
<<<<<<< Updated upstream
            phone: '+91 989 0922 411',
            location: 'New Delhi, India',
            hospital: 'St. Maria Medical Center',
            license: 'DL-MD-90123-922',
            fee: '₹1000 / Session',
=======
            phone: savedUser?.phone_number || '+91 9922222222',
            location: savedUser?.location_coordinates?.coordinates?.[0] ? 'New York, USA' : 'New York, USA',
            workplace_name: savedUser?.doctor_details?.workplace_name || 'St. Maria Medical Center',
            registration_number: savedUser?.doctor_details?.verification?.registration_number || 'NY-MD-90123-922',
            fee: '$180 / Session',
>>>>>>> Stashed changes
            language: 'English (Native)'
        };
    });

    useEffect(() => {
        const fetchProfile = async () => {
             const token = localStorage.getItem('token');
             if(!token) return;
             try {
                 const res = await axios.get('http://localhost:3000/auth/me', {
                     headers: { 'Authorization': `Bearer ${token}` }
                 });
                 if(res.data.success && res.data.user) {
                     const u = res.data.user;
                     setBasicInfo(prev => ({
                         ...prev,
                         name: u.full_name || prev.name,
                         email: u.email || prev.email,
                         title: u.role === 'Doctor' ? 'Chief Cardiologist' : u.role || prev.title,
                     }));
                 }
             } catch(err) {
                 console.error("Failed to fetch profile", err);
             }
        };
        fetchProfile();
    }, []);

    const handleSlotChange = (day: string, value: string) => {
        setSlots(prev => ({ ...prev, [day]: value }));
    };

    const handleBasicChange = (field: string, value: string) => {
        setBasicInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveBasicInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                full_name: basicInfo.name,
                phone_number: basicInfo.phone,
                doctor_details: {
                    specialization: basicInfo.specialization,
                    workplace_name: basicInfo.workplace_name,
                    verification: {
                        registration_number: basicInfo.registration_number
                    }
                }
            };

            const res = await axios.put('http://localhost:3000/auth/updateProfile', 
                updateData,
                {
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );
<<<<<<< Updated upstream
            setIsEditingBasic(false);
            toast.success('Basic info updated successfully');
=======

            if (res.data.success) {
                const savedUserStr = localStorage.getItem('user');
                if (savedUserStr) {
                    const savedUser = JSON.parse(savedUserStr);
                    const updatedUser = { ...savedUser, ...res.data.user };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                setIsEditingBasic(false);
            }
>>>>>>> Stashed changes
        } catch (error) {
            console.error("Failed to update profile", error);
            setIsEditingBasic(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Professional Profile</h2>
                    <p className="text-slate-500 font-semibold mt-1">Manage your medical license and practice details</p>
                </div>
                {isEditingBasic ? (
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-12 px-6 shadow-cura-soft" onClick={() => setIsEditingBasic(false)}>Cancel</Button>
                        <Button className="h-12 px-6 shadow-cura-soft" onClick={handleSaveBasicInfo}>Save Changes</Button>
                    </div>
                ) : (
                    <Button className="h-12 px-6 shadow-cura-soft" onClick={() => setIsEditingBasic(true)}>
                        <Edit size={18} /> Edit Basic Info
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className="cura-card p-10 flex flex-col items-center">
                        <div className="w-32 h-32 bg-cura-primary/10 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-cura-soft mb-8 text-4xl font-black text-cura-primary">
                            {basicInfo.name.charAt(0).toUpperCase()}
                        </div>
                        {isEditingBasic ? (
                            <div className="w-full space-y-3">
                                <input value={basicInfo.name} onChange={e => handleBasicChange('name', e.target.value)} className="w-full text-center text-xl font-black text-slate-800 border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" />
                                <input value={basicInfo.specialization} onChange={e => handleBasicChange('specialization', e.target.value)} className="w-full text-center text-cura-primary font-black text-xs uppercase tracking-widest border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" />
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-slate-800 leading-tight">{basicInfo.name}</h3>
                                <p className="text-cura-primary font-black text-sm uppercase tracking-widest mt-1.5">{basicInfo.specialization}</p>
                            </>
                        )}
                        
                        <div className="flex items-center gap-2 mt-5 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100/50 self-center">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Practitioner</span>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-50 w-full mt-8">
                            {[
                                { icon: Mail, value: basicInfo.email, field: 'email', disabled: true },
                                { icon: Phone, value: basicInfo.phone, field: 'phone', isPhone: true },
                                { icon: MapPin, value: basicInfo.location, field: 'location' }
                            ].map((item: any, idx) => (
                                <div key={idx} className="flex items-start gap-4 text-slate-600 font-bold">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100/50 mt-1">
                                        <item.icon size={18} />
                                    </div>
                                    {isEditingBasic ? (
                                        item.isPhone ? (
                                            <div className="flex-1 flex items-center gap-0 border-b border-slate-200 focus-within:border-cura-primary transition-colors">
                                                <select 
                                                    className="bg-transparent text-sm font-bold text-slate-600 outline-none pr-1 cursor-pointer"
                                                    value={item.value.startsWith('+91') ? '+91' : item.value.startsWith('+1') ? '+1' : '+91'}
                                                    onChange={(e) => {
                                                        const code = e.target.value;
                                                        const number = item.value.replace(/^\+\d+\s?/, '');
                                                        handleBasicChange(item.field, `${code} ${number}`);
                                                    }}
                                                >
                                                    <option value="+91">+91</option>
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                </select>
                                                <input 
                                                    value={item.value.replace(/^\+\d+\s?/, '')} 
                                                    onChange={e => {
                                                        const code = item.value.match(/^\+\d+/)?.[0] || '+91';
                                                        handleBasicChange(item.field, `${code} ${e.target.value.trim()}`);
                                                    }}
                                                    className="flex-1 text-sm bg-transparent outline-none py-1 transition-colors font-medium ml-2" 
                                                />
                                            </div>
                                        ) : (
                                            <input 
                                                value={item.value} 
                                                onChange={e => handleBasicChange(item.field, e.target.value)} 
                                                disabled={item.disabled}
                                                className={`flex-1 text-sm border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors font-medium ${item.disabled ? 'bg-slate-50 opacity-50' : ''}`} 
                                            />
                                        )
                                    ) : (
                                        <span className="text-sm truncate pt-2">{item.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cura-card p-8 bg-sky-50 border-sky-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={60} fill="#0EA5E9" /></div>
                        <h4 className="font-black text-sky-600 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={16} /> Key Achievements
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm font-bold text-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                15+ Yrs Cardiology Exp.
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                3,400+ Successful Consults
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="cura-card p-10">
                        <h4 className="font-black text-slate-800 text-lg tracking-tight mb-8">Clinical Practice</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { label: 'Hospital Affiliate', value: basicInfo.workplace_name, field: 'workplace_name' },
                                { label: 'Medical License ID', value: basicInfo.registration_number, field: 'registration_number' },
                                { label: 'Default Consultation Fee', value: basicInfo.fee, field: 'fee' },
                                { label: 'Primary Language', value: basicInfo.language, field: 'language' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2 group">
                                    <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest group-hover:text-cura-primary transition-colors">{item.label}</p>
                                    {isEditingBasic ? (
                                        <input 
                                            value={item.value} 
                                            onChange={e => handleBasicChange(item.field, e.target.value)} 
                                            className="w-full text-base font-bold text-slate-800 border-b border-slate-200 py-1 outline-none focus:border-cura-primary transition-colors" 
                                        />
                                    ) : (
                                        <p className="text-base font-bold text-slate-700">{item.value}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cura-card p-10 overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-slate-800 text-lg tracking-tight">Verified Credentials</h4>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-cura-primary font-black text-xs hover:bg-cura-primary/5 px-4 py-2 rounded-xl border border-cura-primary/10 transition-all cursor-pointer"
                            >
                                UPLOAD NEW
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept=".pdf,.png,.jpg,.jpeg"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {credentials.map(cred => (
                                <div key={cred.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group/item hover:border-cura-primary/30 transition-all cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-cura-primary shrink-0 transition-transform group-hover/item:scale-110">
                                        <cred.icon size={24} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h5 className="font-bold text-slate-800 truncate">{cred.title}</h5>
                                        <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mt-0.5 truncate">{cred.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cura-card p-10 group bg-white border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-cura-primary/10 rounded-xl flex items-center justify-center"><Calendar className="text-cura-primary" size={20} /></div>
                                <h4 className="font-black text-slate-800 text-lg tracking-tight">Practice Availability</h4>
                            </div>
                            <button className="w-10 h-10 hover:bg-slate-50 text-slate-400 rounded-full transition-all flex items-center justify-center"><MoreVertical size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                <div key={day} className={`p-4 rounded-[1.5rem] transition-all cursor-pointer text-center group/day ${isEditingSlots ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-50 border border-slate-100 hover:border-cura-primary/30 hover:bg-white hover:shadow-cura-soft'}`}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/day:text-cura-primary">{day}</p>
                                    {isEditingSlots ? (
                                        <input 
                                            type="text" 
                                            value={slots[day]} 
                                            onChange={(e) => handleSlotChange(day, e.target.value)}
                                            className="w-full bg-slate-50/50 text-center text-xs font-bold text-slate-800 py-1.5 px-0.5 rounded-lg border border-slate-200 focus:bg-white focus:border-cura-primary focus:ring-2 focus:ring-cura-primary/20 outline-none transition-all"
                                        />
                                    ) : (
                                        <p className="text-xs font-bold text-slate-800">{slots[day]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Timezone: Asia/Kolkata (IST)</p>
                            {isEditingSlots ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-10 text-xs px-4" onClick={() => setIsEditingSlots(false)}>Cancel</Button>
                                    <Button className="h-10 text-xs px-4" onClick={() => { setIsEditingSlots(false); toast.success('Practice slots updated successfully'); }}>Save Changes</Button>
                                </div>
                            ) : (
                                <Button variant="outline" className="h-10 text-xs px-4" onClick={() => setIsEditingSlots(true)}>Update Slots</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
