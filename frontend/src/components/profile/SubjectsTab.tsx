import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"


export default function SubjectsTab() {
  return (
    <>
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
    </>
  )
}