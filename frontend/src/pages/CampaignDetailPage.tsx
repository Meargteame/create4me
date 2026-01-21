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
  FaCheckCircle,
  FaClock,
  FaGlobe,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaBriefcase
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Application State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock applications for brand view demo
  const mockApplications = [
      { id: 1, creator: { name: 'Sarah Jenkins', handle: '@sarahj' }, status: 'pending', date: '2023-11-01' },
      { id: 2, creator: { name: 'Mike Chen', handle: '@techtalks' }, status: 'approved', date: '2023-11-02' },
  ];

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const campaignData = await api.getCampaign(id).catch(() => null);
        if (campaignData && campaignData.campaign) {
            setCampaign(campaignData.campaign);
        } else {
            // Mock data for UI testing if API fails
             setCampaign({
                _id: id,
                title: 'Summer Fashion Haul',
                description: 'We are looking for fashion creators to showcase our new summer line. You will receive 3 items of your choice and a budget for production.',
                budget: 1500,
                deadline: '2023-12-01',
                platforms: ['instagram', 'tiktok'],
                requirements: 'Must have >10k followers. Fashion/Lifestyle niche.',
                deliverables: '1 Reel, 2 Stories',
                status: 'active',
                brand: { name: 'Zara' }
            });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          // await api.applyToCampaign(id, { coverLetter: applicationText, proposedPrice: Number(proposedPrice) });
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setShowApplyModal(false);
          alert('Application submitted successfully!');
      } catch (error) {
          alert('Failed to submit application');
      } finally {
          setIsSubmitting(false);
      }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
         <div className="flex justify-center items-center h-96">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) return <div>Campaign not found</div>;

  const isBrand = user?.role === 'brand'; // Or check if user owns campaign

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </button>

        {/* content */}
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            campaign.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {campaign.status}
                        </span>
                        <div className="text-right">
                             <div className="text-3xl font-bold text-gray-900">${campaign.budget?.toLocaleString()}</div>
                             <div className="text-sm text-gray-500 font-medium">Fixed Budget</div>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                         <span className="flex items-center gap-1 font-semibold text-gray-700">
                             <FaBriefcase className="text-gray-400" /> {campaign.brand?.name || 'Brand Confidential'}
                         </span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                         <span className="flex items-center gap-1">
                             <FaClock className="text-gray-400" /> Due: {new Date(campaign.deadline).toLocaleDateString()}
                         </span>
                    </div>

                    <div className="flex gap-2">
                        {campaign.platforms?.map((p: string) => (
                             <span key={p} className="bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-700 font-medium capitalize border border-gray-100 flex items-center gap-2">
                                {p === 'instagram' && <FaInstagram className="text-pink-600" />}
                                {p === 'tiktok' && <FaTiktok className="text-black" />}
                                {p === 'youtube' && <FaYoutube className="text-red-600" />}
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
                 {/* Decorative blob */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Description</h3>
                        <div className="prose prose-sm text-gray-600 max-w-none">
                            <p>{campaign.description}</p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div>
                                 <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Key Requirements</h4>
                                 <p className="text-sm text-gray-600 whitespace-pre-wrap">{campaign.requirements}</p>
                             </div>
                             <div>
                                 <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Deliverables</h4>
                                 <p className="text-sm text-gray-600 whitespace-pre-wrap">{campaign.deliverables}</p>
                             </div>
                        </div>
                    </div>

                    {/* Applications (Brand View) */}
                    {isBrand && (
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                             <h3 className="text-lg font-bold text-gray-900 mb-4">Received Applications</h3>
                             <div className="space-y-4">
                                {mockApplications.map(app => (
                                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 shadow-sm">
                                                {app.creator.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{app.creator.name}</div>
                                                <div className="text-xs text-gray-500">{app.creator.handle}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="text-sm font-bold text-gray-600 hover:text-gray-900">View Proposal</button>
                                            <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90">Accept</button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Actions */}
                <div className="md:col-span-1">
                     <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                        
                        {!isBrand ? (
                             <div className="space-y-3">
                                <button 
                                    onClick={() => setShowApplyModal(true)}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <FaBriefcase /> Apply Now
                                </button>
                                <button className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                    Save for Later
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Submitting a proposal does not guarantee acceptance.
                                </p>
                             </div>
                        ) : (
                             <div className="space-y-3">
                                <button className="w-full bg-onyx text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
                                    Edit Campaign
                                </button>
                                <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-all">
                                    Close Campaign
                                </button>
                             </div>
                        )}
                     </div>
                </div>
            </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6"
                 >
                     <h2 className="text-xl font-bold text-gray-900 mb-4">Apply for this Campaign</h2>
                     <form onSubmit={handleApply} className="space-y-4">
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Proposed Price</label>
                             <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                 <input 
                                    type="number" 
                                    value={proposedPrice}
                                    onChange={e => setProposedPrice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder={campaign.budget?.toString()}
                                 />
                             </div>
                         </div>
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Cover Letter</label>
                             <textarea 
                                value={applicationText}
                                onChange={e => setApplicationText(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none"
                                placeholder="Explain why you are the best fit..."
                             />
                         </div>
                         <div className="flex gap-3 pt-2">
                             <button 
                                type="button" 
                                onClick={() => setShowApplyModal(false)}
                                className="flex-1 py-2.5 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                             >
                                Cancel
                             </button>
                             <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 font-bold text-white bg-primary rounded-lg hover:bg-primary/90"
                             >
                                {isSubmitting ? 'Sending...' : 'Send Proposal'}
                             </button>
                         </div>
                     </form>
                 </motion.div>
             </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CampaignDetailPage;
