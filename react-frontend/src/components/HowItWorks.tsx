import { motion } from 'framer-motion'
import { 
  FaRocket, 
  FaSearch, 
  FaHandshake, 
  FaChartBar 
} from './icons'

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Create Your Campaign",
      description: "Define your campaign goals, target audience, budget, and content requirements. Our team helps optimize your campaign strategy for the Ethiopian market.",
      icon: <FaRocket />,
      features: ["Campaign brief creation", "Audience targeting", "Budget planning", "Content guidelines"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      step: "02", 
      title: "Discover Perfect Creators",
      description: "Browse our verified network of Ethiopian creators or let our AI match you with creators whose audiences align with your brand values and target demographics.",
      icon: <FaSearch />,
      features: ["Smart creator matching", "Audience analytics", "Portfolio review", "Performance history"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      title: "Collaborate & Create",
      description: "Work directly with selected creators to develop authentic content that resonates with Ethiopian audiences while maintaining your brand guidelines.",
      icon: <FaHandshake />,
      features: ["Direct messaging", "Content approval", "Brand guidelines", "Creative collaboration"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      step: "04",
      title: "Track & Optimize",
      description: "Monitor campaign performance in real-time with detailed analytics. Track reach, engagement, conversions, and ROI across all platforms and optimize as needed.",
      icon: <FaChartBar />,
      features: ["Real-time analytics", "Performance tracking", "ROI measurement", "Campaign optimization"],
      gradient: "from-orange-500 to-red-500"
    }
  ]

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative z-10"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-full text-amber-900 text-sm font-bold mb-8 shadow-md"
          >
            <span className="text-lg">🚀</span>
            Simple Process
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            How{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create4Me Works
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From campaign creation to performance tracking, we make influencer marketing simple and effective
          </p>
        </motion.div>

        {/* Steps - Mobile Stacked, Desktop Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop Only with Gradient */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1 h-[calc(100%-6rem)] bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 z-0 hidden md:block rounded-full opacity-30" />

          {steps.map((step, index) => (
            <div key={index} className={`grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center relative ${index === steps.length - 1 ? '' : 'mb-20'}`}>
              {/* Left Content (for even indices) or Empty (for odd) */}
              <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} ${index % 2 === 0 ? 'opacity-100' : 'opacity-0 invisible md:block'}`}>
                {index % 2 === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      {/* Glass reflection */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl" />
                      
                      {/* Gradient glow on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${step.gradient} transition-opacity duration-500 rounded-3xl`} />
                      
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} text-white text-3xl mb-6 shadow-lg relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-3 relative z-10">
                        {step.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-700">
                            <span className={`bg-gradient-to-r ${step.gradient} text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 font-bold text-xs shadow-md`}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Bottom accent line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step.gradient} rounded-b-3xl`} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Center Step Number */}
              <div className="flex justify-center">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-black relative z-20 border-4 border-white shadow-2xl`}
                >
                  {step.step}
                </motion.div>
              </div>

              {/* Right Content (for odd indices) or Empty (for even) */}
              <div className={`${index % 2 === 1 ? 'md:text-left' : 'md:text-right'} ${index % 2 === 1 ? 'opacity-100' : 'opacity-0 invisible md:block'}`}>
                {index % 2 === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      {/* Glass reflection */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl" />
                      
                      {/* Gradient glow on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${step.gradient} transition-opacity duration-500 rounded-3xl`} />
                      
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} text-white text-3xl mb-6 shadow-lg relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-3 relative z-10">
                        {step.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-700">
                            <span className={`bg-gradient-to-r ${step.gradient} text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 font-bold text-xs shadow-md`}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Bottom accent line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step.gradient} rounded-b-3xl`} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center mt-24 p-12 overflow-hidden rounded-3xl"
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
                Ready to Get Started?
              </span>
            </h3>
            
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Launch your first Ethiopian influencer campaign in minutes
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-full border-none font-bold text-lg cursor-pointer transition-all shadow-2xl hover:shadow-3xl"
            >
              Create Campaign →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}