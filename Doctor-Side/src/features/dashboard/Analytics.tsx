import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, TrendingUp, ShieldCheck } from 'lucide-react';

const StatPanel = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-[3rem] card-shadow border border-slate-50 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10 transition-opacity group-hover:opacity-30 ${color}`}></div>
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className={`p-4 rounded-[1.5rem] shadow-sm flex items-center justify-center ${color.replace('bg-', 'bg-').replace('-500', '-100')} ${color.replace('bg-', 'text-')}`}>
        <Icon size={24} />
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {change > 0 ? '+' : ''}{change}% This Month
      </div>
    </div>
    <div>
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">{title}</p>
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
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
    { name: 'High', value: 120, color: '#f43f5e' },
    { name: 'Medium', value: 340, color: '#f59e0b' },
    { name: 'Low', value: 524, color: '#10b981' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Clinical Intelligence Center</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Real-time diagnostics and patient population insights</p>
        </div>
        <div className="flex bg-white p-2 rounded-[2rem] card-shadow border border-slate-50">
           <button className="px-6 py-3 bg-slate-800 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatPanel title="Annual Unique Patients" value="2,482" change={18.2} icon={Users} color="bg-primary-500" />
        <StatPanel title="Clinical Efficiency Index" value="94.2%" change={5.4} icon={Activity} color="bg-secondary-500" />
        <StatPanel title="Critical AI Interventions" value="128" change={-12.5} icon={Activity} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] card-shadow border border-slate-50 relative group">
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-10 flex items-center justify-between">
              Patient Flow Patterns
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary-500"></div> Patients Managed
              </span>
           </h3>
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weeklyData}>
                    <defs>
                       <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontStyle: 'bold', fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontStyle: 'bold', fill: '#94a3b8'}} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                    />
                    <Area type="monotone" dataKey="patients" stroke="#0d9488" strokeWidth={5} fillOpacity={1} fill="url(#colorPatients)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] card-shadow border border-slate-50 flex flex-col items-center">
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-10 self-start">Case Risk Proportions</h3>
           <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={riskData}
                       innerRadius={80}
                       outerRadius={110}
                       paddingAngle={10}
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <p className="text-3xl font-black text-slate-800 tracking-tight">984</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Total Cases</p>
              </div>
           </div>
           <div className="w-full space-y-4 mt-6">
              {riskData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                       <p className="text-xs font-black uppercase tracking-widest text-slate-600">{item.name} Protocol</p>
                    </div>
                    <p className="font-black text-slate-800 text-sm">{item.value}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-slate-800 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-3xl">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/20 rounded-full blur-[100px]"></div>
         <div className="flex-1 space-y-6 relative z-10">
            <div className="flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit">
               <ShieldCheck size={18} className="text-emerald-400" />
               <p className="text-[10px] font-black uppercase tracking-widest">Quantum Health Analysis Active</p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-none uppercase">AI Diagnostics Accuracy</h2>
            <p className="text-slate-300 font-bold text-lg leading-relaxed max-w-2xl">
               Zenith AI is currently operating at <span className="text-primary-400">99.4% precision</span>. Your clinical oversight is critical for the remaining 0.6% edge-case validation.
            </p>
            <div className="flex items-center gap-8 mt-10">
               <div>
                  <p className="text-4xl font-black tracking-tighter">1,240</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 uppercase">Reports Validated</p>
               </div>
               <div className="w-px h-12 bg-white/20"></div>
               <div>
                  <p className="text-4xl font-black tracking-tighter">0.12s</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 uppercase">Avg Latency</p>
               </div>
            </div>
         </div>
         <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shrink-0 w-80 relative z-10 shadow-inner group hover:scale-105 transition-transform duration-500">
            <div className="text-center space-y-6">
               <div className="w-20 h-20 bg-primary-500/20 rounded-[2rem] flex items-center justify-center mx-auto text-primary-400 group-hover:rotate-12 transition-transform">
                  <TrendingUp size={48} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Efficiency Peak</p>
               <h3 className="text-3xl font-black">All Labs Verified</h3>
               <button className="w-full py-4 bg-white text-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-400 hover:text-white transition-colors">
                  System Audit Log
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
