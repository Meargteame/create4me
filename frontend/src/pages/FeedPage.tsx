import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

interface Campaign {
  _id: string;
  id?: string;
  title: string;
  description: string;
  userId: any;
  budget?: number;
  platforms?: string[];
  deadline?: string;
  status: string;
  category?: string;
  createdAt: string;
}

export default function FeedPage() {
  const { user } = useAuth();
  return user?.role === 'brand' ? <BrandFeed /> : <CreatorFeed />;
}

function BrandFeed() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getMyCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div><p className="text-2xl font-bold">{campaigns.length}</p><p className="text-sm text-gray-500">Active Campaigns</p></div>
            </div>
          </div>
        </div>
        <div className="col-span-6 space-y-4">
          {campaigns.map(c => (
            <div key={c._id} className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-gray-600 mb-4">{c.description}</p>
              <Link to="/campaigns" className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block">View</Link>
            </div>
          ))}
        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <Link to="/campaigns" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-center mb-2">Create Campaign</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CreatorFeed() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns((data.campaigns || []).filter((c: Campaign) => c.status === 'active'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = campaigns.filter(c => {
    if (filter === 'all') return true;
    return c.platforms?.includes(filter);
  });

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Pipeline</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-sm">Pending</span><span className="font-semibold">5</span></div>
              <div className="flex justify-between"><span className="text-sm">Accepted</span><span className="font-semibold text-green-600">3</span></div>
            </div>
          </div>
        </div>
        <div className="col-span-6 space-y-4">
          <div className="bg-white rounded-xl border p-4 flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All</button>
            <button onClick={() => setFilter('Instagram')} className={`px-4 py-2 rounded-lg ${filter === 'Instagram' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Instagram</button>
            <button onClick={() => setFilter('YouTube')} className={`px-4 py-2 rounded-lg ${filter === 'YouTube' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>YouTube</button>
          </div>
          {filtered.map(c => (
            <div key={c._id} className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-1">by {c.userId?.name || 'Brand'}</p>
              <p className="text-gray-600 mb-4">{c.description}</p>
              {c.budget && <p className="text-green-600 font-semibold mb-4">${c.budget}</p>}
              <Link to="/campaigns" className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block">Quick Apply</Link>
            </div>
          ))}
        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Performance</h3>
            <div className="space-y-3">
              <div><p className="text-sm text-gray-600">Response Rate</p><p className="text-xl font-bold">92%</p></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
