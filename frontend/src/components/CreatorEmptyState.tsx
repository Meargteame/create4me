import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLock, FaBriefcase, FaDollarSign, FaArrowRight } from 'react-icons/fa';

interface CreatorEmptyStateProps {
    onHighlightSidebar?: () => void;
}

export default function CreatorEmptyState({ onHighlightSidebar }: CreatorEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-16 text-center shadow-lg"
            style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
        >
            {/* Guided Flow Graphic */}
            <div className="mb-12">
                <div className="flex items-center justify-center gap-8 max-w-3xl mx-auto">
                    {/* Step 1: Security/Lock Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-xl"
                            style={{
                                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            <FaLock className="text-4xl text-green-600" />
                        </div>
                        <div className="mt-3 text-xs font-bold text-green-600 uppercase tracking-wide">
                            Security
                        </div>
                    </motion.div>

                    {/* Arrow 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <FaArrowRight className="text-3xl text-green-500" />
                    </motion.div>

                    {/* Step 2: Job/Opportunity Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-cyan-100 to-sky-100 rounded-2xl flex items-center justify-center shadow-xl"
                            style={{
                                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            <FaBriefcase className="text-4xl text-blue-600" />
                        </div>
                        <div className="mt-3 text-xs font-bold text-blue-600 uppercase tracking-wide">
                            Opportunity
                        </div>
                    </motion.div>

                    {/* Arrow 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <FaArrowRight className="text-3xl text-blue-500" />
                    </motion.div>

                    {/* Step 3: Money/Payout Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-xl"
                            style={{
                                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            <FaDollarSign className="text-4xl text-emerald-600" />
                        </div>
                        <div className="mt-3 text-xs font-bold text-emerald-600 uppercase tracking-wide">
                            Payout
                        </div>
                    </motion.div>
                </div>

                {/* Connecting Line */}
                <div className="relative h-1 max-w-3xl mx-auto mt-8">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-emerald-500 rounded-full opacity-20"
                    />
                </div>
            </div>

            {/* Motivational Copy */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mb-10"
            >
                {/* Headline (2xl) */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to the Future of Ethiopian Creator Jobs.
                </h2>

                {/* Body Copy (sm) */}
                <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    You're now connected to <span className="font-semibold text-green-600">verified brands</span> and <span className="font-semibold text-green-600">secure, local payments</span>. Your next promotion job is just a click away.
                </p>
            </motion.div>

            {/* Call-to-Action */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
            >
                <Link
                    to="/feed"
                    onClick={onHighlightSidebar}
                    className="cta-pulse inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                    style={{
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3), 0 10px 30px rgba(22, 163, 74, 0.2)'
                    }}
                >
                    Find Your First Secure Campaign Now
                    <FaArrowRight className="text-xl" />
                </Link>
            </motion.div>

            {/* Subtle Helper Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mt-6 text-sm text-gray-500"
            >
                💡 Tip: Check the "<span className="font-semibold text-green-600">Available Campaigns</span>" section in the sidebar
            </motion.p>
        </motion.div>
    );
}
