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
        portfolioLink: applicationData.portfolio
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
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
              <FaRocket className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'brand' 
                ? 'Create your first campaign to start finding creators' 
                : 'Check back soon for new opportunities'}
            </p>
            {user?.role === 'brand' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
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
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    campaign.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : campaign.status === 'draft'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {campaign.status}
                  </span>
                  {campaign.category && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                      {campaign.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {campaign.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  {campaign.budget && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaDollarSign className="text-green-600" />
                      <span className="font-semibold text-gray-900">
                        ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {campaign.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaClock className="text-gray-400" />
                      <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Platforms */}
                {campaign.platforms && campaign.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.platforms.map((platform: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
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
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Apply Now
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to={`/campaigns/${campaign._id || campaign.id}`}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-900 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/campaigns/${campaign._id || campaign.id}/analytics`}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <FaChartLine className="text-sm" />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Budget ($)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowApplyModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply to Campaign</h2>
            <p className="text-gray-600 mb-6">{selectedCampaign.title}</p>
            
            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Cover Letter</label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Tell the brand why you're perfect for this campaign..."
                  required
                  minLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 100 characters</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your Proposed Rate ($)</label>
                <input
                  type="number"
                  value={applicationData.proposedRate}
                  onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Portfolio Link</label>
                <input
                  type="url"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData({ ...applicationData, portfolio: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
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
