import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaFacebook, 
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaSnapchat,
  FaTelegram,
  FaWhatsapp,
  FaCheckCircle,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaArrowRight,
  FaStar,
  FaBullseye,
  FaDollarSign,
  FaHeart,
  FaFlag,
  FaUsers,
  FaEye,
  FaFire
} from 'react-icons/fa';

export default function HomePageWorldClass() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Fully Rounded Pill Style */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-6">
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-5xl"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
            {/* Logo - Clean Text Only */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent hover:from-red-700 hover:via-pink-700 hover:to-purple-700 transition-all">
                Create4Me
              </Link>
            </motion.div>
            
            {/* Navigation Links - Clean Pills */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:flex items-center gap-1"
            >
              <a href="#features" className="px-5 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all">
                Features
              </a>
              <a href="#how-it-works" className="px-5 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all">
                How it Works
              </a>
              <a href="#pricing" className="px-5 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all">
                Pricing
              </a>
            </motion.div>

            {/* CTA Buttons - Rounded Pills */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Link 
                to="/login" 
                className="px-5 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>
      </div>

      {/* Hero Section - Stripe/Calendly Style */}
      <section className="pt-40 pb-24 px-6 bg-white relative overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
          
          {/* Floating Squares */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-32 h-32 border-2 border-blue-200 rounded-lg opacity-30"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 left-10 w-24 h-24 border-2 border-purple-200 rounded-lg opacity-30"
          />
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Floating Social Media Icons */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-20 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl shadow-xl"
            >
              <FaInstagram />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-20 -right-16 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-xl"
            >
              <FaYoutube />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 8, 0]
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-40 -left-24 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-lg shadow-xl"
            >
              <FaTiktok />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -8, 0]
              }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute top-60 -right-20 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-xl"
            >
              <FaFacebook />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -18, 0],
                rotate: [0, 6, 0]
              }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              className="absolute bottom-20 -left-16 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-lg shadow-xl"
            >
              <FaTwitter />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 18, 0],
                rotate: [0, -6, 0]
              }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="absolute bottom-40 -right-12 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-lg shadow-xl"
            >
              <FaLinkedin />
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-8"
            >
              <FaCheckCircle className="text-green-600" />
              <span className="text-sm font-semibold text-green-900">100% Free to get started</span>
            </motion.div>

            {/* Massive Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 tracking-tight"
            >
              The #1 Influencer Marketing Platform in Ethiopia
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Connect with top Ethiopian creators, launch targeted campaigns, and track your ROI in real-time. 
              Create4Me is your all-in-one solution for authentic brand growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                to="/register?role=brand"
                className="group w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                I'm a Brand
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register?role=creator"
                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-bold text-lg hover:border-gray-400 transition-all flex items-center justify-center gap-3"
              >
                I'm a Creator
                <FaRocket />
              </Link>
            </motion.div>

            {/* Social Proof - Simplified */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-yellow-400 text-base" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5 from 500+ brands</span>
              </div>
              <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-600 text-lg" />
                <span className="font-semibold">2,500+ Active Creators</span>
              </div>
            </motion.div>
          </div>

          {/* Dashboard Preview - Realistic */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 max-w-6xl mx-auto relative z-10"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-8">
                  <div className="bg-white rounded-lg px-4 py-2 text-sm text-gray-500 border border-gray-200">
                    create4me.com/dashboard
                  </div>
                </div>
                <div className="w-20"></div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Campaign Dashboard</h3>
                    <p className="text-gray-600 text-sm mt-1">Welcome back, Brand Manager</p>
                  </div>
                  <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                    + New Campaign
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <FaRocket className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-sm text-blue-700 font-medium mb-1">Active Campaigns</p>
                    <p className="text-3xl font-bold text-blue-900">24</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                        <FaEye className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+34%</span>
                    </div>
                    <p className="text-sm text-green-700 font-medium mb-1">Total Reach</p>
                    <p className="text-3xl font-bold text-green-900">2.4M</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                        <FaChartLine className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+23%</span>
                    </div>
                    <p className="text-sm text-purple-700 font-medium mb-1">Engagement</p>
                    <p className="text-3xl font-bold text-purple-900">4.8%</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                        <FaDollarSign className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+18%</span>
                    </div>
                    <p className="text-sm text-orange-700 font-medium mb-1">ROI</p>
                    <p className="text-3xl font-bold text-orange-900">180%</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-900">Performance Overview</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-600">Reach</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="text-gray-600">Engagement</span>
                      </span>
                    </div>
                  </div>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[
                      { reach: 45, engagement: 35 },
                      { reach: 68, engagement: 52 },
                      { reach: 52, engagement: 48 },
                      { reach: 85, engagement: 72 },
                      { reach: 63, engagement: 58 },
                      { reach: 92, engagement: 85 },
                      { reach: 78, engagement: 68 }
                    ].map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-all cursor-pointer" style={{ height: `${data.reach}%` }}></div>
                        <div className="w-full bg-green-600 rounded-t-lg hover:bg-green-700 transition-all cursor-pointer" style={{ height: `${data.engagement}%` }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Floating Success Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-2xl font-bold flex items-center gap-2"
              >
                <FaFire />
                <span>+23% Growth</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - Platform Logos */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-gray-500 mb-12 uppercase tracking-wider">
            2,500+ Creators Across All Platforms
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-8">
            {[
              { icon: <FaInstagram />, name: 'Instagram', color: 'text-pink-600' },
              { icon: <FaTiktok />, name: 'TikTok', color: 'text-gray-900' },
              { icon: <FaYoutube />, name: 'YouTube', color: 'text-red-600' },
              { icon: <FaFacebook />, name: 'Facebook', color: 'text-blue-600' },
              { icon: <FaTwitter />, name: 'Twitter', color: 'text-blue-400' },
              { icon: <FaLinkedin />, name: 'LinkedIn', color: 'text-blue-700' },
              { icon: <FaPinterest />, name: 'Pinterest', color: 'text-red-600' },
              { icon: <FaSnapchat />, name: 'Snapchat', color: 'text-yellow-400' },
              { icon: <FaTelegram />, name: 'Telegram', color: 'text-blue-500' },
              { icon: <FaWhatsapp />, name: 'WhatsApp', color: 'text-green-500' },
            ].map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className={`text-5xl ${platform.color} group-hover:scale-110 transition-transform`}>
                  {platform.icon}
                </div>
                <span className="text-xs text-gray-600 font-semibold">{platform.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Data with Impact */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '2,500+', label: 'Verified Creators', icon: <FaUsers className="text-blue-600" /> },
              { number: '500+', label: 'Active Brands', icon: <FaRocket className="text-green-600" /> },
              { number: '180%', label: 'Average ROI', icon: <FaChartLine className="text-purple-600" /> },
              { number: '98%', label: 'Match Accuracy', icon: <FaBullseye className="text-orange-600" /> },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Benefit-Focused */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful tools and insights to run successful influencer campaigns
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaCheckCircle className="text-4xl text-green-600" />,
                title: '98% Match Accuracy',
                description: 'Every creator is thoroughly verified with real engagement metrics and authentic followers',
                stat: 'Used by 98% of top brands'
              },
              {
                icon: <FaChartLine className="text-4xl text-blue-600" />,
                title: 'Real-Time Analytics',
                description: 'Track campaign performance with comprehensive analytics and actionable insights',
                stat: '180% average ROI'
              },
              {
                icon: <FaShieldAlt className="text-4xl text-purple-600" />,
                title: 'Secure Payments',
                description: 'Safe and transparent payment processing with escrow protection',
                stat: '100% payment security'
              },
              {
                icon: <FaRocket className="text-4xl text-orange-600" />,
                title: 'Fast Campaign Launch',
                description: 'Go from idea to live campaign in minutes with our streamlined process',
                stat: 'Launch in 5 minutes'
              },
              {
                icon: <FaEye className="text-4xl text-pink-600" />,
                title: 'Quality Assurance',
                description: 'Review and approve all content before it goes live to your audience',
                stat: '99.9% approval rate'
              },
              {
                icon: <FaDollarSign className="text-4xl text-green-600" />,
                title: 'Performance Tracking',
                description: 'Monitor reach, engagement, and ROI with detailed performance metrics',
                stat: 'Track every metric'
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                  <FaCheckCircle />
                  {feature.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Categories - Visual Appeal */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Find the perfect creator
            </h2>
            <p className="text-xl text-gray-600">
              Browse creators by category and platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Fashion & Beauty', count: '850+', engagement: '4.8%', rating: '4.9', color: 'from-pink-500 to-rose-500', icon: <FaInstagram /> },
              { name: 'Tech & Gaming', count: '620+', engagement: '5.2%', rating: '4.8', color: 'from-blue-500 to-cyan-500', icon: <FaYoutube /> },
              { name: 'Food & Lifestyle', count: '730+', engagement: '4.5%', rating: '4.9', color: 'from-orange-500 to-amber-500', icon: <FaTiktok /> },
              { name: 'Travel & Adventure', count: '540+', engagement: '5.0%', rating: '4.7', color: 'from-green-500 to-emerald-500', icon: <FaInstagram /> },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative p-8 text-white">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{category.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="opacity-90">Creators</span>
                      <span className="font-bold">{category.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-90">Avg. Engagement</span>
                      <span className="font-bold">{category.engagement}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-90">Rating</span>
                      <span className="font-bold flex items-center gap-1">
                        <FaStar className="text-yellow-300" />
                        {category.rating}
                      </span>
                    </div>
                  </div>
                  <button className="mt-6 w-full py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Browse Creators
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Clear Journey */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Launch your campaign in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Create Campaign',
                description: 'Define your goals, budget, and target audience',
                checklist: ['Set campaign objectives', 'Define target demographics', 'Set budget & timeline'],
                success: '95% completion rate'
              },
              {
                number: '02',
                title: 'Find Creators',
                description: 'Browse and connect with verified creators',
                checklist: ['Search by category', 'Review creator profiles', 'Check engagement metrics'],
                success: '98% match accuracy'
              },
              {
                number: '03',
                title: 'Launch & Track',
                description: 'Approve content and monitor performance',
                checklist: ['Review submissions', 'Approve content', 'Track real-time metrics'],
                success: '180% average ROI'
              },
              {
                number: '04',
                title: 'Measure Results',
                description: 'Analyze campaign performance and ROI',
                checklist: ['View detailed analytics', 'Export reports', 'Optimize future campaigns'],
                success: '99% satisfaction'
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-2 mb-6">
                    {step.checklist.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <FaCheckCircle className="text-green-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
                    <FaCheckCircle />
                    {step.success}
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Conversion Focused */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your needs
            </p>
            <div className="inline-flex items-center gap-4 p-2 bg-gray-100 rounded-xl">
              <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold shadow-sm">
                Monthly
              </button>
              <button className="px-6 py-2 text-gray-600 font-semibold">
                Annual <span className="text-green-600">(Save 20%)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                description: 'Perfect for trying out the platform',
                features: [
                  '1 active campaign',
                  'Up to 5 creator connections',
                  'Basic analytics',
                  'Email support',
                  '5% platform fee'
                ],
                cta: 'Start Free',
                popular: false
              },
              {
                name: 'Professional',
                price: '4,999',
                period: 'per month',
                description: 'For growing brands and agencies',
                features: [
                  '10 active campaigns',
                  'Unlimited creator connections',
                  'Advanced analytics & reporting',
                  'Priority support',
                  '3% platform fee',
                  'Campaign templates',
                  'Team collaboration'
                ],
                cta: 'Start 14-day trial',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'contact us',
                description: 'For large organizations',
                features: [
                  'Unlimited campaigns',
                  'Dedicated account manager',
                  'Custom integrations',
                  '24/7 phone support',
                  'Negotiable platform fee',
                  'White-label options',
                  'API access',
                  'Custom contracts'
                ],
                cta: 'Contact Sales',
                popular: false
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-blue-600 text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price === 'Free' || plan.price === 'Custom' ? plan.price : `ETB ${plan.price}`}
                  </span>
                  <span className={`text-sm ml-2 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-3 ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      <FaCheckCircle className={plan.popular ? 'text-green-300' : 'text-green-600'} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.name === 'Professional' && (
                  <p className="text-center text-sm mt-4 text-blue-100">
                    No credit card required
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FaFlag className="text-green-600" />
                <span>Ethiopian-owned & operated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to grow your brand?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 500+ Ethiopian brands already working with top creators
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group w-full sm:w-auto px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                Start Free Campaign
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-5 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all"
              >
                Sign In
              </Link>
            </div>
            <p className="text-blue-100 text-sm mt-6">
              <FaCheckCircle className="inline mr-2" />
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C4</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Create4Me</span>
              </div>
              <p className="text-gray-400 mb-6">
                Ethiopia's #1 influencer marketing platform connecting brands with verified creators.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedin className="text-2xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© 2025 Create4Me. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <FaHeart className="text-red-500" />
              <span>Made with love in Ethiopia</span>
              <FaFlag className="text-green-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
