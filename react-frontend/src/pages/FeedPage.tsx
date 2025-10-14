import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { 
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFilter
} from '../components/icons/index.js'

interface CampaignPost {
  id: string
  brand: {
    name: string
    logo: string
    verified: boolean
  }
  title: string
  description: string
  budget: {
    min: number
    max: number
  }
  deadline: string
  location: string
  category: string
  requirements: string[]
  image?: string
  likes: number
  comments: number
  applications: number
  isLiked: boolean
  isBookmarked: boolean
  postedAt: string
}

// Mock campaign data
const mockCampaigns: CampaignPost[] = [
  {
    id: '1',
    brand: {
      name: 'EthioCoffee',
      logo: '/api/placeholder/50/50',
      verified: true
    },
    title: 'Ethiopian Coffee Culture Campaign',
    description: 'Looking for lifestyle creators to showcase the authentic Ethiopian coffee experience. We want to highlight the traditional coffee ceremony and modern coffee culture in Ethiopia.',
    budget: { min: 8000, max: 20000 },
    deadline: '2024-10-15',
    location: 'Addis Ababa',
    category: 'Lifestyle',
    requirements: ['Instagram posts (3-5)', 'Stories (10+)', 'Reel content', '50K+ followers'],
    image: '/api/placeholder/600/300',
    likes: 24,
    comments: 8,
    applications: 15,
    isLiked: false,
    isBookmarked: true,
    postedAt: '2 hours ago'
  },
  {
    id: '2',
    brand: {
      name: 'Addis Fashion',
      logo: '/api/placeholder/50/50',
      verified: false
    },
    title: 'Local Fashion Brand Launch',
    description: 'New Ethiopian fashion brand launching sustainable clothing line. Seeking fashion influencers to showcase our eco-friendly designs inspired by Ethiopian culture.',
    budget: { min: 5000, max: 15000 },
    deadline: '2024-10-20',
    location: 'Nationwide',
    category: 'Fashion',
    requirements: ['Fashion photography', 'Brand storytelling', 'Sustainable fashion focus'],
    likes: 18,
    comments: 12,
    applications: 8,
    isLiked: true,
    isBookmarked: false,
    postedAt: '5 hours ago'
  },
  {
    id: '3',
    brand: {
      name: 'TechHub Ethiopia',
      logo: '/api/placeholder/50/50',
      verified: true
    },
    title: 'Tech Innovation Showcase',
    description: 'Promoting Ethiopian tech startups and innovation. Looking for tech reviewers and content creators to feature emerging technologies and startups in Ethiopia.',
    budget: { min: 12000, max: 30000 },
    deadline: '2024-11-01',
    location: 'Addis Ababa',
    category: 'Technology',
    requirements: ['Tech review content', 'Startup interviews', 'Innovation storytelling'],
    likes: 31,
    comments: 6,
    applications: 22,
    isLiked: false,
    isBookmarked: true,
    postedAt: '1 day ago'
  }
]

export default function FeedPage() {
  const [campaigns, setCampaigns] = useState<CampaignPost[]>(mockCampaigns)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const handleLike = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            isLiked: !campaign.isLiked,
            likes: campaign.isLiked ? campaign.likes - 1 : campaign.likes + 1
          }
        : campaign
    ))
  }

  const handleBookmark = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, isBookmarked: !campaign.isBookmarked }
        : campaign
    ))
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true
    if (filter === 'bookmarked') return campaign.isBookmarked
    return campaign.category.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Campaign Feed
          </h1>
          <p style={{ color: '#6b7280' }}>
            Discover the latest brand campaigns and collaboration opportunities from Ethiopian businesses.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
          {/* Sidebar Filters */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', height: 'fit-content', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaFilter size={16} />
              Filters
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['all', 'lifestyle', 'fashion', 'technology', 'food', 'beauty'].map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      border: 'none',
                      borderRadius: '0.375rem',
                      backgroundColor: filter === category ? '#dbeafe' : 'transparent',
                      color: filter === category ? '#1d4ed8' : '#6b7280',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Quick Filters</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => setFilter('bookmarked')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: '0.375rem',
                    backgroundColor: filter === 'bookmarked' ? '#dbeafe' : 'transparent',
                    color: filter === 'bookmarked' ? '#1d4ed8' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  Bookmarked
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              >
                <option value="recent">Most Recent</option>
                <option value="budget">Highest Budget</option>
                <option value="deadline">Deadline Soon</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Campaign Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* Campaign Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={campaign.brand.logo}
                        alt={campaign.brand.name}
                        style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{campaign.brand.name}</h3>
                          {campaign.brand.verified && (
                            <div style={{ color: '#3b82f6' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{campaign.postedAt}</p>
                      </div>
                    </div>
                    
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {campaign.category}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
                    {campaign.title}
                  </h2>
                  
                  <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {campaign.description}
                  </p>

                  {/* Campaign Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <FaDollarSign size={16} />
                      <span>{campaign.budget.min.toLocaleString()} - {campaign.budget.max.toLocaleString()} ETB</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <FaCalendarAlt size={16} />
                      <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <FaMapMarkerAlt size={16} />
                      <span>{campaign.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <FaUsers size={16} />
                      <span>{campaign.applications} applications</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Requirements:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {campaign.requirements.map((req, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Campaign Image */}
                {campaign.image && (
                  <div>
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={() => handleLike(campaign.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: campaign.isLiked ? '#dc2626' : '#6b7280',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        <FaHeart size={16} />
                        {campaign.likes}
                      </button>
                      
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        <FaComment size={16} />
                        {campaign.comments}
                      </button>
                      
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        <FaShare size={16} />
                        Share
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={() => handleBookmark(campaign.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: campaign.isBookmarked ? '#2563eb' : '#6b7280',
                          cursor: 'pointer'
                        }}
                      >
                        <FaBookmark size={16} />
                      </button>
                      
                      <button
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCampaigns.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                  No campaigns found
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Try adjusting your filters to see more campaigns.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}