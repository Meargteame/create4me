import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VanillaTilt from 'vanilla-tilt';
import { AnimatedText } from '../components/AnimatedText';
import Magnetic from '../components/Magnetic';
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
  FaEye
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSectionValueProp from '../components/HeroSectionValueProp';

const stats = [
  { number: '1500', label: 'Creators Signed' },
  { number: '300+', label: 'Brands Launched' },
  { number: '50M+', label: 'Total Reach' },
  { number: '180%', label: 'Avg. ROI' },
];

const AnimatedStat = ({ stat }: { stat: { number: string; label: string } }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, parseInt(stat.number), {
                duration: 2,
                onUpdate: (latest) => setCount(Math.round(latest)),
            });
            return () => controls.stop();
        }
    }, [isInView, stat.number]);

    return (
        <div ref={ref} className="relative flex flex-col items-center justify-center p-8 bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">
            <p className="text-7xl font-bold text-emerald-400">{count.toLocaleString()}{stat.label.includes('%') ? '%' : '+'}</p>
            <p className="mt-2 text-lg font-medium text-gray-300">{stat.label}</p>
        </div>
    );
};

const howItWorksSteps = [
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
];

export default function HomePageWorldClass() {
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const howItWorksRef = useRef(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -200]);
  const y2 = useTransform(scrollY, [0, 800], [0, -150]);
  const y3 = useTransform(scrollY, [0, 800], [0, -50]);
  const gridY = useTransform(scrollY, [0, 800], [0, -300]);

  const { scrollYProgress: scrollYProgressHowItWorks } = useScroll({
    target: howItWorksRef,
    offset: ["start center", "end center"]
  });

  const pathOffset = useTransform(scrollYProgressHowItWorks, [0, 0.8], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    tiltRefs.current.forEach((ref) => {
      if (ref) {
        VanillaTilt.init(ref, {
          max: 15,
          speed: 400,
          glare: true,
          'max-glare': 0.5,
        });
      }
    });
  }, []);

  return (
    <div ref={howItWorksRef} className="min-h-screen bg-white relative overflow-hidden">
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([newX, newY]) =>
              `radial-gradient(600px at ${newX}px ${newY}px, rgba(45, 212, 191, 0.15), transparent 80%)`
          ),
        }}
      />
      {/* Global Background Elements - Continued from Hero */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grid Pattern */}
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-0 top-[-100px] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"
        ></motion.div>

        {/* Gradient Orbs (Fixed positions for ambient feel) */}
        <motion.div style={{ y: y1 }} className="absolute top-[20%] left-0 w-[800px] h-[800px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></motion.div>
        <motion.div style={{ y: y2 }} className="absolute top-[40%] right-0 w-[800px] h-[800px] bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></motion.div>
        <motion.div style={{ y: y3 }} className="absolute bottom-0 left-[20%] w-[800px] h-[800px] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></motion.div>
      </div>

      {/* Navigation - Premium Glassmorphism */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-6">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="w-full max-w-5xl"
        >
          <div className="glass-enhanced rounded-full px-8 py-4" style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <div className="flex items-center justify-between">
              {/* Logo - Premium Gradient */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all">
                  Create4Me
                </Link>
              </motion.div>

              {/* Navigation Links - Premium Pills */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden md:flex items-center gap-2"
              >
                <a href="#features" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-semibold rounded-full hover:bg-white/50 hover:shadow-sm transition-all">
                  Features
                </a>
                <a href="#how-it-works" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-semibold rounded-full hover:bg-white/50 hover:shadow-sm transition-all">
                  How it Works
                </a>
                <a href="#pricing" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-semibold rounded-full hover:bg-white/50 hover:shadow-sm transition-all">
                  Pricing
                </a>
              </motion.div>

              {/* CTA Buttons - Premium Style */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <Magnetic>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-semibold rounded-full hover:bg-white/50 hover:shadow-sm transition-all"
                  >
                    Sign In
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    to="/register"
                    className="premium-button px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all shadow-lg"
                  >
                    Get Started
                  </Link>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </motion.nav>
      </div>


      {/* Hero Section - Value Proposition with Savings Calculator */}
      <div className="relative z-10">
        <HeroSectionValueProp />
      </div>

      {/* Social Proof - Infinite Scroll */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Trusted by 2,500+ Creators Across All Platforms
            </p>
          </div>
          <div className="relative [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <div className="animate-infinite-scroll flex items-center gap-16">
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
                 // Duplicate for seamless scroll
                { icon: <FaInstagram />, name: 'Instagram', color: 'text-pink-600' },
                { icon: <FaTiktok />, name: 'TikTok', color: 'text-gray-900' },
                { icon: <FaYoutube />, name: 'YouTube', color: 'text-red-600' },
                { icon: <FaFacebook />, name: 'Facebook', color: 'text-blue-600' },
                { icon: <FaTwitter />, name: 'Twitter', color: 'text-blue-400' },
              ].map((platform, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className={`text-5xl ${platform.color} group-hover:scale-110 transition-transform filter drop-shadow-lg`}>
                    {platform.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Data with Impact */}
      <section className="py-24 relative z-10">
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
                className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-lg border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="text-5xl mb-6 flex justify-center filter drop-shadow-md">{stat.icon}</div>
                <AnimatedStat stat={stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Benefit-Focused */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <AnimatedText
              el="h2"
              text="Everything you need to succeed"
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
              once
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Powerful tools and insights to run successful influencer campaigns, built for the Ethiopian market.
            </motion.p>
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
                description: 'Safe and transparent payment processing with escrow protection via Telebirr & Chapa',
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
                className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                ref={(el) => (tiltRefs.current[index] = el)}
              >
                <div className="mb-6 group-hover:scale-110 transition-transform filter drop-shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-gray-100">
                  <FaCheckCircle className="text-green-500" />
                  {feature.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Categories - Visual Appeal */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">perfect creator</span>
            </h2>
            <p className="text-xl text-gray-600">
              Browse verified creators by category and platform
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
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer h-80"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all"></div>

                <div className="relative p-8 text-white h-full flex flex-col justify-between z-10">
                  <div>
                    <div className="text-5xl mb-4 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 origin-left">{category.icon}</div>
                    <h3 className="text-2xl font-bold mb-2 leading-tight">{category.name}</h3>
                  </div>

                  <div className="space-y-3 text-sm font-medium">
                    <div className="flex items-center justify-between p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/10">
                      <span className="opacity-90">Creators</span>
                      <span className="font-bold">{category.count}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/10">
                      <span className="opacity-90">Avg. Eng.</span>
                      <span className="font-bold">{category.engagement}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/10">
                      <span className="opacity-90">Rating</span>
                      <span className="font-bold flex items-center gap-1">
                        <FaStar className="text-yellow-300" />
                        {category.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Clear Journey */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">works</span>
            </h2>
            <p className="text-xl text-gray-600">
              Launch your campaign in 4 simple steps
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-full -translate-y-1/2">
                <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="none">
                    <motion.path
                        d="M 50 100 Q 300 100 350 100 T 650 100 T 950 100 T 1150 100"
                        fill="transparent"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        strokeDasharray="1"
                        strokeDashoffset={pathOffset}
                    />
                    <defs>
                        <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-6xl font-black text-gray-300/20 mb-6 absolute top-4 right-6">{step.number}</div>
                  <div className="card-glow bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10 h-full">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-700 mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.checklist.map((item, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-emerald-600 font-semibold">{step.success}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Conversion Focused */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">pricing</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your needs
            </p>
            <div className="inline-flex items-center gap-1 p-1 bg-gray-100/80 backdrop-blur-md rounded-xl border border-gray-200">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                  !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                  isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual <span className="text-green-600 text-xs ml-1">(Save 20%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                name: 'Starter',
                price: { monthly: 'Free', annual: 'Free' },
                period: { monthly: 'forever', annual: 'forever' },
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
                price: { monthly: '4,999', annual: '3,999' },
                period: { monthly: 'per month', annual: 'per month, billed annually' },
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
                price: { monthly: 'Custom', annual: 'Custom' },
                period: { monthly: 'contact us', annual: 'contact us' },
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
                className={`relative rounded-3xl p-8 ${plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl scale-105 ring-4 ring-blue-200/50'
                  : 'bg-white/60 backdrop-blur-lg border border-white/10 shadow-lg'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
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
                  <motion.div layout className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price[isAnnual ? 'annual' : 'monthly'] === 'Free' || plan.price[isAnnual ? 'annual' : 'monthly'] === 'Custom'
                      ? plan.price[isAnnual ? 'annual' : 'monthly']
                      : `ETB ${plan.price[isAnnual ? 'annual' : 'monthly']}`}
                  </motion.div>
                  <span className={`text-sm ml-2 font-medium ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                    {plan.period[isAnnual ? 'annual' : 'monthly']}
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-3 ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      <FaCheckCircle className={plan.popular ? 'text-green-300' : 'text-green-500'} />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-4 rounded-xl font-bold text-center transition-all shadow-lg hover:shadow-xl hover:scale-105 ${plan.popular
                    ? 'bg-white text-blue-700 hover:bg-gray-50'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    }`}
                >
                  {plan.cta}
                </Link>
                {plan.name === 'Professional' && (
                  <p className="text-center text-sm mt-4 text-blue-100 font-medium">
                    No credit card required
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-8 py-4 rounded-full border border-white/60 shadow-sm">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                <span className="font-semibold">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FaFlag className="text-green-600" />
                <span className="font-semibold">Ethiopian-owned & operated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden p-12 text-center shadow-2xl"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>

            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Ready to grow your brand?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join 500+ Ethiopian brands already working with top creators. Start your first campaign today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="group w-full sm:w-auto px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Start Free Campaign
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-10 py-5 bg-blue-700/50 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-blue-700/70 transition-all"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-8 font-medium">
                <FaCheckCircle className="inline mr-2" />
                No credit card required • Free forever plan available
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">C4</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Create4Me</span>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
                Ethiopia's #1 influencer marketing platform connecting brands with verified creators. Secure, fast, and effective.
              </p>
              <div className="flex items-center gap-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2025 Create4Me. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 bg-gray-800/50 px-4 py-2 rounded-full">
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
