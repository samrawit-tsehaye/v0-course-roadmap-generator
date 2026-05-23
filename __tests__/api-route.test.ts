import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

describe('Generate Roadmap API', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns 400 when course title is missing', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key'
    
    // Dynamic import to get fresh module with mocked env
    const { POST } = await import('@/app/api/generate-roadmap/route')
    
    const request = new NextRequest('http://localhost:3000/api/generate-roadmap', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Course title is required')
  })

  it('returns 500 when API key is not configured', async () => {
    // Remove the API key
    delete process.env.GEMINI_API_KEY

    const { POST } = await import('@/app/api/generate-roadmap/route')

    const request = new NextRequest('http://localhost:3000/api/generate-roadmap', {
      method: 'POST',
      body: JSON.stringify({ courseTitle: 'Web Development' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Server configuration error: API key not set')
  })

  it('validates course title is a non-empty string', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key'
    
    const { POST } = await import('@/app/api/generate-roadmap/route')

    const request = new NextRequest('http://localhost:3000/api/generate-roadmap', {
      method: 'POST',
      body: JSON.stringify({ courseTitle: '' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Course title is required')
  })
})
