"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CourseForm } from "@/components/course-form"
import { RoadmapDisplay } from "@/components/roadmap-display"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { GraduationCap, Sparkles, BookOpen, Target, Lightbulb } from "lucide-react"
import type { RoadmapData } from "@/lib/types"

export default function Home() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null)
  const [courseTitle, setCourseTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = (data: RoadmapData, title: string) => {
    setRoadmapData(data)
    setCourseTitle(title)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Course Roadmap Generator
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        {!roadmapData && !isLoading && (
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Learning Paths
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Create Your Perfect
              <br />
              <span className="text-primary">Learning Roadmap</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Enter any course topic and let AI generate a comprehensive learning roadmap 
              with curated resources, recommended videos, books, and platforms.
            </p>

            {/* Feature Cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">Structured Path</h3>
                <p className="text-sm text-muted-foreground">
                  Week-by-week roadmap from basics to advanced topics
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">Curated Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Top videos, websites, and books for your topic
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Lightbulb className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">Expert Designed</h3>
                <p className="text-sm text-muted-foreground">
                  AI acts as a curriculum expert to build your path
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button when roadmap is shown */}
        {roadmapData && !isLoading && (
          <div className="mb-8">
            <button
              onClick={() => {
                setRoadmapData(null)
                setCourseTitle("")
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Generate another roadmap
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className={`${roadmapData || isLoading ? "" : "max-w-2xl mx-auto"}`}>
          {!roadmapData && !isLoading && (
            <CourseForm 
              onGenerate={handleGenerate} 
              onLoadingChange={setIsLoading} 
            />
          )}

          {isLoading && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Generating Your Roadmap
                </h2>
                <p className="text-muted-foreground">
                  Our AI is crafting a personalized learning path for you...
                </p>
              </div>
              <LoadingSkeleton />
            </div>
          )}

          {roadmapData && !isLoading && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                  Your Learning Roadmap for{" "}
                  <span className="text-primary">{courseTitle}</span>
                </h2>
                <p className="text-muted-foreground">
                  Follow this structured path to master {courseTitle}
                </p>
              </div>
              <RoadmapDisplay data={roadmapData} courseTitle={courseTitle} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 print:hidden">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Made with{" "}
            <a
              href="https://v0.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              v0.dev
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
