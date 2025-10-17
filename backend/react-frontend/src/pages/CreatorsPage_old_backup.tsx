import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTrendingUp, 
  FaStar,
  FaCheckCircle,
  FaGrid3X3,
  FaList,
  FaSlidersH,
  FaTimes
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
}

// Mock data for creators
const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Hanan Ahmed',
    username: '@hanan_lifestyle',
    avatar: '/api/placeholder/100/100',
    category: 'Lifestyle',
    location: 'Addis Ababa',
    bio: 'Ethiopian lifestyle blogger sharing authentic moments',
    rating: 4.9,
    totalReviews: 127,
    verified: true,
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    contentTypes: ['Photo', 'Video', 'Reel'],
    isAvailable: true,
    followers: 45000,
    engagement: 8.5,
    completedCampaigns: 23,
    priceRange: { min: 5000, max: 15000 }
  },
  {
    id: '2',
    name: 'Dawit Mengistu',
    username: '@dawit_tech',
    avatar: '/api/placeholder/100/100',
    category: 'Technology',
    location: 'Addis Ababa',
    bio: 'Tech reviewer and software developer from Ethiopia',
    rating: 4.8,
    totalReviews: 89,
    verified: true,
    platforms: ['YouTube', 'LinkedIn', 'Instagram'],
    contentTypes: ['Video', 'Article', 'Review'],
    isAvailable: true,
    followers: 32000,
    engagement: 7.2,
    completedCampaigns: 18,
    priceRange: { min: 8000, max: 25000 }
  },
  {
    id: '3',
    name: 'Meron Kassahun',
    username: '@meron_beauty',
    avatar: '/api/placeholder/100/100',
    category: 'Beauty',
    location: 'Bahir Dar',
    bio: 'Ethiopian beauty enthusiast and makeup artist',
    rating: 4.7,
    totalReviews: 156,
    verified: false,
    platforms: ['Instagram', 'TikTok'],
    contentTypes: ['Photo', 'Reel', 'Tutorial'],
    isAvailable: true,
    followers: 28000,
    engagement: 9.1,
    completedCampaigns: 15,
    priceRange: { min: 3000, max: 12000 }
  },
  {
    id: '4',
    name: 'Yohannes Tadesse',
    username: '@yohannes_food',
    avatar: '/api/placeholder/100/100',
    category: 'Food & Travel',
    location: 'Dire Dawa',
    bio: 'Exploring Ethiopian cuisine and culture',
    rating: 4.6,
    totalReviews: 92,
    verified: true,
    platforms: ['Instagram', 'YouTube', 'Facebook'],
    contentTypes: ['Photo', 'Video', 'Story'],
    isAvailable: false,
    followers: 19000,
    engagement: 6.8,
    completedCampaigns: 12,
    priceRange: { min: 4000, max: 10000 }
  }
]

