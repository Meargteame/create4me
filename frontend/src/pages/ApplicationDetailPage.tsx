import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

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

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      alert('Failed to load application details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    if (!application) return;

    const confirmMessage =
      newStatus === 'accepted'
        ? 'Are you sure you want to accept this application?'
        : 'Are you sure you want to reject this application?';

    if (!confirm(confirmMessage)) return;

    try {
      setUpdating(true);
      await api.updateApplicationStatus(application._id, newStatus);
      setApplication({ ...application, status: newStatus });
      alert(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'from-green-600 to-emerald-600';
      case 'rejected':
        return 'from-red-600 to-pink-600';
      default:
        return 'from-yellow-600 to-orange-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading application...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Application not found</div>
      </div>
    );
  }

  const isBrand = user?.role === 'brand';
  const canUpdateStatus = isBrand && application.status === 'pending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Application Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white mb-2">
                Application Details
              </h1>
              <p className="text-white/60">
                Submitted on {new Date(application.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-xl bg-gradient-to-r ${getStatusColor(application.status)} flex items-center gap-2`}>
              <span className="text-2xl">{getStatusIcon(application.status)}</span>
              <span className="text-white font-bold capitalize">{application.status}</span>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Campaign</h2>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-2">
              {application.campaignId.title}
            </h3>
            <p className="text-white/70 mb-4">{application.campaignId.description}</p>
            <div className="flex flex-wrap gap-4">
              {application.campaignId.budget && (
                <div>
                  <p className="text-white/60 text-sm">Budget</p>
                  <p className="text-white font-bold">
                    ${application.campaignId.budget.toLocaleString()}
                  </p>
                </div>
              )}
              {application.campaignId.deadline && (
                <div>
                  <p className="text-white/60 text-sm">Deadline</p>
                  <p className="text-white font-bold">
                    {new Date(application.campaignId.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-white/60 text-sm">Brand</p>
                <p className="text-white font-bold">{application.campaignId.userId.name}</p>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Creator</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {application.creatorId.name[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{application.creatorId.name}</h3>
                <p className="text-white/60">{application.creatorId.email}</p>
              </div>
            </div>

            {application.proposedRate && (
              <div className="mb-4">
                <p className="text-white/60 text-sm mb-1">Proposed Rate</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                  ${application.proposedRate.toLocaleString()}
                </p>
              </div>
            )}

            {application.coverLetter && (
              <div className="mb-4">
                <p className="text-white/60 text-sm mb-2">Cover Letter</p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {application.portfolio && application.portfolio.length > 0 && (
              <div>
                <p className="text-white/60 text-sm mb-2">Portfolio</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {application.portfolio.map((item, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={item}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        {canUpdateStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Review Application</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={updating}
                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {updating ? 'Updating...' : 'Accept Application'}
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updating}
                className="flex-1 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
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
            className="glass rounded-2xl p-6 text-center"
          >
            <p className="text-white/70">
              {application.status === 'pending' && 'Your application is being reviewed by the brand.'}
              {application.status === 'accepted' && 'Congratulations! Your application has been accepted.'}
              {application.status === 'rejected' && 'Unfortunately, your application was not selected this time.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
