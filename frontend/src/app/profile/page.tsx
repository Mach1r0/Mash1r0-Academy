"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Book, GraduationCap, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../auth/Context"
import { useRouter } from "next/router"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
    }
  }, [user, router])

  if (!user) {
    return null 
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
                  <Link href="/profile/edit">
                    <Button className="w-full">Edit Profile</Button>
                  </Link>
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
            <Tabs defaultValue="subjects">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subjects">My Subjects</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="subjects" className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold">Enrolled Subjects</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>Mathematics</CardTitle>
                        <Badge>In Progress</Badge>
                      </div>
                      <CardDescription>Advanced Calculus</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm">65%</span>
                        </div>
                        <Progress value={65} />
                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                          <span>Last accessed: 2 days ago</span>
                          <span>13/20 lessons</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>Physics</CardTitle>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <CardDescription>Quantum Mechanics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm">100%</span>
                        </div>
                        <Progress value={100} />
                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                          <span>Completed: Jan 15, 2025</span>
                          <span>18/18 lessons</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>Computer Science</CardTitle>
                        <Badge>In Progress</Badge>
                      </div>
                      <CardDescription>Data Structures & Algorithms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm">42%</span>
                        </div>
                        <Progress value={42} />
                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                          <span>Last accessed: Today</span>
                          <span>8/19 lessons</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/subjects">Browse More Subjects</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold">Your Achievements</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="text-center p-4">
                    <div className="mx-auto my-2 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold">First Completion</h4>
                    <p className="text-sm text-muted-foreground">Completed your first subject</p>
                  </Card>

                  <Card className="text-center p-4">
                    <div className="mx-auto my-2 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                      <Book className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold">Bookworm</h4>
                    <p className="text-sm text-muted-foreground">Read 50+ lessons</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Email Notifications</h4>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Course updates</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            On
                          </Button>
                          <Button variant="ghost" size="sm">
                            Off
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New subjects available</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            On
                          </Button>
                          <Button variant="ghost" size="sm">
                            Off
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Privacy</h4>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show my progress to others</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            On
                          </Button>
                          <Button variant="outline" size="sm">
                            Off
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button className="mt-4">Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

    </main>
  )
}

