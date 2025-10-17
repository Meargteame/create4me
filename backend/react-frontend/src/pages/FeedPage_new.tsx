import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiClient from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaRocket,
  FaSearch,
  FaTimes,
} from "../components/icons";

interface CampaignPost {
  id: string;
  brand: {
    name: string;
    logo: string;
    verified: boolean;
  };
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  location: string;
  category: string;
  requirements: string[];
  image?: string;
  likes: number;
  comments: number;
  applications: number;
  isLiked: boolean;
  isBookmarked: boolean;
  postedAt: string;
  views: number;
}

// Mock campaign data - Enhanced
const mockCampaigns: CampaignPost[] = [
  {
    id: "1",
    brand: {
      name: "EthioCoffee",
      logo: "/api/placeholder/50/50",
      verified: true,
    },
    title: "Ethiopian Coffee Culture Campaign",
    description:
      "Looking for lifestyle creators to showcase the authentic Ethiopian coffee experience. We want to highlight the traditional coffee ceremony and modern coffee culture in Ethiopia. Perfect for creators passionate about food, culture, and storytelling.",
    budget: { min: 8000, max: 20000 },
    deadline: "2024-10-15",
    location: "Addis Ababa",
    category: "Lifestyle",
    requirements: [
      "Instagram posts (3-5)",
      "Stories (10+)",
      "Reel content",
      "50K+ followers",
    ],
    likes: 24,
    comments: 8,
    applications: 15,
    isLiked: false,
    isBookmarked: true,
    postedAt: "2 hours ago",
    views: 100,
  },
  {
    id: "2",
    brand: {
      name: "Addis Fashion",
      logo: "/api/placeholder/50/50",
      verified: false,
    },
    title: "Local Fashion Brand Launch",
    description:
      "New Ethiopian fashion brand launching sustainable clothing line. Seeking fashion influencers to showcase our eco-friendly designs inspired by Ethiopian culture.",
    budget: { min: 5000, max: 15000 },
    deadline: "2024-10-20",
    location: "Nationwide",
    category: "Fashion",
    requirements: [
      "Fashion photography",
      "Brand storytelling",
      "Sustainable fashion focus",
      "25K+ followers",
    ],
    likes: 18,
    comments: 12,
    applications: 8,
    isLiked: true,
    isBookmarked: false,
    postedAt: "5 hours ago",
    views: 50,
  },
  {
    id: "3",
    brand: {
      name: "TechHub Ethiopia",
      logo: "/api/placeholder/50/50",
      verified: true,
    },
    title: "Tech Innovation Showcase",
    description:
      "Promoting Ethiopian tech startups and innovation. Looking for tech reviewers and content creators to feature emerging technologies and startups in Ethiopia.",
    budget: { min: 12000, max: 30000 },
    deadline: "2024-11-01",
    location: "Addis Ababa",
    category: "Technology",
    requirements: [
      "Tech review content",
      "Startup interviews",
      "Innovation storytelling",
      "40K+ followers",
    ],
    likes: 31,
    comments: 6,
    applications: 22,
    isLiked: false,
    isBookmarked: true,
    postedAt: "1 day ago",
    views: 200,
  },
  {
    id: "4",
    brand: {
      name: "Ethiopian Beauty Co",
      logo: "/api/placeholder/50/50",
      verified: true,
    },
    title: "Natural Beauty Products Campaign",
    description:
      "Launch campaign for our new line of natural beauty products made from Ethiopian ingredients. Looking for beauty influencers to create authentic content.",
    budget: { min: 10000, max: 25000 },
    deadline: "2024-10-25",
    location: "Addis Ababa",
    category: "Beauty",
    requirements: [
      "Beauty tutorials",
      "Product reviews",
      "Before/after content",
      "30K+ followers",
    ],
    likes: 42,
    comments: 15,
    applications: 28,
    isLiked: true,
    isBookmarked: true,
    postedAt: "3 hours ago",
    views: 150,
  },
];

