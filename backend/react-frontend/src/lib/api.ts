// API client for Create4Me backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string" ? data : data.message || "Request failed",
        );
      }

      return data;
    } catch (error: any) {
      console.error("API request failed:", error);
      throw new Error(error.message || "Network request failed");
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, role?: string) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getMe() {
    return this.request("/auth/me");
  }

  // Campaign endpoints
  async getCampaigns(params?: Record<string, any>) {
    // If 'all' param is true, use the /campaigns/all endpoint for creators
    if (params?.all) {
      const { all, ...restParams } = params;
      const queryString = Object.keys(restParams).length
        ? `?${new URLSearchParams(restParams).toString()}`
        : "";
      return this.request(`/campaigns/all${queryString}`);
    }

    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/campaigns${queryString}`);
  }

  async getAllCampaigns() {
    return this.request("/campaigns/all?all=true");
  }

  async createCampaign(campaignData: any) {
    return this.request("/campaigns", {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
  }

  async getCampaign(id: string) {
    return this.request(`/campaigns/${id}`);
  }

  async updateCampaign(id: string, data: any) {
    return this.request(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string) {
    return this.request(`/campaigns/${id}`, {
      method: "DELETE",
    });
  }

  // Applications endpoints
  async getApplications(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/applications${queryString}`);
  }

  async applyToCampaign(campaignId: string, applicationData: any) {
    return this.request(`/applications`, {
      method: "POST",
      body: JSON.stringify({ ...applicationData, campaignId }),
    });
  }

  async updateApplication(applicationId: string, data: any) {
    return this.request(`/applications/${applicationId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Creator endpoints
  async getCreators(params?: Record<string, any>) {
    if (!params) {
      return this.request("/creators");
    }

    // Filter out undefined values to avoid "undefined" strings in query
    const filteredParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    const queryString =
      Object.keys(filteredParams).length > 0
        ? `?${new URLSearchParams(filteredParams).toString()}`
        : "";
    return this.request(`/creators${queryString}`);
  }

  async getCreator(id: string) {
    return this.request(`/creators/${id}`);
  }

  async updateCreatorProfile(data: any) {
    return this.request("/creators/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async likeCreator(id: string) {
    return this.request(`/creators/${id}/like`, {
      method: "POST",
    });
  }

  async bookmarkCreator(id: string) {
    return this.request(`/creators/${id}/bookmark`, {
      method: "POST",
    });
  }

  // Connection endpoints
  async getConnections(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/connections${queryString}`);
  }

  async sendConnectionRequest(receiverId: string) {
    return this.request("/connections/request", {
      method: "POST",
      body: JSON.stringify({ receiverId }),
    });
  }

  async acceptConnectionRequest(id: string) {
    return this.request(`/connections/${id}/accept`, {
      method: "POST",
    });
  }

  async rejectConnectionRequest(id: string) {
    return this.request(`/connections/${id}/reject`, {
      method: "POST",
    });
  }

  async removeConnection(id: string) {
    return this.request(`/connections/${id}`, {
      method: "DELETE",
    });
  }

  // Pages endpoints
  async getPages(projectId: string) {
    return this.request(`/projects/${projectId}/pages`);
  }

  async createPage(projectId: string, data: any) {
    return this.request(`/projects/${projectId}/pages`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPage(id: string) {
    return this.request(`/pages/${id}`);
  }

  async updatePage(id: string, data: any) {
    return this.request(`/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string) {
    return this.request(`/pages/${id}`, {
      method: "DELETE",
    });
  }

  // Task endpoints
  async getTasks(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/tasks`);
  }

  async createTask(campaignId: string, taskData: any) {
    return this.request(`/campaigns/${campaignId}/tasks`, {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, taskData: any) {
    return this.request(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  // Campaign applicants endpoints
  async getCampaignApplicants(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/applicants`);
  }

  // Upload endpoints
  async uploadFile(file: File, type: "avatar" | "portfolio" | "campaign") {
    const formData = new FormData();
    formData.append("file", file);

    return this.request(`/upload/${type}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  }

  // Test endpoint
  async testConnection() {
    return this.request("/test");
  }
}

const apiClient = new ApiClient();
export default apiClient;
