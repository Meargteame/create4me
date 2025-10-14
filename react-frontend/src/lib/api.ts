// API client for Create4Me backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, role?: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Campaign endpoints
  async getCampaigns() {
    return this.request('/campaigns');
  }

  async createCampaign(title: string, description?: string) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async getCampaign(id: string) {
    return this.request(`/campaigns/${id}`);
  }

  async updateCampaign(id: string, data: any) {
    return this.request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string) {
    return this.request(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Get all campaigns for creator board
  async getAllCampaigns() {
    return this.request('/campaigns/all');
  }

  // Application endpoints
  async applyToCampaign(campaignId: string, coverLetter: string, portfolioLink?: string, deliverables?: string) {
    return this.request(`/applications/campaigns/${campaignId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ coverLetter, portfolioLink, deliverables }),
    });
  }

  async getMyApplications() {
    return this.request('/applications/my-applications');
  }

  async getCampaignApplicants(campaignId: string) {
    return this.request(`/applications/campaigns/${campaignId}/applicants`);
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    return this.request(`/applications/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
  }

  // Campaign interaction endpoints
  async likeCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/like`, {
      method: 'POST',
    });
  }

  async unlikeCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/unlike`, {
      method: 'DELETE',
    });
  }

  async bookmarkCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/bookmark`, {
      method: 'POST',
    });
  }

  async unbookmarkCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/bookmark`, {
      method: 'DELETE',
    });
  }

  async getBookmarkedCampaigns() {
    return this.request('/campaigns/bookmarked');
  }

  // Task endpoints
  async getTasks(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/tasks`);
  }

  async createTask(taskData: any) {
    return this.request(`/campaigns/${taskData.campaignId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, taskData: any) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Page endpoints  
  async getCampaignPages(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/pages`);
  }

  async createPage(campaignId: string, data: any) {
    return this.request(`/campaigns/${campaignId}/pages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPage(id: string) {
    return this.request(`/pages/${id}`);
  }

  async updatePage(id: string, data: any) {
    return this.request(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string) {
    return this.request(`/pages/${id}`, {
      method: 'DELETE',
    });
  }

  // AI endpoints (placeholders)
  async generateContent(prompt: string) {
    return this.request('/ai/generate-content', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async optimizeSEO(content: string) {
    return this.request('/ai/optimize-seo', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async analyzePerformance(data: any) {
    return this.request('/ai/analyze-performance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Creator endpoints
  async getCreators(params?: {
    search?: string;
    category?: string;
    location?: string;
    platform?: string;
    minRating?: number;
    verified?: boolean;
    available?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/creators${queryString ? `?${queryString}` : ''}`);
  }

  async getCreator(id: string) {
    return this.request(`/creators/${id}`);
  }

  async likeCreator(id: string) {
    return this.request(`/creators/${id}/like`, {
      method: 'POST',
    });
  }

  async bookmarkCreator(id: string) {
    return this.request(`/creators/${id}/bookmark`, {
      method: 'POST',
    });
  }

  async contactCreator(id: string, message: string) {
    return this.request(`/creators/${id}/contact`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Connection endpoints
  async getConnections(params?: {
    tab?: 'connected' | 'pending' | 'suggested';
    search?: string;
    role?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/connections${queryString ? `?${queryString}` : ''}`);
  }

  async sendConnectionRequest(receiverId: string) {
    return this.request('/connections/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    });
  }

  async acceptConnectionRequest(id: string) {
    return this.request(`/connections/${id}/accept`, {
      method: 'POST',
    });
  }

  async rejectConnectionRequest(id: string) {
    return this.request(`/connections/${id}/reject`, {
      method: 'POST',
    });
  }

  async removeConnection(id: string) {
    return this.request(`/connections/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload endpoints
  async uploadAvatar(image: string, filename?: string) {
    return this.request('/upload/avatar', {
      method: 'POST',
      body: JSON.stringify({ image, filename }),
    });
  }

  async uploadPortfolioImage(image: string, filename?: string) {
    return this.request('/upload/portfolio', {
      method: 'POST',
      body: JSON.stringify({ image, filename }),
    });
  }

  async uploadCampaignImage(image: string, filename?: string) {
    return this.request('/upload/campaign', {
      method: 'POST',
      body: JSON.stringify({ image, filename }),
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
