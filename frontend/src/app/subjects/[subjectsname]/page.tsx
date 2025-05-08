"use client"
import { useEffect, useState } from "react"
import { CheckCircle, Code, FileText, PenTool, ListChecks, ArrowRight, BookOpen, FileQuestion } from "lucide-react"
import Link from "next/link"
import { 
  fetchThemeBySlug, 
  fetchQuestionsByTheme, 
  fetchAllSubthemeQuestions, 
  fetchAnsweredQuestions,
  fetchThemeWithDetails
} from "@/hooks/UseFetch"
import { useParams } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/app/auth/Context" 
 
interface Theme {
  id: number
  name: string
  description: string
  created?: string
  modified?: string
  questions_count: number
  slug: string
  subthemes_count: number
  subthemes: SubTheme[]
}

interface SubTheme {
  id: number
  name: string
  description: string
  theme_name: string
  created?: string
  modified?: string
  questions_count: number
  slug: string
}

interface Question {
  id: number
  title: string
  difficulty: string
  theme: number
  answer: string
  explanation: string
  subtheme: number
  theme_name: string
}

// Adicione  função para verificar se a questão foi respondida
const checkQuestionAnswered = async (studentId: number, questionId: number): Promise<boolean> => {
  try {
    console.log(`Verificando q uestão ${questionId} para estudante ${studentId}`);
    
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/student-response/question-marked/`,
      { 
        params: { student_id: studentId, question_id: questionId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    console.log(`Resposta para questão ${questionId}:`, response.data);
    return response.data.marked;
  } catch (error) {
    console.error(`Erro ao verificar questão ${questionId}:`, error);
    return false;
  }
}

// Add a wrapper component that includes the key prop
export default function CourseDetailWrapper() {
  const params = useParams()
  const subjectId = params.subjectsname as string
  
  // Using the subjectId as key will force a complete re-render when it changes
  return <CourseDetail key={subjectId} />
}

// The original component is now renamed and accepts no props
function CourseDetail() {
  const params = useParams()
  const subjectId = params.subjectsname as string

  const [theme, setTheme] = useState<Theme | null>(null)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [questionsBySubtheme, setQuestionsBySubtheme] = useState<{ [key: number]: Question[] }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedQuestions, setCompletedQuestions] = useState(0)
  const { user } = useAuth()
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({})
  const [themeId, setThemeId] = useState<string | null>(null)
  const [expandedSubthemes, setExpandedSubthemes] = useState<Record<number, boolean>>({})

  // Reset all state when component unmounts or subjectId changes
  useEffect(() => {
    return () => {
      setTheme(null)
      setAllQuestions([])
      setQuestionsBySubtheme({})
      setLoading(true)
      setError(null)
      setCompletedQuestions(0)
      setAnsweredQuestions({})
      setThemeId(null)
      setExpandedSubthemes({})
    }
  }, [subjectId])

  useEffect(() => {
    const loadThemeData = async () => {
      try {
        // Reset state when theme changes
        setTheme(null)
        setAllQuestions([])
        setQuestionsBySubtheme({})
        setThemeId(null)
        setLoading(true)
        
        console.log("Carregando tema com slug:", subjectId);
        
        // Use the comprehensive fetch function that gets theme, questions and organizes by subtheme
        const completeThemeData = await fetchThemeWithDetails(subjectId);
        console.log("Tema e questões carregados:", completeThemeData);
        
        if (!completeThemeData) {
          console.error("Tema não encontrado para slug:", subjectId);
          setError("Tema não encontrado")
          return
        }
        
        // Set theme data
        setTheme(completeThemeData)
        
        // Set theme ID for additional data loading if needed
        if (completeThemeData.id) {
          console.log("Definindo themeId:", completeThemeData.id.toString());
          setThemeId(completeThemeData.id.toString())
        } else {
          console.error("Tema carregado não possui ID:", completeThemeData);
          setError("Tema sem ID válido")
          return
        }
        
        // Set all questions and organized by subtheme
        if (completeThemeData.allQuestions) {
          console.log(`Setting ${completeThemeData.allQuestions.length} total questions`);
          setAllQuestions(completeThemeData.allQuestions);
        }
        
        if (completeThemeData.questionsBySubtheme) {
          console.log("Questions by subtheme received from API:");
          Object.entries(completeThemeData.questionsBySubtheme).forEach(([subthemeId, questions]) => {
            console.log(`- Subtheme ${subthemeId}: ${Array.isArray(questions) ? questions.length : 0} questions`);
          });
          
          setQuestionsBySubtheme(completeThemeData.questionsBySubtheme);
        } else {
          console.warn("No questionsBySubtheme data received");
        }
        
        // Update completion status if user is logged in
        if (user && user.student_id && completeThemeData.allQuestions?.length > 0) {
          try {
            const answeredIds = await fetchAnsweredQuestions(user.student_id);
            const completedCount = answeredIds.filter((id: number) => 
              completeThemeData.allQuestions.some((q: Question) => q.id === id)
            ).length;
            setCompletedQuestions(completedCount);
          } catch (err) {
            console.error("Erro ao calcular questões completadas:", err);
            setCompletedQuestions(0);
          }
        }
        
      } catch (err) {
        console.error("Error fetching theme:", err)
        setError("Failed to load course data")
      } finally {
        setLoading(false)
      }
    }

    if (subjectId) {
      loadThemeData()
    }
  }, [subjectId, user as any])

  useEffect(() => {
    const loadAnsweredStatus = async () => {
      console.log("Executando loadAnsweredStatus", { user, questionsCount: allQuestions.length });
      
      if (!user) {
        console.log("Usuário não está logado");
        return;
      }
      
      console.log("Dados do usuário:", user);
      
      if (!user.student_id) {
        console.log("Usuário não tem ID de estudante");
        return;
      }
      
      if (!allQuestions || allQuestions.length === 0) {
        console.log("Nenhuma questão carregada");
        return;
      }
      
      try {
        // Buscar todos os IDs de questões respondidas de uma vez
        const answeredIds = await fetchAnsweredQuestions(user.student_id);
        console.log("IDs de questões respondidas:", answeredIds);
        
        // Criar o mapa de questões respondidas
        const answeredMap: Record<number, boolean> = {};
        allQuestions.forEach(question => {
          const isAnswered = answeredIds.includes(question.id);
          answeredMap[question.id] = isAnswered;
          console.log(`Questão ${question.id}: ${isAnswered ? "Respondida" : "Não respondida"}`);
        });
        
        console.log("Mapa final de respostas:", answeredMap);
        setAnsweredQuestions(answeredMap);
      } catch (error) {
        console.error("Erro ao carregar status de respostas:", error);
      }
    };
    
    loadAnsweredStatus();
  }, [user, allQuestions]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando curso...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!theme) return <div className="min-h-screen flex items-center justify-center">Curso não encontrado</div>

  const getSubthemeQuestions = (subthemeId: number) => {
    console.log(`Getting questions for subtheme ${subthemeId}`);
    console.log(`Available subthemes: ${Object.keys(questionsBySubtheme).join(', ')}`);
    
    const questions = questionsBySubtheme[subthemeId] || [];
    console.log(`Found ${questions.length} questions for subtheme ${subthemeId}`);
    
    return questions;
  }

  const toggleExpandSubtheme = (subthemeId: number) => {
    setExpandedSubthemes(prev => ({
      ...prev,
      [subthemeId]: !prev[subthemeId]
    }));
  }

  const progressPercentage =
    theme.questions_count > 0 ? Math.round((completedQuestions / theme.questions_count) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <span>{completedQuestions} questões resolvidas</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{progressPercentage}% concluído</p>
              </div>

              <div className="mt-6">
                <Link href={`/subjects/${theme.slug}/questions`}>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center">
                    <PenTool className="h-5 w-5 mr-2" />
                    Praticar Todas as Questões
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-2xl font-bold mb-4">Questões por Tópico</h3>
              <p className="text-gray-600 mb-4">
                Escolha um tópico abaixo para praticar questões específicas ou use o botão ao lado para praticar todas
                as questões.
              </p>
            </div>

            {theme.subthemes &&
              theme.subthemes.map((subtheme) => {
                console.log(`Rendering subtheme ${subtheme.id}: ${subtheme.name}`);
                const subthemeQuestions = getSubthemeQuestions(subtheme.id);
                console.log(`Subtheme ${subtheme.id} has ${subthemeQuestions.length} questions`);

                return (
                  <div key={subtheme.id} className="mb-6 bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-medium">{subtheme.name}</h4>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{subthemeQuestions.length} questões</span>
                        <Link href={`/subjects/${theme.slug}/questions?subtheme=${subtheme.id}`}>
                          <button className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded flex items-center">
                            Praticar <ArrowRight className="h-4 w-4 ml-1" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="divide-y">
                      {subthemeQuestions.length > 0 ? (
                        subthemeQuestions
                          .slice(0, expandedSubthemes[subtheme.id] ? subthemeQuestions.length : 3)
                          .map((question) => (
                          <div key={question.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                              <span className="text-gray-600">{question.title}</span>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  question.difficulty === "EASY"
                                    ? "bg-green-100 text-green-700"
                                    : question.difficulty === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                } mr-3`}
                              >
                                {question.difficulty === "EASY"
                                  ? "Fácil"
                                  : question.difficulty === "MEDIUM"
                                    ? "Médio"
                                    : "Difícil"}
                              </span>
                              <Link href={`/subjects/${theme.slug}/questions?question=${question.id}`}>
                                <button 
                                  className={`${
                                    answeredQuestions[question.id] 
                                      ? "text-green-500 hover:text-green-700" 
                                      : "text-blue-500 hover:text-blue-700"
                                  } text-sm font-medium`}
                                >
                                  {answeredQuestions[question.id] ? "Respondido" : "Resolver"}
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma questão disponível para este tópico.
                        </div>
                      )}

                      {subthemeQuestions.length > 3 && (
                        <div className="p-4 text-center">
                          <button 
                            onClick={() => toggleExpandSubtheme(subtheme.id)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            {expandedSubthemes[subtheme.id] 
                              ? "Mostrar menos" 
                              : `Ver mais ${subthemeQuestions.length - 3} questões`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </main>
    </div>
  )
}
