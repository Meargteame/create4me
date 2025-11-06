import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaBuilding
} from 'react-icons/fa';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

interface Application {
  _id: string;
  campaignId: {
    _id: string;
    title: string;
    description: string;
    budget?: number;
    deadline?: string;
    userId: {
      name: string;
      email: string;
    };
  };
  creatorId: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  proposedRate?: number;
  coverLetter?: string;
  portfolio?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationDetailPageNew() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const response = await api.getApplication(id!);
      setApplication(response.application);
    } catch (error) {
      console.error('Failed to load application:', error);
      setErrorMessage('Failed to load application details');
      setShowError(true);
      setTimeout(() => navigate('/applications'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    if (!application) return;

    try {
      setUpdating(true);
      await api.updateApplicationStatus(application._id, newStatus);
      setApplication({ ...application, status: newStatus });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update status:', error);
      setErrorMessage('Failed to update application status');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <FaCheckCircle />,
          label: 'Accepted'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <FaTimesCircle />,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <FaClock />,
          label: 'Pending Review'
        };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <FaTimesCircle className="text-4xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h2>
          <button
            onClick={() => navigate('/applications')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Applications
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  const isBrand = user?.role === 'brand';
  const canUpdateStatus = isBrand && application.status === 'pending';
  const statusConfig = getStatusConfig(application.status);

  return (
    <DashboardLayout>
      {showSuccess && (
        <SuccessModal
          message="Application status updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      <div className="space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
        >
          <FaArrowLeft />
          Back
        </motion.button>

        {/* Header with Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Application Details</h1>
              <p className="text-blue-100 flex items-center gap-2">
                <FaCalendarAlt />
                Submitted on {new Date(application.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-xl border-2 ${statusConfig.color} flex items-center gap-2 font-bold`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaFileAlt className="text-blue-600" />
                Campaign Information
              </h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {application.campaignId.title}
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {application.campaignId.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {application.campaignId.budget && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mb-1">
                      <FaDollarSign />
                      Budget
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      ${application.campaignId.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                {application.campaignId.deadline && (
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold mb-1">
                      <FaCalendarAlt />
                      Deadline
                    </div>
                    <p className="text-lg font-bold text-orange-900">
                      {new Date(application.campaignId.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-1">
                    <FaBuilding />
                    Brand
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {application.campaignId.userId.name}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cover Letter</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {application.coverLetter}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Portfolio */}
            {application.portfolio && application.portfolio.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Links</h2>
                <div className="space-y-3">
                  {application.portfolio.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <FaExternalLinkAlt className="text-blue-600" />
                      <span className="flex-1 text-gray-700 font-medium truncate">{link}</span>
                      <FaArrowLeft className="text-gray-400 group-hover:text-blue-600 transform rotate-180 transition-colors" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Creator</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {application.creatorId.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{application.creatorId.name}</h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <FaEnvelope className="text-xs" />
                    {application.creatorId.email}
                  </p>
                </div>
              </div>

              {application.proposedRate && (
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-green-700 text-sm font-semibold mb-1 flex items-center gap-2">
                    <FaDollarSign />
                    Proposed Rate
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    ${application.proposedRate.toLocaleString()}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            {canUpdateStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Review Application</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={updating}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    {updating ? 'Updating...' : 'Accept Application'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle />
                    {updating ? 'Updating...' : 'Reject Application'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Status Message for Creators */}
            {!isBrand && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl p-6 border-2 ${statusConfig.color}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{statusConfig.icon}</div>
                  <h3 className="font-bold text-lg">{statusConfig.label}</h3>
                </div>
                <p className="text-sm">
                  {application.status === 'pending' && 'Your application is being reviewed by the brand. You will be notified once a decision is made.'}
                  {application.status === 'accepted' && 'Congratulations! Your application has been accepted. The brand will contact you soon with next steps.'}
                  {application.status === 'rejected' && 'Unfortunately, your application was not selected this time. Keep applying to other campaigns!'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
