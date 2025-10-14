import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import apiClient from '../lib/api'
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimes,
  FaEye,
  FaCalendarAlt
} from '../components/icons'

interface Application {
  id: string
  campaignTitle: string
  brand: string
  status: 'pending' | 'approved' | 'rejected'
  budget: number
  appliedDate: string
  deadline: string
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await apiClient.getMyApplications()
      if (response.success) {
        const transformedApps = response.applications.map((app: any) => ({
          id: app.id,
          campaignTitle: app.campaign?.title || 'Unknown Campaign',
          brand: app.campaign?.user?.email?.split('@')[0] || 'Unknown Brand',
          status: app.status,
          budget: 0,
          appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
          deadline: app.campaign?.deadline || 'TBD'
        }))
        setApplications(transformedApps)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'from-green-500 to-green-600'
      case 'pending': return 'from-yellow-500 to-yellow-600'
      case 'rejected': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle size={20} />
      case 'pending': return <FaClock size={20} />
      case 'rejected': return <FaTimes size={20} />
      default: return <FaClock size={20} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track all your campaign applications</p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filterOption}
                <span className="ml-2 text-sm">
                  ({filterOption === 'all' 
                    ? applications.length 
                    : applications.filter(a => a.status === filterOption).length})
                </span>
              </button>
            ))}
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 text-center shadow-lg"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No applications found</h3>
              <p className="text-gray-600">Start browsing campaigns and apply!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{app.campaignTitle}</h3>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(app.status)} text-white text-sm font-semibold flex items-center gap-2`}>
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">by {app.brand}</p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendarAlt className="text-blue-600" />
                          <span>Applied: {app.appliedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock className="text-purple-600" />
                          <span>Deadline: {app.deadline}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center gap-2">
                      <FaEye />
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
