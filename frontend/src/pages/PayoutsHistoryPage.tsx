import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { FaDollarSign, FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

interface Payout {
  _id: string;
  campaignId: {
    title: string;
  };
  amount: number;
  platformFee: number;
  netPayout: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'telebirr' | 'chapa';
  processedAt?: string;
  createdAt: string;
}

export default function PayoutsHistoryPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchPayouts(pagination.page);
  }, [pagination.page]);

  const fetchPayouts = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getPaymentHistory(page);
      setPayouts(response.payouts);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch payout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          color: 'text-green-700 bg-green-50',
          label: 'Completed',
        };
      case 'failed':
        return {
          icon: <FaTimesCircle className="text-red-500" />,
          color: 'text-red-700 bg-red-50',
          label: 'Failed',
        };
      default:
        return {
          icon: <FaClock className="text-yellow-500" />,
          color: 'text-yellow-700 bg-yellow-50',
          label: 'Processing',
        };
    }
  };

  if (loading && pagination.page === 1) {
    return (
      <DashboardLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900">Payouts History</h1>
          <p className="text-gray-600 mt-2">A complete record of all your earnings.</p>
        </motion.div>

        {payouts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
            <FaDollarSign className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No Payouts Yet</h3>
            <p className="text-gray-500 mt-2">Your completed campaign payouts will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payouts.map((payout) => {
              const statusConfig = getStatusConfig(payout.status);
              return (
                <motion.div
                  key={payout._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-lg text-gray-800">{payout.campaignId.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt />
                          <span>{new Date(payout.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center gap-2 capitalize font-medium px-3 py-1 rounded-lg ${statusConfig.color}`}>
                          {statusConfig.icon}
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500">Net Payout</p>
                      <p className="font-bold text-2xl text-green-600">${payout.netPayout.toLocaleString()}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500">Platform Fee</p>
                      <p className="font-semibold text-lg text-red-500">-${payout.platformFee.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page <= 1}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
