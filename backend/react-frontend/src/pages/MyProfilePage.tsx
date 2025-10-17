import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import ImageUpload from '../components/ui/ImageUpload'
import apiClient from '../lib/api'
import { 
  FaUser, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
  FaEdit,
  FaSave,
  FaStar,
  FaCamera
} from '../components/icons'
import { getUserDisplayName, getUserInitials } from '../utils/user'

export default function MyProfilePage() {
  const { user, updateUserName } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
  const [bannerUrl, setBannerUrl] = useState('')
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: 'Addis Ababa, Ethiopia',
    bio: 'Creative content creator passionate about storytelling',
    category: 'Lifestyle',
    instagram: '',
    youtube: '',
    tiktok: '',
    linkedin: ''
  })

  const handleAvatarUpload = async (file: File) => {
    try {
      const reader = new FileReader()
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string
            const response = await apiClient.uploadAvatar(base64, file.name)
            if (response.success) {
              setAvatarUrl(response.url)
              resolve(response.url)
            } else {
              reject(new Error('Upload failed'))
            }
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  const handleBannerUpload = async (file: File) => {
    try {
      const reader = new FileReader()
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string
            const response = await apiClient.uploadPortfolioImage(base64, file.name)
            if (response.success) {
              setBannerUrl(response.url)
              resolve(response.url)
            } else {
              reject(new Error('Upload failed'))
            }
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Banner upload error:', error)
      throw error
    }
  }

  const handleSave = async () => {
    // Save profile logic here
    try {
      if (profile.name.trim() && profile.name !== user?.name) {
        await updateUserName(profile.name.trim())
      }
      // TODO: Update other profile fields when backend API is ready
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your profile information</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              {isEditing ? <FaSave /> : <FaEdit />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative group">
              {bannerUrl && (
                <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageUpload
                    value={bannerUrl}
                    onChange={setBannerUrl}
                    onUpload={handleBannerUpload}
                    label=""
                    shape="square"
                    size="lg"
                    className="bg-white/90 p-4 rounded-xl"
                  />
                </div>
              )}
              <div className="absolute -bottom-16 left-8">
                <div className="relative group">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-full object-cover ring-8 ring-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-5xl font-bold ring-8 ring-white">
                      {getUserInitials(user)}
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                      <ImageUpload
                        value={avatarUrl}
                        onChange={setAvatarUrl}
                        onUpload={handleAvatarUpload}
                        label=""
                        shape="circle"
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+251 xxx xxx xxx"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60 resize-none"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaInstagram className="inline mr-2 text-pink-600" />
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={profile.instagram}
                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                        disabled={!isEditing}
                        placeholder="@username"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaYoutube className="inline mr-2 text-red-600" />
                        YouTube
                      </label>
                      <input
                        type="text"
                        value={profile.youtube}
                        onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                        disabled={!isEditing}
                        placeholder="@channel"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaTiktok className="inline mr-2" />
                        TikTok
                      </label>
                      <input
                        type="text"
                        value={profile.tiktok}
                        onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
                        disabled={!isEditing}
                        placeholder="@username"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaLinkedin className="inline mr-2 text-blue-600" />
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        disabled={!isEditing}
                        placeholder="linkedin.com/in/username"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600 mt-1">Applications</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="text-3xl font-bold text-green-600">5</div>
                      <div className="text-sm text-gray-600 mt-1">Approved</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 flex items-center justify-center gap-1">
                        4.8 <FaStar size={20} />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
