import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaShieldAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

interface BrandEmptyStateProps {
    onHighlightSidebar?: () => void;
}

export default function BrandEmptyState({ onHighlightSidebar }: BrandEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-16 text-center shadow-lg"
            style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
        >
            {/* Target & Scope Graphic */}
            <div className="mb-12 relative">
                <div className="flex items-center justify-center">
                    {/* Magnifying Glass / Target Circles */}
                    <div className="relative w-64 h-64">
                        {/* Outer Target Ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.15 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"
                        />

                        {/* Middle Target Ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 0.7, opacity: 0.25 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="absolute inset-0 m-auto w-44 h-44 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"
                        />

                        {/* Inner Target Ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 0.4, opacity: 0.35 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="absolute inset-0 m-auto w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"
                        />

                        {/* Center: Creator Icon with Shield */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                            className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl"
                            style={{
                                boxShadow: '0 10px 40px rgba(22, 163, 74, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                            }}
                        >
                            <FaUser className="text-3xl text-gray-700" />

                            {/* Verified Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.0, type: 'spring', stiffness: 300 }}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                            >
                                <FaCheckCircle className="text-white text-sm" />
                            </motion.div>
                        </motion.div>

                        {/* Magnifying Glass Handle */}
                        <motion.div
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="absolute -bottom-8 -right-8"
                        >
                            <div className="w-24 h-24 relative">
                                {/* Glass Circle */}
                                <div className="absolute top-0 right-0 w-16 h-16 border-4 border-green-600 rounded-full bg-white/50 backdrop-blur-sm"
                                    style={{
                                        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(22, 163, 74, 0.2)'
                                    }}
                                >
                                    <FaSearch className="absolute inset-0 m-auto text-green-600 text-xl" />
                                </div>

                                {/* Handle */}
                                <div className="absolute bottom-0 left-0 w-2 h-12 bg-gradient-to-b from-green-600 to-green-700 rounded-full transform rotate-45 origin-top"
                                    style={{
                                        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scanning Lines Effect */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-30"
                />
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-30"
                />
            </div>

            {/* Motivational Copy */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mb-10"
            >
                {/* Headline (3xl) */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Find Your Perfect Ethiopian Creator.
                </h2>

                {/* Body Copy (base) */}
                <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Access a <span className="font-semibold text-green-600">vetted network</span> of content creators on TikTok and Instagram. Start your search now to <span className="font-semibold text-green-600">connect securely</span> and launch your next campaign.
                </p>
            </motion.div>

            {/* Call-to-Action */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
            >
                <Link
                    to="/creators"
                    onClick={onHighlightSidebar}
                    className="cta-pulse inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                    style={{
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3), 0 10px 30px rgba(22, 163, 74, 0.2)'
                    }}
                >
                    <FaShieldAlt />
                    Start Creator Discovery
                    <FaArrowRight className="text-xl" />
                </Link>
            </motion.div>

            {/* Subtle Helper Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
                className="mt-6 text-sm text-gray-500"
            >
                💡 Tip: Browse vetted creators in the "<span className="font-semibold text-green-600">Creator Discovery</span>" section
            </motion.p>

            {/* Security Features */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="mt-10 pt-10 border-t border-gray-200"
            >
                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {/* Feature 1 */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl flex items-center justify-center">
                            <FaShieldAlt className="text-green-600 text-xl" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Verified Creators</h4>
                        <p className="text-xs text-gray-600">All profiles vetted for authenticity</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FaSearch className="text-blue-600 text-xl" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Smart Discovery</h4>
                        <p className="text-xs text-gray-600">Find creators matching your brand</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <FaCheckCircle className="text-emerald-600 text-xl" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Secure Platform</h4>
                        <p className="text-xs text-gray-600">Protected communication & payments</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
