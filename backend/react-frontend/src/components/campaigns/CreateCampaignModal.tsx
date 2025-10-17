import React, { useState } from 'react';
import apiClient from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose, onCampaignCreated }: CreateCampaignModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a campaign.');
      return;
    }
    if (!title.trim()) {
      setError('Campaign title is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await apiClient.createCampaign(title, description);
      if (response.success) {
        setTitle('');
        setDescription('');
        showToast('Campaign created successfully!', 'success');
        onCampaignCreated();
        onClose();
      } else {
        setError(response.message || 'Failed to create campaign');
        showToast(response.message || 'Failed to create campaign', 'error');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      showToast('Network error. Please try again.', 'error');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <button onClick={onClose} className="float-right bg-transparent border-none text-2xl text-gray-500 hover:text-gray-800">×</button>
        
        <h2 className="text-center text-2xl font-bold mb-6">Create New Campaign</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">Campaign Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Summer Fashion Launch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium">Description (Optional)</label>
            <textarea
              id="description"
              placeholder="e.g., A campaign to promote our new summer collection."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 border-none rounded-lg bg-indigo-600 text-white text-base font-bold cursor-pointer disabled:opacity-60 hover:bg-indigo-700 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
}
