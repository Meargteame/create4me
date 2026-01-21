import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    FaDollarSign, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaClock, 
    FaCalendarAlt, 
    FaDownload,
    FaArrowRight,
    FaHistory,
    FaWallet
} from 'react-icons/fa';

interface Payout {
  _id: string;
  campaignId: { title: string };
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
}

export default function PayoutsHistoryPage() {
  const [loading, setLoading] = useState(false);
  
  // Mock Data
  const payouts: Payout[] = [
      { _id: '1', campaignId: { title: 'Summer Fashion Haul' }, amount: 1500, status: 'completed', date: '2023-11-15' },
      { _id: '2', campaignId: { title: 'Tech Review Series' }, amount: 3000, status: 'processing', date: '2023-11-20' },
      { _id: '3', campaignId: { title: 'Energy Drink Launch' }, amount: 800, status: 'pending', date: '2023-11-25' },
  ];

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'completed': 
            return <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaCheckCircle className="text-[10px]" /> Paid</span>;
          case 'processing': 
            return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaClock className="text-[10px]" /> Processing</span>;
          default: 
            return <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaClock className="text-[10px]" /> Pending</span>;
      }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payouts & Earnings</h1>
                <p className="text-gray-500 mt-1">Track your income and payment history.</p>
            </div>
            <div className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">
                    <FaWallet />
                </div>
                <div>
                    <div className="text-xs text-gray-300 font-medium">Available Balance</div>
                    <div className="text-xl font-bold font-sans">$4,250.00</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* History Table */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FaHistory className="text-gray-400" /> Transaction History
                        </h3>
                        <button className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                            <FaDownload className="text-xs" /> Export CSV
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Campaign</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payouts.map((payout, idx) => (
                                    <tr key={payout._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-sm">{payout.campaignId.title}</div>
                                            <div className="text-xs text-gray-400">ID: #{payout._id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {new Date(payout.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            ${payout.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end">
                                                {getStatusBadge(payout.status)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
                    
                    <div className="space-y-3">
                         <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                                     TB
                                 </div>
                                 <div>
                                     <div className="font-bold text-sm text-gray-900">Telebirr</div>
                                     <div className="text-xs text-gray-500">**** 8902</div>
                                 </div>
                             </div>
                             <FaCheckCircle className="text-green-500" />
                         </div>
                         
                         <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                             + Add Payment Method
                         </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Contact support regarding payment issues or tax documents.
                        </p>
                        <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            Contact Support
                        </button>
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
