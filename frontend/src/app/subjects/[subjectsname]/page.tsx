'use client'
import { useEffect, useState } from "react"
import { CheckCircle, Code, FileText, PenTool, ListChecks, FileQuestion } from "lucide-react"
import Link from "next/link"
import { fetchThemeBySlug } from "@/hooks/UseFetch"
import { useParams } from "next/navigation"

interface Theme {
    id: number;
    name: string;
    description: string;
    created?: string;
    modified?: string;
    questions_count: number;
    slug: string;
    subthemes_count: number;
}

interface SubTheme {
  id: number;
  name: string;
  description: string;
  theme_name: string;
  created?: string;
  modified?: string;
  questions_count: number;
  slug: string;
}

interface Question { 
    id: number; 
    question: string; 
    options: string[]; 
    answer: string; 
    explanation: string; 
}

export default function CourseDetail() {
  const params = useParams();
  const subjectId = params.subjectsname as string;
  
  const [theme, setTheme] = useState<Theme | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadThemeData = async () => {
      try {
        setLoading(true);
        const themeData = await fetchThemeBySlug(subjectId);
        setTheme(themeData);
        
        console.log("Theme loaded:", themeData);
      } catch (err) {
        console.error("Error fetching theme:", err);
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };
    
    if (subjectId) {
      loadThemeData();
    }
  }, [subjectId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando curso...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!theme) return <div className="min-h-screen flex items-center justify-center">Curso não encontrado</div>;

  return (
    <div className="min-h-screen bg-white">
      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/subjects" className="text-gray-500 hover:text-black mr-2">
            Cursos
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <span className="font-medium">{theme.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white p-4 rounded-full mr-4">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{theme.name}</h2>
                  <p className="text-gray-500">{theme.description}</p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center text-gray-600">
                  <ListChecks className="h-5 w-5 mr-2" />
                  <span>{theme.questions_count} questões no total</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>{theme.subthemes_count} módulos</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>20 questões resolvidas</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">45% concluído</p>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-6">Conteúdo do curso</h3>

            <div className="mb-6 border rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                    1
                  </span>
                  <h4 className="font-medium"> {theme.name}</h4>
                </div>
              </div>

              <div className="divide-y">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Definição de {theme.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

              </div>
            </div>


            <div className="mt-8 flex justify-center">
              <Link href={'/subjects/'}>
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg flex items-center">
                <PenTool className="h-5 w-5 mr-2" />
                Continuar Estudando
              </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}