const categories = ['All Categories', 'Lifestyle', 'Technology', 'Beauty', 'Food & Travel', 'Fashion', 'Fitness']
const locations = ['All Locations', 'Addis Ababa', 'Bahir Dar', 'Dire Dawa', 'Mekelle', 'Hawassa']
const platforms = ['All Platforms', 'Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'Facebook']

export default function CreatorsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Debounce search to avoid filtering on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  const [filters, setFilters] = useState({
    category: 'All Categories',
    location: 'All Locations',
    platform: 'All Platforms',
    minRating: 0,
    verified: false,
    isAvailable: true
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      category: 'All Categories',
      location: 'All Locations',
      platform: 'All Platforms',
      minRating: 0,
      verified: false,
      isAvailable: true
    })
  }

  // Filter creators based on debounced search term and other filters
  const filteredCreators = useMemo(() => {
    return mockCreators.filter(creator => {
      // Search filter (debounced)
      if (debouncedSearchTerm && 
          !creator.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) && 
          !creator.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
          !creator.bio.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (filters.category !== 'All Categories' && creator.category !== filters.category) return false
      
      // Location filter
      if (filters.location !== 'All Locations' && creator.location !== filters.location) return false
      
      // Platform filter
      if (filters.platform !== 'All Platforms' && !creator.platforms.includes(filters.platform)) return false
      
      // Rating filter
      if (filters.minRating > 0 && creator.rating < filters.minRating) return false
      
      // Verified filter
      if (filters.verified && !creator.verified) return false
      
      // Available filter
      if (filters.isAvailable && !creator.isAvailable) return false
      
      return true
    })
  }, [debouncedSearchTerm, filters])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (debouncedSearchTerm) count++
    if (filters.category !== 'All Categories') count++
    if (filters.location !== 'All Locations') count++
    if (filters.platform !== 'All Platforms') count++
    if (filters.minRating > 0) count++
    if (filters.verified) count++
    if (!filters.isAvailable) count++
    return count
  }, [debouncedSearchTerm, filters])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Find Ethiopian Creators
          </h1>
          <p style={{ color: '#6b7280', maxWidth: '48rem' }}>
            Discover verified content creators and influencers across Ethiopia. 
            Connect with authentic voices that align with your brand values.
          </p>
        </div>

        {/* Filters - Glassmorphic Design */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '1.5rem', marginBottom: '2rem' }}>
          {/* Main Search and Quick Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <FaSearch size={16} />
              </div>
              <input
                type="text"
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  outline: 'none'
                }}
              />
              {/* Search indicator */}
              {searchTerm && searchTerm !== debouncedSearchTerm && (
                <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.75rem' }}>
                  Searching...
                </div>
              )}
            </div>

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Location */}
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none'
              }}
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: `1px solid ${showAdvancedFilters || activeFiltersCount > 0 ? '#2563eb' : '#d1d5db'}`,
                backgroundColor: showAdvancedFilters || activeFiltersCount > 0 ? '#eff6ff' : 'white',
                color: showAdvancedFilters || activeFiltersCount > 0 ? '#2563eb' : '#374151',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <FaSlidersH size={16} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '50%',
                  width: '1.25rem',
                  height: '1.25rem',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Platform */}
                <select
                  value={filters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>

                {/* Min Rating */}
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                >
                  <option value={0}>Any Rating</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <FaTimes size={16} />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Verified only</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.isAvailable}
                    onChange={(e) => handleFilterChange('isAvailable', e.target.checked)}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Available for hire</span>
                </label>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {filteredCreators.length} creators found
              {activeFiltersCount > 0 && (
                <span style={{ marginLeft: '0.5rem', color: '#2563eb' }}>({activeFiltersCount} filters applied)</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: viewMode === 'grid' ? '#dbeafe' : 'transparent',
                  color: viewMode === 'grid' ? '#2563eb' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FaGrid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: viewMode === 'list' ? '#dbeafe' : 'transparent',
                  color: viewMode === 'list' ? '#2563eb' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FaList size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Creators Display */}
        {filteredCreators.length === 0 ? (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '1rem', 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#d1d5db', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>
              <FaSearch size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              No creators found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {debouncedSearchTerm 
                ? `No results for "${debouncedSearchTerm}". Try different search terms or filters.`
                : 'Try adjusting your filters to see more results.'}
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredCreators.map((creator) => (
              <Link key={creator.id} to={`/creator/${creator.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '1rem', 
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.25)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}>
                  {/* Avatar and Basic Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {creator.verified && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '1.25rem',
                          height: '1.25rem',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FaCheckCircle size={12} color="white" />
                        </div>
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {creator.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{creator.username}</p>
                    </div>
                  </div>

                  {/* Category and Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {creator.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      <FaMapMarkerAlt size={12} />
                      <span>{creator.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{formatNumber(creator.followers)}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Followers</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{creator.engagement}%</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Engagement</div>
                    </div>
                  </div>

                  {/* Rating and Campaigns */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FaStar size={16} color="#fbbf24" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{creator.rating}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({creator.completedCampaigns} campaigns)</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Starting from</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#2563eb' }}>
                      {creator.priceRange.min.toLocaleString()} ETB
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredCreators.map((creator) => (
              <Link key={creator.id} to={`/creator/${creator.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '1rem', 
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.25)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {creator.verified && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '1.5rem',
                          height: '1.5rem',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FaCheckCircle size={16} color="white" />
                        </div>
                      )}
                    </div>

                    {/* Creator Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            {creator.name}
                          </h3>
                          <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{creator.username}</p>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
                            <span style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#dbeafe',
                              color: '#1d4ed8',
                              borderRadius: '9999px',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {creator.category}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                              <FaMapMarkerAlt size={14} />
                              <span>{creator.location}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FaUsers size={16} color="#6b7280" />
                              <span style={{ fontWeight: '500' }}>{formatNumber(creator.followers)}</span>
                              <span style={{ color: '#6b7280' }}>followers</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FaTrendingUp size={16} color="#6b7280" />
                              <span style={{ fontWeight: '500' }}>{creator.engagement}%</span>
                              <span style={{ color: '#6b7280' }}>engagement</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FaStar size={16} color="#fbbf24" />
                              <span style={{ fontWeight: '500' }}>{creator.rating}</span>
                              <span style={{ color: '#6b7280' }}>({creator.completedCampaigns} campaigns)</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Starting from</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                            {creator.priceRange.min.toLocaleString()} ETB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredCreators.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              <FaUsers size={64} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
              No creators found
            </h3>
            <p style={{ color: '#6b7280' }}>
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}