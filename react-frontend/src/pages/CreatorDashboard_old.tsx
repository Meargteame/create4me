import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import apiClient from '../lib/api'
import { 
  FaChartLine,
  FaDollarSign,
  FaStar,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaRocket,
  FaUsers,
  FaTasks
} from '../components/icons/index.js'
import { Link } from 'react-router-dom'

interface Application {
  id: string
  campaignTitle: string
  brand: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  budget: number
  appliedDate: string
  deadline: string
}

export default function CreatorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('portfolio')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    if (!user) return
    try {
      const response = await apiClient.getMyApplications()
      if (response.success) {
        // Transform backend data to match our interface
        const transformedApps = response.applications.map((app: any) => ({
          id: app.id,
          campaignTitle: app.campaign?.title || 'Unknown Campaign',
          brand: app.campaign?.user?.email?.split('@')[0] || 'Unknown Brand',
          status: app.status,
          budget: 0, // Add budget field to backend if needed
          appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
          deadline: app.campaign?.deadline || 'TBD'
        }))
        setApplications(transformedApps)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [user])

  const stats = [
    {
      title: 'Applications Sent',
      value: applications.length,
      icon: <FaChartLine />,
      color: '#3b82f6'
    },
    {
      title: 'Approved Campaigns',
      value: applications.filter(a => a.status === 'approved').length,
      icon: <FaCheckCircle />,
      color: '#10b981'
    },
    {
      title: 'Total Earnings',
      value: `${applications.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.budget, 0).toLocaleString()} ETB`,
      icon: <FaDollarSign />,
      color: '#f59e0b'
    },
    {
      title: 'Profile Rating',
      value: '4.8',
      icon: <FaStar />,
      color: '#8b5cf6'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'rejected': return '#ef4444'
      case 'completed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />
      case 'pending': return <FaClock />
      case 'rejected': return <FaTimes />
      case 'completed': return <FaCheckCircle />
      default: return <FaClock />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header with Gradient */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">
                Welcome back, {user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                Your creator journey continues here. Let's make something amazing!
              </p>
            </div>
            <Link 
              to="/campaign-board" 
              className="hidden md:flex items-center gap-2 bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaRocket className="text-xl" />
              <span>Browse Campaigns</span>
            </Link>
          </div>
        </div>

        {/* Quick Action on Mobile */}
        <Link 
          to="/campaign-board" 
          className="md:hidden mb-6 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <FaRocket />
          <span>Browse Campaigns</span>
        </Link>

        {/* Stats Overview with Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  style={{ backgroundColor: `${stat.color}15` }} 
                  className="p-4 rounded-xl"
                >
                  <div style={{ color: stat.color, fontSize: '24px' }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {index === 0 ? 'Total' : index === 1 ? 'Active' : index === 2 ? 'Earnings' : 'Rating'}
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {stat.title}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-green-600 font-semibold">↑ 12% this month</span>
              </div>
            </div>
          ))}
        </div>

        {/* My Applications Section - Modern Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                📋
              </div>
              My Applications
            </h2>
            <p className="text-purple-100 mt-2">
              Track and manage your campaign applications in real-time
            </p>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaClock className="text-5xl text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Applications Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You haven't applied to any campaigns yet. Start exploring amazing opportunities from top brands!
                </p>
                <Link 
                  to="/campaign-board"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  <FaRocket className="text-xl" />
                  <span>Discover Campaigns</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div 
                    key={application.id} 
                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-purple-300 transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {application.campaignTitle.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                              {application.campaignTitle}
                            </h4>
                            <p className="text-gray-600 text-sm font-medium">
                              by <span className="text-indigo-600">{application.brand}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div style={{ color: getStatusColor(application.status), fontSize: '20px' }}>
                            {getStatusIcon(application.status)}
                          </div>
                          <span 
                            style={{ 
                              backgroundColor: `${getStatusColor(application.status)}20`, 
                              color: getStatusColor(application.status),
                              borderColor: getStatusColor(application.status)
                            }} 
                            className="px-4 py-1.5 rounded-full text-sm font-bold capitalize border-2"
                          >
                            {application.status}
                          </span>
                        </div>
                      </div>
                      
                      <button className="flex items-center gap-2 px-5 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 font-semibold transition-colors">
                        <FaEye />
                        <span>View Details</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="text-xs font-semibold text-green-700 uppercase mb-1">💰 Budget</div>
                        <div className="text-xl font-bold text-green-800">{application.budget.toLocaleString()} ETB</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3">
                        <div className="text-xs font-semibold text-blue-700 uppercase mb-1">📅 Applied</div>
                        <div className="text-xl font-bold text-blue-800">{new Date(application.appliedDate).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3">
                        <div className="text-xs font-semibold text-orange-700 uppercase mb-1">⏰ Deadline</div>
                        <div className="text-xl font-bold text-orange-800">{new Date(application.deadline).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/campaign-board"
            className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
          >
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <FaRocket className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Browse Campaigns</h3>
            <p className="text-purple-100">Discover new opportunities</p>
          </Link>

          <button 
            onClick={() => setActiveTab('portfolio')}
            className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl text-left"
          >
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <FaStar className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">My Portfolio</h3>
            <p className="text-blue-100">Showcase your work</p>
          </button>

          <button 
            onClick={() => setActiveTab('earnings')}
            className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl text-left"
          >
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <FaDollarSign className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Earnings</h3>
            <p className="text-green-100">Track your income</p>
          </button>
        </div>

        {/* Additional Tabs Modal */}
        {activeTab !== 'portfolio' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">🚧</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This feature is under development. Check back soon for updates!
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}