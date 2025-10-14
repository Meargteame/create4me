import { motion } from 'framer-motion'
import { 
  FaTwitter,
  FaInstagram, 
  FaLinkedin, 
  FaFacebook 
} from './icons'

export default function Footer() {
  const quickLinks = [
    { name: 'For Brands', href: '#brands' },
    { name: 'For Creators', href: '#creators' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
  ]

  const legalLinks = [
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
  ]

  const socialLinks = [
    { icon: <FaTwitter />, name: 'Twitter', href: '#twitter', gradient: 'from-sky-400 to-blue-500' },
    { icon: <FaInstagram />, name: 'Instagram', href: '#instagram', gradient: 'from-purple-500 to-pink-500' },
    { icon: <FaLinkedin />, name: 'LinkedIn', href: '#linkedin', gradient: 'from-blue-600 to-blue-700' },
    { icon: <FaFacebook />, name: 'Facebook', href: '#facebook', gradient: 'from-blue-500 to-indigo-600' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white py-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h3 className="text-xl font-black">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create4Me
              </span>
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              Ethiopia's Premier Creator Platform
            </p>
            
            {/* Contact */}
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>hello@create4me.et</span>
              </div>
              <div className="flex items-center gap-2">
                <span>�</span>
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex flex-wrap justify-center items-center gap-5 text-sm">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <span className="text-gray-700">|</span>
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-500 hover:text-white transition-colors text-xs"
                >
                  {link.name}
                </a>
              ))}
              <span className="text-gray-700">|</span>
              <span className="text-gray-500 text-xs">© 2025</span>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 bg-gradient-to-br ${social.gradient} rounded-lg flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all`}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}