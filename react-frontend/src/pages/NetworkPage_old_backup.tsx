import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaUserCheck, FaStar, FaMapMarkerAlt, FaUsers, FaChartLine, FaCheckCircle } from '../components/icons/index.js'
import { useAuth } from '../contexts/AuthContext'

interface Connection {
  id: string
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
}

interface NetworkStats {
  totalConnections: number
  brandConnections: number
  creatorConnections: number
  pendingRequests: number
}

export default function NetworkPage() {
  const { user } = useAuth()
  const [connections, setConnections] = useState<Connection[]>([])
  const [stats, setStats] = useState<NetworkStats>({
    totalConnections: 0,
    brandConnections: 0,
    creatorConnections: 0,
    pendingRequests: 0
  })
  const [activeTab, setActiveTab] = useState<'connections' | 'suggestions' | 'requests'>('connections')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNetworkData()
  }, [])

  const fetchNetworkData = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API calls
      const mockConnections: Connection[] = [
        {
          id: '1',
          name: 'Tigist Alemayehu',
          role: 'creator',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=150',
          location: 'Addis Ababa',
          followers: 45000,
          engagement: 4.2,
          rating: 4.8,
          category: 'Lifestyle',
          verified: true,
          mutualConnections: 12,
          lastActive: '2 hours ago',
          status: 'connected'
        },
        {
          id: '2',
          name: 'Ethiopian Coffee Co.',
          role: 'brand',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          location: 'Addis Ababa',
          followers: 120000,
          engagement: 3.8,
          rating: 4.6,
          category: 'Food & Beverage',
          verified: true,
          mutualConnections: 8,
          lastActive: '1 day ago',
          status: 'connected'
        }
      ]

      const mockStats: NetworkStats = {
        totalConnections: 45,
        brandConnections: 18,
        creatorConnections: 27,
        pendingRequests: 5
      }

      setConnections(mockConnections)
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to fetch network data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status: 'pending' as const }
        : conn
    ))
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="spinner" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0 60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
              Your Network
            </h1>
            <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              Connect with Ethiopian brands and creators. Build meaningful partnerships.
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {stats.totalConnections}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Connections</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {stats.brandConnections}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Brand Partners</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {stats.creatorConnections}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Creators</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {stats.pendingRequests}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Pending Requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Connection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {connections.map(connection => (
            <div key={connection.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '16px',
                  position: 'relative'
                }}>
                  <img 
                    src={connection.avatar} 
                    alt={connection.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {connection.verified && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}>
                      <FaCheckCircle size={12} color="white" />
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {connection.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: connection.role === 'brand' ? '#dbeafe' : '#fef3c7',
                      color: connection.role === 'brand' ? '#1e40af' : '#92400e',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {connection.role === 'brand' ? 'Brand' : 'Creator'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <FaMapMarkerAlt size={12} />
                    <span>{connection.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {formatNumber(connection.followers)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {connection.engagement}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Engagement</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    <FaStar size={14} color="#fbbf24" />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {connection.rating}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Rating</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Message
                </button>
                <button style={{
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}