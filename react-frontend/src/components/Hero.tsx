import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useState, useEffect } from 'react'
import { 
  FaFacebook, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok, 
  FaWhatsapp, 
  FaTelegram, 
  FaSnapchat,
  FaTwitter
} from 'react-icons/fa'
import { SiWechat } from 'react-icons/si'

// Social Media Icon Component with real icons
const SocialIcon = ({ 
  Icon, 
  position, 
  delay = 0, 
  color,
  bgColor 
}: { 
  Icon: any; 
  position: { top?: string; bottom?: string; left?: string; right?: string }; 
  delay?: number;
  color: string;
  bgColor: string;
}) => (
  <motion.div
    className="absolute"
    style={position}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.15, 1],
      rotate: [0, 10, -10, 0]
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <div className={`${bgColor} rounded-2xl p-4 shadow-xl backdrop-blur-md border border-white/20`}>
      <Icon className={`${color} text-4xl`} />
    </div>
  </motion.div>
)

// Floating Particle Component
const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }: { delay?: number; duration?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full bg-blue-500/20"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0.2, 0.5, 0.2],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
)

// Spark Effect Component
const Spark = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay,
      ease: "easeOut"
    }}
  />
)

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} duration={15 + Math.random() * 10} size={2 + Math.random() * 4} />
        ))}
      </div>

      {/* Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Spark key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Mouse Follow Light Effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Floating Social Media Icons - Real Brand Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {/* Facebook - Top Left */}
        <SocialIcon 
          Icon={FaFacebook} 
          position={{ top: "12%", left: "8%" }} 
          delay={0}
          color="text-blue-600"
          bgColor="bg-white/80"
        />
        
        {/* YouTube - Top Right */}
        <SocialIcon 
          Icon={FaYoutube} 
          position={{ top: "18%", right: "10%" }} 
          delay={0.5}
          color="text-red-600"
          bgColor="bg-white/80"
        />
        
        {/* Instagram - Middle Left */}
        <SocialIcon 
          Icon={FaInstagram} 
          position={{ top: "38%", left: "6%" }} 
          delay={1}
          color="text-pink-600"
          bgColor="bg-white/80"
        />
        
        {/* TikTok - Middle Right */}
        <SocialIcon 
          Icon={FaTiktok} 
          position={{ top: "42%", right: "8%" }} 
          delay={1.5}
          color="text-black"
          bgColor="bg-white/80"
        />
        
        {/* WhatsApp - Bottom Left */}
        <SocialIcon 
          Icon={FaWhatsapp} 
          position={{ bottom: "22%", left: "10%" }} 
          delay={2}
          color="text-green-600"
          bgColor="bg-white/80"
        />
        
        {/* Telegram - Bottom Right */}
        <SocialIcon 
          Icon={FaTelegram} 
          position={{ bottom: "28%", right: "12%" }} 
          delay={2.5}
          color="text-blue-500"
          bgColor="bg-white/80"
        />
        
        {/* Snapchat - Top Center-Right */}
        <SocialIcon 
          Icon={FaSnapchat} 
          position={{ top: "22%", right: "28%" }} 
          delay={3}
          color="text-yellow-400"
          bgColor="bg-white/80"
        />
        
        {/* Twitter/X - Middle Left Upper */}
        <SocialIcon 
          Icon={FaTwitter} 
          position={{ top: "28%", left: "14%" }} 
          delay={3.5}
          color="text-sky-500"
          bgColor="bg-white/80"
        />
        
        {/* WeChat - Top Center-Left */}
        <SocialIcon 
          Icon={SiWechat} 
          position={{ top: "16%", left: "25%" }} 
          delay={4}
          color="text-green-500"
          bgColor="bg-white/80"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'flex items-center gap-3 mb-6 px-4 py-2',
              'bg-white/80',
              'backdrop-blur-xl',
              'border border-gray-200/50',
              'shadow-lg shadow-blue-500/10',
              'rounded-full text-sm font-semibold text-gray-800'
            )}
          >
            <div className="relative flex items-center justify-center w-4 h-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span>v1.0 Now Live!</span>
            <span className="text-gray-400">|</span>
            <Link to="/whats-new" className="hover:text-blue-600 transition-colors">
              See what's new
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.1' }}
            className="font-black text-gray-900"
          >
            The #1 Influencer Marketing <br />
            Platform in <span className="relative inline-block mt-6">
              <span 
                className="absolute -inset-2 block bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl blur-xl opacity-70"
              ></span>
              <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ethiopia
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg text-gray-600"
          >
            Connect with top Ethiopian creators, launch targeted campaigns, and track your ROI in real-time. 
            Create4Me is your all-in-one solution for authentic brand growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className={cn(
                'w-full sm:w-auto px-8 py-4 rounded-xl',
                'bg-white',
                'text-gray-900 font-bold text-lg',
                'flex items-center justify-center gap-2',
                'border-2 border-gray-200',
                'shadow-md',
                'transform hover:scale-105',
                'hover:bg-gray-50',
                'hover:border-gray-300',
                'transition-all duration-300 ease-out'
              )}
            >
              I'm a Creator
            </Link>
            <Link
              to="/signup-brand"
              className={cn(
                'w-full sm:w-auto px-8 py-4 rounded-xl',
                'bg-blue-600',
                'text-white font-bold text-lg',
                'flex items-center justify-center gap-2',
                'border-2 border-blue-700',
                'shadow-lg shadow-blue-500/30',
                'transform hover:scale-105',
                'hover:bg-blue-500',
                'transition-all duration-300 ease-out'
              )}
            >
              I'm a Brand
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-500"
          >
            100% Free to get started.
          </motion.div>
        </div>
      </div>
    </section>
  )
}