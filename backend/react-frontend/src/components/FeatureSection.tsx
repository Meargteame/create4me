import { motion } from 'framer-motion'
import { 
  FaUserCheck, 
  FaShieldAlt, 
  FaChartLine, 
  FaDollarSign, 
  FaTasks, 
  FaMapMarkerAlt 
} from './icons'

export default function FeatureSection() {
  const features = [
    {
      icon: <FaUserCheck />,
      title: "Smart Creator Matching",
      description: "Our AI-powered algorithm matches your brand with Ethiopian creators whose audiences align perfectly with your target market.",
      highlight: "98% Match Accuracy",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaShieldAlt />, 
      title: "Verified Creator Network",
      description: "Every creator on our platform is thoroughly verified with authentic followers, real engagement, and proven content quality.",
      highlight: "100% Verified Profiles",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaChartLine />,
      title: "Real-Time Analytics",
      description: "Track campaign performance with detailed analytics including reach, engagement, conversions, and ROI across all Ethiopian markets.",
      highlight: "Live Performance Data",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaDollarSign />,
      title: "Transparent Pricing",
      description: "Clear, upfront pricing with no hidden fees. Pay creators directly through our secure payment system in ETB or USD.",
      highlight: "No Hidden Fees",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <FaTasks />,
      title: "Campaign Management",
      description: "End-to-end campaign management from creator outreach to content approval and performance tracking.",
      highlight: "Full Service Support",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Ethiopian Market Focus",
      description: "Deep understanding of Ethiopian culture, languages, and consumer behavior to ensure authentic brand messaging.",
      highlight: "Local Expertise",
      gradient: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <section className="relative bg-gradient-to-b from-white to-slate-50 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-full text-emerald-700 text-sm font-semibold mb-6"
          >
            <span className="text-lg">✨</span>
            Why Choose Create4Me
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Successful Campaigns
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From creator discovery to campaign execution, we provide all the tools and expertise 
            needed to launch successful influencer marketing campaigns in Ethiopia.
          </p>
        </motion.div>

        {/* Features Grid - 2 Rows of 3 Cards */}
        <div className="grid grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glassmorphic Card */}
              <div className="relative h-full p-8 rounded-3xl bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl" />
                
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500 rounded-3xl`} />
                
                {/* Icon */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <span className={`text-xs bg-gradient-to-r ${feature.gradient} text-white px-3 py-1.5 rounded-full font-bold shadow-md`}>
                    {feature.highlight}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed relative z-10">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center mt-20 p-12 overflow-hidden rounded-3xl"
        >
          {/* Glassmorphic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-purple-50/80 to-pink-50/90 backdrop-blur-xl border-2 border-white/50 rounded-3xl" />
          
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-3xl" />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ready to Launch Your Ethiopian Campaign?
              </span>
            </h3>
            
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join hundreds of brands already growing with Ethiopian creators
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full border-none font-semibold text-lg cursor-pointer transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Free Campaign →
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-800 hover:border-purple-400 px-8 py-4 rounded-full font-semibold text-lg cursor-pointer transition-all shadow-md hover:shadow-lg"
              >
                View Creator Network
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}