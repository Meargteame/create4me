import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBookmark,
  FaRegBookmark,
  FaDollarSign,
  FaClock,
  FaSearch,
  FaFire,
  FaFilter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaArrowRight,
  FaBriefcase,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function FeedPageNew() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCampaigns, setSavedCampaigns] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('For You');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.getCampaigns().catch(() => ({ campaigns: [] }));
      // Mock data if empty for demo
      const data = (response.campaigns && response.campaigns.length > 0) ? response.campaigns : [
          { _id: '1', title: 'Summer Fashion Haul', description: 'Looking for fashion creators for our new summer line. Must have high engagement rates.', budget: 1500, deadline: '2023-12-01', platforms: ['instagram', 'tiktok'], brandName: 'Zara', location: 'Global' },
          { _id: '2', title: 'Tech Review Series', description: 'Review our latest noise cancelling headphones. detailed technical breakdown required.', budget: 3000, deadline: '2023-11-20', platforms: ['youtube'], brandName: 'Sony', location: 'US Only' },
          { _id: '3', title: 'Energy Drink Launch', description: 'High energy transition videos needed. Sports and action focus.', budget: 800, deadline: '2023-12-15', platforms: ['tiktok'], brandName: 'RedBull', location: 'Europe' },
          { _id: '4', title: 'Skincare Routine', description: 'Showcase your morning routine using our organic products.', budget: 1000, deadline: '2024-01-05', platforms: ['instagram', 'youtube'], brandName: 'CeraVe', location: 'Global' },
          { _id: '5', title: 'Mobile Game Promo', description: 'Gameplay highlights and reaction video.', budget: 5000, deadline: '2023-11-30', platforms: ['tiktok', 'youtube'], brandName: 'Supercell', location: 'Global' },
      ];
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const newSaved = new Set(savedCampaigns);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedCampaigns(newSaved);
  };

  const getPlatformIcon = (p: string) => {
      switch(p.toLowerCase()) {
          case 'instagram': return <FaInstagram className="text-pink-600 text-lg" />;
          case 'tiktok': return <FaTiktok className="text-black text-lg" />;
          case 'youtube': return <FaYoutube className="text-red-600 text-lg" />;
          default: return <FaBriefcase className="text-gray-400" />;
      }
  };

  // Filter Logic
  const filteredCampaigns = campaigns.filter(c => {
      const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.brandName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'For You' || activeCategory === 'Trending' ? true : true; // Simplify for demo
      return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Discover Opportunities</h1>
                <p className="text-gray-500 mt-2 text-lg">Find campaigns that match your unique style and audience.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
                    placeholder="Search by brand, title, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Categories / Filter Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-6 mb-2 no-scrollbar">
            {['For You', 'Trending', 'High Budget', 'Quick Turnaround', 'Tech', 'Fashion', 'Beauty'].map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeCategory === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                    }`}
                >
                    {cat} {cat === 'Trending' && <FaFire className="inline-block ml-1 text-orange-400 mb-0.5" />}
                </button>
            ))}
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {loading ? (
                     [1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
                     ))
                ) : (
                    filteredCampaigns.map((campaign, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            key={campaign._id}
                            className="group bg-white rounded-3xl p-1 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="relative p-6 flex flex-col h-full rounded-[20px] bg-white z-10">
                                {/* Brand & Save Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                                            {campaign.brandName?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{campaign.brandName}</h4>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Posted 2d ago</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => toggleSave(campaign._id, e)}
                                        className="w-8 h-8 rounded-full bg-gray-50 hover:bg-primary/10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {savedCampaigns.has(campaign._id) ? <FaBookmark /> : <FaRegBookmark />}
                                    </button>
                                </div>

                                {/* Title & platforms */}
                                <div className="flex gap-2 mb-3">
                                    {campaign.platforms?.map((p: string) => (
                                        <span key={p} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                            {getPlatformIcon(p)}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {campaign.title}
                                </h3>
                                
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                                    {campaign.description}
                                </p>

                                {/* Tags/Pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg flex items-center gap-1 border border-green-100">
                                        <FaDollarSign className="text-[10px]" />
                                        {campaign.budget?.toLocaleString()}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg flex items-center gap-1 border border-gray-100">
                                        <FaMapMarkerAlt className="text-[10px]" />
                                        {campaign.location || 'Remote'}
                                    </span>
                                </div>

                                {/* Action Button */}
                                <Link 
                                    to={`/campaigns/${campaign._id}`}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-primary transition-all shadow-lg shadow-gray-200 group-hover:shadow-primary/25"
                                >
                                    View Details <FaArrowRight className="text-xs opacity-50 -ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
