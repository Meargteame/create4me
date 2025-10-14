import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StatCard, { StatCardGrid } from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import CreateCampaignModal from '../components/campaigns/CreateCampaignModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
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
  FaTasks,
  FaUser,
  FaSignOutAlt,
  FaCheckCircle,
  FaClock,
  FaTimes
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
  const [activeTab, setActiveTab] = useState('overview');
  
  // Confirmation modals
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCampaigns = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiClient.getCampaigns();
      if (response.success) {
        setCampaigns(response.campaigns || []);
      } else {
        console.error('Error fetching campaigns:', response.message);
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    }
    setLoading(false);
  };

  const fetchApplicants = async () => {
    // Mock applicants data for now
    setApplicants([
      {
        id: '1',
        creatorName: 'John Doe',
        campaignTitle: 'Summer Product Launch',
        status: 'pending',
        appliedDate: '2024-01-15'
      },
      {
        id: '2',
        creatorName: 'Jane Smith',
        campaignTitle: 'Brand Awareness Campaign',
        status: 'approved',
        appliedDate: '2024-01-14'
      },
      {
        id: '3',
        creatorName: 'Mike Johnson',
        campaignTitle: 'Holiday Special',
        status: 'pending',
        appliedDate: '2024-01-13'
      }
    ]);
  };

  useEffect(() => {
    fetchCampaigns();
    fetchApplicants();
  }, [user]);

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCampaign = async () => {
    if (!selectedCampaignId) return;
    
    setActionLoading(true);
    try {
      // TODO: Add actual delete API call
      // await apiClient.deleteCampaign(selectedCampaignId);
      setCampaigns(campaigns.filter(c => c.id !== selectedCampaignId));
      setDeleteConfirmOpen(false);
      setSelectedCampaignId(null);
      showToast('Campaign deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      showToast('Failed to delete campaign. Please try again.', 'error');
    }
    setActionLoading(false);
  };

  const handleRejectApplicantClick = (applicantId: string) => {
    setSelectedApplicantId(applicantId);
    setRejectConfirmOpen(true);
  };

  const handleRejectApplicant = async () => {
    if (!selectedApplicantId) return;
    
    setActionLoading(true);
    try {
      // TODO: Add actual reject API call
      // await apiClient.rejectApplicant(selectedApplicantId);
      setApplicants(applicants.map(a => 
        a.id === selectedApplicantId ? { ...a, status: 'rejected' as const } : a
      ));
      setRejectConfirmOpen(false);
      setSelectedApplicantId(null);
      showToast('Applicant rejected successfully', 'success');
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      showToast('Failed to reject applicant. Please try again.', 'error');
    }
    setActionLoading(false);
  };

  const activeCampaigns = campaigns.filter(c => c.status !== 'completed').length;
  const pendingApplicants = applicants.filter(a => a.status === 'pending').length;
  const approvedApplicants = applicants.filter(a => a.status === 'approved').length;

  const sidebarItems = [
    { icon: <FaChartLine size={20} />, label: 'Overview', value: 'overview' },
    { icon: <FaRocket size={20} />, label: 'Campaigns', value: 'campaigns' },
    { icon: <FaUsers size={20} />, label: 'Applicants', value: 'applicants' },
    { icon: <FaTasks size={20} />, label: 'Analytics', value: 'analytics' },
    { icon: <FaUser size={20} />, label: 'Account Settings', value: 'account', link: '/account' }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800'
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'approved': return <FaCheckCircle className="text-green-600" />;
      case 'rejected': return <FaTimes className="text-red-600" />;
      default: return <FaClock className="text-blue-600" />;
    }
  };

  return (
    <>
      <DashboardLayout
        title="Brand Dashboard"
        subtitle={`Welcome back, ${user?.email?.split('@')[0] || 'Brand'}!`}
        actions={
          <Button onClick={() => setIsModalOpen(true)} size="md">
            <FaPlus className="mr-2" />
            New Campaign
          </Button>
        }
      >
      {/* Stats Overview */}
      <StatCardGrid className="mb-8">
        <StatCard
          title="Total Campaigns"
          value={campaigns.length}
          change={12}
          trend="up"
          icon={<FaRocket size={24} />}
          color="primary"
        />
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          change={8}
          trend="up"
          icon={<FaCheckCircle size={24} />}
          color="success"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingApplicants}
          change={-5}
          trend="down"
          icon={<FaClock size={24} />}
          color="warning"
        />
        <StatCard
          title="Active Creators"
          value={approvedApplicants}
          change={15}
          trend="up"
          icon={<FaUsers size={24} />}
          color="info"
        />
      </StatCardGrid>

      {/* Rest of dashboard content below - keeping old structure for now */}
      {activeTab === 'overview' && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.email?.split('@')[0] || 'Brand'}!
                  </h1>
                  <p className="text-gray-600 mt-1">Here's what's happening with your campaigns</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium"
                >
                  <FaPlus />
                  New Campaign
                </button>
              </div>

              {/* Stats Cards - Glassmorphic Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                      <FaRocket className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {campaigns.length}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Total Campaigns</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                      <FaCheckCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {activeCampaigns}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Active Campaigns</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md">
                      <FaClock className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {pendingApplicants}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Pending Reviews</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                      <FaUsers className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {approvedApplicants}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Active Creators</div>
                </div>
              </div>

              {/* Recent Campaigns - Glassmorphic Design */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
                <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/5">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Campaigns</h3>
                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                  >
                    View All
                  </button>
                </div>
                {loading ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <FaRocket className="mx-auto mb-4 text-gray-400" size={48} />
                    <h4 className="text-lg font-medium mb-2 text-gray-700">No campaigns yet</h4>
                    <p className="mb-4">Create your first campaign to get started</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Create Campaign
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <div key={campaign.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{campaign.title}</h4>
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
                                  {campaign.budget} ETB
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
                              className="p-2 text-green-600 hover:bg-green-100/50 rounded-lg transition-all duration-300"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Applicants - Glassmorphic Design */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/5">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Applicants</h3>
                  <button
                    onClick={() => setActiveTab('applicants')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                  >
                    View All
                  </button>
                </div>
                {applicants.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <FaUsers className="mx-auto mb-4 text-gray-400" size={48} />
                    <h4 className="text-lg font-medium mb-2 text-gray-700">No applicants yet</h4>
                    <p>Applications will appear here when creators apply to your campaigns</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {applicants.slice(0, 5).map((applicant) => (
                      <div key={applicant.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                              <FaUser className="text-white" size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{applicant.creatorName}</h4>
                              <p className="text-sm text-gray-700">{applicant.campaignTitle}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(applicant.status)}`}>
                              {getStatusIcon(applicant.status)}
                              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                            </span>
                            {applicant.status === 'pending' && (
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-all duration-300 shadow-md hover:shadow-lg">
                                  Approve
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-all duration-300 shadow-md hover:shadow-lg">
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium"
                >
                  <FaPlus />
                  New Campaign
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {loading ? (
                  <div className="p-16 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <FaRocket className="mx-auto mb-4 text-gray-400" size={64} />
                    <h4 className="text-xl font-medium mb-2 text-gray-700">No campaigns yet</h4>
                    <p className="mb-6">Create your first campaign to start connecting with creators</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Create Your First Campaign
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign</th>
                        <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                        <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                        <th className="p-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">{campaign.title}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-600 max-w-md truncate">
                              {campaign.description || '-'}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-end">
                              <Link 
                                to={`/campaign/${campaign.id}`} 
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                              >
                                <FaEye size={18} />
                              </Link>
                              <Link 
                                to={`/campaign/${campaign.id}/applicants`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Applicants"
                              >
                                <FaUsers size={18} />
                              </Link>
                              <button 
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCampaignClick(campaign.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* Applicants Tab */}
          {activeTab === 'applicants' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Campaign Applicants</h1>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {applicants.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <FaUsers className="mx-auto mb-4 text-gray-400" size={64} />
                    <h4 className="text-xl font-medium mb-2 text-gray-700">No applicants yet</h4>
                    <p>Creator applications will appear here when they apply to your campaigns</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {applicants.map((applicant) => (
                      <div key={applicant.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                              <FaUser className="text-indigo-600" size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">{applicant.creatorName}</h4>
                              <p className="text-sm text-gray-600 mt-1">{applicant.campaignTitle}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${getStatusBadge(applicant.status)}`}>
                              {getStatusIcon(applicant.status)}
                              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                            </span>
                            {applicant.status === 'pending' && (
                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectApplicantClick(applicant.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <FaEye size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Campaign Performance</h3>
                    <FaChartLine className="text-blue-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">87%</div>
                  <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Total Reach</h3>
                    <FaUsers className="text-purple-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">45.2K</div>
                  <p className="text-sm text-green-600 mt-2">+8% from last month</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Budget Spent</h3>
                    <FaDollarSign className="text-green-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">12,450 ETB</div>
                  <p className="text-sm text-gray-600 mt-2">Out of 20,000 ETB</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analytics Coming Soon</h3>
                <p className="text-gray-600">
                  Track your campaign performance, creator engagement, ROI, and more with our upcoming analytics dashboard.
                </p>
              </div>
            </>
          )}
      </DashboardLayout>

      {/* Modals - Outside DashboardLayout */}
      <>
        <CreateCampaignModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCampaignCreated={fetchCampaigns}
        />

        <ConfirmationModal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDeleteCampaign}
          title="Delete Campaign"
          message="Are you sure you want to delete this campaign? This action cannot be undone and all applicant data will be lost."
          confirmText="Delete"
          variant="danger"
          isLoading={actionLoading}
        />

        <ConfirmationModal
          isOpen={rejectConfirmOpen}
          onClose={() => setRejectConfirmOpen(false)}
          onConfirm={handleRejectApplicant}
          title="Reject Applicant"
          message="Are you sure you want to reject this applicant? They will be notified of your decision."
          confirmText="Reject"
          variant="warning"
          isLoading={actionLoading}
        />

        <ConfirmationModal
          isOpen={logoutConfirmOpen}
          onClose={() => setLogoutConfirmOpen(false)}
          onConfirm={handleLogout}
          title="Logout"
          message="Are you sure you want to logout? Any unsaved changes will be lost."
          confirmText="Logout"
          variant="info"
        />
      </>
    </>
  );
}