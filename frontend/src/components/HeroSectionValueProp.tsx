import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaFacebook,
    FaArrowRight,
    FaRocket,
    FaCheckCircle
} from 'react-icons/fa';

export default function HeroSectionValueProp() {
    return (
        <section className="pt-40 pb-24 px-6 bg-transparent relative">
            {/* Background elements removed to use global page background */}

            <div className="max-w-7xl mx-auto">
                <div className="max-w-5xl mx-auto text-center relative">
                    {/* Floating Social Media Icons */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -left-20 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl shadow-xl float-animation"
                    >
                        <FaInstagram />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                            rotate: [0, -5, 0]
                        }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-20 -right-16 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-xl float-animation"
                    >
                        <FaYoutube />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 8, 0]
                        }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-40 -left-24 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-lg shadow-xl float-animation"
                    >
                        <FaTiktok />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            rotate: [0, -8, 0]
                        }}
                        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="absolute top-60 -right-20 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-xl float-animation"
                    >
                        <FaFacebook />
                    </motion.div>

                    {/* Three-Part Headline */}

                    {/* Part 1: Pain Point Text - Pre-Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-full mb-8 shadow-lg"
                    >
                        <span className="text-base font-bold text-red-700">Tired of DMs, Scams, and Missed Opportunities?</span>
                    </motion.div>

                    {/* Part 2: Massive H1 with Shimmer Animation */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            type: "spring",
                            stiffness: 80,
                            damping: 12
                        }}
                        className="text-7xl lg:text-8xl font-black text-gray-900 leading-none mb-8 tracking-tight"
                    >
                        <span className="block mb-2">Instant Access.</span>
                        <span className="block gradient-shimmer" style={{
                            background: 'linear-gradient(90deg, #16a34a 0%, #059669 25%, #10b981 50%, #059669 75%, #16a34a 100%)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Verified Brands.
                        </span>
                    </motion.h1>

                    {/* Part 3: Value Sub-Headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto font-semibold"
                    >
                        Your central hub for{' '}
                        <span className="relative inline-block">
                            <span className="text-blue-600 font-bold">Ethiopian brand promotions</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
                        </span>
                        {' '}on TikTok & Instagram. Get{' '}
                        <span className="text-green-600 font-bold">secure, vetted jobs</span>
                        {' '}and skip the hustle.
                    </motion.p>

                    {/* CTA Buttons with Icon Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col items-center justify-center gap-6 mb-16"
                    >
                        {/* Main CTA Row */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register?role=creator"
                                className="premium-button group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105"
                                style={{
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(22, 163, 74, 0.2), 0 8px 16px rgba(22, 163, 74, 0.15)'
                                }}
                            >
                                See Available Campaigns
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/register?role=brand"
                                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-bold text-lg hover:border-green-600 hover:text-green-700 transition-all flex items-center justify-center gap-3 hover:shadow-lg"
                            >
                                I'm a Brand
                                <FaRocket />
                            </Link>
                        </div>

                        {/* Social Media Icon Stack */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-sm text-gray-600 font-semibold">Available on:</span>
                            <div className="flex items-center gap-2">
                                {/* TikTok Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
                                    style={{
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <FaTiktok className="text-gray-800 text-lg" />
                                </motion.div>

                                {/* Instagram Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
                                    style={{
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <FaInstagram className="text-gray-800 text-lg" />
                                </motion.div>

                                {/* YouTube Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
                                    style={{
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <FaYoutube className="text-gray-800 text-lg" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600"
                    >
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className=" text-green-600 text-lg" />
                            <span className="font-semibold">No hidden fees</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-600 text-lg" />
                            <span className="font-semibold">Direct brand payments</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-600 text-lg" />
                            <span className="font-semibold">2,500+ verified creators</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
