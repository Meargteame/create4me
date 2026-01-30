import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import {
    FaUser,
    FaInstagram,
    FaYoutube,
    FaTiktok,
    FaCamera,
    FaSave,
    FaLink
} from 'react-icons/fa';
import SuccessModal from '../components/SuccessModal';

export default function ProfileEditorPageNew() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [profile, setProfile] = useState({
        name: user?.name || '',
        bio: 'Digital creator, filmmaker, and storyteller based in Addis.',
        category: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        socialLinks: {
            instagram: 'instagram.com/user',
            tiktok: 'tiktok.com/@user',
            youtube: ''
        }
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setShowSuccess(true);
        }, 1000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-txt-primary">Edit Profile</h1>
                    <p className="text-txt-secondary mt-1">Update your personal details and portfolio.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border-color shadow-sm flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-input flex items-center justify-center overflow-hidden border-2 border-card shadow-md">
                                {(user as any)?.avatar ? (
                                    <img src={(user as any).avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-txt-secondary">
                                        {profile.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCamera className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-txt-primary">Profile Picture</h3>
                            <p className="text-xs text-txt-secondary mb-3">Recommended 400x400px. JPG, PNG.</p>
                            <button type="button" className="text-sm font-bold text-primary border border-border-color px-4 py-2 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all">
                                Upload New
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-card p-8 rounded-2xl border border-border-color shadow-sm relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <h3 className="font-bold text-txt-primary mb-4 flex items-center gap-2">
                                <FaUser className="text-txt-secondary" /> Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-txt-primary mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-border-color rounded-lg bg-input text-txt-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-txt-primary mb-1">Category</label>
                                    <select
                                        value={profile.category}
                                        onChange={e => setProfile({ ...profile, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer bg-input text-txt-primary"
                                    >
                                        <option>Lifestyle</option>
                                        <option>Tech</option>
                                        <option>Fashion</option>
                                        <option>Fitness</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-txt-primary mb-1">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full px-4 py-2 border border-border-color rounded-lg bg-input text-txt-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-24 resize-none"
                                    placeholder="Tell brands about yourself..."
                                />
                                <p className="text-xs text-right text-txt-secondary mt-1">{profile.bio.length}/150</p>
                            </div>
                        </div>
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaLink className="text-gray-400" /> Social Presence
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 text-xl">
                                    <FaInstagram />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Instagram Username"
                                    value={profile.socialLinks.instagram}
                                    onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, instagram: e.target.value } })}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-black text-xl">
                                    <FaTiktok />
                                </div>
                                <input
                                    type="text"
                                    placeholder="TikTok Username"
                                    value={profile.socialLinks.tiktok}
                                    onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, tiktok: e.target.value } })}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 text-xl">
                                    <FaYoutube />
                                </div>
                                <input
                                    type="text"
                                    placeholder="YouTube Channel URL"
                                    value={profile.socialLinks.youtube}
                                    onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, youtube: e.target.value } })}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Action */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-onyx text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <FaSave /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    title="Success"
                    message="Profile updated successfully!"
                />
            </div>
        </DashboardLayout>
    );
}
