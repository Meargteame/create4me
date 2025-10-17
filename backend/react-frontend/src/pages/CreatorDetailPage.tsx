import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { 
  FaArrowLeft,
  FaStar,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUsers,
  FaTrendingUp,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaEnvelope,
  FaChartLine
} from '../components/icons/index.js'

interface Creator {
  id: string
  name: string
  username: string
  avatar: string
  coverImage: string
  category: string
  location: string
  bio: string
  rating: number
  totalReviews: number
  verified: boolean
  platforms: Array<{
    name: string
    followers: number
    engagementRate: number
    url: string
  }>
  contentTypes: string[]
  isAvailable: boolean
  followers: number
  engagement: number
  completedCampaigns: number
  priceRange: {
    min: number
    max: number
  }
  portfolio: Array<{
    id: string
    title: string
    image: string
    type: 'photo' | 'video'
    description: string
  }>
  reviews: Array<{
    id: string
    author: string
    rating: number
    comment: string
    date: string
    campaign: string
  }>
  packages: Array<{
    id: string
    name: string
    description: string
    price: number
    deliverables: string[]
    timeline: string
  }>
}

// Mock creator data
const mockCreator: Creator = {
  id: '1',
  name: 'Hanan Ahmed',
  username: '@hanan_lifestyle',
  avatar: '/api/placeholder/150/150',
  coverImage: '/api/placeholder/800/300',
  category: 'Lifestyle',
  location: 'Addis Ababa, Ethiopia',
  bio: 'Ethiopian lifestyle blogger and content creator passionate about sharing authentic moments from Ethiopian culture. I love creating content that inspires and connects with my audience through storytelling, lifestyle tips, and cultural experiences.',
  rating: 4.9,
  totalReviews: 127,
  verified: true,
  platforms: [
    { name: 'Instagram', followers: 45000, engagementRate: 8.5, url: 'https://instagram.com/hanan_lifestyle' },
    { name: 'TikTok', followers: 28000, engagementRate: 12.3, url: 'https://tiktok.com/@hanan_lifestyle' },
    { name: 'YouTube', followers: 15000, engagementRate: 6.8, url: 'https://youtube.com/c/hananhlifestyle' }
  ],
  contentTypes: ['Photo', 'Video', 'Reel', 'Story'],
  isAvailable: true,
  followers: 88000,
  engagement: 8.5,
  completedCampaigns: 23,
  priceRange: { min: 5000, max: 15000 },
  portfolio: [
    {
      id: '1',
      title: 'Ethiopian Coffee Culture',
      image: '/api/placeholder/300/300',
      type: 'photo',
      description: 'Traditional Ethiopian coffee ceremony content for local coffee brand'
    },
    {
      id: '2',
      title: 'Addis Fashion Week',
      image: '/api/placeholder/300/300',
      type: 'video',
      description: 'Behind the scenes coverage of Addis Fashion Week'
    },
    {
      id: '3',
      title: 'Local Business Spotlight',
      image: '/api/placeholder/300/300',
      type: 'photo',
      description: 'Feature content for Ethiopian startup companies'
    }
  ],
  reviews: [
    {
      id: '1',
      author: 'Brand Manager at EthioCorp',
      rating: 5,
      comment: 'Hanan exceeded our expectations! Her content was authentic and really resonated with our target audience. The engagement rates were fantastic.',
      date: '2 weeks ago',
      campaign: 'Ethiopian Coffee Campaign'
    },
    {
      id: '2',
      author: 'Marketing Director at Local Brand',
      rating: 4,
      comment: 'Great to work with, very professional and delivered high-quality content on time. Would definitely work with her again.',
      date: '1 month ago',
      campaign: 'Fashion Brand Launch'
    }
  ],
  packages: [
    {
      id: '1',
      name: 'Basic Package',
      description: 'Perfect for small businesses getting started',
      price: 5000,
      deliverables: ['2 Instagram posts', '1 Story highlight', 'Basic photo editing'],
      timeline: '3-5 days'
    },
    {
      id: '2',
      name: 'Standard Package',
      description: 'Great for growing brands wanting more exposure',
      price: 10000,
      deliverables: ['4 Instagram posts', '2 Stories', '1 Reel', 'Professional editing', 'Usage rights (30 days)'],
      timeline: '5-7 days'
    },
    {
      id: '3',
      name: 'Premium Package',
      description: 'Complete content solution for established brands',
      price: 15000,
      deliverables: ['6 Instagram posts', '4 Stories', '2 Reels', '1 YouTube video', 'Professional editing', 'Usage rights (90 days)', 'Performance report'],
      timeline: '7-10 days'
    }
  ]
}

