import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLink,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaChartLine,
  FaHeart
} from 'react-icons/fa';

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false); // Mock loading immediate
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about' | 'reviews'>('portfolio');

  // Hardcoded mock data for MVP visual demo
  const creator = {
      name: "Sarah Jenkins",
      username: "@sarahj_style",
      bio: "Fashion & Lifestyle Content Creator based in NYC. I help brands tell their story through cinematic reels and authentic storytelling. Obsessed with sustainable fashion and morning coffees.",
      avatar: "https://i.pravatar.cc/300?u=sarah",
      coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      location: "New York, NY",
      categories: ["Fashion", "Lifestyle", "Travel"],
      stats: {
          followers: "120k",
          engagement: "5.2%",
          avgViews: "45k"
      },
      platforms: [
          { name: 'instagram', link: '#', handle: '@sarahj_style' },
          { name: 'tiktok', link: '#', handle: '@sarah.creates' },
          { name: 'youtube', link: '#', handle: 'Sarah Jenkins Vlogs' }
      ],
      portfolio: [
           { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000', title: 'Summer Collection w/ Zara', type: 'Reel' },
           { id: 2, image: 'https://images.unsplash.com/photo-1529139574466-a302d2d3f5c4?q=80&w=1000', title: 'Morning Routine', type: 'Photo' },
           { id: 3, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000', title: 'Paris Fashion Week', type: 'Vlog' },
           { id: 4, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000', title: 'Styling Tips', type: 'TikTok' },
      ],
      reviews: [
          { id: 1, brand: 'Zara', text: 'Sarah was amazing to work with! Professional, timely, and the content was stunning.', rating: 5 },
          { id: 2, brand: 'Glossier', text: 'High quality content and great engagement from her audience.', rating: 5 },
      ]
  };

  const getPlatformIcon = (p: string) => {
      if (p === 'instagram') return <FaInstagram />;
      if (p === 'tiktok') return <FaTiktok />;
      if (p === 'youtube') return <FaYoutube />;
      return <FaLink />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full rounded-b-[3rem] -mt-8 -mx-4 md:mx-0 md:rounded-3xl relative overflow-hidden mb-20 shadow-lg">
            <img src={creator.coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="px-4 md:px-8">
            {/* Profile Header Card (Floating) */}
            <div className="relative -mt-32 md:-mt-24 mb-8 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
                 {/* Avatar */}
                 <div className="relative -mt-16 md:-mt-24 shrink-0">
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
                         <img src={creator.avatar} alt="Avatar" className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white" title="Active"></div>
                 </div>

                 {/* Info */}
                 <div className="flex-1 w-full">
                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                         <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                {creator.name}
                                <FaCheckCircle className="text-blue-500 text-xl" title="Verified Creator" />
                            </h1>
                            <p className="text-gray-500 font-medium mb-2">{creator.username}</p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                                <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400" /> {creator.location}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full self-center"></span>
                                {creator.categories.map(cat => (
                                    <span key={cat} className="bg-gray-100 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider text-gray-600">{cat}</span>
                                ))}
                            </div>
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex gap-3 w-full md:w-auto">
                             <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                 <FaEnvelope /> Hire Me
                             </button>
                             <button className="px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                                 <FaHeart className={activeTab === 'about' ? 'text-red-500' : 'text-gray-400'} />
                             </button>
                         </div>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Socials */}
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FaUsers /></div>
                                    <div className="text-sm font-bold text-gray-600">Audience</div>
                                </div>
                                <div className="text-lg font-bold text-gray-900">{creator.stats.followers}</div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><FaChartLine /></div>
                                    <div className="text-sm font-bold text-gray-600">Engagement</div>
                                </div>
                                <div className="text-lg font-bold text-gray-900">{creator.stats.engagement}</div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><FaStar /></div>
                                    <div className="text-sm font-bold text-gray-600">Avg Views</div>
                                </div>
                                <div className="text-lg font-bold text-gray-900">{creator.stats.avgViews}</div>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Social Presence</h3>
                        <div className="flex flex-col gap-3">
                            {creator.platforms.map((p) => (
                                <a key={p.name} href={p.link} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`text-xl ${p.name === 'instagram' ? 'text-pink-600' : p.name === 'youtube' ? 'text-red-600' : 'text-black'}`}>
                                            {getPlatformIcon(p.name)}
                                        </div>
                                        <span className="font-bold text-gray-700 capitalize">{p.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-primary transition-colors">{p.handle}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-100 pb-2 overflow-x-auto">
                        {['portfolio', 'about', 'reviews'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2 font-bold text-sm rounded-full transition-all capitalize whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'bg-black text-white' 
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'portfolio' && (
                             <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                             >
                                 {creator.portfolio.map((item) => (
                                     <div key={item.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                                         <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{item.type}</span>
                                            <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                         </div>
                                     </div>
                                 ))}
                             </motion.div>
                        )}

                        {activeTab === 'about' && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm leading-relaxed text-gray-600">
                                 <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
                                 <p className="mb-6">{creator.bio}</p>
                                 <h4 className="font-bold text-gray-900 mb-2">My Journey</h4>
                                 <p className="mb-6">Started creating content in 2020 focusing on sustainable living. Now I work with brands to bring their eco-friendly initiatives to life.</p>
                                 <h4 className="font-bold text-gray-900 mb-2">Why work with me?</h4>
                                 <ul className="list-disc pl-5 space-y-2">
                                     <li>Professional equipment and editing</li>
                                     <li>Quick turnaround times (48-72h)</li>
                                     <li>Highly engaged community in the 18-34 demographic</li>
                                 </ul>
                             </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                {creator.reviews.map((review) => (
                                    <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-gray-900">{review.brand}</h4>
                                            <div className="flex text-yellow-400 gap-1 text-sm">
                                                {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic">"{review.text}"</p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
