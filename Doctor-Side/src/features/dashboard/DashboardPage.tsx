import React from 'react';
import { Users, Stethoscope, Bed, Heart, ChevronDown, Download, Search, Filter, MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PatientModal from '../patients/PatientModal';

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
  { name: 'Paid', value: 27.4, color: '#306F6F' },
  { name: 'Overdue', value: 38.6, color: '#FF7070' },
  { name: 'Unpaid', value: 34.0, color: '#F7FEFE' },
];

const patientList = [
  { no: '01', id: '#FUP121312424', name: 'Isagi Yoichi', age: 20, date: '25 Dec 2023', time: '08:30 pm', type: 'FUP+ECG', status: 'Success' },
  { no: '02', id: '#ECG131312424', name: 'Leonardo Decaprio', age: 36, date: '25 Dec 2023', time: '08:30 pm', type: 'ECG', status: 'Pending' },
  { no: '03', id: '#FUPECG312424', name: 'Kaiser Brown', age: 20, date: '25 Dec 2023', time: '08:30 pm', type: 'FUP', status: 'Progress' },
];

const DashboardPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#212121] tracking-tight">Overview</h1>
          <p className="text-[14px] text-[#717171] mt-1">Latest updates for the last 7 days.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] text-[14px] font-medium text-[#212121] hover:bg-slate-50 transition-colors">
              <span>Week</span>
              <ChevronDown size={18} />
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#306F6F] text-white rounded-[0.5rem] text-[14px] font-medium hover:bg-opacity-90 transition-all active:scale-95">
              <Download size={18} />
              <span>Export</span>
           </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Total Patients" value="5,715" change="-0.10% Since last week" symbol={<Users size={20} />} trend="down" color="primary" />
         <StatCard title="Total Doctors" value="1,510" change="+340 Available Doctor" symbol={<Stethoscope size={20} />} trend="up" color="primary" />
         <StatCard title="Total Surgery" value="523" change="+165 New Patient" symbol={<Heart size={20} />} trend="up" color="primary" />
         <StatCard title="Total Room" value="221" change="340 Available Doctor" symbol={<Bed size={20} />} trend="up" color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-[#212121]">Average Patient Visit</h3>
              <button className="p-1.5 text-[#A0A0A0] hover:bg-slate-50 rounded-lg"><MoreHorizontal size={20} /></button>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <defs>
                       <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#306F6F" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#306F6F" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#717171'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#717171'}} dx={-5} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: '#212121', color: '#fff' }}
                       itemStyle={{ fontSize: '13px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visit" 
                      stroke="#306F6F" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorVisits)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#306F6F' }}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center">
           <div className="flex items-center justify-between w-full mb-6">
              <h3 className="text-[18px] font-bold text-[#212121]">Invoice Statistics</h3>
              <button className="p-1.5 text-[#A0A0A0] hover:bg-slate-50 rounded-lg"><MoreHorizontal size={20} /></button>
           </div>
           <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={pieData}
                       innerRadius={65}
                       outerRadius={85}
                       paddingAngle={5}
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
                 <p className="text-[24px] font-bold text-[#212121]">1,135</p>
                 <p className="text-[12px] text-[#717171]">Invoices</p>
              </div>
           </div>
           <div className="w-full space-y-3 mt-6">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#306F6F]"></div>
                    <p className="text-[13px] font-medium text-[#717171]">Total Paid</p>
                 </div>
                 <p className="font-semibold text-[#212121] text-[14px]">234</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF7070]"></div>
                    <p className="text-[13px] font-medium text-[#717171]">Total Overdue</p>
                 </div>
                 <p className="font-semibold text-[#212121] text-[14px]">514</p>
              </div>
           </div>
        </div>
      </div>

      {/* Patient List (Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-[18px] font-bold text-[#212121]">Today's Appointments</h3>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">
                     <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] text-[14px] outline-none w-64 focus:border-[#306F6F] transition-colors"
                  />
               </div>
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] text-[14px] font-medium text-[#212121] hover:bg-slate-50 transition-colors">
                  <Filter size={18} />
                  <span>Filter</span>
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-200 text-[#A0A0A0] text-[13px] font-medium">
                     <th className="pb-4 font-normal">Patient Name</th>
                     <th className="pb-4 font-normal">Age</th>
                     <th className="pb-4 font-normal">Date</th>
                     <th className="pb-4 font-normal">Time</th>
                     <th className="pb-4 font-normal">Type</th>
                     <th className="pb-4 font-normal">Status</th>
                     <th className="pb-4 font-normal text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {patientList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors text-[14px] text-[#212121]">
                      <td className="py-4 font-medium">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#F7FEFE] text-[#306F6F] flex items-center justify-center font-bold text-xs uppercase">
                              {p.name.substring(0,2)}
                           </div>
                           <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[#717171]">{p.age} yrs</td>
                      <td className="py-4 text-[#717171]">{p.date}</td>
                      <td className="py-4 text-[#717171]">{p.time}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-[12px] font-medium">
                           {p.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-md text-[12px] font-medium ${
                          p.status === 'Success' ? 'text-emerald-700 bg-emerald-50' :
                          p.status === 'Pending' ? 'text-amber-700 bg-amber-50' :
                          'text-sky-700 bg-sky-50'
                        }`}>
                           {p.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-[#A0A0A0]">
                           <button 
                             onClick={() => setSelectedPatientId('p1')} // Using a mock ID for demo
                             className="hover:text-[#306F6F] transition-colors"
                           >
                             <Eye size={18} />
                           </button>
                           <button className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {selectedPatientId && (
        <PatientModal 
          patientId={selectedPatientId} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, symbol, trend }: any) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-medium text-[#717171]">{title}</p>
        <div className="w-10 h-10 rounded-full bg-[#F7FEFE] text-[#306F6F] flex items-center justify-center">
           {symbol}
        </div>
      </div>
      <div>
         <p className="text-[28px] font-bold text-[#212121] leading-tight mb-2">{value}</p>
         <p className={`text-[13px] font-medium ${trend === 'down' ? 'text-[#FF7070]' : 'text-emerald-600'} flex items-center gap-1`}>
            {trend === 'down' ? '↓' : '↑'} {change}
         </p>
      </div>
    </div>
  );
};

export default DashboardPage;
