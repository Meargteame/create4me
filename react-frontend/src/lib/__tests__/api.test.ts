import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from '../api'

// Mock fetch
global.fetch = vi.fn()

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        success: true,
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' }
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await apiClient.login('test@example.com', 'password')

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        })
      )
    })

    it('should include auth token in requests', async () => {
      localStorage.setItem('auth_token', 'test-token')

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, campaigns: [] })
      })

      await apiClient.getCampaigns()

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      )
    })
  })

  describe('Campaigns', () => {
    it('should fetch campaigns', async () => {
      const mockCampaigns = [
        { id: '1', title: 'Campaign 1' },
        { id: '2', title: 'Campaign 2' }
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, campaigns: mockCampaigns })
      })

      const result = await apiClient.getCampaigns()

      expect(result.campaigns).toEqual(mockCampaigns)
    })

    it('should create campaign', async () => {
      const newCampaign = { title: 'New Campaign', description: 'Description' }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, campaign: { id: '1', ...newCampaign } })
      })

      const result = await apiClient.createCampaign(newCampaign.title, newCampaign.description)

      expect(result.success).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/campaigns'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newCampaign)
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should throw error on failed request', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Request failed' })
      })

      await expect(apiClient.getCampaigns()).rejects.toThrow()
    })

    it('should throw error on network failure', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.getCampaigns()).rejects.toThrow('Network error')
    })
  })
})
