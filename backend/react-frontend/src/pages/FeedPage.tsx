import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FaSpinner,
} from "../components/icons/index.js";

interface CampaignPost {
  id: string;
  _id?: string;
  brand?: {
    name: string;
    logo: string;
    verified: boolean;
  };
  userId?: {
    id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  budget?: {
    min: number;
    max: number;
  };
  deadline?: string;
  location?: string;
  category?: string;
  requirements?: string[];
  image?: string;
  likes?: number;
  comments?: number;
  applications?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  postedAt?: string;
  createdAt?: string;
  status?: string;
}

export default function FeedPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call different endpoint based on user role
      // Creators see all campaigns, brands see their own campaigns
      let response;
      if (user?.role === "creator") {
        // For creators, get all campaigns
        response = await apiClient.getCampaigns({ all: true });
      } else if (user?.role === "brand") {
        // For brands, get their own campaigns
        response = await apiClient.getCampaigns();
      } else {
        // If no user or unknown role, try to get all
        response = await apiClient.getCampaigns({ all: true });
      }

      if (response.success && response.campaigns) {
        // Transform backend data to match frontend interface
        const transformedCampaigns = response.campaigns.map(
          (campaign: any) => ({
            id: campaign.id || campaign._id,
            _id: campaign._id,
            brand: campaign.userId
              ? {
                  name: campaign.userId.name || "Unknown Brand",
                  logo: "/api/placeholder/50/50",
                  verified: false,
                }
              : {
                  name: "Unknown Brand",
                  logo: "/api/placeholder/50/50",
                  verified: false,
                },
            title: campaign.title,
            description: campaign.description || "No description available",
            budget: campaign.budget || { min: 0, max: 0 },
            deadline:
              campaign.deadline ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            location: campaign.location || "Not specified",
            category: campaign.category || "General",
            requirements: campaign.requirements || [],
            image: campaign.image || "/api/placeholder/600/300",
            likes: campaign.likes || 0,
            comments: campaign.comments || 0,
            applications: campaign.applications || 0,
            isLiked: campaign.isLiked || false,
            isBookmarked: campaign.isBookmarked || false,
            postedAt: formatPostedTime(campaign.createdAt),
            createdAt: campaign.createdAt,
            status: campaign.status || "active",
          }),
        );

        setCampaigns(transformedCampaigns);
      } else {
        setCampaigns([]);
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
      setError(error.message || "Failed to load campaigns");
      setCampaigns([]);
      setLoading(false);
    }
  };

  const formatPostedTime = (dateString?: string) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const handleLike = async (campaignId: string) => {
    try {
      // Optimistic update
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId
            ? {
                ...campaign,
                isLiked: !campaign.isLiked,
                likes: campaign.isLiked
                  ? (campaign.likes || 0) - 1
                  : (campaign.likes || 0) + 1,
              }
            : campaign,
        ),
      );

      // Make API call (you'll need to implement this endpoint)
      // await apiClient.likeCampaign(campaignId)
    } catch (error) {
      console.error("Error liking campaign:", error);
      // Revert on error
      fetchCampaigns();
    }
  };

  const handleBookmark = async (campaignId: string) => {
    try {
      // Optimistic update
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, isBookmarked: !campaign.isBookmarked }
            : campaign,
        ),
      );

      // Make API call (you'll need to implement this endpoint)
      // await apiClient.bookmarkCampaign(campaignId)
    } catch (error) {
      console.error("Error bookmarking campaign:", error);
      // Revert on error
      fetchCampaigns();
    }
  };

  const handleApply = (campaignId: string) => {
    // Navigate to application page or open modal
    console.log("Applying to campaign:", campaignId);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter === "all") return true;
    if (filter === "bookmarked") return campaign.isBookmarked;
    return campaign.category?.toLowerCase() === filter.toLowerCase();
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
      );
    }
    if (sortBy === "budget") {
      return (b.budget?.max || 0) - (a.budget?.max || 0);
    }
    return 0;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Campaign Feed
          </h1>
          <p style={{ color: "#6b7280" }}>
            Discover the latest brand campaigns and collaboration opportunities.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            gap: "2rem",
          }}
        >
          {/* Sidebar Filters */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              height: "fit-content",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaFilter size={16} />
              Filters
            </h3>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                Category
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[
                  "all",
                  "lifestyle",
                  "fashion",
                  "technology",
                  "food",
                  "beauty",
                  "general",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      textAlign: "left",
                      border: "none",
                      borderRadius: "0.375rem",
                      backgroundColor:
                        filter === category ? "#dbeafe" : "transparent",
                      color: filter === category ? "#1d4ed8" : "#6b7280",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s",
                    }}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                Sort By
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => setSortBy("recent")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    textAlign: "left",
                    border: "none",
                    borderRadius: "0.375rem",
                    backgroundColor:
                      sortBy === "recent" ? "#dbeafe" : "transparent",
                    color: sortBy === "recent" ? "#1d4ed8" : "#6b7280",
                    cursor: "pointer",
                  }}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => setSortBy("budget")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    textAlign: "left",
                    border: "none",
                    borderRadius: "0.375rem",
                    backgroundColor:
                      sortBy === "budget" ? "#dbeafe" : "transparent",
                    color: sortBy === "budget" ? "#1d4ed8" : "#6b7280",
                    cursor: "pointer",
                  }}
                >
                  Highest Budget
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                Quick Filters
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => setFilter("bookmarked")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    textAlign: "left",
                    border: "none",
                    borderRadius: "0.375rem",
                    backgroundColor:
                      filter === "bookmarked" ? "#dbeafe" : "transparent",
                    color: filter === "bookmarked" ? "#1d4ed8" : "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaBookmark size={14} />
                  Bookmarked
                </button>
              </div>
            </div>
          </div>

          {/* Campaign Feed */}
          <div>
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "4rem",
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                }}
              >
                <FaSpinner className="animate-spin" size={32} color="#3b82f6" />
                <span style={{ marginLeft: "1rem", color: "#6b7280" }}>
                  Loading campaigns...
                </span>
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#fee2e2",
                  borderRadius: "0.75rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#dc2626", fontWeight: "500" }}>
                  Failed to load campaigns
                </p>
                <p
                  style={{
                    color: "#991b1b",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={fetchCampaigns}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && sortedCampaigns.length === 0 && (
              <div
                style={{
                  padding: "4rem",
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>
                  No campaigns found
                </p>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              sortedCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* Campaign Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <img
                        src={campaign.brand?.logo}
                        alt={campaign.brand?.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              color: "#111827",
                            }}
                          >
                            {campaign.brand?.name}
                          </h3>
                          {campaign.brand?.verified && (
                            <span
                              style={{
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                padding: "0.125rem 0.5rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                              }}
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          {campaign.postedAt}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(campaign.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                      }}
                    >
                      <FaBookmark
                        size={20}
                        color={campaign.isBookmarked ? "#3b82f6" : "#d1d5db"}
                      />
                    </button>
                  </div>

                  {/* Campaign Content */}
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {campaign.title}
                    </h2>
                    <p
                      style={{
                        color: "#4b5563",
                        marginBottom: "1rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {campaign.description}
                    </p>

                    {campaign.image && (
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                          marginBottom: "1rem",
                        }}
                      />
                    )}

                    {/* Campaign Details */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FaDollarSign color="#10b981" />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          Budget: ETB {campaign.budget?.min?.toLocaleString()} -{" "}
                          {campaign.budget?.max?.toLocaleString()}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FaCalendarAlt color="#f59e0b" />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          Deadline:{" "}
                          {campaign.deadline
                            ? new Date(campaign.deadline).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FaMapMarkerAlt color="#ef4444" />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          {campaign.location}
                        </span>
                      </div>
                    </div>

                    {/* Requirements */}
                    {campaign.requirements &&
                      campaign.requirements.length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                          <h4
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#374151",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Requirements:
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            {campaign.requirements.map((req, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  color: "#4b5563",
                                }}
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </Link>

                  {/* Campaign Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(campaign.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: campaign.isLiked ? "#ef4444" : "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        <FaHeart size={18} />
                        <span>{campaign.likes || 0}</span>
                      </button>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        <FaComment size={18} />
                        <span>{campaign.comments || 0}</span>
                      </button>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        <FaUsers size={18} />
                        <span>{campaign.applications || 0} applications</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(campaign.id);
                      }}
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2563eb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#3b82f6";
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
