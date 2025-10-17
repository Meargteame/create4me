// Shared type definitions for the application

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'brand' | 'creator';
  created_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  category?: string;
  status?: string;
  createdAt: string;
  user: {
    email: string;
    name?: string;
  };
}

export interface Application {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  campaign?: Campaign;
}
