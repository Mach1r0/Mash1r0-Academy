"use client"
import Image from "next/image"
import { useEffect, useState } from "react" // Adicione useState
import Link from "next/link"
import { CalendarDays, Book, GraduationCap, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "../auth/Context"
import { useRouter } from "next/navigation"
import ProfileTabs from "@/components/profile/ProfileTabs"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState("subjects")
  
  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
    }
  }, [user, router])

  if (!user) {
    return null 
  }

  // Função para mudar para a aba Settings
  const navigateToSettings = () => {
    setActiveTab("settings")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Image
                      src={user.picture || "/placeholder.svg?height=128&width=128"}
                      alt="Profile picture"
                      width={128}
                      height={128}
                      className="rounded-full border-4 border-background"
                    />
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit profile picture</span>
                    </Button>
                  </div>
                  <div className="space-y-1 text-center">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button onClick={navigateToSettings} className="w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-xs text-muted-foreground">January 12, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Subjects</p>
                      <p className="text-xs text-muted-foreground">5 Enrolled</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-xs text-muted-foreground">3 Subjects</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
        </div>
      </div>
    </main>
  )
}