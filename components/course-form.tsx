"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Key, BookOpen, AlertCircle, Eye, EyeOff } from "lucide-react"
import type { RoadmapData } from "@/lib/types"

interface CourseFormProps {
  onGenerate: (data: RoadmapData, courseTitle: string) => void
  onLoadingChange: (loading: boolean) => void
}

const API_KEY_STORAGE_KEY = "gemini-api-key"

export function CourseForm({ onGenerate, onLoadingChange }: CourseFormProps) {
  const [apiKey, setApiKey] = useState("")
  const [courseTitle, setCourseTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    localStorage.setItem(API_KEY_STORAGE_KEY, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key")
      return
    }

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
          apiKey: apiKey.trim(),
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
          Enter your Gemini API key and a course title to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Gemini API Key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your free API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
              . Your key is stored locally in your browser.
            </p>
          </div>

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
