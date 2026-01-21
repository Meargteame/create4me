import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaUsers,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaCheckCircle,
  FaEye,
  FaChartLine,
  FaShieldAlt,
  FaComments,
  FaEnvelopeOpenText,
  FaBolt
} from 'react-icons/fa';

export default function CreatorsPageNew() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Talent');

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const data = await api.getCreators().catch(() => ({ creators: [] }));
      // Mock data if empty
      const mockCreators = [
          { _id: '1', userId: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=1' }, bio: 'Fashion & Lifestyle Content Creator based in NYC. I help brands tell their story.', categories: ['Fashion', 'Lifestyle'], rating: 4.9, followers: '120k', engagement: '5.2%', platforms: ['instagram', 'tiktok'] },
          { _id: '2', userId: { name: 'TechWithDave', avatar: 'https://i.pravatar.cc/150?u=2' }, bio: 'Unboxing and reviewing the latest gadgets. Honest opinions only.', categories: ['Tech', 'Gaming'], rating: 4.8, followers: '85k', engagement: '8.1%', platforms: ['youtube'] },
          { _id: '3', userId: { name: 'Bella Chef', avatar: 'https://i.pravatar.cc/150?u=3' }, bio: 'Plant-based recipes and sustainable living tips.', categories: ['Food', 'Lifestyle'], rating: 5.0, followers: '250k', engagement: '4.5%', platforms: ['instagram', 'tiktok', 'youtube'] },
          { _id: '4', userId: { name: 'Fitness Mike', avatar: 'https://i.pravatar.cc/150?u=4' }, bio: 'Certified trainer. Workouts, nutrition, and motivation.', categories: ['Fitness', 'Health'], rating: 4.7, followers: '45k', engagement: '12%', platforms: ['instagram'] },
      ];
      setCreators((data.creators && data.creators.length > 0) ? data.creators : mockCreators);
    } catch (error) {
      console.error('Failed to load creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Talent' || (creator.categories && creator.categories.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === 'instagram') return <FaInstagram className="text-pink-600" />;
    if (p === 'youtube') return <FaYoutube className="text-red-600" />;
    if (p === 'tiktok') return <FaTiktok className="text-black" />;
    return <FaStar className="text-gray-400" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Find Creators</h1>
                <p className="text-gray-500 mt-2 text-lg">Connect with top-tier talent for your next campaign.</p>
            </div>
            
            <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
                    placeholder="Search creators by name or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 pb-6 mb-2 no-scrollbar">
            {['All Talent', 'Fashion', 'Tech', 'Lifestyle', 'Gaming', 'Food', 'Fitness'].map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeCategory === cat 
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 transform scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
                {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse"></div>)
                ) : (
                    filteredCreators.map((creator, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={creator._id}
                            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col text-center items-center group relative overflow-hidden"
                        >
                            {/* Top Pattern */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white z-0"></div>

                            {/* Avatar */}
                            <div className="relative z-10 w-24 h-24 mb-4">
                                <img 
                                    src={creator.userId?.avatar || `https://ui-avatars.com/api/?name=${creator.userId?.name}&background=random`} 
                                    alt={creator.userId?.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Active Now"></div>
                            </div>

                            {/* Name & Badge */}
                            <div className="relative z-10 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                                    {creator.userId?.name}
                                    <FaCheckCircle className="text-blue-500 text-xs" />
                                </h3>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">{creator.categories?.[0] || 'Creator'}</p>
                            </div>

                            {/* Bio */}
                            <p className="relative z-10 text-gray-500 text-sm mb-6 line-clamp-2 px-2 min-h-[40px]">
                                {creator.bio}
                            </p>

                            {/* Stats */}
                            <div className="relative z-10 grid grid-cols-2 w-full gap-2 mb-6">
                                <div className="bg-gray-50 rounded-xl p-2">
                                    <div className="text-gray-900 font-bold">{creator.followers || '10k'}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">Followers</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2">
                                    <div className="text-gray-900 font-bold">{creator.engagement || '3.5%'}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">Engage</div>
                                </div>
                            </div>

                            {/* Platforms & Action */}
                            <div className="mt-auto w-full relative z-10">
                                <div className="flex justify-center gap-3 mb-5">
                                    {creator.platforms?.map((p: string) => (
                                        <div key={p} className="p-2 bg-gray-50 rounded-full hover:bg-white hover:shadow-sm transition-all shadow-gray-200">
                                            {getPlatformIcon(p)}
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                    <FaEnvelopeOpenText /> Invite to Campaign
                                </button>
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
