import { 
  FaPalette, 
  FaGamepad, 
  FaStar, 
  FaUtensils,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaShieldAlt
} from './icons'

export default function CreatorPreview() {
  const creatorCategories = [
    {
      category: 'Fashion & Beauty',
      count: '420+',
      avgEngagement: '8.5%',
      topRating: '4.9★',
      icon: <FaPalette />,
      color: '#ec4899'
    },
    {
      category: 'Tech & Gaming',
      count: '180+',
      avgEngagement: '6.8%',
      topRating: '4.8★',
      icon: <FaGamepad />,
      color: '#8b5cf6'
    },
    {
      category: 'Lifestyle',
      count: '520+',
      avgEngagement: '7.4%',
      topRating: '4.9★',
      icon: <FaStar />,
      color: '#f59e0b'
    },
    {
      category: 'Food & Travel',
      count: '280+',
      avgEngagement: '9.1%',
      topRating: '4.8★',
      icon: <FaUtensils />,
      color: '#10b981'
    },
  ]

  const qualityMetrics = [
    { label: 'Authentic Followers', value: '99.2%', color: '#3b82f6' },
    { label: 'Avg. Engagement', value: '7.8%', color: '#10b981' },
    { label: 'Brand Rating', value: '4.9★', color: '#8b5cf6' },
    { label: 'Response Time', value: '24h', color: '#f59e0b' }
  ]

  const qualityFeatures = [
    { icon: <FaCheckCircle />, text: '100% Verified Profiles' },
    { icon: <FaUsers />, text: 'Authentic Audience Analysis' },
    { icon: <FaChartLine />, text: 'Performance History Review' },
    { icon: <FaShieldAlt />, text: 'Brand Safety Compliance' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Access Premium Ethiopian Creator Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform features vetted Ethiopian creators across all major categories. 
            Every creator is verified for authenticity, engagement quality, and brand safety.
          </p>
        </div>

        {/* Creator Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {creatorCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:-translate-y-2">
              <div className="text-5xl text-center mb-4" style={{ color: category.color }}>
                {category.icon}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                {category.category}
              </h3>
              
              <div className="text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Creators</span>
                  <span className="font-semibold" style={{ color: category.color }}>    
                    {category.count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement:</span>
                  <span className="font-semibold text-green-600">
                    {category.avgEngagement}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-semibold text-amber-600">
                    {category.topRating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Assurance Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Quality You Can Trust
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every Ethiopian creator on our platform undergoes rigorous verification. We check for authentic 
                audiences, engagement quality, brand safety, and content standards before approval.
              </p>
              
              <div className="space-y-4">
                {qualityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 text-slate-600">
                      {feature.icon}
                    </span>
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Metrics Grid */}
            <div className="grid grid-cols-2 gap-6">
              {qualityMetrics.map((metric, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold mb-2" style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg cursor-pointer mr-4 shadow-lg hover:shadow-xl">
            Browse Creators →
          </button>
          
          <button className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg cursor-pointer">
            Join as Creator
          </button>
        </div>
      </div>
    </section>
  )
}