import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Calculator, Code, Globe } from "lucide-react"

interface Question {
  id: string;
  text: string;
  subject: string;
}

interface Subject {
  title: string;
  icon: React.ReactNode;
  description: string;
  questions: number;
}

const featuredQuestion: Question = {
  id: "q1",
  text: "What is the capital of France?",
  subject: "Geography",
}

const subjects: Subject[] = [
  {
    title: "Mathematics",
    icon: <Calculator className="w-8 h-8" />,
    description: "Master algebra, calculus, and geometry",
    questions: 245
  },
  {
    title: "Programming",
    icon: <Code className="w-8 h-8" />,
    description: "Learn algorithms and data structures",
    questions: 180
  },
  {
    title: "Geography",
    icon: <Globe className="w-8 h-8" />,
    description: "Explore countries and cultures",
    questions: 150
  },
  {
    title: "Literature",
    icon: <BookOpen className="w-8 h-8" />,
    description: "Analyze classic and modern works",
    questions: 95
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Master Your Subjects</h1>
          <p className="text-xl text-muted-foreground">
            Stay focused, keep learning, and master the system—one concept at a time!
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Question</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6" />
                {featuredQuestion.subject}
              </CardTitle>
              <CardDescription>Today's highlighted question</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{featuredQuestion.text}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/questions/${featuredQuestion.id}`}>View Answer</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Course Categories */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Explore Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {subject.icon}
                    {subject.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{subject.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {subject.questions} questions
                    </span>
                    <Button asChild variant="outline">
                      <Link href={`/subjects/${subject.title.toLowerCase()}`}>
                        Start Learning
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}