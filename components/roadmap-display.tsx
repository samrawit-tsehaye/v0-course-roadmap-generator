"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Copy, 
  FileDown, 
  CheckCircle2, 
  Youtube, 
  Globe, 
  BookOpen,
  MapPin,
  ExternalLink
} from "lucide-react"
import { useState } from "react"
import type { RoadmapData } from "@/lib/types"

interface RoadmapDisplayProps {
  data: RoadmapData
  courseTitle: string
}

export function RoadmapDisplay({ data, courseTitle }: RoadmapDisplayProps) {
  const [copied, setCopied] = useState(false)

  const formatAsMarkdown = () => {
    let markdown = `# Learning Roadmap: ${courseTitle}\n\n`
    
    markdown += `## 📍 Detailed Roadmap\n\n`
    data.detailedRoadmap.forEach((item, index) => {
      markdown += `${index + 1}. ${item}\n`
    })
    
    markdown += `\n## 🎥 YouTube Videos\n\n`
    data.youtubeVideos.forEach((item) => {
      markdown += `- ${item}\n`
    })
    
    markdown += `\n## 🌐 Website Platforms\n\n`
    data.websitePlatforms.forEach((item) => {
      markdown += `- ${item}\n`
    })
    
    markdown += `\n## 📚 Book Recommendations\n\n`
    data.bookTitles.forEach((item) => {
      markdown += `- ${item}\n`
    })
    
    return markdown
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatAsMarkdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleExport = () => {
    window.print()
  }

  const extractYouTubeId = (text: string) => {
    const match = text.match(/watch\?v=([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const extractLink = (text: string) => {
    const match = text.match(/Link:\s*(https?:\/\/[^\s]+)/i)
    return match ? match[1] : null
  }

  const extractTitle = (text: string) => {
    const match = text.match(/Title:\s*([^|]+)/i)
    return match ? match[1].trim() : text
  }

  const extractChannel = (text: string) => {
    const match = text.match(/Channel:\s*([^|]+)/i)
    return match ? match[1].trim() : null
  }

  const extractAuthor = (text: string) => {
    const match = text.match(/Author:\s*(.+)/i)
    return match ? match[1].trim() : null
  }

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="gap-2"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy as Markdown
            </>
          )}
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export as PDF
        </Button>
      </div>

      {/* Detailed Roadmap */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Learning Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {data.detailedRoadmap.map((item, index) => (
              <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  {index < data.detailedRoadmap.length - 1 && (
                    <div className="h-full w-px bg-border mt-2" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="text-foreground leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* YouTube Videos */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Youtube className="h-5 w-5 text-red-500" />
            Recommended Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.youtubeVideos.map((item, index) => {
              const videoId = extractYouTubeId(item)
              const title = extractTitle(item)
              const channel = extractChannel(item)
              const link = extractLink(item)
              
              return (
                <a
                  key={index}
                  href={link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                    {videoId && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt={title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {title}
                      </h4>
                      {channel && (
                        <p className="text-sm text-muted-foreground">{channel}</p>
                      )}
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Website Platforms */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-blue-500" />
            Learning Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.websitePlatforms.map((item, index) => {
              const title = extractTitle(item)
              const link = extractLink(item)
              
              return (
                <a
                  key={index}
                  href={link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full p-4 transition-all hover:border-primary/50 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {title}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Book Recommendations */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-amber-500" />
            Recommended Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.bookTitles.map((item, index) => {
              const title = extractTitle(item)
              const author = extractAuthor(item)
              
              return (
                <Card key={index} className="p-4 transition-all hover:border-primary/50">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-b from-amber-500/20 to-amber-600/20 border border-amber-500/30">
                      <BookOpen className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{title}</h4>
                      {author && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          by {author}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Course Badge */}
      <div className="flex justify-center print:hidden">
        <Badge variant="secondary" className="text-sm">
          Generated for: {courseTitle}
        </Badge>
      </div>
    </div>
  )
}
