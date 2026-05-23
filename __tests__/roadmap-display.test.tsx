import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoadmapDisplay } from '@/components/roadmap-display'
import type { RoadmapData } from '@/lib/types'

const mockRoadmapData: RoadmapData = {
  detailedRoadmap: [
    'Week 1: Introduction to HTML - Learn the basics of HTML structure and semantic elements',
    'Week 2: CSS Fundamentals - Master CSS styling, selectors, and the box model',
    'Week 3: JavaScript Basics - Understand variables, functions, and DOM manipulation',
  ],
  youtubeVideos: [
    'Title: HTML Crash Course | Channel: Traversy Media | Link: https://youtube.com/watch?v=UB1O30fR-EE',
    'Title: CSS Tutorial | Channel: freeCodeCamp | Link: https://youtube.com/watch?v=1Rs2ND1ryYc',
  ],
  websitePlatforms: [
    'Title: MDN Web Docs | Link: https://developer.mozilla.org',
    'Title: freeCodeCamp | Link: https://www.freecodecamp.org',
  ],
  bookTitles: [
    'Title: Eloquent JavaScript | Author: Marijn Haverbeke',
    'Title: HTML and CSS | Author: Jon Duckett',
  ],
}

describe('RoadmapDisplay', () => {
  it('renders the learning roadmap section', () => {
    render(<RoadmapDisplay data={mockRoadmapData} courseTitle="Web Development" />)

    expect(screen.getByText(/learning roadmap/i)).toBeInTheDocument()
    expect(screen.getByText(/week 1/i)).toBeInTheDocument()
    expect(screen.getByText(/week 2/i)).toBeInTheDocument()
    expect(screen.getByText(/week 3/i)).toBeInTheDocument()
  })

  it('renders YouTube video recommendations', () => {
    render(<RoadmapDisplay data={mockRoadmapData} courseTitle="Web Development" />)

    expect(screen.getByText(/recommended videos/i)).toBeInTheDocument()
    expect(screen.getByText(/html crash course/i)).toBeInTheDocument()
    expect(screen.getByText(/css tutorial/i)).toBeInTheDocument()
  })

  it('renders learning platforms section', () => {
    render(<RoadmapDisplay data={mockRoadmapData} courseTitle="Web Development" />)

    expect(screen.getByText('Learning Platforms')).toBeInTheDocument()
    expect(screen.getByText(/mdn web docs/i)).toBeInTheDocument()
    // Use getAllByText since freeCodeCamp appears in both videos and platforms sections
    expect(screen.getAllByText(/freecodecamp/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders book recommendations', () => {
    render(<RoadmapDisplay data={mockRoadmapData} courseTitle="Web Development" />)

    expect(screen.getByText(/recommended books/i)).toBeInTheDocument()
    expect(screen.getByText(/eloquent javascript/i)).toBeInTheDocument()
    expect(screen.getByText(/marijn haverbeke/i)).toBeInTheDocument()
  })

  it('renders copy and export buttons', () => {
    render(<RoadmapDisplay data={mockRoadmapData} courseTitle="Web Development" />)

    expect(screen.getByRole('button', { name: /copy as markdown/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export as pdf/i })).toBeInTheDocument()
  })

  it('renders with empty arrays without crashing', () => {
    const emptyData: RoadmapData = {
      detailedRoadmap: [],
      youtubeVideos: [],
      websitePlatforms: [],
      bookTitles: [],
    }

    render(<RoadmapDisplay data={emptyData} courseTitle="Empty Course" />)

    // Should still render section headers even if content is empty
    expect(screen.getByText('Learning Roadmap')).toBeInTheDocument()
    expect(screen.getByText('Recommended Videos')).toBeInTheDocument()
    expect(screen.getByText('Learning Platforms')).toBeInTheDocument()
    expect(screen.getByText('Recommended Books')).toBeInTheDocument()
  })
})