export default function FeedPage() {
  const { user: _user } = useAuth(); // For future use
  const [campaigns, setCampaigns] = useState<CampaignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignPost | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [applyingCampaignId, setApplyingCampaignId] = useState<string | null>(
    null,
  );
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    portfolioLink: "",
    deliverables: "",
  });
  const itemsPerPage = 6;

  // Fetch campaigns from backend
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      // Use getCampaigns with 'all' parameter to get all campaigns
      const response = await apiClient.getCampaigns({ all: true });

      console.log("Feed Page API Response:", response);
      console.log("Campaigns count:", response.campaigns?.length || 0);

      if (response.success && response.campaigns) {
        // Transform backend data to match frontend structure
        const transformedCampaigns = response.campaigns.map(
          (campaign: any) => ({
            id: campaign._id || campaign.id,
            _id: campaign._id,
            brand: {
              name:
                campaign.userId?.name ||
                campaign.userId?.email?.split("@")[0] ||
                "Brand",
              logo: "/api/placeholder/50/50",
              verified: true,
            },
            title: campaign.title,
            description: campaign.description || "No description provided",
            budget: campaign.budget || { min: 5000, max: 20000 },
            deadline:
              campaign.deadline ||
              campaign.updatedAt ||
              new Date().toISOString(),
            location: campaign.location || "Ethiopia",
            category: campaign.category || "General",
            requirements: campaign.requirements || [],
            likes: 0,
            comments: 0,
            applications: 0,
            isLiked: false,
            isBookmarked: false,
            postedAt: getTimeAgo(campaign.createdAt),
          }),
        );

        console.log("Transformed campaigns:", transformedCampaigns);
        setCampaigns(transformedCampaigns);
      } else {
        console.warn("No campaigns in response or unsuccessful");
        setCampaigns([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setLoading(false);
      // Show empty state on error instead of mock data
      setCampaigns([]);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const handleLike = async (campaignId: string) => {
    try {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return;

      // Optimistic update
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                isLiked: !c.isLiked,
                likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              }
            : c,
        ),
      );

      // Backend call (when endpoints are implemented)
      // if (campaign.isLiked) {
      //   await apiClient.unlikeCampaign(campaignId)
      // } else {
      //   await apiClient.likeCampaign(campaignId)
      // }
    } catch (error) {
      console.error("Error liking campaign:", error);
      showToastNotification("Failed to update like");
      // Revert on error
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                isLiked: !c.isLiked,
                likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              }
            : c,
        ),
      );
    }
  };

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBookmark = async (campaignId: string) => {
    try {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return;

      const newIsBookmarked = !campaign.isBookmarked;

      // Optimistic update
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, isBookmarked: newIsBookmarked } : c,
        ),
      );

      showToastNotification(
        newIsBookmarked ? "✓ Campaign bookmarked!" : "✓ Bookmark removed",
      );

      // Backend call (when endpoints are implemented)
      // if (newIsBookmarked) {
      //   await apiClient.bookmarkCampaign(campaignId)
      // } else {
      //   await apiClient.unbookmarkCampaign(campaignId)
      // }
    } catch (error) {
      console.error("Error bookmarking campaign:", error);
      showToastNotification("Failed to bookmark");
      // Revert on error
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, isBookmarked: !c.isBookmarked } : c,
        ),
      );
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.brand.name.toLowerCase().includes(query) ||
        campaign.requirements.some((req) => req.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filter === "all") return true;
    if (filter === "bookmarked") return campaign.isBookmarked;
    return campaign.category.toLowerCase() === filter.toLowerCase();
  });

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  const handleViewDetails = (campaign: CampaignPost) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };

  const handleQuickApply = (campaignId: string) => {
    setApplyingCampaignId(campaignId);
    setShowQuickApply(true);
    setApplicationData({
      coverLetter: "",
      portfolioLink: "",
      deliverables: "",
    });
  };

  const submitQuickApply = async () => {
    if (!applyingCampaignId) return;

    // Validation
    if (!applicationData.coverLetter.trim()) {
      showToastNotification("Please provide a cover letter");
      return;
    }

    try {
      const response = await apiClient.applyToCampaign(
        applyingCampaignId,
        applicationData.coverLetter,
        applicationData.portfolioLink,
        applicationData.deliverables,
      );

      if (response.success) {
        showToastNotification("✓ Application submitted successfully!");

        // Update campaign applications count
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === applyingCampaignId
              ? { ...c, applications: c.applications + 1 }
              : c,
          ),
        );

        setShowQuickApply(false);
        setApplyingCampaignId(null);
        setApplicationData({
          coverLetter: "",
          portfolioLink: "",
          deliverables: "",
        });
      }
    } catch (error: any) {
      console.error("Error applying to campaign:", error);
      showToastNotification(error.message || "Failed to submit application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Add breathing space after header */}
      <div className="h-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Header Text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-gray-700 text-center text-lg">
            Discover the latest brand campaigns • {campaigns.length}{" "}
            opportunities available
          </p>
        </motion.div>

        {/* Campaign Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Campaigns
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {campaigns.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaRocket className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  New This Week
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    campaigns.filter((c) => c.postedAt.includes("hours ago"))
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-between">
                <FaClock className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Budget</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.round(
                    campaigns.reduce(
                      (acc, c) => acc + (c.budget.min + c.budget.max) / 2,
                      0,
                    ) / campaigns.length,
                  ).toLocaleString()}{" "}
                  ETB
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bookmarked</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {campaigns.filter((c) => c.isBookmarked).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaBookmark className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Changed to flex layout for proper left sidebar */}
        <div className="flex gap-6">
          {/* Sidebar Filters - Glassmorphic - Fixed Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <FaFilter className="text-blue-600" size={18} />
                Filters
              </h3>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              {/* Category Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                  Categories
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    "all",
                    "lifestyle",
                    "fashion",
                    "technology",
                    "beauty",
                    "food",
                  ].map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setFilter(category)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2.5 text-left rounded-xl font-medium transition-all duration-300 ${
                        filter === category
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category === "all"
                        ? "✨ All Categories"
                        : `${category.charAt(0).toUpperCase() + category.slice(1)}`}
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* Quick Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                  Quick Filters
                </h4>
                <motion.button
                  onClick={() => setFilter("bookmarked")}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-4 py-2.5 text-left rounded-xl font-medium transition-all duration-300 ${
                    filter === "bookmarked"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaBookmark className="inline mr-2" />
                  Bookmarked
                </motion.button>
              </div>
              please continue with the update
              {/* Sort By */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                >
                  <option value="recent">🕐 Most Recent</option>
                  <option value="budget">💰 Highest Budget</option>
                  <option value="deadline">⏰ Deadline Soon</option>
                  <option value="popular">🔥 Most Popular</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Campaign Feed - Takes remaining space */}
          <div className="flex-1">
            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
              >
                <FaFilter size={16} />
                <span>
                  {showMobileFilters ? "Hide Filters" : "Show Filters"}
                </span>
              </button>
            </div>

            {/* Active Filters Display */}
            {(filter !== "all" || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex flex-wrap gap-2"
              >
                {searchQuery && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <FaSearch size={12} />
                    <span>"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                {filter !== "all" && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <span>
                      {filter === "bookmarked"
                        ? "🔖 Bookmarked"
                        : `📁 ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                    </span>
                    <button
                      onClick={() => setFilter("all")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                {(filter !== "all" || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                    }}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium underline"
                  >
                    Clear all
                  </button>
                )}
              </motion.div>
            )}

            {loading ? (
              // Loading Skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-3xl p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-300 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : filteredCampaigns.length === 0 ? (
              // Context-Aware Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm"
              >
                {searchQuery ? (
                  <>
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No results for "{searchQuery}"
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try different keywords or check your spelling.
                    </p>
                    <motion.button
                      onClick={() => setSearchQuery("")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm"
                    >
                      Clear Search
                    </motion.button>
                  </>
                ) : filter === "bookmarked" ? (
                  <>
                    <div className="text-6xl mb-4">🔖</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No bookmarked campaigns
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start bookmarking campaigns you're interested in!
                    </p>
                    <motion.button
                      onClick={() => setFilter("all")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm"
                    >
                      View All Campaigns
                    </motion.button>
                  </>
                ) : filter !== "all" ? (
                  <>
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No {filter} campaigns
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try browsing other categories to find opportunities.
                    </p>
                    <motion.button
                      onClick={() => setFilter("all")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm"
                    >
                      View All Categories
                    </motion.button>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No campaigns available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Check back soon for new opportunities!
                    </p>
                  </>
                )}
              </motion.div>
            ) : (
              // Campaign Cards - Horizontal Scrollable Layout
              <div className="relative">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Available Campaigns
                  </h2>
                </div>
                {/* Grid Layout for Campaigns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {paginatedCampaigns.map((campaign, index) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-white to-blue-50/30 border-2 border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group"
                      >
                        {/* Campaign Header - Compact with gradient accent */}
                        <div className="p-5 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                {/* Brand Logo with Fallback Icon */}
                                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                                  <FaRocket className="text-white" size={18} />
                                </div>
                                {campaign.brand.verified && (
                                  <div className="absolute -bottom-0.5 -right-0.5 bg-blue-700 rounded-full p-0.5">
                                    <FaCheckCircle
                                      className="text-white"
                                      size={12}
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-sm text-gray-800">
                                  {campaign.title}
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaClock size={10} />
                                  {campaign.postedAt}
                                </p>
                              </div>
                            </div>

                            <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-bold">
                              {campaign.category}
                            </span>
                          </div>

                          {/* Campaign Title & Description - Smaller */}
                          <h2 className="text-lg font-bold mb-2 text-gray-800 transition-all duration-300">
                            {campaign.title}
                          </h2>

                          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                            {campaign.description}
                          </p>

                          {/* Campaign Stats Grid - Enhanced with gradient backgrounds */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 px-3 py-2 rounded-xl">
                              <FaDollarSign
                                className="text-blue-600 flex-shrink-0"
                                size={16}
                              />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">
                                  Budget
                                </p>
                                <p className="text-sm font-bold text-gray-800 truncate">
                                  ${campaign.budget.min.toLocaleString()}-$
                                  {campaign.budget.max.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 px-3 py-2 rounded-xl">
                              <FaCalendarAlt
                                className="text-green-600 flex-shrink-0"
                                size={16}
                              />
                              <div>
                                <p className="text-xs text-gray-500 mb-0.5">
                                  Deadline
                                </p>
                                <p className="text-sm font-bold text-gray-800">
                                  {getDaysUntilDeadline(campaign.deadline)} days
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 px-3 py-2 rounded-xl">
                              <FaMapMarkerAlt
                                className="text-purple-600 flex-shrink-0"
                                size={16}
                              />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">
                                  Location
                                </p>
                                <p className="text-sm font-bold text-gray-800 truncate">
                                  {campaign.location}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 px-3 py-2 rounded-xl">
                              <FaUsers
                                className="text-orange-600 flex-shrink-0"
                                size={16}
                              />
                              <div>
                                <p className="text-xs text-gray-500 mb-0.5">
                                  Applicants
                                </p>
                                <p className="text-sm font-bold text-gray-800">
                                  {campaign.applications}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Requirements - Enhanced */}
                          <div className="mb-4">
                            <h4 className="text-sm font-bold mb-2 text-gray-700 flex items-center gap-1">
                              <FaCheckCircle
                                className="text-blue-600"
                                size={14}
                              />
                              Requirements
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {campaign.requirements.map((req, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-white border-2 border-blue-100 text-gray-700 rounded-lg text-xs font-medium hover:border-blue-300 transition-colors"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions Bar - Enhanced with gradient */}
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t-2 border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => handleLike(campaign.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
                                  campaign.isLiked
                                    ? "text-blue-600 bg-blue-100"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                <FaHeart size={14} />
                                <span className="font-medium">
                                  {campaign.likes}
                                </span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                              >
                                <FaComment size={14} />
                                <span className="font-medium">
                                  {campaign.comments}
                                </span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <FaShare size={14} />
                              </motion.button>
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => handleBookmark(campaign.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  campaign.isBookmarked
                                    ? "text-blue-600 bg-blue-100"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                <FaBookmark size={14} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleViewDetails(campaign)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all"
                              >
                                Details
                              </motion.button>

                              <motion.button
                                onClick={() => handleQuickApply(campaign.id)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                              >
                                <span>Apply Now</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {filteredCampaigns.length > itemsPerPage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                      }`}
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                    <FaRocket className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {selectedCampaign.brand.name}
                      {selectedCampaign.brand.verified && (
                        <FaCheckCircle className="text-blue-600" size={16} />
                      )}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedCampaign.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="text-gray-600" size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Campaign Title */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCampaign.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedCampaign.description}
                  </p>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <FaDollarSign size={18} />
                      <span className="text-sm font-semibold">Budget</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedCampaign.budget.min.toLocaleString()}-
                      {selectedCampaign.budget.max.toLocaleString()} ETB
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <FaCalendarAlt size={18} />
                      <span className="text-sm font-semibold">Deadline</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {getDaysUntilDeadline(selectedCampaign.deadline)} days
                      left
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <FaMapMarkerAlt size={18} />
                      <span className="text-sm font-semibold">Location</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedCampaign.location}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <FaUsers size={18} />
                      <span className="text-sm font-semibold">
                        Applications
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedCampaign.applications}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    Requirements
                  </h4>
                  <div className="space-y-2">
                    {selectedCampaign.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheckCircle
                          className="text-blue-600 mt-1 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaHeart
                          className={
                            selectedCampaign.isLiked ? "text-blue-600" : ""
                          }
                          size={18}
                        />
                        <span className="font-medium">
                          {selectedCampaign.likes} likes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaComment size={18} />
                        <span className="font-medium">
                          {selectedCampaign.comments} comments
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Posted {selectedCampaign.postedAt}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={() => {
                      handleQuickApply(selectedCampaign.id);
                      setShowDetailModal(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Apply Now
                  </motion.button>
                  <motion.button
                    onClick={() => handleBookmark(selectedCampaign.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedCampaign.isBookmarked
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FaBookmark size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <FaShare size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Dynamic Apply Modal */}
      <AnimatePresence>
        {showQuickApply &&
          applyingCampaignId &&
          (() => {
            const campaign = campaigns.find((c) => c.id === applyingCampaignId);
            if (!campaign) return null;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={() => setShowQuickApply(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-100"
                >
                  {/* Modal Header with Campaign Info */}
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center ring-2 ring-white/50">
                          <FaRocket className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            Apply to Campaign
                          </h3>
                          <p className="text-blue-100 text-sm">
                            {campaign.brand.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowQuickApply(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <FaTimes className="text-white" size={20} />
                      </button>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                      <h4 className="text-lg font-bold text-white mb-2">
                        {campaign.title}
                      </h4>
                      <p className="text-blue-50 text-sm line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>
                  </div>

                  {/* Campaign Details Summary */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FaCheckCircle className="text-blue-600" />
                      Campaign Overview
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FaDollarSign className="text-blue-600" size={16} />
                          <span className="text-xs text-gray-600 font-semibold">
                            Budget Range
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          ${campaign.budget.min.toLocaleString()} - $
                          {campaign.budget.max.toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FaCalendarAlt className="text-green-600" size={16} />
                          <span className="text-xs text-gray-600 font-semibold">
                            Deadline
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {getDaysUntilDeadline(campaign.deadline)} days left
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FaMapMarkerAlt
                            className="text-purple-600"
                            size={16}
                          />
                          <span className="text-xs text-gray-600 font-semibold">
                            Location
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {campaign.location}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUsers className="text-orange-600" size={16} />
                          <span className="text-xs text-gray-600 font-semibold">
                            Applicants
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.applications}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Section */}
                  {campaign.requirements.length > 0 && (
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/20 border-b border-gray-200">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FaCheckCircle className="text-blue-600" />
                        Campaign Requirements
                      </h4>
                      <div className="space-y-2">
                        {campaign.requirements.map((req, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FaCheckCircle
                                className="text-blue-600"
                                size={12}
                              />
                            </div>
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Form */}
                  <div className="p-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <FaRocket className="text-blue-600" />
                      Your Application
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Why are you a good fit for this campaign?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={applicationData.coverLetter}
                          onChange={(e) =>
                            setApplicationData((prev) => ({
                              ...prev,
                              coverLetter: e.target.value,
                            }))
                          }
                          placeholder="Tell us about your experience anzd why you're interested..."
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Portfolio Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={applicationData.portfolioLink}
                          onChange={(e) =>
                            setApplicationData((prev) => ({
                              ...prev,
                              portfolioLink: e.target.value,
                            }))
                          }
                          placeholder="https://your-portfolio.com"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expected Deliverables
                        </label>
                        <textarea
                          rows={3}
                          value={applicationData.deliverables}
                          onChange={(e) =>
                            setApplicationData((prev) => ({
                              ...prev,
                              deliverables: e.target.value,
                            }))
                          }
                          placeholder="Describe what you'll deliver..."
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <motion.button
                          onClick={handleQuickApply}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          Submit Application
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setShowQuickApply(false);
                            setApplyingCampaignId(null);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
