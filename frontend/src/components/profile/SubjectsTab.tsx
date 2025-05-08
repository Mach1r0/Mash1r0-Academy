import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useAuth } from "@/app/auth/Context"

interface ThemeProgress {
  id: number
  name: string
  description: string
  slug: string
  answered_count: number
  correct_count: number
  total_questions: number
  completion_percentage: number
  accuracy_percentage: number
  last_accessed?: string
}

export default function SubjectsTab() {
  const [themeProgressData, setThemeProgressData] = useState<ThemeProgress[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchThemeProgress = async () => {
      if (!user || !user.student_id) return

      try {
        setLoading(true)
        // First, fetch all themes
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const themesResponse = await axios.get(`${apiUrl}/theme/`)
        const themes = themesResponse.data.results || []

        // For each theme, fetch progress data
        const progressData = await Promise.all(
          themes.map(async (theme: any) => {
            try {
              const progressResponse = await axios.get(
                `${apiUrl}/api/student-response/theme-progress/`, 
                {
                  params: {
                    student_id: user.student_id,
                    theme_id: theme.id
                  },
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              )
              
              return {
                id: theme.id,
                name: theme.name,
                description: theme.description,
                slug: theme.slug,
                answered_count: progressResponse.data.answered_count || 0,
                correct_count: progressResponse.data.correct_count || 0,
                total_questions: progressResponse.data.total_questions || 0,
                completion_percentage: progressResponse.data.completion_percentage || 0,
                accuracy_percentage: progressResponse.data.accuracy_percentage || 0,
                last_accessed: "Recently" // You might want to fetch this separately if available
              }
            } catch (error) {
              console.error(`Error fetching progress for theme ${theme.id}:`, error)
              return {
                id: theme.id,
                name: theme.name,
                description: theme.description,
                slug: theme.slug,
                answered_count: 0,
                correct_count: 0,
                total_questions: 0,
                completion_percentage: 0,
                accuracy_percentage: 0
              }
            }
          })
        )

        // Sort by completion percentage (highest first)
        const sortedProgress = progressData.sort((a, b) => 
          b.completion_percentage - a.completion_percentage
        )
        
        setThemeProgressData(sortedProgress)
      } catch (error) {
        console.error("Error fetching themes or progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchThemeProgress()
  }, [user])

  if (loading) {
    return <div className="text-center py-8">Loading your subjects...</div>
  }

  return (
    <>
      <h3 className="text-xl font-semibold">Enrolled Subjects</h3>

      {themeProgressData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't started any subjects yet.</p>
          <Button variant="outline" asChild>
            <Link href="/subjects">Browse Subjects</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {themeProgressData.map(theme => (
              <Card key={theme.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{theme.name}</CardTitle>
                    <Badge variant={theme.completion_percentage === 100 ? "outline" : "default"}>
                      {theme.completion_percentage === 100 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm">{Math.round(theme.completion_percentage)}%</span>
                    </div>
                    <Progress value={theme.completion_percentage} />
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <span>Last accessed: {theme.last_accessed || "N/A"}</span>
                      <span>{theme.answered_count}/{theme.total_questions} questions</span>
                    </div>
                    {theme.answered_count > 0 && (
                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span>Accuracy: {Math.round(theme.accuracy_percentage)}%</span>
                        <span>{theme.correct_count} correct answers</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Link href={`/subjects/${theme.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" asChild>
              <Link href="/subjects">Browse More Subjects</Link>
            </Button>
          </div>
        </>
      )}
    </>
  )
}