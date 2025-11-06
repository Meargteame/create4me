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
  FaChartLine
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
    switch (platform.toLowerCase()) {
      case 'instagram': return <FaInstagram className="text-pink-600" />;
      case 'youtube': return <FaYoutube className="text-red-600" />;
      case 'tiktok': return <FaTiktok className="text-black" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUsers className="text-blue-600" />
            Discover Creators
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredCreators.length} verified creators ready to work with you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by name or bio..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="text-gray-400 flex-shrink-0" />
            {['all', 'fashion', 'tech', 'lifestyle', 'food', 'travel', 'fitness'].map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  categoryFilter === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
              <FaUsers className="text-4xl text-blue-600" />
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
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100"
              >
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
                  {creator.userId?.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl font-bold text-white/20">
                        {creator.userId.name[0]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 -mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white">
                        {creator.userId?.name?.[0] || 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {creator.userId?.name || 'Creator'}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FaStar />
                          <span className="text-sm font-semibold text-gray-700">
                            {creator.rating || '4.8'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <FaCheckCircle />
                      Verified
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {creator.bio || 'Professional content creator'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                        <FaUsers className="text-blue-600" />
                        Followers
                      </div>
                      <div className="font-bold text-gray-900">
                        {creator.followers ? `${(creator.followers / 1000).toFixed(1)}K` : '0'}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                        <FaChartLine className="text-purple-600" />
                        Engagement
                      </div>
                      <div className="font-bold text-gray-900">
                        {creator.engagement || '0'}%
                      </div>
                    </div>
                  </div>

                  {/* Platforms */}
                  {creator.platforms && creator.platforms.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {creator.platforms.map((platform: string, i: number) => (
                        <div key={i} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action */}
                  <Link
                    to={`/creators/${creator._id}`}
                    className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    View Profile
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
