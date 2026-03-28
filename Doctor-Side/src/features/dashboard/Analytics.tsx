import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, TrendingUp, ShieldCheck } from 'lucide-react';

const StatPanel = ({ title, value, change, icon: Icon, colorClass, iconBgClass, iconColorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 blur-2xl rounded-full opacity-0 transition-opacity group-hover:opacity-10 ${colorClass}`}></div>
    <div className="flex items-center justify-between mb-5 relative z-10">
      <div className={`p-3 rounded-xl flex items-center justify-center ${iconBgClass} ${iconColorClass}`}>
        <Icon size={22} />
      </div>
      <div className={`px-2.5 py-1 rounded-md text-[12px] font-medium ${change > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
        {change > 0 ? '+' : ''}{change}% This Month
      </div>
    </div>
    <div>
      <p className="text-[14px] text-[#717171] mb-1">{title}</p>
      <p className="text-[28px] font-bold text-[#212121] leading-tight">{value}</p>
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const weeklyData = [
    { name: 'Mon', patients: 20 },
    { name: 'Tue', patients: 35 },
    { name: 'Wed', patients: 25 },
    { name: 'Thu', patients: 45 },
    { name: 'Fri', patients: 55 },
    { name: 'Sat', patients: 15 },
    { name: 'Sun', patients: 10 },
  ];

  const riskData = [
    { name: 'High', value: 120, color: '#FF7070' },
    { name: 'Medium', value: 340, color: '#f59e0b' },
    { name: 'Low', value: 524, color: '#306F6F' },
  ];

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[28px] font-bold text-[#212121] tracking-tight">Clinical Intelligence</h2>
          <p className="text-[14px] text-[#717171] mt-1">Real-time diagnostics and patient insights</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[0.75rem] border border-slate-200">
           <button className="px-5 py-2.5 bg-[#306F6F] text-white rounded-md text-[14px] font-medium hover:bg-opacity-90 transition-opacity">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatPanel title="Annual Unique Patients" value="2,482" change={18.2} icon={Users} colorClass="bg-[#306F6F]" iconBgClass="bg-[#F7FEFE]" iconColorClass="text-[#306F6F]" />
        <StatPanel title="Clinical Efficiency" value="94.2%" change={5.4} icon={Activity} colorClass="bg-sky-500" iconBgClass="bg-sky-50" iconColorClass="text-sky-600" />
        <StatPanel title="Critical Interventions" value="128" change={-12.5} icon={Activity} colorClass="bg-[#FF7070]" iconBgClass="bg-red-50" iconColorClass="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[18px] font-bold text-[#212121]">Patient Flow Patterns</h3>
              <div className="flex items-center gap-2 text-[13px] text-[#717171] font-medium">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#306F6F]"></div> Patients Managed
              </div>
           </div>
           <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weeklyData}>
                    <defs>
                       <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#306F6F" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#306F6F" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#717171'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#717171'}} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '12px' }}
                    />
                    <Area type="monotone" dataKey="patients" stroke="#306F6F" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
           <h3 className="text-[18px] font-bold text-[#212121] mb-8 self-start">Case Risk Proportions</h3>
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={riskData}
                       innerRadius={70}
                       outerRadius={95}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                    >
                       {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                 <p className="text-[28px] font-bold text-[#212121] leading-tight">984</p>
                 <p className="text-[12px] text-[#717171]">Total Cases</p>
              </div>
           </div>
           <div className="w-full space-y-3 mt-6">
              {riskData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                       <p className="text-[13px] font-medium text-[#717171]">{item.name} Protocol</p>
                    </div>
                    <p className="font-semibold text-[#212121] text-[14px]">{item.value}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-[#212121] p-10 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#306F6F]/30 rounded-full blur-[80px]"></div>
         <div className="flex-1 space-y-5 relative z-10">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/10 rounded-md w-fit">
               <ShieldCheck size={16} className="text-[#306F6F]" />
               <p className="text-[12px] font-medium text-white/80">Quantum Health Analysis Active</p>
            </div>
            <h2 className="text-[32px] font-bold leading-tight">AI Diagnostics Accuracy</h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl">
               Zenith AI is currently operating at <span className="text-white font-semibold">99.4% precision</span>. Your clinical oversight is critical for the remaining 0.6% edge-case validation.
            </p>
            <div className="flex items-center gap-8 mt-6">
               <div>
                  <p className="text-[28px] font-bold leading-tight">1,240</p>
                  <p className="text-[12px] text-white/50 mt-1">Reports Validated</p>
               </div>
               <div className="w-px h-10 bg-white/10"></div>
               <div>
                  <p className="text-[28px] font-bold leading-tight">0.12s</p>
                  <p className="text-[12px] text-white/50 mt-1">Avg Latency</p>
               </div>
            </div>
         </div>
         <div className="p-8 bg-white/5 rounded-2xl border border-white/10 w-72 shrink-0 relative z-10 text-center space-y-5">
            <div className="w-16 h-16 bg-[#306F6F]/20 rounded-xl flex items-center justify-center mx-auto text-[#306F6F]">
               <TrendingUp size={32} />
            </div>
            <div>
               <p className="text-[12px] text-white/50 mb-1">Efficiency Peak</p>
               <h3 className="text-[20px] font-bold">All Labs Verified</h3>
            </div>
            <button className="w-full py-3 bg-white text-[#212121] rounded-lg font-medium text-[14px] hover:bg-opacity-90 transition-opacity">
               System Audit Log
            </button>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
