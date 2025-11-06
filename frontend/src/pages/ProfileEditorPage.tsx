import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';

export default function ProfileEditorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
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
    if (profile.socialLinks.instagram || profile.socialLinks.youtube) completed++;
    if (profile.portfolio.length > 0) completed++;
    if (user?.name) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information and settings</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{completion}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Profile Strength</span>
            <span className="text-sm text-gray-600">{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          {completion < 100 && (
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile to get more opportunities
            </p>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Tell brands about yourself and your content style..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <select
                    value={profile.category}
                    onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="fashion">Fashion & Beauty</option>
                    <option value="tech">Tech & Gaming</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="food">Food & Travel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Total Followers</label>
                  <input
                    type="text"
                    value={profile.followers}
                    onChange={(e) => setProfile({ ...profile, followers: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50K"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Engagement Rate</label>
                <input
                  type="text"
                  value={profile.engagementRate}
                  onChange={(e) => setProfile({ ...profile, engagementRate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 4.5%"
                />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter'].map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.platforms.includes(platform)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Instagram</label>
                <input
                  type="url"
                  value={profile.socialLinks.instagram}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, instagram: e.target.value }})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">YouTube</label>
                <input
                  type="url"
                  value={profile.socialLinks.youtube}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, youtube: e.target.value }})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://youtube.com/@username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">TikTok</label>
                <input
                  type="url"
                  value={profile.socialLinks.tiktok}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, tiktok: e.target.value }})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://tiktok.com/@username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Facebook</label>
                <input
                  type="url"
                  value={profile.socialLinks.facebook}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, facebook: e.target.value }})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
