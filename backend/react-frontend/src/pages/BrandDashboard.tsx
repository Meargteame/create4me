import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CreateCampaignModal from "../components/CreateCampaignModal";
import {
  FaUsers,
  FaDollarSign,
  FaRocket,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaChartBar,
  FaCalendarAlt,
  FaUserCheck,
  FaEnvelope,
  FaSearch,
  FaStar,
} from "../components/icons";
import { getUserDisplayName } from "../utils/user";

const sidebarLinks = [
  {
    label: "Dashboard",
    icon: <FaChartBar size={18} />,
    path: "/brand-dashboard",
  },
  { label: "Campaigns", icon: <FaRocket size={18} />, path: "/feed" },
  { label: "Creators", icon: <FaUsers size={18} />, path: "/creators" },
  {
    label: "Analytics",
    icon: <FaChartBar size={18} />,
    path: "/business-analytics",
  },
];

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  budget?: number;
  deadline?: string;
  status?: string;
  applicantsCount?: number;
}

interface Stats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalApplicants: number;
  pendingReview: number;
  totalBudget: number;
  approvalRate: number;
  avgResponseTime: number;
  completedCampaigns: number;
}

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplicants: 0,
    pendingReview: 0,
    totalBudget: 0,
    approvalRate: 0,
    avgResponseTime: 0,
    completedCampaigns: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const campaignResponse = await apiClient.getCampaigns();

      if (campaignResponse.success) {
        const campaignsWithCount = await Promise.all(
          campaignResponse.campaigns.map(async (campaign: any) => {
            try {
              const applicantsResponse = await apiClient.getCampaignApplicants(
                campaign.id,
              );
              return {
                ...campaign,
                applicantsCount: applicantsResponse.applicants?.length || 0,
              };
            } catch {
              return { ...campaign, applicantsCount: 0 };
            }
          }),
        );

        setCampaigns(campaignsWithCount);

        // Calculate stats
        const activeCampaigns = campaignsWithCount.filter(
          (c: Campaign) => c.status === "active",
        );
        const totalApplicants = campaignsWithCount.reduce(
          (sum: number, c: Campaign) => sum + (c.applicantsCount || 0),
          0,
        );

        setStats({
          totalCampaigns: campaignsWithCount.length,
          activeCampaigns: activeCampaigns.length,
          totalApplicants,
          pendingReview: Math.floor(totalApplicants * 0.4),
          totalBudget: campaignsWithCount.length * 15000,
          approvalRate: 68,
          avgResponseTime: 2.5,
          completedCampaigns: Math.floor(campaignsWithCount.length * 0.6),
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setIsCreateModalOpen(true);
  };

  const handleCampaignCreated = () => {
    // Refresh dashboard data after campaign is created
    fetchDashboardData();
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await apiClient.deleteCampaign(id);
        setCampaigns(campaigns.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <Header />

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-3 bg-white rounded-xl shadow-lg"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Sidebar Overlay for Mobile */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 pt-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 shadow-xl
          fixed top-20 left-0 bottom-0 overflow-y-auto z-40 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-xl text-white mr-3">
              B
            </div>
            <span className="font-bold text-lg text-gray-900">
              Brand Dashboard
            </span>
          </div>
          <nav className="flex-1">
            <div className="space-y-3 sm:space-y-4">
              {sidebarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-purple-50 ${location.pathname === link.path ? "bg-purple-100 text-purple-700" : ""}`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-20 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {/* Welcome Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      Welcome back, {getUserDisplayName(user)}! 👋
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Manage your campaigns and connect with top creators
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateCampaign}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                    >
                      <FaPlus size={16} />
                      <span className="hidden sm:inline">Create Campaign</span>
                      <span className="sm:hidden">Create</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid - Responsive */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Campaign Metrics
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 lg:hidden">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                    Scroll
                  </p>
                </div>
                <div className="overflow-x-auto lg:overflow-visible custom-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
                  <div className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 min-w-min lg:min-w-0">
                    {/* Total Campaigns */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl text-white text-2xl font-bold">
                          📢
                        </div>
                        <span className="flex items-center text-white/80 text-sm font-semibold">
                          🔥 Active
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {stats.totalCampaigns}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-100 font-medium">
                        Total Campaigns
                      </div>
                      <div className="text-xs text-white/80">
                        {stats.activeCampaigns} active campaigns
                      </div>
                    </motion.div>

                    {/* Total Applicants */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                          <FaUsers className="text-white" size={24} />
                        </div>
                        <span className="flex items-center text-white/80 text-sm font-semibold">
                          ↑ +18%
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {stats.totalApplicants}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-100 font-medium">
                        Total Applicants
                      </div>
                      <div className="text-xs text-white/80">
                        {stats.pendingReview} pending review
                      </div>
                    </motion.div>

                    {/* Total Budget */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                          <FaDollarSign className="text-white" size={24} />
                        </div>
                        <span className="flex items-center text-white/80 text-sm font-semibold">
                          Budget
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">
                        ${stats.totalBudget.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-100 font-medium mb-1">
                        Total Budget
                      </div>
                      <div className="text-xs text-white/80">
                        Allocated this month
                      </div>
                    </motion.div>

                    {/* Approval Rate */}
                    {/* Pending Review */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl text-white text-2xl font-bold">
                          🏆
                        </div>
                        <span className="flex items-center text-white/80 text-sm font-semibold">
                          ⭐ Good
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">
                        {stats.approvalRate}%
                      </div>
                      <div className="text-sm text-yellow-100 font-medium mb-1">
                        Approval Rate
                      </div>
                      <div className="text-xs text-white/80">
                        Avg response: {stats.avgResponseTime}hrs
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main Content - Row Based Layout */}
              <div className="space-y-4 sm:space-y-6">
                {/* First Row - Quick Action Cards - Polished UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Create Campaign Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateCampaign}
                    className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl p-4 sm:p-6 cursor-pointer group transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center text-white">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <FaPlus size={28} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">
                        Create Campaign
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90">
                        Launch a new campaign to find creators
                      </p>
                    </div>
                  </motion.div>

                  {/* Find Creators Card */}
                  <Link to="/creators">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl p-4 sm:p-6 cursor-pointer group h-full transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                          <FaSearch size={28} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">
                          Find Creators
                        </h3>
                        <p className="text-xs sm:text-sm text-white/90">
                          Browse and discover talented creators
                        </p>
                      </div>
                    </motion.div>
                  </Link>

                  {/* Messages Card */}
                  <Link to="/network">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl p-4 sm:p-6 cursor-pointer group h-full transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                          <FaEnvelope size={28} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Messages</h3>
                        <p className="text-xs sm:text-sm text-white/90">
                          Connect with your network
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </div>

                {/* Second Row - Pending Reviews Cards - Polished UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Applicants Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/80 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-sm">
                        <FaClock className="text-orange-600" size={20} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Applicants
                      </h3>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                        {stats.pendingReview}
                      </p>
                      <p className="text-sm text-gray-600">Pending Review</p>
                    </div>
                    {stats.pendingReview > 0 && (
                      <Link to="/feed">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
                        >
                          Review Now
                        </motion.button>
                      </Link>
                    )}
                  </motion.div>

                  {/* Tasks Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/80 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                        <FaCheckCircle className="text-blue-600" size={20} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Tasks</h3>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">0</p>
                      <p className="text-sm text-gray-600">Pending Tasks</p>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed shadow-sm">
                      All Caught Up
                    </button>
                  </motion.div>

                  {/* Messages Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/80 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                        <FaEnvelope className="text-purple-600" size={20} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Messages
                      </h3>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                        0
                      </p>
                      <p className="text-sm text-gray-600">Unread Messages</p>
                    </div>
                    <Link to="/network">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                      >
                        View Inbox
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Third Row - Campaign Performance Cards - Polished UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Total Views Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl border border-blue-200/80 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaEye className="text-white" size={20} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Total Views
                      </h3>
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                      {(stats.totalCampaigns * 4500).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Campaign impressions
                    </p>
                  </motion.div>

                  {/* Completed Campaigns Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl border border-purple-200/80 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaUserCheck className="text-white" size={20} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Completed
                      </h3>
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                      {stats.completedCampaigns}
                    </p>
                    <p className="text-sm text-gray-600">Finished campaigns</p>
                  </motion.div>

                  {/* Average Rating Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl border border-green-200/80 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaStar className="text-white" size={20} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Avg Rating
                      </h3>
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                      {Math.round(stats.approvalRate * 10) / 10}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Campaign success rate
                    </p>
                  </motion.div>
                </div>

                {/* Fourth Row - Your Campaigns Header - Polished UI */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                    <FaRocket className="text-purple-600" />
                    Your Campaigns
                  </h2>
                  <motion.button
                    onClick={handleCreateCampaign}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <FaPlus size={14} />
                    New Campaign
                  </motion.button>
                </div>

                {/* Campaign Cards Row - Polished UI */}
                {campaigns.length === 0 ? (
                  {/* Recent Campaigns Section - Enhanced Polished UI */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/80 p-4 sm:p-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl shadow-lg">
                      📢
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No campaigns yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your first campaign to start finding creators
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateCampaign}
                      className="mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <FaPlus className="inline mr-2" />
                      Create Campaign
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.slice(0, 6).map((campaign, index) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/80 p-6 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {campaign.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Link to={`/projects/${campaign.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                              >
                                <FaEye size={14} />
                              </motion.button>
                            </Link>
                            <Link
                              to={`/landing-page-builder?id=${campaign.id}`}
                            >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FaEdit size={14} />
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </motion.button>
                          </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-1">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                          {campaign.description || "No description"}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaCalendarAlt size={12} />
                            <span>
                              {new Date(campaign.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <FaUsers size={12} className="text-purple-600" />
                            <span className="font-semibold text-purple-600">
                              {campaign.applicantsCount || 0}
                            </span>
                            <span className="text-gray-500">applicants</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Fourth Row - Pro Tips - Polished UI */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-200/80 p-6 backdrop-blur-sm"
                >
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                    💡 Pro Tips
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaCheckCircle
                        className="text-green-600 mt-0.5 flex-shrink-0"
                        size={18}
                      />
                      <span className="text-sm text-gray-700">
                        Clear campaign descriptions get 3x more applicants
                      </span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaCheckCircle
                        className="text-green-600 mt-0.5 flex-shrink-0"
                        size={18}
                      />
                      <span className="text-sm text-gray-700">
                        Respond to applicants within 24 hours for best results
                      </span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaCheckCircle
                        className="text-green-600 mt-0.5 flex-shrink-0"
                        size={18}
                      />
                      <span className="text-sm text-gray-700">
                        Check creator profiles before approval
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCampaignCreated}
      />
    </>
  );
}
