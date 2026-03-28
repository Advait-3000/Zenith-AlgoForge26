import React from 'react';
import { Users, Stethoscope, Bed, Heart, ChevronDown, Download, Search, Filter, MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'Jan', visit: 4000 },
  { name: 'Feb', visit: 3000 },
  { name: 'Mar', visit: 5000 },
  { name: 'Apr', visit: 4500 },
  { name: 'Mei', visit: 6000 },
  { name: 'Jun', visit: 4800 },
  { name: 'Jul', visit: 8000 },
  { name: 'Aug', visit: 5500 },
  { name: 'Sep', visit: 6500 },
  { name: 'Oct', visit: 6000 },
  { name: 'Nov', visit: 5000 },
  { name: 'Des', visit: 4000 },
];

const pieData = [
  { name: 'Paid', value: 27.4, color: '#10b981' },
  { name: 'Overdue', value: 38.6, color: '#0ea5e9' },
  { name: 'Unpaid', value: 34.0, color: '#f1f5f9' },
];

const patientList = [
  { no: '01', id: '#FUP121312424', name: 'Isagi Yoichi', age: 20, date: '25 Dec 2023', time: '08:30 pm', type: 'FUP+ECG', status: 'Success' },
  { no: '02', id: '#ECG131312424', name: 'Leonardo Decaprio', age: 36, date: '25 Dec 2023', time: '08:30 pm', type: 'ECG', status: 'Pending' },
  { no: '03', id: '#FUPECG312424', name: 'Kaiser Brown', age: 20, date: '25 Dec 2023', time: '08:30 pm', type: 'FUP', status: 'Progress' },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-10 py-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Overview</h1>
          <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">there is the latest update for the last 7 days. check now</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold text-slate-800 hover:bg-slate-50 transition-colors">
              <span>Week</span>
              <ChevronDown size={18} />
           </button>
           <button className="flex items-center gap-3 px-6 py-3 bg-emerald-700 text-white rounded-xl text-[13px] font-black tracking-widest uppercase hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-50 active:scale-95">
              <Download size={18} />
              <span>Export</span>
           </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard title="Total Patient" value="5,715" change="-0.10% Since last week" symbol={<Users size={20} />} trend="down" color="emerald" />
         <StatCard title="Total Doctors" value="1,510" change="340 Available Doctor" symbol={<Stethoscope size={20} />} trend="up" color="blue" />
         <StatCard title="Total Surgery" value="523" change="+165 New Patient" symbol={<Heart size={20} />} trend="up" color="amber" />
         <StatCard title="Total Room" value="221" change="340 Available Doctor" symbol={<Bed size={20} />} trend="up" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-50 p-10 shadow-sm relative overflow-hidden group">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Average Patient Visit</h3>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreHorizontal size={20} /></button>
           </div>
           <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <defs>
                       <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 'bold'}} dx={-5} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', background: '#1e293b', color: 'white' }}
                       itemStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visit" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorVisits)" 
                      dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: 'white' }} 
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-[2rem] border border-slate-50 p-10 shadow-sm flex flex-col items-center group relative overflow-hidden">
           <div className="flex items-center justify-between w-full mb-8">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Invoice Statistics</h3>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreHorizontal size={20} /></button>
           </div>
           <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={pieData}
                       innerRadius={65}
                       outerRadius={95}
                       paddingAngle={8}
                       dataKey="value"
                       stroke="none"
                    >
                       {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                 <p className="text-4xl font-black text-slate-800 tracking-tighter">1.135</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1 uppercase">Invoices</p>
              </div>
           </div>
           <div className="w-full space-y-4 mt-10">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-slate-200 transition-all cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Total Paid</p>
                 </div>
                 <p className="font-black text-slate-800 text-sm">234</p>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-slate-200 transition-all cursor-pointer ring-2 ring-primary-500/20">
                 <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary-600">Total Overdue</p>
                 </div>
                 <p className="font-black text-primary-600 text-sm">514</p>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-slate-200 transition-all cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-100"></div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Total Unpaid</p>
                 </div>
                 <p className="font-black text-slate-800 text-sm">345</p>
              </div>
           </div>
        </div>
      </div>

      {/* Patient List (Table) */}
      <div className="bg-white rounded-[2rem] border border-slate-50 p-10 shadow-sm relative overflow-hidden group">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">All Patients</h3>
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                     <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search anything here"
                    className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-800 outline-none w-72 transition-all focus:bg-white"
                  />
               </div>
               <button className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-colors">
                  <Filter size={18} />
                  <span>Filter</span>
               </button>
            </div>
         </div>

         <div className="overflow-x-auto min-h-60">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="pb-6 w-10"> <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 accent-primary-500" /> </th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300 pl-4">No</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">ID Code</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">Patient Name</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">Age</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">Created Date</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">Time</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">Type Patient</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300">Status</th>
                     <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-slate-300 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {patientList.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors cursor-pointer active:scale-[0.99] duration-200">
                      <td className="py-6"> <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 accent-primary-500" /> </td>
                      <td className="py-6 pl-4 text-[13px] font-black text-slate-800">{p.no}</td>
                      <td className="py-6 text-[13px] font-black text-slate-800">{p.id}</td>
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                           <img src={`https://ui-avatars.com/api/?name=${p.name}&background=f1f5f9&color=64748b`} className="w-9 h-9 rounded-full object-cover shadow-sm bg-slate-100" />
                           <span className="text-[13px] font-black text-slate-800 uppercase tracking-tighter">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-6 text-[13px] font-black text-slate-600">{p.age}</td>
                      <td className="py-6 text-[13px] font-black text-slate-600">{p.date}</td>
                      <td className="py-6 text-[13px] font-black text-slate-600 uppercase tracking-tighter">{p.time}</td>
                      <td className="py-6">
                        <span className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-500 shadow-inner">
                           {p.type}
                        </span>
                      </td>
                      <td className="py-6">
                        <span className={`px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold shadow-sm ${
                          p.status === 'Success' ? 'text-primary-600 bg-primary-50/30' :
                          p.status === 'Pending' ? 'text-amber-500 bg-amber-50/30' :
                          'text-sky-500 bg-sky-50/30'
                        }`}>
                           {p.status}
                        </span>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center justify-center gap-2">
                           <button className="p-2 bg-emerald-700/10 text-emerald-800 rounded-lg hover:bg-emerald-700 hover:text-white transition-all"><Eye size={16} /></button>
                           <button className="p-2 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit size={16} /></button>
                           <button className="p-2 bg-rose-500/10 text-rose-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, symbol, trend, color }: any) => {
  const colorStyles: any = {
    emerald: 'bg-primary-50 text-primary-600 ring-primary-100 px-4 py-4 rounded-xl shadow-inner',
    blue: 'bg-sky-50 text-sky-600 ring-sky-100 px-4 py-4 rounded-xl shadow-inner',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100 px-4 py-4 rounded-xl shadow-inner',
  };

  return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden group hover:scale-[1.03] hover:shadow-xl transition-all duration-300 border-b-4 ${
      color === 'emerald' ? 'border-b-primary-500' : color === 'blue' ? 'border-b-sky-500' : 'border-b-amber-500'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
           <p className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{value}</p>
        </div>
        <div className={colorStyles[color]}>
           {symbol}
        </div>
      </div>
      <div>
        <p className={`text-[11px] font-black ${trend === 'down' ? 'text-rose-500' : 'text-emerald-500'} flex items-center gap-2 tracking-tighter`}>
           {trend === 'down' ? '↓' : '↑'}
           {change}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
