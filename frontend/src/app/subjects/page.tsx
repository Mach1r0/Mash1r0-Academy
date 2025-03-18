'use client';
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/navbar/index'
import Footer from '@/components/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Calculator, Code, Globe } from "lucide-react"
import { fetchThemes } from '@/hooks/UseFetch'

interface Theme {
  id: number;
  name: string;
  description: string;
  created?: string;
  modified?: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Theme[];
}

export default function CoursesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getThemes = async () => {
      try {
        setLoading(true);
        const response = await fetchThemes();
        
        const fetchedThemes = (response as PaginatedResponse).results || [];
        
        setThemes(fetchedThemes);
        console.log("Themes loaded:", fetchedThemes);
      } catch (err) {
        console.error("Error fetching themes:", err);
        setError("Failed to load themes");
      } finally {
        setLoading(false);
      }
    };
    
    getThemes();
  }, []);
  
  const getThemeIcon = (theme: Theme) => {
    const iconMap: Record<string, JSX.Element> = {
      "Mathematics": <Calculator className="h-6 w-6" />,
      "Programming": <Code className="h-6 w-6" />,
      "Science": <Brain className="h-6 w-6" />,
      "Languages": <Globe className="h-6 w-6" />,
      "Data Structures & Algorithms": <Code className="h-6 w-6" />,
    };
    return iconMap[theme.name] || <BookOpen className="h-6 w-6" />;
  };
  
  const getThemeColor = (theme: Theme) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-pink-500", "bg-yellow-500", "bg-indigo-500"
    ];
    
    return colors[theme.id % colors.length] || "bg-slate-500";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Choose the course you want to learn</h2>
          
          {loading && <p>Loading courses...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {themes.length > 0 ? (
                themes.map((theme) => (
                  <Card key={theme.id} className="hover:shadow-lg transition-shadow"> 
                    <CardHeader>
                      <div className={`${getThemeColor(theme)} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4`}>
                        {getThemeIcon(theme)}
                      </div>
                      <CardTitle>{theme.name}</CardTitle>
                      <CardDescription>{theme.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Study</Button>
                    </CardFooter>
                  </Card> 
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">No courses available</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}