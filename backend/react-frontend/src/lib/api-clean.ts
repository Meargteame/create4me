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

  // Project endpoints
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(name: string, description?: string) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Page endpoints  
  async getProjectPages(projectId: string) {
    return this.request(`/projects/${projectId}/pages`);
  }

  async createPage(projectId: string, data: any) {
    return this.request(`/projects/${projectId}/pages`, {
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
}

const apiClient = new ApiClient();
export default apiClient;
