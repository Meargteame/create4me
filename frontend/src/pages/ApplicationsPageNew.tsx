import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
  FaBriefcase,
  FaArrowRight,
  FaHourglassHalf,
  FaFileContract
} from 'react-icons/fa';

interface Application {
  _id: string;
  campaignId: {
    _id: string;
    title: string;
    budget?: number;
    category?: string;
    brandName?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  proposedPrice?: number;
  coverLetter?: string;
  createdAt: string;
}

export default function ApplicationsPageNew() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getMyApplications().catch(() => ({ applications: [] }));
      
      // Mock Data if API fails or empty (for MVP demo)
      const apps = (data.applications && data.applications.length > 0) ? data.applications : [
          {
             _id: '1',
             campaignId: { _id: 'c1', title: 'Summer Essentials Re-brand', budget: 5000, brandName: 'H&M', category: 'Fashion' },
             status: 'pending',
             proposedPrice: 4800,
             createdAt: '2023-10-25'
          },
          {
             _id: '2',
             campaignId: { _id: 'c2', title: 'Gaming Headset Review', budget: 1200, brandName: 'Logitech', category: 'Tech' },
             status: 'accepted',
             proposedPrice: 1200,
             createdAt: '2023-10-20'
          },
          {
             _id: '3',
             campaignId: { _id: 'c3', title: 'Organic Smoothie Promo', budget: 800, brandName: 'Naked Juice', category: 'Food' },
             status: 'rejected',
             proposedPrice: 1000,
             createdAt: '2023-10-15'
          },
      ];
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.campaignId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.campaignId?.brandName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
          case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
          default: return 'bg-amber-50 text-amber-600 border-amber-100';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'accepted': return <FaCheckCircle />;
          case 'rejected': return <FaTimesCircle />;
          default: return <FaHourglassHalf />;
      }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Applications</h1>
                <p className="text-gray-500 mt-2 text-lg">Track the status of your pitches and proposals.</p>
            </div>
            
             <div className="relative group w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 space-x-1 bg-gray-100/50 rounded-xl max-w-fit mb-8">
            {['all', 'pending', 'accepted', 'rejected'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setFilter(tab as any)}
                    className={`
                        px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all
                        ${filter === tab 
                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}
                    `}
                >
                    {tab}
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${filter === tab ? 'bg-gray-100' : 'bg-gray-200/50'}`}>
                        {applications.filter(a => tab === 'all' || a.status === tab).length}
                    </span>
                </button>
            ))}
        </div>

        {/* List */}
        <div className="space-y-4">
             <AnimatePresence>
                {loading ? (
                    [1,2,3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>)
                ) : filteredApps.length > 0 ? (
                    filteredApps.map((app, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={app._id}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all group cursor-pointer"
                            onClick={() => navigate(`/applications/${app._id}`)}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                {/* Icon/Brand */}
                                <div className="flex items-center gap-5 w-full md:w-auto">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl font-bold shrink-0">
                                        {app.campaignId?.brandName?.substring(0, 2).toUpperCase() || <FaBriefcase />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                             <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                                                {app.campaignId?.title || 'Unknown Campaign'}
                                             </h3>
                                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                                                 {getStatusIcon(app.status)}
                                                 {app.status}
                                             </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">
                                            {app.campaignId?.brandName} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                                    <div className="md:text-right">
                                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Proposed</div>
                                        <div className="font-bold text-gray-900 flex items-center gap-1 md:justify-end">
                                            <FaDollarSign className="text-gray-400 text-xs" />
                                            {app.proposedPrice?.toLocaleString()}
                                        </div>
                                    </div>
                                    
                                     <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

                                    <div className="md:text-right">
                                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Budget</div>
                                        <div className="font-bold text-gray-900 flex items-center gap-1 md:justify-end">
                                            <FaDollarSign className="text-gray-400 text-xs" />
                                            {app.campaignId?.budget?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="md:pl-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                            <FaArrowRight className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400 text-3xl">
                            <FaFileContract />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No applications found</h3>
                        <p className="text-gray-500">You haven't applied to any campaigns yet.</p>
                    </div>
                )}
             </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
