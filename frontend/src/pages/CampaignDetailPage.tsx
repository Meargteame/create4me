import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCommentDots,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<any>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const campaignData = await api.getCampaign(id);
        setCampaign(campaignData.campaign);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleContact = (recipient: any) => {
    setChatRecipient(recipient);
    setIsMessageModalOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
          <button
            onClick={() => navigate('/campaigns')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Back to Campaigns
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const daysLeft = campaign.deadline 
    ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          <FaArrowLeft />
          Back to Campaigns
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <FaDollarSign />
              <span className="font-semibold">${campaign.budget?.toLocaleString()}</span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <FaCalendarAlt />
                <span className="font-semibold">{daysLeft} days left</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <FaUsers />
              <span className="font-semibold">{campaign.applicants?.length || 0} Applications</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
            </motion.div>

            {/* Requirements */}
            {campaign.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.requirements}</p>
              </motion.div>
            )}

            {/* Deliverables */}
            {campaign.deliverables && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Deliverables</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.deliverables}</p>
              </motion.div>
            )}

            {/* Applications */}
            {campaign.applicants && campaign.applicants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Applications ({campaign.applicants.length})</h2>
                <div className="space-y-3">
                  {campaign.applicants.map((app: any) => (
                    <Link
                      key={app._id}
                      to={`/applications/${app._id}`}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{app.creatorId?.name || 'Creator'}</p>
                          <p className="text-sm text-gray-600">Proposed: ${app.proposedRate?.toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status === 'accepted' && <FaCheckCircle className="inline mr-1" />}
                          {app.status === 'rejected' && <FaTimesCircle className="inline mr-1" />}
                          {app.status === 'pending' && <FaClock className="inline mr-1" />}
                          {app.status}
                        </span>
                      </div>
                      {user?.role === 'brand' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleContact({ _id: app.creatorId._id, name: app.creatorId.name, role: 'creator' });
                            }}
                            className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-semibold hover:bg-green-200"
                        >
                            <FaCommentDots />
                            Contact
                        </button>
                      )}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleContact({ _id: campaign.brand._id, name: campaign.brand.name, role: 'brand' })}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-center hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCommentDots />
                  Contact Brand
                </button>
                <Link
                  to={`/campaigns/${id}/analytics`}
                  className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaChartLine />
                  View Analytics
                </Link>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Campaigns
                </button>
              </div>
            </motion.div>

            {/* Campaign Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Info</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                {campaign.category && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="font-semibold text-gray-900">{campaign.category}</p>
                  </div>
                )}
                {campaign.platforms && campaign.platforms.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.platforms.map((platform: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {isMessageModalOpen && chatRecipient && user && (
        <MessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipient={chatRecipient}
        />
      )}
    </DashboardLayout>
  );
};

export default CampaignDetailPage;
