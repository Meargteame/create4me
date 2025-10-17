import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiClient from '../lib/api';
import {
  FaChartLine,
  FaUsers,
  FaEye,
  FaCheckCircle,
  FaTimes,
  FaClock
} from '../components/icons';

interface CampaignStats {
  id: string;
  title: string;
  totalApplicants: number;
  pendingApplicants: number;
  approvedApplicants: number;
  rejectedApplicants: number;
  views: number;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalCampaigns: 0,
    totalApplicants: 0,
    avgApplicantsPerCampaign: 0,
    totalApproved: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiClient.getCampaigns();
      
      if (response.success && response.campaigns) {
        // Fetch applicants for each campaign and calculate stats
        const statsPromises = response.campaigns.map(async (campaign: any) => {
          try {
            const applicantsResponse = await apiClient.getCampaignApplicants(campaign.id);
            const applicants = applicantsResponse.success ? applicantsResponse.applicants || [] : [];
            
            const totalApplicants = applicants.length;
            const pendingApplicants = applicants.filter((a: any) => a.status === 'pending').length;
            const approvedApplicants = applicants.filter((a: any) => a.status === 'approved').length;
            const rejectedApplicants = applicants.filter((a: any) => a.status === 'rejected').length;
            const views = Math.floor(Math.random() * 500) + 100; // Mock views
            const conversionRate = totalApplicants > 0 ? (approvedApplicants / totalApplicants) * 100 : 0;

            return {
              id: campaign.id,
              title: campaign.title,
              totalApplicants,
              pendingApplicants,
              approvedApplicants,
              rejectedApplicants,
              views,
              conversionRate
            };
          } catch (error) {
            console.error(`Error fetching applicants for campaign ${campaign.id}:`, error);
            return {
              id: campaign.id,
              title: campaign.title,
              totalApplicants: 0,
              pendingApplicants: 0,
              approvedApplicants: 0,
              rejectedApplicants: 0,
              views: 0,
              conversionRate: 0
            };
          }
        });

        const stats = await Promise.all(statsPromises);
        setCampaigns(stats);

        // Calculate total stats
        const totals = stats.reduce((acc, campaign) => ({
          totalCampaigns: acc.totalCampaigns + 1,
          totalApplicants: acc.totalApplicants + campaign.totalApplicants,
          avgApplicantsPerCampaign: 0,
          totalApproved: acc.totalApproved + campaign.approvedApplicants
        }), { totalCampaigns: 0, totalApplicants: 0, avgApplicantsPerCampaign: 0, totalApproved: 0 });

        totals.avgApplicantsPerCampaign = totals.totalCampaigns > 0 
          ? Math.round((totals.totalApplicants / totals.totalCampaigns) * 10) / 10 
          : 0;

        setTotalStats(totals);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/brand-dashboard"
            className="text-gray-500 hover:text-gray-700 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaign Analytics</h1>
          <p className="text-gray-600">Track performance and insights for your campaigns</p>
        </div>

        {/* Overview Stats - 4 Cards in One Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                <span className="text-green-200">↑ 12%</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{totalStats.totalCampaigns}</div>
            <div className="text-blue-100 text-sm font-medium">Total Campaigns</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-blue-100">Active campaigns running</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                <span className="text-green-200">↑ 8%</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{totalStats.totalApplicants}</div>
            <div className="text-green-100 text-sm font-medium">Total Applicants</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-green-100">Creator applications received</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                <span className="text-green-200">↑ 15%</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{totalStats.totalApproved}</div>
            <div className="text-purple-100 text-sm font-medium">Approved Creators</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-purple-100">
                {totalStats.totalApplicants > 0 
                  ? `${((totalStats.totalApproved / totalStats.totalApplicants) * 100).toFixed(1)}% approval rate`
                  : 'No applicants yet'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaEye className="text-white text-2xl" />
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                <span className="text-orange-200">≈ Avg</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{totalStats.avgApplicantsPerCampaign}</div>
            <div className="text-orange-100 text-sm font-medium">Avg. Applicants/Campaign</div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-orange-100">Per campaign engagement</p>
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Campaign Performance</h2>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FaChartLine className="mx-auto text-6xl mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
              <p>Create your first campaign to start tracking analytics.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Applications
                    </th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaClock className="inline mr-1" />
                      Pending
                    </th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaCheckCircle className="inline mr-1" />
                      Approved
                    </th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaTimes className="inline mr-1" />
                      Rejected
                    </th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{campaign.title}</td>
                      <td className="p-4 text-center text-gray-600">{campaign.views}</td>
                      <td className="p-4 text-center font-semibold">{campaign.totalApplicants}</td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {campaign.pendingApplicants}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {campaign.approvedApplicants}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {campaign.rejectedApplicants}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${campaign.conversionRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{campaign.conversionRate.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/campaign/${campaign.id}/applicants`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Top Performing Campaigns</h3>
            {campaigns.length === 0 ? (
              <p className="text-gray-500">No data available yet</p>
            ) : (
              <div className="space-y-3">
                {campaigns
                  .sort((a, b) => b.totalApplicants - a.totalApplicants)
                  .slice(0, 5)
                  .map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-gray-500">{campaign.totalApplicants} applicants</div>
                        </div>
                      </div>
                      <FaCheckCircle className="text-green-600" />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartLine className="text-blue-600" />
                  <span className="font-semibold text-blue-900">Campaign Engagement</span>
                </div>
                <p className="text-sm text-blue-800">
                  Your campaigns are receiving {totalStats.avgApplicantsPerCampaign} applications on average.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-600" />
                  <span className="font-semibold text-green-900">Approval Rate</span>
                </div>
                <p className="text-sm text-green-800">
                  {totalStats.totalApplicants > 0 
                    ? `${((totalStats.totalApproved / totalStats.totalApplicants) * 100).toFixed(1)}% of applicants have been approved.`
                    : 'No applicants to analyze yet.'}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-purple-600" />
                  <span className="font-semibold text-purple-900">Creator Interest</span>
                </div>
                <p className="text-sm text-purple-800">
                  {totalStats.totalApplicants > 0
                    ? `${totalStats.totalApplicants} creators have shown interest in your campaigns.`
                    : 'Start promoting your campaigns to attract creators.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
