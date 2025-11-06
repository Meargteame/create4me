import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBookmark, 
  FaDollarSign, 
  FaClock, 
  FaSearch,
  FaFire,
  FaFilter,
  FaRocket,
  FaCheckCircle
} from 'react-icons/fa';

export default function FeedPageNew() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCampaigns, setSavedCampaigns] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.getCampaigns();
      const activeCampaigns = (response.campaigns || []).filter(
        (c: any) => c.status === 'active'
      );
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (campaignId: string) => {
    const newSaved = new Set(savedCampaigns);
    if (newSaved.has(campaignId)) {
      newSaved.delete(campaignId);
    } else {
      newSaved.add(campaignId);
    }
    setSavedCampaigns(newSaved);
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'all') return true;
    if (filter === 'urgent') {
      const daysLeft = getDaysLeft(campaign.deadline);
      return daysLeft !== null && daysLeft <= 7;
    }
    if (filter === 'high-budget') {
      return campaign.budget && campaign.budget >= 5000;
    }
    if (filter === 'saved') {
      return savedCampaigns.has(campaign._id);
    }
    return campaign.platforms?.some((p: string) => p.toLowerCase() === filter.toLowerCase());
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaFire className="text-orange-500" />
              Discover Opportunities
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredCampaigns.length} active campaigns available
            </p>
          </div>
          
          {savedCampaigns.size > 0 && (
            <button
              onClick={() => setFilter('saved')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filter === 'saved'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBookmark />
              Saved ({savedCampaigns.size})
            </button>
          )}
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
                placeholder="Search opportunities..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="text-gray-400 flex-shrink-0" />
            {[
              { id: 'all', label: 'All', icon: null },
              { id: 'urgent', label: 'Urgent', icon: <FaFire className="text-orange-500" /> },
              { id: 'high-budget', label: 'High Budget', icon: <FaDollarSign className="text-green-500" /> },
              { id: 'instagram', label: 'Instagram', icon: null },
              { id: 'youtube', label: 'YouTube', icon: null },
              { id: 'tiktok', label: 'TikTok', icon: null },
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  filter === filterOption.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.icon}
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns List */}
        {filteredCampaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
              <FaSearch className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'saved' 
                ? "You haven't saved any campaigns yet"
                : 'Try adjusting your filters or check back later'}
            </p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              View All Opportunities
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign, index) => {
              const daysLeft = getDaysLeft(campaign.deadline);
              const isUrgent = daysLeft !== null && daysLeft <= 7;
              const isSaved = savedCampaigns.has(campaign._id);
              const timeAgo = new Date(campaign.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {campaign.title}
                        </h3>
                        {isUrgent && (
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                            <FaFire />
                            {daysLeft} days left
                          </span>
                        )}
                        {campaign.category && (
                          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg">
                            {campaign.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-3">
                        {campaign.description}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(campaign._id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <FaBookmark className={`text-xl ${isSaved ? 'text-blue-600' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  {/* Platforms */}
                  {campaign.platforms && campaign.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {campaign.platforms.map((platform: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6 text-sm">
                      {campaign.budget && (
                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaDollarSign className="text-green-600 text-sm" />
                          </div>
                          ${campaign.budget.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-gray-400" />
                        {daysLeft !== null ? `${daysLeft} days left` : 'No deadline'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        Posted {timeAgo}
                      </div>
                    </div>

                    {user?.role === 'creator' && (
                      <Link
                        to="/campaigns"
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <FaRocket />
                        Apply Now
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        {filteredCampaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">Ready to get started?</h3>
                <p className="text-blue-100">Apply to campaigns that match your profile and start earning</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-3xl" />
                <div>
                  <div className="text-2xl font-bold">{filteredCampaigns.length}</div>
                  <div className="text-sm text-blue-100">Opportunities</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
