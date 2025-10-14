import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import apiClient from '../lib/api'
import { 
  FaUserCheck, 
  FaStar, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaChartLine, 
  FaCheckCircle,
  FaUserPlus,
  FaUserTimes,
  FaEnvelope,
  FaSearch,
  FaTimes,
  FaFilter,
  FaClock,
  FaHeart,
  FaComments
} from '../components/icons'

interface Connection {
  id: string
  userId?: string
  name: string
  role: 'brand' | 'creator'
  avatar: string
  location: string
  followers: number
  engagement: number
  rating: number
  category: string
  verified: boolean
  mutualConnections: number
  lastActive: string
  status: 'connected' | 'pending' | 'suggested'
  bio?: string
  username?: string
}

// Mock data
const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Tigist Alemayehu',
    role: 'creator',
    avatar: '/api/placeholder/100/100',
    location: 'Addis Ababa',
    followers: 45000,
    engagement: 4.2,
    rating: 4.8,
    category: 'Lifestyle',
    verified: true,
    mutualConnections: 12,
    lastActive: '2 hours ago',
    status: 'connected',
    bio: 'Content creator specializing in lifestyle and fashion'
  },
  {
    id: '2',
    name: 'Ethiopian Coffee Co.',
    role: 'brand',
    avatar: '/api/placeholder/100/100',
    location: 'Addis Ababa',
    followers: 120000,
    engagement: 3.8,
    rating: 4.6,
    category: 'Food & Beverage',
    verified: true,
    mutualConnections: 8,
    lastActive: '1 day ago',
    status: 'connected',
    bio: 'Premium Ethiopian coffee brand'
  },
  {
    id: '3',
    name: 'Samuel Gebru',
    role: 'creator',
    avatar: '/api/placeholder/100/100',
    location: 'Bahir Dar',
    followers: 28000,
    engagement: 5.1,
    rating: 4.7,
    category: 'Technology',
    verified: false,
    mutualConnections: 5,
    lastActive: '5 hours ago',
    status: 'pending',
    bio: 'Tech reviewer and software developer'
  },
  {
    id: '4',
    name: 'Addis Fashion House',
    role: 'brand',
    avatar: '/api/placeholder/100/100',
    location: 'Addis Ababa',
    followers: 85000,
    engagement: 4.5,
    rating: 4.9,
    category: 'Fashion',
    verified: true,
    mutualConnections: 15,
    lastActive: '3 hours ago',
    status: 'suggested',
    bio: 'Sustainable Ethiopian fashion brand'
  }
]

