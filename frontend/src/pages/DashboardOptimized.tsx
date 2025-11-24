import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaRocket,
    FaUsers,
    FaChartLine,
    FaDollarSign,
    FaEye,
    FaCheckCircle,
    FaClock,
    FaArrowUp,
    FaArrowRight,
    FaFire,
    FaShieldAlt,
    FaBolt,
    FaComments
} from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardPageOptimized() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        newCampaignsToday: 12,
        pendingPayouts: 4500,
        activeCampaigns: 3,
        totalEarnings: 25000,
        creatorsAppliedThisWeek: 45,
        campaignsNeedingReview: 7,
        unreadMessages: 3,
        avgEngagementRate: 5.8
    });
    const [loading, setLoading] = useState(false);

    const isCreator = user?.role === 'creator';
    const isBrand = user?.role === 'brand';

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Hero At-a-Glance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white"
                    style={{
                        boxShadow: '0 10px 40px rgba(22, 163, 74, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <FaShieldAlt className="text-3xl" />
                            <h2 className="text-xl font-bold">
                                {isCreator ? 'Your Secure Opportunity Hub' : 'Your Verified Creator Network'}
                            </h2>
                        </div>

                        {/* AT-A-GLANCE CRITICAL NUMBER - 7XL */}
                        <div className="mb-6">
                            <div className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">
                                {isCreator ? 'New Secure Campaigns Posted Today' : 'Verified Creators Applied This Week'}
                            </div>
                            <div className="text-8xl font-black mb-4" style={{ lineHeight: '1' }}>
                                {isCreator ? stats.newCampaignsToday : stats.creatorsAppliedThisWeek}
                            </div>
                            <p className="text-lg opacity-90 max-w-2xl">
                                {isCreator
                                    ? 'Fresh opportunities from vetted Ethiopian brands. Apply now to secure your spot!'
                                    : 'High-quality Ethiopian creators ready for collaboration. Start secure chats today!'}
                            </p>
                        </div>

                        {/* Primary CTA */}
                        <Link
                            to={isCreator ? '/feed' : '/creators'}
                            className="cta-pulse inline-flex items-center gap-3 px-8 py-4 bg-white text-green-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                        >
                            {isCreator ? (
                                <>
                                    <FaBolt />
                                    Find Secure Campaigns
                                    <FaArrowRight />
                                </>
                            ) : (
                                <>
                                    <FaUsers />
                                    Discover Vetted Creators
                                    <FaArrowRight />
                                </>
                            )}
                        </Link>
                    </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-3d-tilt bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                <FaRocket className="text-2xl text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <FaArrowUp className="text-xs" />
                                Active
                            </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            {isCreator ? stats.activeCampaigns : stats.campaignsNeedingReview}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                            {isCreator ? 'Active Campaigns' : 'Campaigns Needing Review'}
                        </div>
                    </motion.div>

                    {/* Stat Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-3d-tilt bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                <FaDollarSign className="text-2xl text-green-600" />
                            </div>
                            {isCreator && stats.pendingPayouts > 0 && (
                                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <FaClock className="text-xs" />
                                    Pending
                                </span>
                            )}
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            {isCreator ? `${stats.pendingPayouts.toLocaleString()} ETB` : `${stats.unreadMessages}`}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                            {isCreator ? 'Pending Payouts' : 'Unread Messages'}
                        </div>
                    </motion.div>

                    {/* Stat Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-3d-tilt bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                <FaChartLine className="text-2xl text-purple-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            {isCreator ? `${stats.totalEarnings.toLocaleString()} ETB` : `${stats.avgEngagementRate}%`}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                            {isCreator ? 'Total Earnings' : 'Avg Creator Engagement'}
                        </div>
                    </motion.div>

                    {/* Stat Card 4 - Messages */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card-3d-tilt bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-white"
                        style={{
                            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2), 0 10px 24px rgba(22, 163, 74, 0.15)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <FaComments className="text-2xl text-white" />
                            </div>
                            <FaShieldAlt className="text-xl opacity-50" />
                        </div>
                        <div className="text-3xl font-black mb-1">
                            {stats.unreadMessages}
                        </div>
                        <div className="text-sm font-medium opacity-90 mb-3">
                            Secure Messages
                        </div>
                        <Link
                            to="/messages"
                            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                        >
                            View All <FaArrowRight className="text-xs" />
                        </Link>
                    </motion.div>
                </div>

                {/* Recent Activity / Empty State */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FaFire className="text-orange-500" />
                        {isCreator ? 'Quick Actions' : 'Recent Activity'}
                    </h3>

                    {/* Empty State Example (when no active campaigns) */}
                    {isCreator && stats.activeCampaigns === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-md"
                            style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                <FaRocket className="text-6xl text-green-600" />
                            </div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-3">
                                Ready to start earning?
                            </h4>
                            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                                You don't have any active campaigns yet. Browse {stats.newCampaignsToday} new secure opportunities posted today from verified Ethiopian brands!
                            </p>
                            <Link
                                to="/feed"
                                className="cta-pulse inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                                style={{
                                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                                }}
                            >
                                <FaBolt />
                                Find Your First Secure Campaign
                                <FaArrowRight />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Activity Cards */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaCheckCircle className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">New Application</h5>
                                        <p className="text-sm text-gray-600">Sarah applied to "Tech Product Launch"</p>
                                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaComments className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">New Message</h5>
                                        <p className="text-sm text-gray-600">Brand X sent you a proposal</p>
                                        <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
