"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/app/auth/Context"

export default function SignIn() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSingIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const result = await signIn(email, password);
      if (result && result.ok) {
        router.push('/')
      } else {
        setError("Invalid Credentials")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred during sign-in")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>Sign in to StudyQuest</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSingIn}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
            Forgot your password?
          </Link>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}