export default function NetworkPage_New() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'connected' | 'pending' | 'suggested'>('connected')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'brand' | 'creator'>('all')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [stats, setStats] = useState({ total: 0, brands: 0, creators: 0, pending: 0 })

  useEffect(() => {
    fetchConnections()
  }, [activeTab, searchQuery, roleFilter])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      
      const response = await apiClient.getConnections({
        tab: activeTab,
        search: searchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      })

      setConnections(response.connections)
      setStats(response.stats)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching connections:', error)
      showToastNotification('Failed to load connections')
      // Fallback to mock data
      setConnections(mockConnections.filter(c => c.status === activeTab))
      setLoading(false)
    }
  }

  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleConnect = async (connectionId: string) => {
    try {
      // Optimistic update
      setConnections(prev => prev.map(c => 
        c.id === connectionId 
          ? { ...c, status: 'pending' as const }
          : c
      ))
      
      const connection = connections.find(c => c.id === connectionId)
      if (connection) {
        await apiClient.sendConnectionRequest(connection.userId || connectionId)
        showToastNotification('✓ Connection request sent!')
      }
    } catch (error) {
      console.error('Error connecting:', error)
      // Revert on error
      setConnections(prev => prev.map(c => 
        c.id === connectionId 
          ? { ...c, status: 'suggested' as const }
          : c
      ))
      showToastNotification('Failed to send request')
    }
  }

  const handleAccept = async (connectionId: string) => {
    try {
      // Optimistic update
      setConnections(prev => prev.map(c => 
        c.id === connectionId 
          ? { ...c, status: 'connected' as const }
          : c
      ))
      
      await apiClient.acceptConnectionRequest(connectionId)
      showToastNotification('✓ Connection accepted!')
      
      // Refresh data
      fetchConnections()
    } catch (error) {
      console.error('Error accepting:', error)
      // Revert on error
      setConnections(prev => prev.map(c => 
        c.id === connectionId 
          ? { ...c, status: 'pending' as const }
          : c
      ))
      showToastNotification('Failed to accept')
    }
  }

  const handleRemove = async (connectionId: string) => {
    try {
      const previousConnections = [...connections]
      
      // Optimistic update
      setConnections(prev => prev.filter(c => c.id !== connectionId))
      
      await apiClient.removeConnection(connectionId)
      showToastNotification('✓ Connection removed')
    } catch (error) {
      console.error('Error removing:', error)
      // Restore on error  
      setConnections(connections)
      showToastNotification('Failed to remove')
    }
  }

  const handleDecline = async (connectionId: string) => {
    try {
      const previousConnections = [...connections]
      
      // Optimistic update
      setConnections(prev => prev.filter(c => c.id !== connectionId))
      
      await apiClient.rejectConnectionRequest(connectionId)
      showToastNotification('✓ Request declined')
    } catch (error) {
      console.error('Error declining:', error)
      // Restore on error  
      setConnections(connections)
      showToastNotification('Failed to decline')
    }
  }

  // Connections are already filtered by backend
  const filteredConnections = connections.filter(conn => {
    // Search filter (local for responsiveness)
    const searchLower = searchQuery.toLowerCase()
    if (searchQuery && !conn.name.toLowerCase().includes(searchLower)) {
      return false
    }

    // Role filter (local for responsiveness)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        conn.name.toLowerCase().includes(query) ||
        conn.category.toLowerCase().includes(query) ||
        conn.location.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Role filter
    if (roleFilter !== 'all' && conn.role !== roleFilter) return false

    return true
  })

  const stats = {
    total: connections.filter(c => c.status === 'connected').length,
    brands: connections.filter(c => c.status === 'connected' && c.role === 'brand').length,
    creators: connections.filter(c => c.status === 'connected' && c.role === 'creator').length,
    pending: connections.filter(c => c.status === 'pending').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="h-24" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Network
          </h1>
          <p className="text-gray-600">
            Connect with brands and creators • {stats.total} connections
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Connections</p>
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
                <p className="text-gray-600 text-sm font-medium">Brands</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.brands}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Creators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.creators}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUserCheck className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs & Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('connected')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'connected'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Connected ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('suggested')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'suggested'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Suggested
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex-1 flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="brand">Brands</option>
                <option value="creator">Creators</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || roleFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  <FaSearch size={12} />
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
              {roleFilter !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  <span>{roleFilter === 'brand' ? '🏢' : '👤'} {roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}s</span>
                  <button onClick={() => setRoleFilter('all')} className="hover:text-blue-900">
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setRoleFilter('all')
                }}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Connections List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredConnections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm"
          >
            <div className="text-6xl mb-4">
              {activeTab === 'connected' ? '👥' : activeTab === 'pending' ? '⏳' : '✨'}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {activeTab === 'connected' && 'No connections yet'}
              {activeTab === 'pending' && 'No pending requests'}
              {activeTab === 'suggested' && 'No suggestions'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'connected' && 'Start connecting with brands and creators'}
              {activeTab === 'pending' && 'You have no pending connection requests'}
              {activeTab === 'suggested' && 'Check back later for suggestions'}
            </p>
            {activeTab === 'suggested' && (
              <motion.button
                onClick={() => setActiveTab('suggested')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm"
              >
                View Suggestions
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredConnections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-4 ring-blue-100">
                        <FaUsers className="text-white" size={24} />
                      </div>
                      {connection.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                          <FaCheckCircle className="text-white" size={12} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            {connection.name}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              connection.role === 'brand' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {connection.role === 'brand' ? '🏢 Brand' : '👤 Creator'}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600">{connection.category}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {activeTab === 'connected' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-sm"
                              >
                                <FaEnvelope className="inline mr-2" size={14} />
                                Message
                              </motion.button>
                              <motion.button
                                onClick={() => handleRemove(connection.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200"
                              >
                                <FaUserTimes className="inline mr-2" size={14} />
                                Remove
                              </motion.button>
                            </>
                          )}
                          
                          {activeTab === 'pending' && (
                            <>
                              <motion.button
                                onClick={() => handleAccept(connection.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-sm"
                              >
                                <FaUserCheck className="inline mr-2" size={14} />
                                Accept
                              </motion.button>
                              <motion.button
                                onClick={() => handleRemove(connection.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200"
                              >
                                Decline
                              </motion.button>
                            </>
                          )}
                          
                          {activeTab === 'suggested' && (
                            <motion.button
                              onClick={() => handleConnect(connection.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-sm"
                            >
                              <FaUserPlus className="inline mr-2" size={14} />
                              Connect
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {connection.bio && (
                        <p className="text-sm text-gray-600 mb-3">{connection.bio}</p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-gray-400" size={12} />
                          <span className="text-gray-600">{connection.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaUsers className="text-gray-400" size={12} />
                          <span className="text-gray-600">{(connection.followers / 1000).toFixed(1)}K followers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaChartLine className="text-gray-400" size={12} />
                          <span className="text-gray-600">{connection.engagement}% engagement</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaStar className="text-yellow-500" size={12} />
                          <span className="text-gray-600">{connection.rating} rating</span>
                        </div>
                        {connection.mutualConnections > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FaUserCheck className="text-blue-500" size={12} />
                            <span className="text-gray-600">{connection.mutualConnections} mutual</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        <FaClock className="inline mr-1" size={10} />
                        Active {connection.lastActive}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />

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
