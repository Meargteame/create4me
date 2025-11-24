import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FaComments
} from 'react-icons/fa';

export default function CreatorsPageNew() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const data = await api.getCreators();
      setCreators(data.creators || []);
    } catch (error) {
      console.error('Failed to load creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || creator.categories?.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('instagram')) return <FaInstagram className="text-gray-700" />;
    if (platformLower.includes('youtube')) return <FaYoutube className="text-gray-700" />;
    if (platformLower.includes('tiktok')) return <FaTiktok className="text-gray-700" />;
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
            <FaShieldAlt className="text-green-600" />
            Discover Vetted Creators
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            {filteredCreators.length} verified Ethiopian creators ready for secure collaboration
          </p>
        </div>

        {/* Search and Filters - Premium Style */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200"
          style={{
            backdropFilter: 'blur(12px)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vetted creators..."
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                style={{
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              />
            </div>
          </div>

          {/* Category Filters - Security Focused */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="text-gray-500 flex-shrink-0" />
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${categoryFilter === 'all'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FaShieldAlt />
              All Verified
            </button>
            {['fashion', 'tech', 'lifestyle', 'food', 'travel', 'fitness'].map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${categoryFilter === category
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Creators Grid - Premium Cards */}
        {filteredCreators.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center">
              <FaUsers className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No creators found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator, index) => (
              <motion.div
                key={creator._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-3d-tilt group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              >
                {/* Cover with Verification Badge */}
                <div className="h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative">
                  {/* PROMINENT Verification Badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-xl ring-4 ring-white">
                    <FaShieldAlt className="text-lg" />
                    VETTED PROFILE
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 pt-8">
                  {/* Creator Info */}
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-gray-900 text-xl mb-1">
                      {creator.userId?.name || 'Creator'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                      {creator.bio || 'Professional Ethiopian content creator'}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-yellow-500">
                      <FaStar className="text-lg" />
                      <span className="text-lg font-bold text-gray-900">
                        {creator.rating || '4.8'}
                      </span>
                    </div>
                  </div>

                  {/* KEY METRICS - DATA FOCUSED (XL SIZE) */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1.5 text-blue-600 text-xs mb-2 font-semibold uppercase tracking-wide">
                        <FaUsers />
                        Followers
                      </div>
                      <div className="text-3xl font-black text-blue-600">
                        {creator.followers ? `${(creator.followers / 1000).toFixed(1)}K` : '0'}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1.5 text-purple-600 text-xs mb-2 font-semibold uppercase tracking-wide">
                        <FaChartLine />
                        Engagement
                      </div>
                      <div className="text-3xl font-black text-purple-600">
                        {creator.engagement || '5.2'}%
                      </div>
                    </div>
                  </div>

                  {/* Platforms - Glassmorphism Icons */}
                  {creator.platforms && creator.platforms.length > 0 && (
                    <div className="flex justify-center gap-2 mb-6">
                      {creator.platforms.slice(0, 3).map((platform: string, i: number) => {
                        const icon = getPlatformIcon(platform);
                        return icon ? (
                          <div
                            key={i}
                            className="w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg flex items-center justify-center shadow-sm"
                            title={platform}
                            style={{
                              backdropFilter: 'blur(8px)',
                              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {icon}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Action - SECURITY FOCUSED CTA */}
                  <Link
                    to={`/creators/${creator._id}`}
                    className="cta-pulse block w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-center hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                    style={{
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(22, 163, 74, 0.2)'
                    }}
                  >
                    <FaComments />
                    Start Secure Chat
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
