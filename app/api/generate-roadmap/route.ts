import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { courseTitle } = await request.json()

    if (!courseTitle) {
      return NextResponse.json(
        { error: "Course title is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: API key not set" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      }
    })

    const systemPrompt = `You are a leading expert curriculum designer with decades of experience creating world-class educational programs. Your task is to create a comprehensive, detailed learning roadmap for the course: "${courseTitle}".

You MUST respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):

{
  "detailedRoadmap": [
    "Week 1: [Topic] - [Brief description of what will be learned and key concepts]",
    "Week 2: [Topic] - [Brief description of what will be learned and key concepts]",
    ...continue for 8-12 weeks
  ],
  "youtubeVideos": [
    "Title: [Video Title] | Channel: [Channel Name] | Link: https://youtube.com/watch?v=[videoId]",
    ...provide 5-8 high-quality, real educational videos
  ],
  "websitePlatforms": [
    "Title: [Website Name] | Link: [Full URL]",
    ...provide 5-8 reputable learning platforms or documentation sites
  ],
  "bookTitles": [
    "Title: [Book Title] | Author: [Author Name]",
    ...provide 4-6 highly-rated books for this subject
  ]
}

Important guidelines:
1. Make the roadmap progressive, starting from fundamentals and building to advanced topics
2. Include practical projects and hands-on exercises in the roadmap
3. Recommend real, popular, and high-quality resources that actually exist
4. For YouTube videos, suggest channels known for quality educational content
5. Include both free and paid resources for variety
6. Tailor the difficulty progression appropriately for the subject matter`

    const result = await model.generateContent(systemPrompt)
    const response = result.response
    const text = response.text()

    try {
      const roadmapData = JSON.parse(text)
      
      // Validate the response structure
      if (!roadmapData.detailedRoadmap || !roadmapData.youtubeVideos || 
          !roadmapData.websitePlatforms || !roadmapData.bookTitles) {
        throw new Error("Invalid response structure")
      }

      return NextResponse.json(roadmapData)
    } catch {
      console.error("Failed to parse Gemini response:", text)
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("API Error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API Key. Please check your Gemini API key and try again." },
        { status: 401 }
      )
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("rate")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate roadmap. Please try again." },
      { status: 500 }
    )
  }
}
