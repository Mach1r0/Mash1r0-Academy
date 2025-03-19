import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Flag, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function QuestionsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Data Structures & Algorithms</h1>
        <p className="text-muted-foreground">Quiz 2: Binary Trees and Heaps</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <QuestionProgress />
          <CurrentQuestion />
          <QuestionNavigation />
        </div>

        <div className="space-y-6">
          <QuizInfo />
          <QuestionList />
        </div>
      </div>
    </div>
  )
}

function QuestionProgress() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Question 3 of 10</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>15:42 remaining</span>
        </div>
      </div>
      <Progress value={30} className="h-2" />
    </div>
  )
}

function CurrentQuestion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">What is the maximum number of nodes in a binary tree of height h?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-muted-foreground">
            <p>Select the correct formula for the maximum number of nodes in a binary tree with height h.</p>
          </div>

          <RadioGroup defaultValue="option1">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1" className="flex-1 cursor-pointer">
                  2^h - 1
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2" className="flex-1 cursor-pointer">
                  2^(h+1) - 1
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50">
                <RadioGroupItem value="option3" id="option3" />
                <Label htmlFor="option3" className="flex-1 cursor-pointer">
                  2^h
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50">
                <RadioGroupItem value="option4" id="option4" />
                <Label htmlFor="option4" className="flex-1 cursor-pointer">
                  h^2
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <Flag className="h-4 w-4" />
          Flag for review
        </Button>
        <Button size="sm" className="gap-1">
          <CheckCircle className="h-4 w-4" />
          Submit answer
        </Button>
      </CardFooter>
    </Card>
  )
}

function QuestionNavigation() {
  return (
    <div className="flex justify-between">
      <Button variant="outline" className="gap-1">
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button className="gap-1">
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function QuizInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-1">Time Limit</h4>
          <p className="text-sm text-muted-foreground">30 minutes</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Attempts</h4>
          <p className="text-sm text-muted-foreground">1 of 2 used</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Points</h4>
          <p className="text-sm text-muted-foreground">10 points possible</p>
        </div>
        <Separator />
        <div className="pt-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/subjects/cs101">Exit Quiz</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function QuestionList() {
  const questions = [
    { id: 1, status: "completed" },
    { id: 2, status: "completed" },
    { id: 3, status: "current" },
    { id: 4, status: "unattempted" },
    { id: 5, status: "flagged" },
    { id: 6, status: "unattempted" },
    { id: 7, status: "unattempted" },
    { id: 8, status: "unattempted" },
    { id: 9, status: "unattempted" },
    { id: 10, status: "unattempted" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Navigator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question) => (
            <Button
              key={question.id}
              variant={question.status === "current" ? "default" : "outline"}
              size="sm"
              className={`relative ${
                question.status === "completed" ? "bg-green-100 hover:bg-green-200 border-green-200" : ""
              } ${question.status === "flagged" ? "bg-amber-100 hover:bg-amber-200 border-amber-200" : ""}`}
            >
              {question.id}
              {question.status === "completed" && (
                <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
              )}
              {question.status === "flagged" && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-amber-600" />}
            </Button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span>Unattempted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

