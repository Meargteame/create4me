import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TaskModal from '../components/tasks/TaskModal';
import apiClient from '../lib/api';
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaUsers,
  FaDollarSign,
  FaMapMarkerAlt,
  FaRocket,
  FaChartLine,
  FaEnvelope
} from '../components/icons';

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  budget?: number;
  deadline?: string;
  requirements?: string;
  category?: string;
  location?: string;
  status?: string;
  user?: {
    email: string;
    companyName?: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
}

export default function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<{ applied: boolean, message: string }>({ applied: false, message: '' });

  const checkApplicationStatus = async () => {
    if (!user || !campaignId) return;
    try {
      const response = await apiClient.getMyApplications();
      if (response.success) {
        const existingApplication = response.applications.find((app: any) => app.campaignId === campaignId);
        if (existingApplication) {
          setApplicationStatus({ applied: true, message: `You applied on ${new Date(existingApplication.createdAt).toLocaleDateString()}` });
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const fetchCampaign = async () => {
    if (!user || !campaignId) return;
    try {
      const data = await apiClient.getCampaign(campaignId);
      if (data.success) {
        setCampaign(data.campaign);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  const fetchTasks = async () => {
    if (!user || !campaignId) return;
    try {
      const data = await apiClient.getTasks(campaignId);
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchTasks();
    checkApplicationStatus();
  }, [user, campaignId]);

  const handleApply = async () => {
    if (!user || !campaignId) return;
    setIsApplying(true);
    try {
      const response = await apiClient.applyToCampaign(campaignId, coverLetter);
      if (response.success) {
        setApplicationStatus({ applied: true, message: 'Application submitted successfully!' });
      }
    } catch (error: any) {
      console.error('Error applying to campaign:', error);
      setApplicationStatus({ applied: false, message: error.message || 'Failed to apply.' });
    } finally {
      setIsApplying(false);
      setCoverLetter('');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiClient.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <FaCheckCircle className="text-green-500" />;
      case 'in-progress': return <FaClock className="text-yellow-500" />;
      default: return <FaExclamationTriangle className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <h1>Campaign not found</h1>
          <Link to="/brand-dashboard" className="text-indigo-600">← Back to Dashboard</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Link 
          to={user?.role === 'creator' ? '/campaign-board' : '/dashboard'}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <FaArrowLeft className="mr-2" size={18} />
          Back to {user?.role === 'creator' ? 'Campaigns' : 'Dashboard'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Campaign Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{campaign.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {campaign.category && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        {campaign.category}
                      </span>
                    )}
                    {campaign.status && (
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                {user?.role === 'brand' && (
                  <button 
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaPlus size={16} />
                    Add Task
                  </button>
                )}
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {campaign.budget && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <FaDollarSign size={14} />
                      <span className="font-medium">Budget</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{campaign.budget} ETB</div>
                  </div>
                )}
                {campaign.deadline && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <FaClock size={14} />
                      <span className="font-medium">Deadline</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {campaign.location && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <FaMapMarkerAlt size={14} />
                      <span className="font-medium">Location</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{campaign.location}</div>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <FaRocket size={14} />
                    <span className="font-medium">Posted</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Campaign Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {campaign.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Requirements Card */}
            {campaign.requirements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Requirements
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {campaign.requirements}
                </div>
              </div>
            )}

            {/* Brand Info Card */}
            {campaign.user && user?.role === 'creator' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUsers className="text-indigo-600" />
                  About the Brand
                </h2>
                <div className="space-y-3">
                  {campaign.user.companyName && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaRocket className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{campaign.user.companyName}</div>
                        <div className="text-sm text-gray-600">Brand Partner</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope size={16} />
                    <span>{campaign.user.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card for Creators */}
            {user?.role === 'creator' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Apply to Campaign</h3>
                {applicationStatus.applied ? (
                  <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                    <FaCheckCircle className="mx-auto text-green-600 mb-3" size={48} />
                    <p className="font-semibold text-green-900 mb-1">Application Submitted!</p>
                    <p className="text-sm text-green-700">{applicationStatus.message}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        rows={6}
                        placeholder="Tell the brand why you're perfect for this campaign..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tip: Mention relevant experience and why you're interested
                      </p>
                    </div>
                    <button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FaPaperPlane size={18} />
                      {isApplying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    {applicationStatus.message && !applicationStatus.applied && (
                      <p className="text-red-600 text-sm mt-3 text-center">{applicationStatus.message}</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Management Card for Brands */}
            {user?.role === 'brand' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Campaign</h3>
                <div className="space-y-3">
                  <Link
                    to={`/campaign/${campaign.id}/applicants`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <FaUsers size={18} />
                    View Applicants
                  </Link>
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <FaEdit size={18} />
                    Edit Campaign
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    <FaTrash size={18} />
                    Delete Campaign
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Campaign Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUsers size={18} />
                    <span className="text-sm">Total Applicants</span>
                  </div>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaChartLine size={18} />
                    <span className="text-sm">Views</span>
                  </div>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaClock size={18} />
                    <span className="text-sm">Days Left</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {campaign.deadline 
                      ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* To Do Column */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {getStatusIcon('todo')}
                  To Do ({tasksByStatus.todo.length})
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {tasksByStatus.todo.map(task => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditTask(task)} className="text-gray-400 hover:text-indigo-600"><FaEdit /></button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span style={{ backgroundColor: getPriorityColor(task.priority), color: 'white' }} className="px-2 py-1 rounded-full font-medium">
                        {task.priority}
                      </span>
                      <span className="text-gray-500">
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {getStatusIcon('in-progress')}
                  In Progress ({tasksByStatus['in-progress'].length})
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {tasksByStatus['in-progress'].map(task => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditTask(task)} className="text-gray-400 hover:text-indigo-600"><FaEdit /></button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span style={{ backgroundColor: getPriorityColor(task.priority), color: 'white' }} className="px-2 py-1 rounded-full font-medium">
                        {task.priority}
                      </span>
                       <span className="text-gray-500">
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {getStatusIcon('done')}
                  Done ({tasksByStatus.done.length})
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {tasksByStatus.done.map(task => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg shadow-sm opacity-70">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold line-through">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditTask(task)} className="text-gray-400 hover:text-indigo-600"><FaEdit /></button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                     <div className="flex items-center justify-between mt-3 text-xs">
                      <span style={{ backgroundColor: getPriorityColor(task.priority), color: 'white' }} className="px-2 py-1 rounded-full font-medium">
                        {task.priority}
                      </span>
                       <span className="text-gray-500">
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isTaskModalOpen && (
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={handleCloseModal}
            onTaskCreated={handleTaskCreated}
            campaignId={campaignId!}
            editingTask={editingTask}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
}
