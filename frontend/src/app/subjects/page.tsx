import React from 'react'
import Navbar from '@/components/navbar/index'
import Footer from '@/components/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Calculator, Code, Globe } from "lucide-react"

const courses = [ 
  {
    title: 'Course 1', 
    description: "This is the description of course 1",
    image: '/public/file.svg',
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-blue-500"
  }, 
  {
    title: 'Course 2', 
    description: "This is the description of course 2",
    image: '/public/file.svg',
    icon: <Calculator className="h-8 w-8" />,
    color: "bg-green-500"
  },
  {
    title: 'Course 3', 
    description: "This is the description of course 3",
    image: '/public/file.svg',
    icon: <Brain className="h-8 w-8" />,
    color: "bg-purple-500"
  }
]

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Choose the course you want to learn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {courses.map((course) => (
              <Card key={course.title} className="hover:shadow-lg transition-shadow"> 
                <CardHeader>
                  <div
                    className={`${course.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4`}>
                    {course.icon}
                  </div>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full">Study</Button>
                </CardFooter>
              </Card> 
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}