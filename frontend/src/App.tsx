import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Users, BarChart } from "lucide-react"

export default function StudyPlatform() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">StudyPro</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-sm font-medium hover:underline">
              Features
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              About
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              Contact
            </a>
          </nav>
          <Button>Sign Up</Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Learn Smarter, Not Harder</h1>
            <p className="text-xl mb-8">Boost your study efficiency with our AI-powered learning platform</p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose StudyPro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2" />
                  <CardTitle>Personalized Learning Paths</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Tailored study plans based on your goals and learning style.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2" />
                  <CardTitle>Collaborative Study Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Connect with peers and learn together in virtual study rooms.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart className="h-8 w-8 mb-2" />
                  <CardTitle>Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Visualize your learning progress and identify areas for improvement.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Thousands of Successful Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold text-purple-600">10k+</p>
                <p className="text-xl">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">500+</p>
                <p className="text-xl">Courses</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">95%</p>
                <p className="text-xl">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-8">Sign up now and get a 7-day free trial</p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
              <Input placeholder="Enter your email" className="max-w-xs" />
              <Button size="lg">Start Free Trial</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">StudyPro</h3>
              <p className="text-sm">Empowering learners worldwide</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">© 2024 StudyPro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

