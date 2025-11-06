import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebook,
  FaCheckCircle,
  FaSave,
  FaCamera,
  FaChartLine,
  FaUsers,
  FaLink,
  FaTag
} from 'react-icons/fa';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

export default function ProfileEditorPageNew() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [profile, setProfile] = useState({
    bio: '',
    category: '',
    platforms: [] as string[],
    followers: '',
    engagementRate: '',
    portfolio: [] as string[],
    socialLinks: {
      instagram: '',
      youtube: '',
      tiktok: '',
      facebook: ''
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getMyProfile();
      if (data.profile) {
        setProfile({
          bio: data.profile.bio || '',
          category: data.profile.category || '',
          platforms: data.profile.platforms || [],
          followers: data.profile.followers || '',
          engagementRate: data.profile.engagementRate || '',
          portfolio: data.profile.portfolio || [],
          socialLinks: data.profile.socialLinks || {
            instagram: '',
            youtube: '',
            tiktok: '',
            facebook: ''
          }
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateMyProfile(profile);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setProfile(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 8;
    
    if (profile.bio) completed++;
    if (profile.category) completed++;
    if (profile.platforms.length > 0) completed++;
    if (profile.followers) completed++;
    if (profile.engagementRate) completed++;
    if (profile.portfolio.length > 0) completed++;
    if (profile.socialLinks.instagram || profile.socialLinks.youtube || 
        profile.socialLinks.tiktok || profile.socialLinks.facebook) completed++;
    if (user?.name) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  const platformOptions = [
    { id: 'instagram', name: 'Instagram', icon: <FaInstagram className="text-pink-600" /> },
    { id: 'youtube', name: 'YouTube', icon: <FaYoutube className="text-red-600" /> },
    { id: 'tiktok', name: 'TikTok', icon: <FaTiktok className="text-black" /> },
    { id: 'facebook', name: 'Facebook', icon: <FaFacebook className="text-blue-600" /> }
  ];

  const categories = [
    'Fashion', 'Tech', 'Lifestyle', 'Food', 'Travel', 
    'Fitness', 'Beauty', 'Gaming', 'Music', 'Education'
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showSuccess && (
        <SuccessModal
          message="Profile updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaUser />
                Edit Your Profile
              </h1>
              <p className="text-blue-100 mt-2">
                Complete your profile to attract more brands
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-1">{completion}%</div>
              <div className="text-sm text-blue-100">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-400/30 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white rounded-full shadow-lg"
            />
          </div>
        </motion.div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  placeholder="Tell brands about yourself and your content style..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaTag className="text-purple-600" />
                  Category
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Social Media Platforms
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {platformOptions.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    profile.platforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2 flex justify-center">
                    {platform.icon}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {platform.name}
                  </div>
                  {profile.platforms.includes(platform.id) && (
                    <FaCheckCircle className="text-blue-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaLink className="text-blue-600" />
                Profile Links
              </h3>
              {platformOptions.map((platform) => (
                <div key={platform.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {platform.icon}
                    </div>
                    <input
                      type="url"
                      value={profile.socialLinks[platform.id as keyof typeof profile.socialLinks] || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: {
                          ...profile.socialLinks,
                          [platform.id]: e.target.value
                        }
                      })}
                      placeholder={`Your ${platform.name} profile URL`}
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Stats
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  Total Followers
                </label>
                <input
                  type="number"
                  value={profile.followers}
                  onChange={(e) => setProfile({ ...profile, followers: e.target.value })}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaChartLine className="text-purple-600" />
                  Engagement Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.engagementRate}
                  onChange={(e) => setProfile({ ...profile, engagementRate: e.target.value })}
                  placeholder="e.g., 4.5"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCamera className="text-pink-600" />
              Portfolio Links
            </h2>
            
            <div className="space-y-3">
              {profile.portfolio.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const newPortfolio = [...profile.portfolio];
                      newPortfolio[index] = e.target.value;
                      setProfile({ ...profile, portfolio: newPortfolio });
                    }}
                    placeholder="https://example.com/your-work"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPortfolio = profile.portfolio.filter((_, i) => i !== index);
                      setProfile({ ...profile, portfolio: newPortfolio });
                    }}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => setProfile({ ...profile, portfolio: [...profile.portfolio, ''] })}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                + Add Portfolio Link
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Profile
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
}
