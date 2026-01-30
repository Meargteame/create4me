import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaSearch,
    FaDollarSign,
    FaBriefcase,
    FaEllipsisH
} from 'react-icons/fa';

export default function CampaignsPageNew() {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>('newest');

    // Form
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        category: '',
        deadline: '',
        requirements: '',
        platforms: [] as string[]
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
            // Mock Data if empty
            if (!data.campaigns || data.campaigns.length === 0) {
                setCampaigns([
                    { _id: '1', title: 'Summer Collection Launch', description: 'Showcase our new summer vibes.', budget: 5000, status: 'active', platform: ['instagram'], createdAt: '2023-10-01' },
                    { _id: '2', title: 'Tech Review 2024', description: 'Deep dive into our new headphones.', budget: 2500, status: 'draft', platform: ['youtube'], createdAt: '2023-10-05' },
                    { _id: '3', title: 'Viral Dance Challenge', description: 'Create a sound for our brand.', budget: 1000, status: 'completed', platform: ['tiktok'], createdAt: '2023-09-15' },
                ])
            }
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
            setFormData({ title: '', description: '', budget: '', category: '', deadline: '', requirements: '', platforms: [] });
            loadCampaigns();
            setShowSuccessModal(true);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to create campaign');
            setShowErrorModal(true);
        }
    };

    // Filter Logic
    const filteredCampaigns = campaigns
        .filter(c => {
            const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'all' || c.status === activeTab;
            return matchesSearch && matchesTab;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'budget_high') return (b.budget || 0) - (a.budget || 0);
            if (sortBy === 'budget_low') return (a.budget || 0) - (b.budget || 0);
            return 0;
        });



    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-txt-primary tracking-tight">Campaign Manager</h1>
                        <p className="text-txt-secondary mt-2 text-lg">Oversee, track, and optimize your creator partnerships.</p>
                    </div>
                    {user?.role === 'brand' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-primary font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                        >
                            <FaPlus className="mr-2" /> New Campaign
                        </button>
                    )}
                </div>

                {/* Control Bar */}
                {/* Control Bar */}
                <div className="bg-card p-2 rounded-2xl border border-border-color shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex p-1 gap-1 bg-input rounded-xl w-full md:w-auto overflow-x-auto">
                        {['all', 'active', 'draft', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-card text-txt-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-txt-secondary hover:text-txt-primary hover:bg-card/50'
                                    }`}
                            >
                                {tab}
                                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${activeTab === tab ? 'bg-input text-txt-secondary' : 'bg-input/50 text-txt-secondary'}`}>
                                    {campaigns.filter(c => tab === 'all' || c.status === tab).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary text-xs" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-input border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none text-txt-primary placeholder:text-txt-secondary"
                            />
                        </div>

                        <div className="h-8 w-[1px] bg-border-color hidden md:block"></div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-input border-none rounded-xl px-4 py-2.5 text-sm font-bold text-txt-primary cursor-pointer focus:ring-2 focus:ring-primary/10 outline-none hover:bg-input transition-colors appearance-none"
                        >
                            <option value="newest">Newest First</option>
                            <option value="budget_high">Budget: High to Low</option>
                            <option value="budget_low">Budget: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Content Grid */}
                <AnimatePresence mode='wait'>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredCampaigns.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredCampaigns.map((campaign) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    key={campaign._id}
                                    className="group bg-card rounded-2xl p-6 border border-border-color shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Status Pill */}
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${campaign.status === 'active' ? 'bg-green-500/10 text-green-600 ring-1 ring-green-500/20' :
                                            campaign.status === 'completed' ? 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20' :
                                                'bg-input text-txt-secondary ring-1 ring-border-color'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-green-500' :
                                                campaign.status === 'completed' ? 'bg-blue-500' :
                                                    'bg-gray-400'
                                                }`}></span>
                                            {campaign.status || 'Draft'}
                                        </span>

                                        <button className="text-txt-secondary hover:text-txt-primary transition-colors">
                                            <FaEllipsisH />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-txt-primary mb-2 leading-tight group-hover:text-primary transition-colors">
                                        {campaign.title}
                                    </h3>
                                    <p className="text-txt-secondary text-sm mb-6 line-clamp-2 min-h-[40px]">
                                        {campaign.description}
                                    </p>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-input rounded-xl p-3">
                                            <div className="text-xs text-txt-secondary font-bold uppercase mb-1">Budget</div>
                                            <div className="text-txt-primary font-bold flex items-center gap-1">
                                                <FaDollarSign className="text-xs text-txt-secondary" />
                                                {campaign.budget?.toLocaleString() || '0'}
                                            </div>
                                        </div>
                                        <div className="bg-input rounded-xl p-3">
                                            <div className="text-xs text-txt-secondary font-bold uppercase mb-1">Applications</div>
                                            <div className="text-txt-primary font-bold flex items-center gap-1">
                                                <FaBriefcase className="text-xs text-txt-secondary" />
                                                12
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between border-t border-border-color pt-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-input border-2 border-card"></div>
                                            <div className="w-8 h-8 rounded-full bg-input border-2 border-card"></div>
                                            <div className="w-8 h-8 rounded-full bg-input border-2 border-card flex items-center justify-center text-[10px] font-bold text-txt-secondary">+3</div>
                                        </div>
                                        <Link
                                            to={`/campaigns/${campaign._id}`}
                                            className="text-sm font-bold text-txt-primary hover:text-primary flex items-center gap-2 group/link"
                                        >
                                            Manage <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 bg-card rounded-3xl border-2 border-dashed border-border-color text-center"
                        >
                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary text-3xl">
                                <FaSearch />
                            </div>
                            <h3 className="text-xl font-bold text-txt-primary mb-2">No campaigns found</h3>
                            <p className="text-txt-secondary max-w-sm mx-auto mb-8">
                                Adjust your filters or create a new campaign to get started.
                            </p>
                            <button onClick={() => { setActiveTab('all'); setSearchQuery(''); }} className="text-primary font-bold hover:underline">
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-onyx/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-card rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-8 border-b border-border-color flex justify-between items-center sticky top-0 bg-card z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-txt-primary">New Campaign</h2>
                                        <p className="text-sm text-txt-secondary">Define your requirements to find the perfect creator.</p>
                                    </div>
                                    <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-input flex items-center justify-center text-txt-secondary hover:bg-input/80 transition-colors">✕</button>
                                </div>

                                <form onSubmit={handleCreateCampaign} className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-txt-primary mb-2">Campaign Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-input border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all outline-none font-medium text-txt-primary placeholder:text-txt-secondary"
                                                placeholder="e.g. Summer Collection Launch 2024"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-txt-primary mb-2">Total Budget ($)</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.budget}
                                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                                className="w-full px-4 py-3 bg-input border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all outline-none font-medium text-txt-primary placeholder:text-txt-secondary"
                                                placeholder="5000"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-txt-primary mb-2">Category</label>
                                            <select className="w-full px-4 py-3 bg-input border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all outline-none font-medium appearance-none text-txt-primary">
                                                <option>Fashion & Lifestyle</option>
                                                <option>Tech & Gadgets</option>
                                                <option>Beauty</option>
                                                <option>Fitness</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-txt-primary mb-2">Description & Brief</label>
                                            <textarea
                                                required
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-input border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all outline-none font-medium h-32 resize-none leading-relaxed text-txt-primary placeholder:text-txt-secondary"
                                                placeholder="Describe the campaign goals, tone, and key messages..."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end gap-3 border-t border-border-color">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="px-6 py-3 text-sm font-bold text-txt-secondary hover:bg-input rounded-xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-95"
                                        >
                                            Launch Campaign
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Success"
                    message="Campaign created successfully"
                />
                <ErrorModal
                    isOpen={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    title="Error"
                    message={errorMessage}
                />
            </div>
        </DashboardLayout>
    );
}
