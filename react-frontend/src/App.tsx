import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import NamePromptModal from './components/NamePromptModal'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Eager load critical pages (public routes)
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

// Lazy load protected routes for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CreatorsPage = lazy(() => import('./pages/CreatorsPage'))
const CreatorDetailPage = lazy(() => import('./pages/CreatorDetailPage'))
const FeedPage = lazy(() => import('./pages/FeedPage_new'))
const NetworkPage = lazy(() => import('./pages/NetworkPage'))
const BrandDashboard = lazy(() => import('./pages/BrandDashboard'))
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'))
const CampaignDetailPage = lazy(() => import('./pages/CampaignDetailPage'))
const CampaignBoardPage = lazy(() => import('./pages/CampaignBoardPage'))
const CampaignApplicantsPage = lazy(() => import('./pages/CampaignApplicantsPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const CreatorProfilePage = lazy(() => import('./pages/CreatorProfilePage'))
const MyApplicationsPage = lazy(() => import('./pages/MyApplicationsPage'))
const MyProfilePage = lazy(() => import('./pages/MyProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const ServerErrorPage = lazy(() => import('./pages/ServerErrorPage'))
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'))
const ComponentsShowcase = lazy(() => import('./pages/ComponentsShowcase'))
const ModalsShowcase = lazy(() => import('./pages/ModalsShowcase'))
const DashboardShowcase = lazy(() => import('./pages/DashboardShowcase'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
)

function AppContent() {
  const { user, isAuthenticated, isLoading, updateUserName } = useAuth()
  const [showNamePrompt, setShowNamePrompt] = useState(false)

  useEffect(() => {
    // Show name prompt if user is logged in but has no name
    if (isAuthenticated && user && !user.name && !isLoading) {
      const hasSkipped = localStorage.getItem('namePromptSkipped')
      if (!hasSkipped) {
        // Small delay to let the app load first
        const timer = setTimeout(() => {
          setShowNamePrompt(true)
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated, user, isLoading])

  return (
    <>
      <NamePromptModal 
        isOpen={showNamePrompt}
        onClose={() => setShowNamePrompt(false)}
        onSubmit={updateUserName}
      />
      <div className="App">
        <Suspense fallback={<PageLoader />}>
          <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/showcase" element={<ComponentsShowcase />} />
              <Route path="/modals" element={<ModalsShowcase />} />
              <Route path="/dashboard-showcase" element={<DashboardShowcase />} />

              {/* Protected Routes - Browse & Discovery */}
              <Route 
                path="/creators" 
                element={
                  <ProtectedRoute>
                    <CreatorsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator/:id" 
                element={
                  <ProtectedRoute>
                    <CreatorDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute>
                    <FeedPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/network" 
                element={
                  <ProtectedRoute>
                    <NetworkPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brand-dashboard" 
                element={
                  <ProtectedRoute requiredRole="brand">
                    <BrandDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator-dashboard" 
                element={
                  <ProtectedRoute requiredRole="creator">
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/campaign/:campaignId" 
                element={
                  <ProtectedRoute>
                    <CampaignDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/campaign-board" 
                element={
                  <ProtectedRoute>
                    <CampaignBoardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/campaign/:campaignId/applicants" 
                element={
                  <ProtectedRoute>
                    <CampaignApplicantsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <CreatorProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-applications" 
                element={
                  <ProtectedRoute>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-profile" 
                element={
                  <ProtectedRoute>
                    <MyProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brand-analytics" 
                element={
                  <ProtectedRoute requiredRole="brand">
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business-analytics" 
                element={
                  <ProtectedRoute requiredRole="brand">
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Error Pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/server-error" element={<ServerErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
