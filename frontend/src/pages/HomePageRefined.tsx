import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaCheck,
    FaBolt,
    FaShieldAlt,
    FaWallet
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Components ---

const MagneticButton = ({ children, className, to }: { children: React.ReactNode, className?: string, to: string }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const ySpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((e.clientX - centerX) * 0.1);
        y.set((e.clientY - centerY) * 0.1);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div style={{ x: xSpring, y: ySpring }} className="inline-block">
            <Link
                to={to}
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={className}
            >
                {children}
            </Link>
        </motion.div>
    );
};

// --- Sections ---

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-main overflow-hidden min-h-[90vh] flex items-center">
            {/* Background Grid - Very Subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <span className="h-[2px] w-8 bg-primary"></span>
                            <span className="text-sm font-bold tracking-widest uppercase text-txt-secondary">The Modern Standard</span>
                        </div>

                        <h1 className="text-6xl lg:text-8xl font-black text-txt-primary leading-[0.95] tracking-tight mb-8">
                            Create. <br />
                            <span className="relative inline-block">
                                Earn.
                                <motion.svg
                                    viewBox="0 0 200 9"
                                    className="absolute -bottom-2 left-0 w-full"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                >
                                    <path d="M2.00026 6.99997C38.5063 3.66663 115.5 -2.00003 198 2.49997" stroke="#FF2E00" strokeWidth="3" strokeLinecap="round" fill="none" />
                                </motion.svg>
                            </span> <br />
                            Repeat.
                        </h1>

                        <p className="text-xl text-txt-secondary max-w-lg mb-10 leading-relaxed font-medium">
                            The precision platform for professional Ethiopian creators and ambitious brands.
                            <span className="text-txt-primary font-bold"> No clutter. Just business.</span>
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <MagneticButton
                                to="/register?role=creator"
                                className="px-8 py-4 bg-onyx text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-3 relative overflow-hidden group shadow-lg shadow-gray-200"
                            >
                                <span className="relative z-10">Start Creating</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform text-white" />

                                {/* Red glow trace on hover */}
                                <div className="absolute inset-0 border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </MagneticButton>

                            <MagneticButton
                                to="/register?role=brand"
                                className="px-8 py-4 bg-card text-txt-primary border-2 border-border-color rounded-full font-bold text-lg hover:border-txt-secondary transition-all flex items-center gap-3"
                            >
                                <span className="relative z-10">Hire Talent</span>
                            </MagneticButton>
                        </div>
                    </motion.div>

                    {/* Right: The "Floating Studio" Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mx-auto lg:mx-0 w-full flex justify-center lg:justify-end"
                    >
                        {/* Decorative Elements around phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary/5 to-transparent blur-3xl -z-10"></div>

                        {/* Phone Frame */}
                        <div className="relative w-[300px] sm:w-[350px] aspect-[9/19] bg-main rounded-[40px] border-[8px] border-onyx shadow-2xl overflow-hidden z-10 hover:rotate-1 transition-transform duration-500">
                            {/* Notch/Island */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-onyx rounded-b-2xl z-20"></div>

                            {/* Screen Content */}
                            <div className="h-full w-full bg-main pt-12 px-5 flex flex-col font-sans">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="w-10 h-10 rounded-full bg-input flex items-center justify-center text-xs font-bold text-txt-secondary">
                                        MT
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center relative">
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                        <FaBolt className="text-txt-secondary text-xs" />
                                    </div>
                                </div>

                                {/* Earnings Card */}
                                <div className="bg-card p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-border-color mb-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary transform origin-top scale-y-100 transition-transform duration-500"></div>
                                    <p className="text-txt-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Total Balance</p>
                                    <h3 className="text-3xl font-black text-txt-primary tracking-tight">ETB 45.2k</h3>
                                    <div className="mt-3 inline-flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">
                                        +12% <span className="text-txt-secondary font-medium">this week</span>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <p className="text-txt-primary font-bold mb-4 text-sm ml-1">Live Campaigns</p>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-card p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-border-color hover:shadow-md transition-shadow">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${i === 1 ? 'bg-primary' : 'bg-onyx'}`}>
                                                {i === 1 ? 'C' : i === 2 ? 'S' : 'B'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-txt-primary text-xs truncate">Brand Collab #{i}</p>
                                                <p className="text-[10px] text-txt-secondary">Payment pending</p>
                                            </div>
                                            <div className="text-xs font-bold text-txt-primary">
                                                $200
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Floating Action Button */}
                                <div className="mt-auto mb-6 bg-onyx text-white p-3.5 rounded-2xl flex justify-center items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
                                    <span className="font-bold text-sm">New Offer</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating "Card" outside phone */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-20 -left-4 lg:-left-12 bg-card p-4 rounded-2xl shadow-xl border border-border-color z-20 w-[180px]"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-sm">
                                    <FaCheck />
                                </div>
                                <div>
                                    <p className="text-[10px] text-txt-secondary font-bold uppercase">Status</p>
                                    <p className="font-bold text-txt-primary text-sm">ID Verified</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-input rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => {
    return (
        <div className="group relative p-8 bg-card rounded-3xl border border-border-color transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
            {/* Hover Glow Trace */}
            <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none"></div>

            <div className="w-12 h-12 bg-input rounded-2xl flex items-center justify-center text-xl text-txt-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Icon />
            </div>
            <h3 className="text-xl font-bold text-txt-primary mb-3 group-hover:translate-x-1 transition-transform">{title}</h3>
            <p className="text-txt-secondary leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

const Features = () => {
    return (
        <section className="py-24 bg-main relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-20 max-w-2xl">
                    <h2 className="text-4xl font-black text-txt-primary mb-6">Built for the <br /><span className="text-primary">Creator Class.</span></h2>
                    <p className="text-xl text-txt-secondary">We stripped away the complexity. No agencies, no delays, no hidden fees.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={FaShieldAlt}
                        title="Vetted & Verified"
                        desc="We manually verify every creator and brand with Government IDs. Community trust is our currency."
                    />
                    <FeatureCard
                        icon={FaBolt}
                        title="Instant Contracts"
                        desc="Smart templates handle all the legal work. Launch a secure campaign in just 3 clicks."
                    />
                    <FeatureCard
                        icon={FaWallet}
                        title="Direct Payouts"
                        desc="Get paid directly into your Telebirr, Chapa, or Bank account. 0% creative commission fees."
                    />
                </div>
            </div>
        </section>
    );
};

const Marquee = () => {
    return (
        <div className="py-10 bg-onyx overflow-hidden border-y border-gray-800">
            <div className="flex relative overflow-hidden group w-full">
                <motion.div
                    className="flex whitespace-nowrap gap-16 min-w-full"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                >
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-16 items-center">
                            <span className="text-gray-600 font-bold text-xl uppercase tracking-widest hover:text-white transition-colors cursor-default">Spotify</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            <span className="text-gray-600 font-bold text-xl uppercase tracking-widest hover:text-white transition-colors cursor-default">Coca-Cola</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            <span className="text-gray-600 font-bold text-xl uppercase tracking-widest hover:text-white transition-colors cursor-default">Nike</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            <span className="text-gray-600 font-bold text-xl uppercase tracking-widest hover:text-white transition-colors cursor-default">Safaricom</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            <span className="text-gray-600 font-bold text-xl uppercase tracking-widest hover:text-white transition-colors cursor-default">Canva</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            <span className="text-gray-600 font-bold text-xl uppercase tracking-widest hover:text-white transition-colors cursor-default">Telebirr</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const CTA = () => {
    return (
        <section className="py-32 bg-card relative overflow-hidden">
            {/* Gradient Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-black text-txt-primary mb-8 tracking-tighter">
                    Ready to <span className="text-primary underline decoration-primary decoration-4 underline-offset-8 decoration-skip-ink-none">go pro?</span>
                </h2>
                <p className="text-xl text-txt-secondary mb-12 max-w-xl mx-auto font-medium">
                    Join the platform defining the future of Ethiopian digital marketing.
                </p>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white text-xl font-bold rounded-full hover:bg-black hover:scale-105 transition-all shadow-2xl shadow-primary/30 group"
                >
                    Get Started Free
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    );
}

export default function HomePageRefined() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
            <Header />
            <main>
                <Hero />
                <Marquee />
                <Features />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
