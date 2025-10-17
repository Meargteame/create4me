import { motion } from 'framer-motion'
import { FaUsers, FaHandshake, FaChartLine, FaShieldAlt } from './icons'
import { FaInstagram, FaTiktok, FaYoutube, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'

export default function StatsSection() {
  const stats = [
    {
      number: "2,500+",
      label: "Verified Creators",
      description: "Active Ethiopian content creators across all major platforms",
      icon: FaUsers,
      iconColor: "text-cyan-400",
      growth: "+25% this month",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      number: "500+",
      label: "Brand Partners", 
      description: "Leading Ethiopian and international brands trust our platform",
      icon: FaHandshake,
      iconColor: "text-pink-400",
      growth: "+15% this month",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      number: "180%",
      label: "Average ROI",
      description: "Brands see significant returns on their influencer investments",
      icon: FaChartLine,
      iconColor: "text-emerald-400",
      growth: "+30% vs traditional marketing",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      number: "98%",
      label: "Success Rate",
      description: "Campaigns that meet or exceed brand expectations",
      icon: FaShieldAlt,
      iconColor: "text-orange-400",
      growth: "Industry leading",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const platforms = [
    { name: "Instagram", users: "1.2M+", icon: FaInstagram, gradient: "from-pink-500 to-purple-500" },
    { name: "TikTok", users: "800K+", icon: FaTiktok, gradient: "from-cyan-500 to-blue-500" },
    { name: "YouTube", users: "600K+", icon: FaYoutube, gradient: "from-red-500 to-pink-500" }, 
    { name: "Facebook", users: "2.1M+", icon: FaFacebookF, gradient: "from-blue-500 to-indigo-500" },
    { name: "Twitter", users: "450K+", icon: FaTwitter, gradient: "from-sky-500 to-blue-500" },
    { name: "LinkedIn", users: "300K+", icon: FaLinkedinIn, gradient: "from-blue-600 to-cyan-600" }
  ]

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium mb-6 shadow-lg"
          >
            <span className="text-2xl">📊</span>
            Platform Statistics
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
            Ethiopia's Largest{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Creator Network
            </span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Connect with the most engaged and authentic Ethiopian audience across all major social platforms
          </p>
        </motion.div>

        {/* Main Stats Grid - Always Single Horizontal Row */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group relative"
            >
              {/* Glassmorphic Card - Compact */}
              <div className="relative h-full p-6 rounded-2xl bg-white/15 backdrop-blur-xl border-2 border-white/25 shadow-2xl hover:shadow-3xl transition-all duration-500 text-center overflow-hidden">
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl" />
                
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br ${stat.gradient} transition-opacity duration-500 rounded-2xl blur-xl`} />
                
                {/* Icon */}
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center justify-center mb-4 relative z-10 ${stat.iconColor}`}
                >
                  <stat.icon size={48} />
                </motion.div>
                
                {/* Number with gradient */}
                <div className={`text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent relative z-10`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-lg font-bold text-white mb-2 relative z-10">
                  {stat.label}
                </div>
                
                {/* Description */}
                <p className="text-xs text-white/80 mb-3 leading-relaxed relative z-10">
                  {stat.description}
                </p>
                
                {/* Growth Badge */}
                <div className="inline-block px-4 py-2 bg-green-400/20 backdrop-blur-sm border border-green-300/30 text-green-100 rounded-full text-xs font-bold relative z-10 shadow-md">
                  ✨ {stat.growth}
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platform Coverage */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-12 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
          
          <h3 className="text-4xl font-bold text-center mb-12 relative z-10">
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Multi-Platform Creator Network
            </span>
          </h3>
          
          <div className="grid grid-cols-6 gap-4 lg:gap-6 relative z-10">
            {platforms.map((platform, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.1 }}
                className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${platform.gradient} text-white mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <platform.icon size={28} />
                </div>
                <div className="text-base font-bold text-white mb-1">
                  {platform.name}
                </div>
                <div className="text-xs text-white/80">
                  {platform.users}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-2xl text-white/90 mb-8 font-medium">
            Ready to tap into Ethiopia's most engaged creator community?
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-blue-600 px-10 py-5 rounded-full border-none font-bold text-lg cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Get Started Today →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}