import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiClient from '../lib/api';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaEnvelope,
  FaCalendarAlt
} from '../components/icons';

interface Applicant {
  id: string;
  creator: {
    id: string;
    email: string;
  };
  coverLetter: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
}

export default function CampaignApplicantsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [campaignId, user]);

  const fetchData = async () => {
    if (!user || !campaignId) return;
    
    try {
      setLoading(true);
      
      // Fetch campaign details
      const campaignResponse = await apiClient.getCampaign(campaignId);
      if (campaignResponse.success) {
        setCampaign(campaignResponse.campaign);
      }

      // Fetch applicants
      const applicantsResponse = await apiClient.getCampaignApplicants(campaignId);
      if (applicantsResponse.success) {
        setApplicants(applicantsResponse.applicants || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingStatus(applicationId);
    try {
      const response = await apiClient.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        // Update local state
        setApplicants(prev =>
          prev.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactElement }> = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <FaClock className="mr-1" />
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <FaCheckCircle className="mr-1" />
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <FaTimes className="mr-1" />
      }
    };

    const style = styles[status] || styles.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <div className="text-gray-500">Loading applicants...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Campaign not found</h1>
            <Link to="/brand-dashboard" className="text-indigo-600 hover:text-indigo-800">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingCount = applicants.filter(a => a.status === 'pending').length;
  const approvedCount = applicants.filter(a => a.status === 'approved').length;
  const rejectedCount = applicants.filter(a => a.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/campaign/${campaignId}`}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Campaign
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
          <p className="text-gray-600">Manage applications for this campaign</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-900">{applicants.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600 mt-1">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600 mt-1">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600 mt-1">Rejected</div>
          </div>
        </div>

        {/* Applicants List */}
        {applicants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaEnvelope />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
            <p className="text-gray-500">
              When creators apply to your campaign, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {applicant.creator.email.split('@')[0]}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FaEnvelope className="mr-2" />
                      {applicant.creator.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FaCalendarAlt className="mr-2" />
                      Applied {new Date(applicant.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(applicant.status)}
                  </div>
                </div>

                {applicant.coverLetter && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Cover Letter:</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {applicant.coverLetter}
                    </p>
                  </div>
                )}

                {applicant.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(applicant.id, 'approved')}
                      disabled={updatingStatus === applicant.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                    >
                      <FaCheckCircle />
                      {updatingStatus === applicant.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(applicant.id, 'rejected')}
                      disabled={updatingStatus === applicant.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                    >
                      <FaTimes />
                      {updatingStatus === applicant.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
