export interface Campaign {
  id: string
  userId: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    email: string
  }
  // Additional fields for frontend display
  budget?: {
    min: number
    max: number
  }
  deadline?: string
  location?: string
  category?: string
  requirements?: string[]
  image?: string
  likes?: number
  comments?: number
  applications?: number
  isLiked?: boolean
  isBookmarked?: boolean
  postedAt?: string
  brand?: {
    name: string
    logo: string
    verified: boolean
  }
}

export interface CampaignApplication {
  id: string
  campaignId: string
  creatorId: string
  coverLetter: string
  portfolioLink?: string
  deliverables?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
  campaign?: Campaign
  creator?: {
    id: string
    email: string
  }
}

export interface CampaignStats {
  totalCampaigns: number
  newThisWeek: number
  averageBudget: number
  bookmarked: number
}
