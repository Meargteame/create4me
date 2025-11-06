import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePageWorldClass';
import LoginPage from './pages/LoginPageNew';
import RegisterPage from './pages/RegisterPageNew';
import DashboardPage from './pages/DashboardPageNew';
import CampaignsPage from './pages/CampaignsPageNew';
import CreatorsPage from './pages/CreatorsPageNew';
import FeedPage from './pages/FeedPageNew';
import ProfileEditorPage from './pages/ProfileEditorPageNew';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPageNew';
import ApplicationDetailPage from './pages/ApplicationDetailPageNew';
import ApplicationsPage from './pages/ApplicationsPageNew';
import CampaignAnalyticsPage from './pages/CampaignAnalyticsPageNew';
import Header from './components/Header';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function AppRoutes() {
  const location = window.location.pathname;
  const isHomePage = location === '/';

  return (
    <div className="min-h-screen">
      {!isHomePage && <Header />}
      <div className={!isHomePage ? 'pt-20' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
          <Route path="/creators" element={<ProtectedRoute><CreatorsPage /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboardPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
          <Route path="/campaigns/:id/analytics" element={<ProtectedRoute><CampaignAnalyticsPage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditorPage /></ProtectedRoute>} />
        </Routes>
      </div>
      {!isHomePage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
