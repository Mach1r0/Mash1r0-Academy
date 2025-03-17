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
import { useAuth } from '@/app/auth/Context'

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
  
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return 
    }

    try { 
      const response = await signUp(name, username, email, password)
      if(response.ok){
        router.push('/sign-in')
      } else {
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
        
        const errorMsg = response.error || "";
        
        if (errorMsg.toLowerCase().includes('email')) {
            setEmailError(errorMsg);
        } 
        else if (errorMsg.toLowerCase().includes('username')) {
            setUsernameError(errorMsg);
        }
        else if (errorMsg.toLowerCase().includes('password')) {
            setPasswordError(errorMsg);
        }
        else {
            setError(errorMsg);
        }
      }
    } catch (error) {
      console.error(error)
      setError('Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle> Create a account </CardTitle>
          <CardDescription> Enter your details to sign up </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
                {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
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
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
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
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
          
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}