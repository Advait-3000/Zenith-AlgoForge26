import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, updateProfileStatus, loginSuccess, useAppSelector } from '../../store';
import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const { user, hasProfile } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    hospital: user?.hospital || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      dispatch(updateProfileStatus(true));
      dispatch(loginSuccess({ ...user, ...formData }));
      setSaving(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      <div className="flex items-center gap-4 mb-8">
        {hasProfile && (
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200">
            <ArrowLeft size={20} color="#212121" />
          </button>
        )}
        <div>
          <h1 className="text-[28px] font-bold text-[#212121] tracking-tight">
            {hasProfile ? 'Edit Profile' : 'Profile Setup'}
          </h1>
          <p className="text-[14px] text-[#717171] mt-1">
            {hasProfile ? 'Keep your clinical information up to date' : 'Complete your registration to access the dashboard'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#212121] block">Medical Specialization</label>
            <select
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[0.75rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[16px] text-[#212121]"
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#212121] block">Clinical Experience (Years)</label>
            <input
              type="number"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g. 10"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[0.75rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#212121] block">Current Hospital / Clinic</label>
            <input
              type="text"
              required
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              placeholder="Cura General Hospital"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[0.75rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[16px] text-[#212121] placeholder:text-[#A0A0A0]"
            />
          </div>

          <div className="md:col-span-2 space-y-4 pt-4">
            <label className="text-[14px] font-medium text-[#212121] block">Medical License / Certificate</label>
            <div
              className={`border-[1.5px] border-dashed rounded-[0.75rem] p-10 flex flex-col items-center justify-center transition-all ${
                file ? 'border-[#306F6F] bg-[#F7FEFE]' : 'border-slate-300 bg-slate-50 relative'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <CheckCircle size={32} color="#306F6F" className="mb-3" />
                  <p className="text-[16px] font-semibold text-[#212121]">{file.name}</p>
                  <p className="text-[14px] text-[#717171] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={() => setFile(null)} className="mt-4 text-[14px] font-semibold text-[#FF7070]">Remove Document</button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <Upload size={24} color="#A0A0A0" />
                  </div>
                  <p className="text-[16px] font-semibold text-[#212121]">Drag & Drop Certification</p>
                  <p className="text-[14px] text-[#717171] mt-1">Supported formats: PDF, PNG, JPG (Max: 10MB)</p>
                  
                  <label className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-[#212121] text-[14px] font-medium rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                    Browse Files
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-8">
            <button
              type="submit"
              disabled={saving || (!file && !hasProfile)}
              className={`px-8 py-4 rounded-[0.75rem] font-semibold text-[16px] transition-all flex items-center justify-center min-w-[200px] ${
                (saving || (!file && !hasProfile)) ? 'bg-[#A0A0A0] text-white cursor-not-allowed' : 'bg-[#306F6F] text-white hover:opacity-90'
              }`}
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                hasProfile ? 'Save Changes' : 'Initialize Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
