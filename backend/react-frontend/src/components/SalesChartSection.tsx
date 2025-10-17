import { motion } from 'framer-motion'

export default function SalesChartSection() {
  const chartData = [40, 65, 45, 80, 60, 95, 85]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart/Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Chart Container */}
              <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 shadow-2xl overflow-hidden">
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl" />
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-xl font-bold text-gray-900">
                    Campaign Performance
                  </h3>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-full">
                    <span className="text-xl">▲</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+180% Growth</span>
                  </div>
                </div>
                
                {/* Chart Bars */}
                <div className="flex items-end justify-between h-48 gap-2 mb-4 relative z-10">
                  {chartData.map((height, index) => (
                    <motion.div 
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-500 transition-all cursor-pointer"
                    />
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 relative z-10">
                  {months.map((month, index) => (
                    <span key={index}>{month}</span>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 p-4 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200/50 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-gray-900">
                    Live Tracking
                  </span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl"
              >
                <div className="text-3xl font-black">2.5M ETB</div>
                <div className="text-xs opacity-90">Revenue This Month</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-blue-900 text-sm font-bold mb-8 shadow-md"
            >
              <span className="text-lg">📊</span>
              Data-Driven Results
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Turn Ethiopian Creator Data Into{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Revenue Growth
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our advanced analytics platform tracks every aspect of your Ethiopian influencer 
              campaigns, giving you the insights needed to optimize performance and 
              maximize ROI. See exactly how creator partnerships drive real business results in Ethiopia.
            </p>

            <div className="mb-10 space-y-6">
              {[
                {
                  icon: '🎯',
                  title: 'Ethiopian Audience Analytics',
                  description: 'Deep insights into Ethiopian creator audiences including demographics, interests, and engagement patterns.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: '📈',
                  title: 'Performance Tracking',
                  description: 'Real-time monitoring of campaign metrics, conversions, and revenue attribution.',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: '👥',
                  title: 'Local Creator Matching',
                  description: 'AI-powered recommendations to find Ethiopian creators whose audiences align with your target market.',
                  gradient: 'from-purple-500 to-pink-500'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full border-none font-bold text-lg cursor-pointer transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              View Analytics Demo →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}