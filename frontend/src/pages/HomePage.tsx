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
  FaRocket,
  FaCheckCircle,
  FaChartLine,
  FaDollarSign,
  FaShieldAlt,
  FaHeart,
  FaBullseye,
  FaHandshake,
  FaFlag
} from 'react-icons/fa';
import { useState } from 'react';

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaRocket className="text-white text-xl" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Create4Me</span>
                <span className="ml-2 text-xs text-blue-600 font-semibold">v1.0 Now Live!</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium">Features</a>
              <a href="#creators" className="text-gray-700 hover:text-gray-900 font-medium">Creators</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-semibold mb-6"
          >
            ✨ 100% Free to get started
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight"
          >
            The #1 Influencer Marketing
            <br />
            Platform in <span className="text-blue-600">Ethiopia</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Connect with verified Ethiopian creators, launch campaigns in minutes, and track real-time performance. 
            The complete platform for influencer marketing success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register?role=brand"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <span className="flex items-center gap-2">
                I'm a Brand
                <FaRocket className="text-lg" />
              </span>
            </Link>
            <Link
              to="/register?role=creator"
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg font-semibold text-lg hover:border-gray-400 transition-colors"
            >
              I'm a Creator ✨
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social Media Platforms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-wide">
            Creators Across All Major Platforms
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-8 items-center justify-items-center">
            {[
              { name: 'Instagram', icon: <FaInstagram className="text-pink-600" /> },
              { name: 'TikTok', icon: <FaTiktok className="text-black" /> },
              { name: 'YouTube', icon: <FaYoutube className="text-red-600" /> },
              { name: 'Facebook', icon: <FaFacebook className="text-blue-600" /> },
              { name: 'Twitter', icon: <FaTwitter className="text-blue-400" /> },
              { name: 'LinkedIn', icon: <FaLinkedin className="text-blue-700" /> },
              { name: 'Pinterest', icon: <FaPinterest className="text-red-600" /> },
              { name: 'Snapchat', icon: <FaSnapchat className="text-yellow-400" /> },
              { name: 'Telegram', icon: <FaTelegram className="text-blue-500" /> },
              { name: 'WhatsApp', icon: <FaWhatsapp className="text-green-500" /> },
            ].map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {platform.icon}
                </div>
                <span className="text-xs text-gray-600 font-medium">{platform.name}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">
            2,500+ creators across all major platforms
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Why Choose Create4Me
            </h2>
            <p className="text-xl text-gray-600">
              Everything You Need for Successful Campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBullseye className="text-blue-600" />,
                title: '98% Match Accuracy',
                description: 'AI-powered creator matching ensures perfect brand-creator alignment every time'
              },
              {
                icon: <FaCheckCircle className="text-green-600" />,
                title: '100% Verified Profiles',
                description: 'Every creator is thoroughly verified with real engagement metrics and authentic followers'
              },
              {
                icon: <FaChartLine className="text-purple-600" />,
                title: 'Live Performance Data',
                description: 'Track campaign performance in real-time with comprehensive analytics and insights'
              },
              {
                icon: <FaDollarSign className="text-green-600" />,
                title: 'No Hidden Fees',
                description: 'Transparent pricing in ETB and USD. Pay only for what you use, no surprises'
              },
              {
                icon: <FaHandshake className="text-blue-600" />,
                title: 'Full Service Support',
                description: 'End-to-end campaign management from creator discovery to final reporting'
              },
              {
                icon: <FaFlag className="text-green-600" />,
                title: 'Local Expertise',
                description: 'Deep understanding of Ethiopian market, culture, and creator landscape'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <FaShieldAlt className="text-blue-600" />
              Trusted by Ethiopia's Leading Brands
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '98%', label: 'Campaign Success Rate' },
              { number: '180%', label: 'Average ROI Increase' },
              { number: '500+', label: 'Satisfied Clients' },
              { number: '2,500+', label: 'Creator Network' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="text-5xl font-black text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Creator Categories */}
      <section id="creators" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Access Premium Ethiopian Creator Categories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '👗', title: 'Fashion & Beauty', creators: '850+', engagement: '8.5%', rating: '4.9' },
              { icon: '🎮', title: 'Tech & Gaming', creators: '620+', engagement: '9.2%', rating: '4.8' },
              { icon: '🌟', title: 'Lifestyle', creators: '1,200+', engagement: '7.8%', rating: '4.9' },
              { icon: '🍔', title: 'Food & Travel', creators: '450+', engagement: '8.9%', rating: '4.7' }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Creators:</span>
                    <span className="font-semibold text-gray-900">{category.creators}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg. Engagement:</span>
                    <span className="font-semibold text-green-600">{category.engagement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating:</span>
                    <span className="font-semibold text-yellow-600">{category.rating}⭐</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <FaRocket className="text-blue-600" />
              Simple Process - How Create4Me Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '1',
                title: 'Create Your Campaign',
                items: ['Define your goals', 'Set your budget', 'Choose categories', 'Add requirements']
              },
              {
                number: '2',
                title: 'Discover Perfect Creators',
                items: ['AI-powered matching', 'Browse portfolios', 'Check engagement rates', 'Review past work']
              },
              {
                number: '3',
                title: 'Collaborate & Create',
                items: ['Direct messaging', 'Share briefs', 'Approve content', 'Track progress']
              },
              {
                number: '4',
                title: 'Track & Optimize',
                items: ['Real-time analytics', 'Performance metrics', 'ROI tracking', 'Campaign insights']
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <ul className="space-y-2">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <FaDollarSign className="text-green-600" />
              Transparent Pricing
            </h2>
            <div className="inline-flex items-center gap-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'annual' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Annual
                <span className="ml-2 text-xs text-green-600 font-semibold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: billingCycle === 'monthly' ? '2,500' : '24,000',
                period: billingCycle === 'monthly' ? '/month' : '/year',
                features: [
                  '5 Active Campaigns',
                  'Up to 50 Creator Matches',
                  'Basic Analytics',
                  'Email Support',
                  { text: 'Advanced Features', included: false },
                  { text: 'Priority Support', included: false }
                ]
              },
              {
                name: 'Professional',
                price: billingCycle === 'monthly' ? '7,500' : '72,000',
                period: billingCycle === 'monthly' ? '/month' : '/year',
                popular: true,
                features: [
                  'Unlimited Campaigns',
                  'Unlimited Creator Matches',
                  'Advanced Analytics',
                  'Priority Support',
                  'Campaign Templates',
                  'Dedicated Manager'
                ]
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: [
                  'Everything in Professional',
                  'Dedicated Account Manager',
                  'Custom Integrations',
                  'White-label Options',
                  'SLA Guarantee',
                  'Custom Training'
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white border-2 rounded-2xl p-8 ${
                  plan.popular ? 'border-blue-600 shadow-xl' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600"> ETB{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {typeof feature === 'string' ? (
                        <>
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </>
                      ) : (
                        <>
                          <span className={`mt-1 ${feature.included ? 'text-green-600' : 'text-gray-300'}`}>
                            {feature.included ? '✓' : '✗'}
                          </span>
                          <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Launch Your Ethiopian Campaign?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of brands already growing with Ethiopian creators
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                <span className="flex items-center gap-2">
                  Start Free Campaign
                  <FaRocket />
                </span>
              </Link>
              <Link
                to="/creators"
                className="px-8 py-4 bg-blue-700 text-white border-2 border-white rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                View Creator Network
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FaRocket className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold">Create4Me</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Ethiopia's #1 influencer marketing platform
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>📧 hello@create4me.et</p>
                <p>📞 +251 11 123 4567</p>
                <p>📍 Addis Ababa, Ethiopia</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/creators" className="hover:text-white">Find Creators</Link></li>
                <li><Link to="/campaigns" className="hover:text-white">Browse Campaigns</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Creator Guide</a></li>
                <li><a href="#" className="hover:text-white">Brand Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Press Kit</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex flex-wrap gap-3 text-2xl">
                <a href="#" className="hover:scale-110 transition-transform">📷</a>
                <a href="#" className="hover:scale-110 transition-transform">🐦</a>
                <a href="#" className="hover:scale-110 transition-transform">💼</a>
                <a href="#" className="hover:scale-110 transition-transform">👥</a>
                <a href="#" className="hover:scale-110 transition-transform">📺</a>
                <a href="#" className="hover:scale-110 transition-transform">✈️</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p className="flex items-center gap-2">
              Made with <FaHeart className="text-red-500" /> in Ethiopia • v1.0.0 • <span className="text-green-500">● All Systems Operational</span>
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>&copy; 2024 Create4Me. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