export default function CreatorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setCreator(mockCreator)
      setLoading(false)
    }, 1000)
  }, [id])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <FaInstagram />
      case 'youtube': return <FaYoutube />
      case 'linkedin': return <FaLinkedin />
      case 'facebook': return <FaFacebook />
      default: return <FaUsers />
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!creator) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Creator not found</h2>
          <Link to="/creators" style={{ color: '#2563eb', textDecoration: 'none' }}>
            ← Back to creators
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Back Button */}
        <Link 
          to="/creators" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: '#2563eb', 
            textDecoration: 'none',
            marginBottom: '2rem'
          }}
        >
          <FaArrowLeft size={16} />
          Back to Creators
        </Link>

        {/* Cover Image */}
        <div style={{ 
          height: '300px', 
          borderRadius: '0.75rem', 
          backgroundImage: `url(${creator.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '2rem'
        }}></div>

        {/* Profile Header */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '2rem' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <img
                src={creator.avatar}
                alt={creator.name}
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              {creator.verified && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid white'
                }}>
                  <FaCheckCircle size={20} color="white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {creator.name}
                  </h1>
                  <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: '0.25rem 0' }}>{creator.username}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {creator.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                      <FaMapMarkerAlt size={16} />
                      <span>{creator.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          size={16} 
                          color={i < Math.floor(creator.rating) ? '#fbbf24' : '#e5e7eb'} 
                        />
                      ))}
                    </div>
                    <span style={{ fontWeight: '500' }}>{creator.rating}</span>
                    <span style={{ color: '#6b7280' }}>({creator.totalReviews} reviews)</span>
                  </div>
                </div>

                {user && (
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Contact Creator
                  </button>
                )}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {formatNumber(creator.followers)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {creator.engagement}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Engagement</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {creator.completedCampaigns}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Campaigns Done</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                    {creator.priceRange.min.toLocaleString()}+ ETB
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Starting Price</div>
                </div>
              </div>

              {/* Bio */}
              <p style={{ color: '#374151', lineHeight: '1.6', margin: 0 }}>{creator.bio}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <nav style={{ display: 'flex', gap: '2rem', padding: '1rem 2rem' }}>
              {['overview', 'portfolio', 'reviews', 'packages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.5rem 0',
                    borderBottom: `2px solid ${activeTab === tab ? '#2563eb' : 'transparent'}`,
                    color: activeTab === tab ? '#2563eb' : '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Platforms */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Platforms</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {creator.platforms.map((platform, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ color: '#6b7280' }}>
                            {getPlatformIcon(platform.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500' }}>{platform.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {formatNumber(platform.followers)} followers
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '500', color: '#16a34a' }}>
                            {platform.engagementRate}%
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            engagement
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Types */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Content Types</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {creator.contentTypes.map((type, index) => (
                      <div key={index} style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}>
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Portfolio</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {creator.portfolio.map((item) => (
                    <div key={item.id} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {creator.reviews.map((review) => (
                    <div key={review.id} style={{
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: '500' }}>{review.author}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              size={14} 
                              color={i < review.rating ? '#fbbf24' : '#e5e7eb'} 
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: '#374151', marginBottom: '0.5rem', margin: 0 }}>{review.comment}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>{review.campaign}</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Packages</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {creator.packages.map((pkg) => (
                    <div key={pkg.id} style={{
                      border: `2px solid ${selectedPackage === pkg.id ? '#2563eb' : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedPackage(pkg.id)}>
                      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{pkg.name}</h4>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{pkg.description}</p>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                          {pkg.price.toLocaleString()} ETB
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Deliverables:</h5>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {pkg.deliverables.map((item, index) => (
                            <li key={index} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              marginBottom: '0.25rem',
                              fontSize: '0.875rem'
                            }}>
                              <FaCheckCircle size={14} color="#16a34a" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        <strong>Timeline:</strong> {pkg.timeline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}