import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CourseForm } from '@/components/course-form'

// Mock fetch
global.fetch = vi.fn()

describe('CourseForm', () => {
  const mockOnGenerate = vi.fn()
  const mockOnLoadingChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form with course title input', () => {
    render(
      <CourseForm 
        onGenerate={mockOnGenerate} 
        onLoadingChange={mockOnLoadingChange} 
      />
    )

    expect(screen.getByLabelText(/course title/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate roadmap/i })).toBeInTheDocument()
  })

  it('shows error when submitting without course title', async () => {
    render(
      <CourseForm 
        onGenerate={mockOnGenerate} 
        onLoadingChange={mockOnLoadingChange} 
      />
    )

    const submitButton = screen.getByRole('button', { name: /generate roadmap/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a course title/i)).toBeInTheDocument()
    })
  })

  it('calls onGenerate with data on successful submission', async () => {
    const mockRoadmapData = {
      detailedRoadmap: ['Week 1: Introduction'],
      youtubeVideos: ['Title: Video 1 | Channel: Test | Link: https://youtube.com/watch?v=123'],
      websitePlatforms: ['Title: MDN | Link: https://developer.mozilla.org'],
      bookTitles: ['Title: Test Book | Author: Test Author'],
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRoadmapData,
    } as Response)

    render(
      <CourseForm 
        onGenerate={mockOnGenerate} 
        onLoadingChange={mockOnLoadingChange} 
      />
    )

    const input = screen.getByLabelText(/course title/i)
    fireEvent.change(input, { target: { value: 'Web Development' } })

    const submitButton = screen.getByRole('button', { name: /generate roadmap/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith(mockRoadmapData, 'Web Development')
    })
  })

  it('displays error message on API failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' }),
    } as Response)

    render(
      <CourseForm 
        onGenerate={mockOnGenerate} 
        onLoadingChange={mockOnLoadingChange} 
      />
    )

    const input = screen.getByLabelText(/course title/i)
    fireEvent.change(input, { target: { value: 'Test Course' } })

    const submitButton = screen.getByRole('button', { name: /generate roadmap/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => ({
          detailedRoadmap: [],
          youtubeVideos: [],
          websitePlatforms: [],
          bookTitles: [],
        }),
      } as Response), 100))
    )

    render(
      <CourseForm 
        onGenerate={mockOnGenerate} 
        onLoadingChange={mockOnLoadingChange} 
      />
    )

    const input = screen.getByLabelText(/course title/i)
    fireEvent.change(input, { target: { value: 'Test Course' } })

    const submitButton = screen.getByRole('button', { name: /generate roadmap/i })
    fireEvent.click(submitButton)

    expect(mockOnLoadingChange).toHaveBeenCalledWith(true)
    
    await waitFor(() => {
      expect(screen.getByText(/generating roadmap/i)).toBeInTheDocument()
    })
  })
})
