import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import ImageUpload from '../components/ui/ImageUpload'
import apiClient from '../lib/api'
import { 
  FaUser, 
  FaBell, 
  FaLock,
  FaPalette,
  FaGlobe,
  FaSave,
  FaShieldAlt,
  FaEye,
  FaEyeSlash
} from '../components/icons'

export default function SettingsPage() {
  const { user, updateUserName } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
  
  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: ''
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    campaignUpdates: true,
    applicationUpdates: true,
    newsletter: false,
    weeklyDigest: true,
    newMessages: true
  })
  
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [preferenceSettings, setPreferenceSettings] = useState({
    language: 'en',
    timezone: 'Africa/Addis_Ababa',
    currency: 'ETB',
    theme: 'light'
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
              showSaveMessage('Avatar updated successfully!')
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

  const showSaveMessage = (message: string) => {
    setSaveMessage(message)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleSaveAccount = async () => {
    setIsSaving(true)
    try {
      if (accountSettings.name !== user?.name) {
        await updateUserName(accountSettings.name)
      }
      showSaveMessage('Account settings saved successfully!')
    } catch (error) {
      showSaveMessage('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)
    setTimeout(() => {
      showSaveMessage('Notification preferences saved!')
      setIsSaving(false)
    }, 500)
  }

  const handleSaveSecurity = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      showSaveMessage('Passwords do not match!')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      showSaveMessage('Security settings updated!')
      setSecuritySettings({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setIsSaving(false)
    }, 500)
  }

  const handleSavePreferences = () => {
    setIsSaving(true)
    setTimeout(() => {
      showSaveMessage('Preferences saved!')
      setIsSaving(false)
    }, 500)
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: <FaUser />, description: 'Manage your profile' },
    { id: 'notifications', label: 'Notifications', icon: <FaBell />, description: 'Email & push settings' },
    { id: 'security', label: 'Security', icon: <FaLock />, description: 'Password & privacy' },
    { id: 'preferences', label: 'Preferences', icon: <FaPalette />, description: 'Language & theme' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60"
                        />
                        <p className="text-sm text-gray-500 mt-2">Your email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          User Role
                        </label>
                        <div className="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
                          <span className="font-semibold text-blue-700 capitalize">
                            {user?.role || 'Creator'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {Object.entries(settings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Receive notifications for this category
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                          <p className="text-sm text-gray-700">
                            Two-factor authentication is not enabled. Enable it to add an extra layer of security.
                          </p>
                          <button className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaGlobe className="inline mr-2" />
                          Language
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                          <option>English</option>
                          <option>Amharic</option>
                          <option>Oromo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaPalette className="inline mr-2" />
                          Theme
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Time Zone
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                          <option>East Africa Time (EAT)</option>
                          <option>UTC</option>
                          <option>GMT</option>
                        </select>
                      </div>

                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
