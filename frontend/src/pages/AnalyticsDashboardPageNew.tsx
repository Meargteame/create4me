import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaDownload
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsDashboardPageNew() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock Data
  const data = [
      { name: 'Mon', value: 4000, engagement: 2400 },
      { name: 'Tue', value: 3000, engagement: 1398 },
      { name: 'Wed', value: 2000, engagement: 9800 },
      { name: 'Thu', value: 2780, engagement: 3908 },
      { name: 'Fri', value: 1890, engagement: 4800 },
      { name: 'Sat', value: 2390, engagement: 3800 },
      { name: 'Sun', value: 3490, engagement: 4300 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-onyx text-white p-3 rounded-lg text-xs font-medium shadow-xl">
          <p className="mb-1 opacity-70">{label}</p>
          <p className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Value: ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                <p className="text-gray-500 mt-1">Performance metrics for your campaigns.</p>
            </div>
            <div className="flex gap-3">
                 <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-primary transition-colors appearance-none cursor-pointer hover:bg-gray-50"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 3 Months</option>
                    </select>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                     <FaDownload className="text-gray-400" /> Export
                 </button>
            </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
                 { label: 'Total Earnings', value: '$12,450', change: '+12.5%', isUp: true },
                 { label: 'Impressions', value: '1.2M', change: '+8.2%', isUp: true },
                 { label: 'Avg. Engagement', value: '4.8%', change: '-0.5%', isUp: false },
                 { label: 'Active Campaigns', value: '8', change: '+2', isUp: true },
             ].map((kpi, idx) => (
                 <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                 >
                     <h3 className="text-sm text-gray-500 font-medium mb-1">{kpi.label}</h3>
                     <div className="flex items-end justify-between">
                         <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                         <div className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                             kpi.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                         }`}>
                             {kpi.isUp ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                             {kpi.change}
                         </div>
                     </div>
                 </motion.div>
             ))}
        </div>

        {/* Main Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Revenue Growth</h3>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-primary"></div> Income</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Projected</span>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF2E00" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#FF2E00" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9CA3AF', fontSize: 12}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9CA3AF', fontSize: 12}} 
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#FF2E00" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Side Stats */}
            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-4">Traffic Sources</h3>
                     <div className="space-y-4">
                         {[
                             { label: 'Instagram', val: 65, color: 'bg-pink-500' },
                             { label: 'TikTok', val: 20, color: 'bg-black' },
                             { label: 'Direct', val: 15, color: 'bg-gray-400' },
                         ].map(item => (
                             <div key={item.label}>
                                 <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                     <span>{item.label}</span>
                                     <span>{item.val}%</span>
                                 </div>
                                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                     <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 <div className="bg-onyx text-white p-6 rounded-xl relative overflow-hidden">
                     <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                        <p className="text-gray-400 text-sm mb-4">Get advanced analytics and audience demographics.</p>
                        <button className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all text-sm">
                            View Plans
                        </button>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
