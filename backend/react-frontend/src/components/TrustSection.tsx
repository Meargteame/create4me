import { motion } from 'framer-motion'
import { FaChartLine, FaDollarSign, FaStar, FaUsers } from './icons'

export default function TrustSection() {
  const testimonials = [
    {
      name: "Meron Tadesse",
      company: "EthioTech Solutions",
      role: "Marketing Director",
      content: "Create4Me helped us connect with authentic Ethiopian creators who truly understand our market. Our campaign reach increased by 250%.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b882?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Dawit Bekele", 
      company: "AddisLife",
      role: "Content Creator",
      content: "The platform made it so easy to find brand partnerships that align with my values. I've worked with 12 brands this year alone.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Sara Alemayehu",
      company: "Blue Nile Coffee",
      role: "Brand Manager", 
      content: "Working with Ethiopian creators through Create4Me has been game-changing for our local market penetration.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ]

  const stats = [
    { label: "Campaign Success Rate", value: "98%", icon: FaChartLine, color: "text-green-600" },
    { label: "Average ROI Increase", value: "180%", icon: FaDollarSign, color: "text-emerald-600" }, 
    { label: "Satisfied Clients", value: "500+", icon: FaStar, color: "text-yellow-600" },
    { label: "Creator Network", value: "2,500+", icon: FaUsers, color: "text-blue-600" }
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-blue-700 text-sm font-semibold mb-6"
          >
            <span className="text-lg">🛡️</span>
            Trusted by Ethiopia's Leading Brands
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Join Ethiopia's Most{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trusted Platform
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why hundreds of Ethiopian brands and creators choose Create4Me for authentic partnerships
          </p>
        </motion.div>

        {/* Stats Grid - Always Single Horizontal Row */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              {/* Glassmorphic Card - Compact */}
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200/50 shadow-xl hover:shadow-2xl hover:border-blue-400/50 transition-all duration-300">
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl" />
                
                {/* Icon */}
                <div className={`${stat.color} mb-3 transform group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={40} />
                </div>
                
                {/* Value */}
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-xs font-medium text-gray-600">
                  {stat.label}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}