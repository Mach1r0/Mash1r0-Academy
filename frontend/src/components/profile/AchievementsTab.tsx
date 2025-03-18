import { Card } from "@/components/ui/card"
import { GraduationCap, Book } from "lucide-react"

export default function AchievementsTab() {
  return (
    <>
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
    </>
  )
}