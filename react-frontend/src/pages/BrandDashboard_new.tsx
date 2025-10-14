import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateCampaignModal from '../components/campaigns/CreateCampaignModal';
import { useToast } from '../components/ui/Toast';
import apiClient from '../lib/api';
import { 
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaRocket,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaUser
} from '../components/icons';

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  budget?: number;
  deadline?: string;
  status?: string;
}

interface Applicant {
  id: string;
  creatorName: string;
  campaignTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export default function BrandDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchApplicants();
  }, [user]);

  const fetchCampaigns = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiClient.getCampaigns();
      if (response.success) {
        setCampaigns(response.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    }
    setLoading(false);
  };

  const fetchApplicants = async () => {
    // Mock data for now
    setApplicants([
      {
        id: '1',
        creatorName: 'Sarah Alemayehu',
        campaignTitle: 'Summer Product Launch',
        status: 'pending',
        appliedDate: '2024-01-15'
      },
      {
        id: '2',
        creatorName: 'Daniel Tadesse',
        campaignTitle: 'Brand Awareness Campaign',
        status: 'approved',
        appliedDate: '2024-01-14'
      }
    ]);
  };

  const handleCampaignCreated = () => {
    setIsModalOpen(false);
    fetchCampaigns();
    showToast('Campaign created successfully!', 'success');
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      const response = await apiClient.deleteCampaign(id);
      if (response.success) {
        showToast('Campaign deleted successfully', 'success');
        fetchCampaigns();
      }
    } catch (error) {
      showToast('Failed to delete campaign', 'error');
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const pendingApplicants = applicants.filter(a => a.status === 'pending').length;
  const approvedApplicants = applicants.filter(a => a.status === 'approved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'rejected': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening with your campaigns
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <FaPlus />
              New Campaign
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <FaRocket className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {campaigns.length}
            </div>
            <div className="text-sm text-gray-700 font-medium">Total Campaigns</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {activeCampaigns}
            </div>
            <div className="text-sm text-gray-700 font-medium">Active Campaigns</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md">
                <FaClock className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {pendingApplicants}
            </div>
            <div className="text-sm text-gray-700 font-medium">Pending Reviews</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                <FaUsers className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {approvedApplicants}
            </div>
            <div className="text-sm text-gray-700 font-medium">Active Creators</div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Campaigns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/20 bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Recent Campaigns</h3>
              <Link
                to="/feed"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </Link>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="p-12 text-center">
                <FaRocket className="mx-auto mb-4 text-gray-400 text-5xl" />
                <h4 className="text-lg font-medium mb-2 text-gray-700">No campaigns yet</h4>
                <p className="text-gray-600 mb-6">Create your first campaign to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Create Campaign
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {campaigns.slice(0, 5).map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="p-6 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 text-lg">
                          {campaign.title}
                        </h4>
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {campaign.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaClock size={14} />
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                          {campaign.budget && (
                            <span className="flex items-center gap-1">
                              <FaDollarSign size={14} />
                              {campaign.budget.toLocaleString()} ETB
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          to={`/campaign/${campaign.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100/50 rounded-lg transition-all duration-300"
                          title="View"
                        >
                          <FaEye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="p-2 text-red-600 hover:bg-red-100/50 rounded-lg transition-all duration-300"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Applicants */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/20 bg-white/5">
              <h3 className="text-xl font-semibold text-gray-900">Recent Applicants</h3>
            </div>
            
            {applicants.length === 0 ? (
              <div className="p-8 text-center">
                <FaUsers className="mx-auto mb-4 text-gray-400 text-4xl" />
                <h4 className="text-sm font-medium mb-2 text-gray-700">No applicants yet</h4>
                <p className="text-xs text-gray-600">Applications will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {applicants.slice(0, 5).map((applicant) => (
                  <motion.div
                    key={applicant.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <FaUser className="text-white" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {applicant.creatorName}
                        </h4>
                        <p className="text-xs text-gray-700 truncate">
                          {applicant.campaignTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(applicant.status)}`}>
                        {getStatusIcon(applicant.status)}
                        {applicant.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(applicant.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <CreateCampaignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCampaignCreated}
        />
      )}
    </div>
  );
}
