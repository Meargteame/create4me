import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaRocket,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

export default function CampaignsPageNew() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    deadline: '',
    platforms: [] as string[],
    requirements: '',
    deliverables: ''
  });

  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedRate: '',
    portfolio: ''
  });

  useEffect(() => {
    loadCampaigns();
  }, [user]);

  const loadCampaigns = async () => {
    try {
      const data = user?.role === 'brand'
        ? await api.getMyCampaigns()
        : await api.getCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCampaign({
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined
      });
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        budget: '',
        category: '',
        deadline: '',
        platforms: [],
        requirements: '',
        deliverables: ''
      });
      loadCampaigns();
      setShowSuccessModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create campaign');
      setShowErrorModal(true);
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    try {
      await api.applyToCampaign(selectedCampaign._id || selectedCampaign.id, {
        coverLetter: applicationData.coverLetter,
        proposedPrice: applicationData.proposedRate ? Number(applicationData.proposedRate) : undefined,
      });
      setShowApplyModal(false);
      setApplicationData({ coverLetter: '', proposedRate: '', portfolio: '' });
      setSelectedCampaign(null);
      setShowSuccessModal(true);
    } catch (error: any) {
      setShowApplyModal(false);
      setErrorMessage(error.message || 'Failed to submit application');
      setShowErrorModal(true);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'brand' ? 'My Campaigns' : 'Available Campaigns'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'brand'
                ? 'Manage your campaigns and track applications'
                : 'Browse and apply to campaigns that match your profile'}
            </p>
          </div>

          {user?.role === 'brand' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaPlus />
              Create Campaign
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 text-center shadow-lg border border-white/50"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center shadow-inner">
              <FaRocket className="text-5xl text-blue-600 opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {user?.role === 'brand'
                ? 'Create your first campaign to start finding creators'
                : 'Check back soon for new opportunities'}
            </p>
            {user?.role === 'brand' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <FaPlus />
                Create Campaign
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign._id || campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/50 hover:border-blue-200/50"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${campaign.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : campaign.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                    {campaign.status}
                  </span>
                  {campaign.category && (
                    <span className="px-3 py-1 bg-purple-50/80 text-purple-700 rounded-lg text-xs font-bold backdrop-blur-sm border border-purple-100">
                      {campaign.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {campaign.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 font-medium">
                  {campaign.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-3 mb-6 p-4 bg-white/40 rounded-xl border border-white/50">
                  {campaign.budget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Budget</span>
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <FaDollarSign className="text-green-600" />
                        <span>{campaign.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  {campaign.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Deadline</span>
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <FaClock className="text-blue-500" />
                        <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Platforms */}
                {campaign.platforms && campaign.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {campaign.platforms.map((platform: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50/80 text-blue-700 text-xs rounded-lg font-bold border border-blue-100">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {user?.role === 'creator' ? (
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setShowApplyModal(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Apply Now
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to={`/campaigns/${campaign._id || campaign.id}`}
                      className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors text-sm border border-gray-200 shadow-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/campaigns/${campaign._id || campaign.id}/analytics`}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <FaChartLine />
                      Analytics
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={user?.role === 'brand' ? "Campaign Created!" : "Application Submitted!"}
        message={user?.role === 'brand'
          ? "Your campaign has been created successfully and is now live."
          : "Your application has been successfully submitted. The brand will review it and get back to you soon."}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
      />

      {/* Create Campaign Modal - Simplified for now */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-white/50"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Campaign Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="e.g. Summer Fashion Collection Launch"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  rows={4}
                  placeholder="Describe your campaign goals and requirements..."
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Budget ($)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="e.g. Fashion, Tech, Lifestyle"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Apply Modal - Simplified */}
      {showApplyModal && selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowApplyModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-white/50"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-2">Apply to Campaign</h2>
            <p className="text-gray-600 mb-8 font-medium">{selectedCampaign.title}</p>

            <form onSubmit={submitApplication} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Cover Letter</label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  rows={6}
                  placeholder="Tell the brand why you're perfect for this campaign..."
                  required
                  minLength={100}
                />
                <p className="text-xs text-gray-500 mt-2 ml-1 font-medium">Minimum 100 characters</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Your Proposed Rate ($)</label>
                <input
                  type="number"
                  value={applicationData.proposedRate}
                  onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Portfolio Link</label>
                <input
                  type="url"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData({ ...applicationData, portfolio: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
