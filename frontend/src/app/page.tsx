import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Calculator, Code, Globe } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

type Subject = {
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

type Question = {
  id: string
  text: string
  subject: string
}

const subjects: Subject[] = [
  {
    name: "Math",
    description: "Algebra, Geometry, Calculus",
    icon: <Calculator className="h-8 w-8" />,
    color: "bg-blue-500",
  },
  {
    name: "Science",
    description: "Physics, Chemistry, Biology",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-green-500",
  },
  {
    name: "Literature",
    description: "Poetry, Prose, Drama",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-yellow-500",
  },
  {
    name: "Programming",
    description: "Python, JavaScript, Java",
    icon: <Code className="h-8 w-8" />,
    color: "bg-purple-500",
  },
]

const featuredQuestion: Question = {
  id: "q1",
  text: "What is the capital of France?",
  subject: "Geography",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Explore Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div
                    className={`${subject.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4`}
                  >
                    {subject.icon}
                  </div>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Featured Question</h2>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center space-x-2">
                  <Globe className="h-6 w-6" />
                  <span>{featuredQuestion.subject}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{featuredQuestion.text}</p>
              <Button>Answer Now</Button>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />

    </div>
  )
}

