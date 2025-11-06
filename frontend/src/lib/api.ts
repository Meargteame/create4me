const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Auth
  async register(email: string, password: string, role: string, name?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, name })
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Campaigns
  async getCampaigns() {
    return this.request('/campaigns/all');
  }

  async getMyCampaigns() {
    return this.request('/campaigns');
  }

  async createCampaign(data: any) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCampaign(id: string) {
    return this.request(`/campaigns/${id}`);
  }

  // Creators
  async getCreators(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/creators${query}`);
  }

  async getCreator(id: string) {
    return this.request(`/creators/${id}`);
  }

  // Applications
  async applyToCampaign(campaignId: string, data: any) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ campaignId, ...data })
    });
  }

  async getMyApplications() {
    return this.request('/applications/my');
  }

  async getCampaignApplicants(campaignId: string) {
    return this.request(`/applications/campaign/${campaignId}`);
  }

  async updateApplicationStatus(id: string, status: string) {
    return this.request(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Upload endpoints
  async uploadImage(image: string, type: 'avatar' | 'portfolio' | 'campaign') {
    return this.request(`/upload/${type}`, {
      method: 'POST',
      body: JSON.stringify({ image })
    });
  }

  // Creator profile endpoints
  async getMyProfile() {
    return this.request('/creators/profile/me');
  }

  async updateMyProfile(data: any) {
    return this.request('/creators/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async addPortfolioItem(data: any) {
    return this.request('/creators/profile/portfolio', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deletePortfolioItem(itemId: string) {
    return this.request(`/creators/profile/portfolio/${itemId}`, {
      method: 'DELETE'
    });
  }

  // Analytics endpoints
  async getDashboardAnalytics() {
    return this.request('/analytics/dashboard');
  }

  async getCampaignAnalytics(campaignId: string) {
    return this.request(`/analytics/campaign/${campaignId}`);
  }

  async getCreatorAnalytics(creatorId: string) {
    return this.request(`/analytics/creator/${creatorId}`);
  }

  // Message endpoints
  async getConversations() {
    return this.request('/messages/conversations');
  }

  async getMessages(userId: string) {
    return this.request(`/messages/conversation/${userId}`);
  }

  async sendMessage(recipientId: string, content: string) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ receiverId: recipientId, content })
    });
  }

  async markAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PATCH'
    });
  }

  // Application detail endpoint
  async getApplication(id: string) {
    return this.request(`/applications/${id}`);
  }
}

export const api = new ApiClient();
