"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, BookOpen, AlertCircle } from "lucide-react"
import type { RoadmapData } from "@/lib/types"

interface CourseFormProps {
  onGenerate: (data: RoadmapData, courseTitle: string) => void
  onLoadingChange: (loading: boolean) => void
}

export function CourseForm({ onGenerate, onLoadingChange }: CourseFormProps) {
  const [courseTitle, setCourseTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!courseTitle.trim()) {
      setError("Please enter a course title")
      return
    }

    setIsLoading(true)
    onLoadingChange(true)

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle: courseTitle.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate roadmap")
      }

      onGenerate(data, courseTitle.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
      onLoadingChange(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate Your Roadmap
        </CardTitle>
        <CardDescription>
          Enter a course title to get a personalized learning roadmap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title Input */}
          <div className="space-y-2">
            <Label htmlFor="courseTitle" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Title
            </Label>
            <Input
              id="courseTitle"
              type="text"
              placeholder="e.g., Web Development, Machine Learning, Graphic Design"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Roadmap
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
