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
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${filter === 'saved'
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
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${filter === filterOption.id
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

        {/* Campaign Cards */}
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
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              View All Opportunities
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
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
                  className="card-3d-tilt group bg-gradient-to-br from-white to-gray-50/30 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    background: 'rgba(255, 255, 255, 0.98)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06), 0 20px 40px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                  }}
                >
                  {/* Header Row - Brand & Compensation */}
                  <div className="flex items-start justify-between gap-6 mb-6">
                    {/* Left: Brand & Title */}
                    <div className="flex-1">
                      {/* Brand Name with Verified Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-base font-bold text-green-700">
                            {campaign.userId?.name?.[0] || 'B'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">
                              {campaign.userId?.name || 'Brand Name'}
                            </span>
                            <FaCheckCircle className="text-green-500 text-sm" title="Verified Brand" />
                          </div>
                          <span className="text-xs text-gray-500">Posted {timeAgo}</span>
                        </div>
                      </div>

                      {/* Campaign Title */}
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-3">
                        {campaign.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>

                    {/* Right: Compensation (LARGE & PROMINENT) */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                        Compensation
                      </div>
                      <div className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                        ${campaign.budget?.toLocaleString() || '0'}
                      </div>

                      {/* Urgent Badge */}
                      {isUrgent && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-md">
                          <FaFire />
                          {daysLeft} days left
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row - Platforms, Deadline & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                    {/* Left: Platform Icons & Deadline */}
                    <div className="flex items-center gap-6">
                      {/* Monochrome Social Icons */}
                      {campaign.platforms && campaign.platforms.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-semibold">Platforms:</span>
                          <div className="flex items-center gap-1.5">
                            {campaign.platforms.slice(0, 3).map((platform: string, i: number) => {
                              let Icon = null;
                              const platformLower = platform.toLowerCase();
                              if (platformLower.includes('tiktok')) Icon = <FaRocket />;
                              else if (platformLower.includes('instagram')) Icon = <FaBookmark />;
                              else if (platformLower.includes('youtube')) Icon = <FaClock />;

                              return Icon ? (
                                <div
                                  key={`${campaign._id}-platform-${i}`}
                                  className="w-8 h-8 bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg flex items-center justify-center shadow-sm"
                                  title={platform}
                                  style={{
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1)'
                                  }}
                                >
                                  {Icon}
                                </div>
                              ) : (
                                <span key={`${campaign._id}-platform-${i}`} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                                  {platform}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <FaClock className="text-gray-400" />
                        <span className="font-medium">
                          {daysLeft !== null ? `${daysLeft} days left` : 'No deadline'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      {/* Save Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(campaign._id);
                        }}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                      >
                        <FaBookmark className={`text-lg ${isSaved ? 'text-green-600' : 'text-gray-400'}`} />
                      </button>

                      {/* Apply Now Button - HIGHLY CONTRASTING */}
                      {user?.role === 'creator' && (
                        <Link
                          to={`/campaigns/${campaign._id}`}
                          className="cta-pulse premium-button group/btn px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
                          style={{
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(22, 163, 74, 0.2), 0 8px 16px rgba(22, 163, 74, 0.15)'
                          }}
                        >
                          Apply Now
                          <FaRocket className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
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
