import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Building, Calendar, Upload, CheckCircle, Clock, Save, ArrowLeft } from 'lucide-react';
import { useAppDispatch, updateProfileStatus, loginSuccess, useAppSelector } from '../../store';

const InputWrapper = ({ icon: Icon, label, children }: any) => (
  <div className="space-y-3">
    <label className="text-[13px] font-black text-slate-800 flex items-center gap-3 tracking-tight uppercase">
      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-primary-500 border border-slate-100">
        <Icon size={16} />
      </div>
      {label}
    </label>
    {children}
  </div>
);

const ProfileSetup: React.FC = () => {
  const { user, hasProfile } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    hospital: user?.hospital || '',
    availability: user?.availability || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      dispatch(updateProfileStatus(true));
      dispatch(loginSuccess({ ...user, ...formData }));
      setSaving(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            {hasProfile && (
              <button 
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-xl transition-all"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
                {hasProfile ? 'Edit Profile' : 'Profile Setup'}
              </h1>
              <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">
                {hasProfile ? 'Keep your clinical information up to date' : 'Complete your registration to access the Cura console'}
              </p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] p-12 border border-slate-50 shadow-sm relative overflow-hidden">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <InputWrapper icon={Stethoscope} label="Medical Specialization">
            <select
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </InputWrapper>

          <InputWrapper icon={Clock} label="Clinical Experience (Years)">
            <input
              type="number"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g. 10"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-bold text-slate-700"
            />
          </InputWrapper>

          <InputWrapper icon={Building} label="Current Hospital / Clinic">
            <input
              type="text"
              required
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              placeholder="Cura General Hospital"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-bold text-slate-700"
            />
          </InputWrapper>

          <InputWrapper icon={Calendar} label="Operating Hours">
            <input
              type="text"
              required
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g. 09:00 AM - 05:00 PM"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-bold text-slate-700"
            />
          </InputWrapper>

          <div className="md:col-span-2 space-y-4">
            <label className="text-[13px] font-black text-slate-800 flex items-center gap-3 tracking-tight uppercase">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-primary-500 border border-slate-100">
                <Upload size={16} />
              </div>
              Medical License / Achievement Certificate
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all duration-500 ${
                file ? 'border-primary-500 bg-primary-50/10 shadow-inner' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-200'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-primary-200 rotate-6 group-hover:rotate-0 transition-transform">
                    <CheckCircle size={40} />
                  </div>
                  <p className="text-xl font-black text-slate-800 tracking-tighter uppercase">{file.name}</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">{(file.size / 1024 / 1024).toFixed(2)} MB • File Securely Loaded</p>
                  <button type="button" onClick={() => setFile(null)} className="mt-8 px-8 py-3 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase text-rose-500 hover:bg-rose-50 transition-colors tracking-widest">Update Document</button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                    <Upload size={32} />
                  </div>
                  <p className="font-black text-slate-800 text-lg uppercase tracking-tighter">Drag & drop certification</p>
                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Supported formats: PDF, PNG, JPG (Size max: 10MB)</p>
                  <label className="mt-10 px-10 py-4 bg-white border border-slate-100 text-slate-800 font-black uppercase tracking-widest text-[11px] rounded-xl shadow-sm hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer inline-block active:scale-95">
                    Browse Clinical Files
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-6 border-t border-slate-50">
            <button
              type="submit"
              disabled={saving || (!file && !hasProfile)}
              className={`px-12 py-5 bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-700/20 hover:bg-emerald-800 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-4 ${
                (saving || (!file && !hasProfile)) ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} />
                  {hasProfile ? 'Save Changes' : 'Initialize Cura Account'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
