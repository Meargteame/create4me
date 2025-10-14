import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import apiClient from '../lib/api'
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaStar,
  FaCheckCircle,
  FaGrid3X3,
  FaList,
  FaTimes,
  FaFilter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
  FaFacebook,
  FaEnvelope,
  FaHeart,
  FaBookmark
} from '../components/icons'

interface Creator {
  id: string
  name: string
  username: string
  avatar: string
  category: string
  location: string
  bio: string
  rating: number
  totalReviews: number
  verified: boolean
  platforms: string[]
  contentTypes: string[]
  isAvailable: boolean
  followers: number
  engagement: number
  completedCampaigns: number
  priceRange: {
    min: number
    max: number
  }
  email?: string
  isLiked?: boolean
  isBookmarked?: boolean
}

export default function CreatorsPage_New() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [stats, setStats] = useState({ total: 0, available: 0, avgRating: 0, bookmarked: 0 })
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    fetchCreators()
  }, [searchQuery, categoryFilter, locationFilter, availabilityFilter, sortBy, currentPage])

  const fetchCreators = async () => {
    try {
      setLoading(true)
      
      const response = await apiClient.getCreators({
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        location: locationFilter !== 'all' ? locationFilter : undefined,
        available: availabilityFilter === 'available' ? true : undefined,
        sortBy,
        page: currentPage,
        limit: itemsPerPage
      })

      // Map backend data to frontend format
      const mappedCreators = response.creators.map((creator: any) => ({
        id: creator.id,
        name: creator.displayName,
        username: creator.username,
        avatar: creator.avatar || '/api/placeholder/100/100',
        category: creator.category,
        location: creator.location || 'Remote',
        bio: creator.bio || '',
        rating: creator.rating,
        totalReviews: 0, // Add to backend if needed
        verified: creator.isVerified,
        platforms: Array.isArray(creator.platforms) ? creator.platforms : JSON.parse(creator.platforms || '[]'),
        contentTypes: [], // Add to backend if needed
        isAvailable: creator.isAvailable,
        followers: creator.followers,
        engagement: creator.engagement,
        completedCampaigns: creator.completedCampaigns,
        priceRange: creator.priceRange || { min: 0, max: 0 },
        isLiked: creator.isLiked || false,
        isBookmarked: creator.isBookmarked || false
      }))

      setCreators(mappedCreators)
      setStats(response.stats)
      setTotalPages(response.pagination.totalPages)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching creators:', error)
      showToastNotification('Failed to load creators. Please check your connection.')
      setCreators([])
      setLoading(false)
    }
  }

  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLike = async (creatorId: string) => {
    try {
      const previousState = creators.find(c => c.id === creatorId)?.isLiked

      // Optimistic update
      setCreators(prev => prev.map(c => 
        c.id === creatorId 
          ? { ...c, isLiked: !c.isLiked }
          : c
      ))

      const response = await apiClient.likeCreator(creatorId)
      showToastNotification(response.message || (previousState ? 'Creator unliked' : 'Creator liked!'))
    } catch (error) {
      console.error('Error liking creator:', error)
      // Revert on error
      setCreators(prev => prev.map(c => 
        c.id === creatorId 
          ? { ...c, isLiked: !c.isLiked }
          : c
      ))
      showToastNotification('Failed to update like')
    }
  }

  const handleBookmark = async (creatorId: string) => {
    try {
      const creator = creators.find(c => c.id === creatorId)
      if (!creator) return

      const newIsBookmarked = !creator.isBookmarked

      // Optimistic update
      setCreators(prev => prev.map(c => 
        c.id === creatorId 
          ? { ...c, isBookmarked: newIsBookmarked }
          : c
      ))

      const response = await apiClient.bookmarkCreator(creatorId)
      showToastNotification(response.message || (newIsBookmarked ? '✓ Creator bookmarked!' : '✓ Bookmark removed'))
    } catch (error) {
      console.error('Error bookmarking creator:', error)
      // Revert on error
      setCreators(prev => prev.map(c => 
        c.id === creatorId 
          ? { ...c, isBookmarked: !c.isBookmarked }
          : c
      ))
      showToastNotification('Failed to bookmark')
    }
  }

  const handleViewDetails = (creator: Creator) => {
    setSelectedCreator(creator)
    setShowDetailModal(true)
  }

  // Creators are already filtered and sorted by backend
  const paginatedCreators = creators

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <FaInstagram />
      case 'youtube': return <FaYoutube />
      case 'linkedin': return <FaLinkedin />
      case 'tiktok': return <FaTiktok />
      case 'facebook': return <FaFacebook />
      default: return null
    }
  }

  const categories = ['all', 'lifestyle', 'technology', 'beauty', 'food & travel', 'fashion', 'fitness']
  const locations = ['all', 'addis ababa', 'bahir dar', 'dire dawa', 'mekelle', 'hawassa']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breathing space */}
      <div className="h-24" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Creators
          </h1>
          <p className="text-gray-600">
            Connect with talented Ethiopian creators • {creators.length} creators available
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Creators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Now</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.available}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.avgRating.toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bookmarked</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.bookmarked}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaBookmark className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Layout */}
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <FaFilter className="text-blue-600" size={18} />
                Filters
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Category</h4>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <motion.button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2.5 text-left rounded-xl font-medium transition-all ${
                        categoryFilter === category
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? '✨ All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Location</h4>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? '📍 All Locations' : location.charAt(0).toUpperCase() + location.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Availability</h4>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Creators</option>
                  <option value="available">Available Now</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="followers">👥 Most Followers</option>
                  <option value="engagement">📈 Best Engagement</option>
                  <option value="campaigns">🚀 Most Campaigns</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Creators Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & View Switcher */}
            <div className="flex items-center justify-between mb-6">
              <div className="lg:hidden">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-sm"
                >
                  <FaFilter size={16} />
                  <span>{showMobileFilters ? 'Hide' : 'Show'} Filters</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaGrid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaList size={18} />
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || categoryFilter !== 'all' || locationFilter !== 'all' || availabilityFilter !== 'all') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex flex-wrap gap-2"
              >
                {searchQuery && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <FaSearch size={12} />
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                {categoryFilter !== 'all' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <span>📁 {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}</span>
                    <button onClick={() => setCategoryFilter('all')} className="hover:text-blue-900">
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                {locationFilter !== 'all' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <FaMapMarkerAlt size={12} />
                    <span>{locationFilter.charAt(0).toUpperCase() + locationFilter.slice(1)}</span>
                    <button onClick={() => setLocationFilter('all')} className="hover:text-blue-900">
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('all')
                    setLocationFilter('all')
                    setAvailabilityFilter('all')
                  }}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium underline"
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {loading ? (
              // Loading Skeleton
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-300 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : paginatedCreators.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No creators found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <motion.button
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('all')
                    setLocationFilter('all')
                    setAvailabilityFilter('all')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Creator Cards - Grid Layout (3 per row) */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                  <AnimatePresence>
                    {paginatedCreators.map((creator, index) => (
                          <motion.div
                            key={creator.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gradient-to-br from-white to-purple-50/30 border-2 border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300"
                          >
                        {/* Creator Card Content */}
                        <div className="p-6 bg-gradient-to-r from-white/50 to-purple-50/50">
                          {/* Avatar & Basic Info */}
                          <div className="flex flex-col items-center mb-4">
                            <div className="relative mb-3">
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center ring-4 ring-purple-100">
                                <FaUsers className="text-white" size={36} />
                              </div>
                              {creator.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5">
                                  <FaCheckCircle className="text-white" size={16} />
                                </div>
                              )}
                              {creator.isAvailable && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                              )}
                            </div>
                            
                            <div className="text-center">
                              <h3 className="font-bold text-xl text-gray-900">{creator.name}</h3>
                              <p className="text-sm text-gray-500 mb-1">{creator.username}</p>
                              <div className="flex items-center gap-1 mt-1 justify-center">
                                <FaStar className="text-yellow-500" size={16} />
                                <span className="text-sm font-bold text-gray-700">{creator.rating}</span>
                                <span className="text-xs text-gray-500">({creator.totalReviews} reviews)</span>
                              </div>
                            </div>
                          </div>

                          {/* Creator Details */}
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <FaMapMarkerAlt size={12} />
                              <span>{creator.location}</span>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {creator.category}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {creator.bio}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Followers</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {(creator.followers / 1000).toFixed(1)}K
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Engagement</p>
                                <p className="text-sm font-bold text-gray-900">{creator.engagement}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Campaigns</p>
                                <p className="text-sm font-bold text-gray-900">{creator.completedCampaigns}</p>
                              </div>
                            </div>

                            {/* Platforms */}
                            <div className="flex items-center gap-2 mb-3">
                              {creator.platforms.slice(0, 4).map((platform, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                  {getPlatformIcon(platform)}
                                </div>
                              ))}
                            </div>

                            {/* Price Range */}
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                              <span className="text-xs text-gray-500">Price Range</span>
                              <span className="text-sm font-bold text-gray-900">
                                {creator.priceRange.min.toLocaleString()} - {creator.priceRange.max.toLocaleString()} ETB
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => handleLike(creator.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-lg transition-colors ${
                                  creator.isLiked 
                                    ? 'text-blue-600 bg-blue-100' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <FaHeart size={16} />
                              </motion.button>
                              
                              <motion.button
                                onClick={() => handleBookmark(creator.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-lg transition-colors ${
                                  creator.isBookmarked 
                                    ? 'text-blue-600 bg-blue-100' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <FaBookmark size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleViewDetails(creator)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all"
                              >
                                View Profile
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                              >
                                <FaEnvelope className="inline mr-2" size={14} />
                                Contact
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                        ))}
                      </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                      }`}
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Creator Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedCreator && (
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
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal content here - similar to FeedPage detail modal */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Creator Profile</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaTimes className="text-gray-600" size={20} />
                  </button>
                </div>
                
                {/* Creator details */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-4 ring-blue-100 mb-4">
                    <FaUsers className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedCreator.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedCreator.username}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <FaStar className="text-yellow-500" />
                    <span className="font-bold">{selectedCreator.rating}</span>
                    <span className="text-gray-500">({selectedCreator.totalReviews} reviews)</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{selectedCreator.bio}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Followers</p>
                    <p className="text-2xl font-bold">{selectedCreator.followers.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Engagement</p>
                    <p className="text-2xl font-bold">{selectedCreator.engagement}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Campaigns</p>
                    <p className="text-2xl font-bold">{selectedCreator.completedCampaigns}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-lg font-bold">{selectedCreator.location}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <FaEnvelope className="inline mr-2" />
                    Send Message
                  </motion.button>
                  <motion.button
                    onClick={() => handleBookmark(selectedCreator.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedCreator.isBookmarked
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                    }`}
                  >
                    <FaBookmark size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
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
  )
}
