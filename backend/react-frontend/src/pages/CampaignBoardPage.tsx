import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiClient from "../lib/api";
import {
  FaSearch,
  FaClock,
  FaDollarSign,
  FaRocket,
  FaFilter,
  FaTimes,
} from "../components/icons";
import { FaBuilding } from "react-icons/fa";
import { CardSkeleton } from "../components/ui/LoadingStates";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  budget?: number;
  deadline?: string;
  category?: string;
  user: {
    email: string;
  };
}

type SortOption =
  | "newest"
  | "oldest"
  | "budget-high"
  | "budget-low"
  | "deadline";

export default function CampaignBoardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [deadlineFilter, setDeadlineFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await apiClient.getAllCampaigns();
        if (response.success) {
          setCampaigns(response.campaigns);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const categories = [
    "Marketing",
    "Content Creation",
    "Social Media",
    "Product Launch",
    "Influencer",
    "Photography",
    "Video",
    "Other",
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setBudgetMin("");
    setBudgetMax("");
    setSelectedCategory("");
    setDeadlineFilter("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    budgetMin ||
    budgetMax ||
    selectedCategory ||
    deadlineFilter ||
    sortBy !== "newest";

  // Filter campaigns
  let filteredCampaigns = campaigns.filter((campaign) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower) ||
        campaign.user.email.toLowerCase().includes(searchLower) ||
        campaign.category?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Budget filter
    if (budgetMin && campaign.budget && campaign.budget < Number(budgetMin))
      return false;
    if (budgetMax && campaign.budget && campaign.budget > Number(budgetMax))
      return false;

    // Category filter
    if (selectedCategory && campaign.category !== selectedCategory)
      return false;

    // Deadline filter
    if (deadlineFilter && campaign.deadline) {
      const daysUntilDeadline = Math.ceil(
        (new Date(campaign.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (deadlineFilter === "7" && daysUntilDeadline > 7) return false;
      if (deadlineFilter === "30" && daysUntilDeadline > 30) return false;
      if (deadlineFilter === "90" && daysUntilDeadline > 90) return false;
    }

    return true;
  });

  // Sort campaigns
  filteredCampaigns.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "budget-high":
        return (b.budget || 0) - (a.budget || 0);
      case "budget-low":
        return (a.budget || 0) - (b.budget || 0);
      case "deadline":
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalItems = filteredCampaigns.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 pt-24">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Find Your Next Collaboration
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Browse campaigns from top brands and apply to work with them.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-4xl mx-auto">
          <div className="relative">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by keyword, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <FaFilter size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  Active
                </span>
              )}
            </button>

            <div className="flex items-center gap-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  <FaTimes size={14} />
                  Clear All
                </button>
              )}

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
                  <option value="deadline">Ending Soon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget Range (ETB)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <select
                    value={deadlineFilter}
                    onChange={(e) => setDeadlineFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">Any Time</option>
                    <option value="7">Within 7 days</option>
                    <option value="30">Within 30 days</option>
                    <option value="90">Within 90 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && filteredCampaigns.length > 0 && (
          <div className="mb-6 max-w-4xl mx-auto">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {startIndex + 1}-{Math.min(endIndex, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
              {totalItems === 1 ? "campaign" : "campaigns"}
            </p>
          </div>
        )}

        {/* Campaign Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <EmptyState
            icon={<FaRocket size={64} />}
            title="No campaigns found"
            description={
              hasActiveFilters
                ? "Try adjusting your filters or search terms to see more results"
                : "Check back later for new campaign opportunities from brands"
            }
            actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCampaigns.map((campaign) => {
                const daysUntilDeadline = campaign.deadline
                  ? Math.ceil(
                      (new Date(campaign.deadline).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    )
                  : null;
                const isUrgent =
                  daysUntilDeadline !== null && daysUntilDeadline <= 7;

                return (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {campaign.title}
                          </h2>
                          {campaign.category && (
                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                              {campaign.category}
                            </span>
                          )}
                        </div>
                        {isUrgent && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">
                            Urgent
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 h-12 line-clamp-2 text-sm">
                        {campaign.description}
                      </p>

                      {/* Info Grid */}
                      <div className="space-y-2 mb-4">
                        {campaign.budget && (
                          <div className="flex items-center text-sm text-gray-700">
                            <FaDollarSign
                              className="mr-2 text-green-600"
                              size={16}
                            />
                            <span className="font-semibold">
                              {campaign.budget.toLocaleString()} ETB
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-600">
                          <FaBuilding className="mr-2" size={14} />
                          <span>{campaign.user.email.split("@")[0]}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-2" size={14} />
                          <span>
                            Posted{" "}
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {campaign.deadline && (
                          <div
                            className={`flex items-center text-sm font-medium ${isUrgent ? "text-red-600" : "text-gray-700"}`}
                          >
                            <FaClock className="mr-2" size={14} />
                            <span>
                              Deadline:{" "}
                              {daysUntilDeadline !== null &&
                              daysUntilDeadline > 0
                                ? `${daysUntilDeadline} day${daysUntilDeadline > 1 ? "s" : ""} left`
                                : "Expired"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Link
                        to={`/campaign/${campaign.id}`}
                        className="block w-full text-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        View Details & Apply
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName="campaigns"
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
