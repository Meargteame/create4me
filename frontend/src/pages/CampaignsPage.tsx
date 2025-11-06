import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import { Link } from 'react-router-dom';
import { BarChart3, Megaphone } from 'lucide-react';

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    deadline: '',
    platforms: [] as string[],
    requirements: ''
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
      setFormData({ title: '', description: '', budget: '', category: '', deadline: '', platforms: [], requirements: '' });
      loadCampaigns();
    } catch (error: any) {
      alert(error.message || 'Failed to create campaign');
    }
  };

  const handleApply = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowApplyModal(true);
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
      setErrorMessage(error.message || 'Failed to submit application. Please try again.');
      setShowErrorModal(true);
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Create Campaign
            </button>
          )}
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id || campaign.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{campaign.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                  campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {campaign.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

              <div className="space-y-2 mb-4">
                {campaign.budget && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-semibold text-green-600">${campaign.budget.toLocaleString()}</span>
                  </div>
                )}
                {campaign.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-semibold text-gray-900">{campaign.category}</span>
                  </div>
                )}
                {campaign.deadline && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {campaign.platforms && campaign.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {campaign.platforms.map((platform: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {user?.role === 'creator' ? (
                <button
                  onClick={() => handleApply(campaign)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to={`/campaigns/${campaign._id || campaign.id}`}
                    className="flex-1 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/campaigns/${campaign._id || campaign.id}/analytics`}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {campaigns.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'brand' 
                ? 'Create your first campaign to start finding creators' 
                : 'Check back soon for new opportunities'}
            </p>
            {user?.role === 'brand' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Campaign
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>
            
            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Instagram Content Creator Needed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe your campaign requirements..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Budget (USD)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Lifestyle, Tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter'].map(platform => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.platforms.includes(platform)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Minimum followers, engagement rate, etc."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply to Campaign</h2>
            <h3 className="text-lg text-gray-600 mb-6">{selectedCampaign.title}</h3>
            
            <form onSubmit={submitApplication} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Tell the brand why you're the perfect fit for this campaign..."
                  required
                  minLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 100 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your Proposed Rate (USD)</label>
                <input
                  type="number"
                  value={applicationData.proposedRate}
                  onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3000"
                />
                {selectedCampaign.budget && (
                  <p className="text-sm text-gray-500 mt-1">Campaign budget: ${selectedCampaign.budget.toLocaleString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Portfolio Link</label>
                <input
                  type="url"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData({ ...applicationData, portfolio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for a strong application:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific about your relevant experience</li>
                  <li>• Mention your audience size and engagement rate</li>
                  <li>• Explain your creative approach</li>
                  <li>• Show enthusiasm and professionalism</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyModal(false);
                    setApplicationData({ coverLetter: '', proposedRate: '', portfolio: '' });
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applicationData.coverLetter.length < 100}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Application Submitted!"
        message="Your application has been successfully submitted. The brand will review it and get back to you soon."
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Application Failed"
        message={errorMessage}
      />
    </DashboardLayout>
  );
}
