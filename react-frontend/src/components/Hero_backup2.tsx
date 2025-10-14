import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useState, useEffect } from 'react'

// Floating Particle Component
const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }: { delay?: number; duration?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full bg-blue-500/20
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'inline-flex items-center gap-3',
                'px-5 py-2.5 rounded-full',
                'bg-white/80
                'backdrop-blur-xl',
                'border border-gray-200/50
                'shadow-lg shadow-blue-500/10',
                'text-sm font-semibold'
              )}
            >
              <motion.span 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-yellow-500"
              >
                ★
              </motion.span>
              <span className="text-gray-900 Premier Creator Platform</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
            </motion.div>

            {/* Premium Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] text-gray-900
            >
              Connect with
              <br />
              <span className="relative inline-block mt-2">
                <span className="text-blue-600 Creators</span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-500/20 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            {/* Premium Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Launch authentic campaigns with verified Ethiopian influencers.
              Track performance in real-time with our premium analytics dashboard.
            </motion.p>

            {/* Glassmorphic CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/creators" className="group">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative overflow-hidden',
                    'w-full sm:w-auto',
                    'bg-blue-600
                    'text-white font-semibold text-lg',
                    'px-8 py-4 rounded-2xl',
                    'shadow-2xl shadow-blue-500/50',
                    'transition-all duration-300',
                    'flex items-center justify-center gap-3'
                  )}
                >
                  <span className="relative z-10">Start Campaign</span>
                  <motion.svg 
                    className="w-5 h-5 relative z-10" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%', skewX: -20 }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full sm:w-auto',
                  'border-2 border-gray-300',
                  'text-gray-700 font-semibold text-lg',
                  'px-8 py-4 rounded-xl',
                  'hover:bg-gray-50 hover:border-gray-400',
                  'transition-all duration-200'
                )}
              >
                Join as Creator
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">2,500+</div>
                <p className="text-sm text-gray-600">Verified Creators</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <p className="text-sm text-gray-600">Brand Partners</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Bento Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Ethiopian content creators"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Live Campaign Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={cn(
                'absolute top-4 right-4',
                'bg-white/90 backdrop-blur-xl',
                'rounded-xl p-4',
                'shadow-lg shadow-black/10',
                'animate-float'
              )}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-900">Live Campaign</span>
              </div>
            </motion.div>

            {/* Floating Reach Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className={cn(
                'absolute bottom-4 left-4',
                'bg-gradient-to-br from-primary-600 to-accent-600',
                'text-white rounded-xl p-4',
                'shadow-lg shadow-primary-500/30',
                'animate-float'
              )}
              style={{ animationDelay: '1s' }}
            >
              <div className="text-3xl font-bold">180K</div>
              <div className="text-sm opacity-90">Total Reach</div>
            </motion.div>

            {/* Floating Mini Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className={cn(
                'absolute top-1/2 -right-4',
                'bg-white/90 backdrop-blur-xl',
                'rounded-xl p-3',
                'shadow-lg shadow-black/10'
              )}
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl">📈</div>
                <div>
                  <div className="text-lg font-bold text-gray-900">+127%</div>
                  <div className="text-xs text-gray-600">Growth</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}