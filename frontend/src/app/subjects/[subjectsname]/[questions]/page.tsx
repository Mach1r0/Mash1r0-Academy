"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Flag, CheckCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { fetchQuestionsByTheme, fetchQuestionsBySubtheme, fetchThemeBySlug } from "@/hooks/UseFetch"
import { 
  saveStudentResponse,
  updateStudentResponse,
  checkStudentResponse,
  saveMultipleStudentResponses, 
  saveMultipleResponses
} from "@/hooks/UseFetch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/auth/Context" 

interface Question {
  id: number
  title: string
  difficulty: string
  theme: number
  answer: string
  explanation: string
  subtheme: number
  theme_name: string
  subtheme_name:string 
}

interface QuestionNavigatorProps {
  themeId: string
  currentQuestionId: number
  onQuestionSelect: (questionId: number) => void
  answeredQuestions: number[]
  flaggedQuestions: number[]
}

export function QuestionNavigator({
  themeId,
  currentQuestionId,
  onQuestionSelect,
  answeredQuestions = [],
  flaggedQuestions = []
}: QuestionNavigatorProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const subthemeId = searchParams.get('subtheme')
  const { token } = useAuth() 
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        
        let data
        if (subthemeId) {
          console.log("Navigator: Carregando questões por subtema", subthemeId)
          data = await fetchQuestionsBySubtheme(subthemeId)
        } else {
          console.log("Navigator: Carregando questões por tema", themeId)
          data = await fetchQuestionsByTheme(themeId)
        }
        
        const questionsData = data.results || data || []
        console.log("Navigator: Questões carregadas", questionsData)
        setQuestions(questionsData)
      } catch (error) {
        console.error("Navigator: Erro ao carregar questões:", error)
        setQuestions([]) 
      } finally {
        setLoading(false)
      }
    }

    if (themeId) {
      loadQuestions()
    }
  }, [themeId, subthemeId])

  if (loading) {
    return <div className="flex justify-center p-4">Carregando navegador de questões...</div>
  }

  if (questions.length === 0) {
    return <div className="flex justify-center p-4">Nenhuma questão encontrada para navegação</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Navegador de Questões
          {subthemeId && <span className="text-sm font-normal ml-2">(Subtema)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isCurrentQuestion = question.id === currentQuestionId
            const isAnswered = answeredQuestions.includes(question.id)
            const isFlagged = flaggedQuestions.includes(question.id)

            return (
              <Button
                key={question.id}
                variant={isCurrentQuestion ? "default" : "outline"}
                size="sm"
                onClick={() => onQuestionSelect(question.id)}
                className={`relative ${
                  isAnswered ? "bg-green-100 hover:bg-green-200 border-green-200" : ""
                } ${isFlagged ? "bg-amber-100 hover:bg-amber-200 border-amber-200" : ""}`}
              >
                {index + 1}
                {isAnswered && (
                  <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                )}
                {isFlagged && (
                  <Flag className="absolute -top-1 -right-1 h-3 w-3 text-amber-600" />
                )}
              </Button>
            )
          })}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Respondida</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Atual</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <span>Marcada</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span>Não respondida</span>
          </div>
        </div>
        
        {subthemeId && questions.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Mostrando {questions.length} questões do subtema
              <span className="font-medium ml-1">
                {questions[0]?.subtheme_name || `ID: ${subthemeId}`}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SubTheme {
  id: number;
  name: string;
  description?: string;
  theme_name?: string;
  questions_count?: number;
  slug?: string;
}

export default function QuestionsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const subjectSlug = params.subjectsname as string
  const subthemeId = searchParams.get('subtheme')
  const questionId = searchParams.get('question')
  const [theme, setTheme] = useState<{
    id: number;
    name: string;
    description?: string;
    subthemes?: SubTheme[];
  } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(1800) 
  const [quizFinished, setQuizFinished] = useState(false)
  const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({})
  const [themeId, setThemeId] = useState<string | null>(null)
  const router = useRouter(); 
  const { toast } = useToast()
  const { user, token } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [subthemeName, setSubthemeName] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        console.log("Carregando tema com slug:", subjectSlug);
        const themeData = await fetchThemeBySlug(subjectSlug)
        setTheme(themeData)
        
        if (!themeData || !themeData.id) {
          setError("Tema não encontrado")
          return
        }
        
        console.log("Definindo themeId:", themeData.id.toString())
        setThemeId(themeData.id.toString()) 
        
        let questionData: Question[] = []
        
        if (questionId) {
          console.log("Carregando questão específica:", questionId);
          const allQuestionsData = await fetchQuestionsByTheme(themeData.id.toString())
          const allQuestions = allQuestionsData.results || []
          
          const specificQuestion = allQuestions.find((q: Question) => q.id.toString() === questionId)
          if (specificQuestion) {
            questionData = [specificQuestion] 
            
            setCurrentQuestionIndex(0)
          } else {
            questionData = allQuestions
            console.log("Questão específica não encontrada. Carregando todas as questões.")
          }
        } else if (subthemeId) {
          console.log("Carregando questões do subtema:", subthemeId);
          const data = await fetchQuestionsBySubtheme(subthemeId)
          questionData = data.results || []
          
          if (data.subtheme_name) {
            setSubthemeName(data.subtheme_name)
          } else if (questionData.length > 0 && questionData[0].subtheme_name) {
            setSubthemeName(questionData[0].subtheme_name)
          } else {
            try {
              const subthemes = theme?.subthemes || []
              const matchingSubtheme = subthemes.find((st: SubTheme) => st.id.toString() === subthemeId)
              if (matchingSubtheme) {
                setSubthemeName(matchingSubtheme.name)
              } else {
                setSubthemeName(`Subtema ${subthemeId}`)
              }
            } catch (err) {
              console.error("Error fetching subtheme name:", err)
              setSubthemeName(`Subtema ${subthemeId}`)
            }
          }
        } else {
          console.log("Carregando todas as questões do tema:", themeData.id);
          const data = await fetchQuestionsByTheme(themeData.id.toString())
          questionData = data.results || []
        }
        
        console.log("Questões carregadas:", questionData);
        setQuestions(questionData)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Falha ao carregar questões")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [subjectSlug, subthemeId, questionId])

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionId = questions[currentQuestionIndex]?.id
      setCurrentAnswer(userAnswers[currentQuestionId] || "")
    }
  }, [currentQuestionIndex, questions, userAnswers])

  useEffect(() => {
    if (quizFinished || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, quizFinished])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveCurrentAnswer(false)
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentAnswer(false)
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const saveCurrentAnswer = async (silent = false) => {
    if (!user || !token) {
      if (!silent) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para salvar respostas",
          variant: "destructive"
        })
      }
      return null
    }
    
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return null
    
    const answer = currentAnswer 
    if (!answer || !answer.trim()) {
      if (!silent) {
        toast({
          title: "Resposta vazia",
          description: "Por favor, forneça uma resposta antes de salvar",
          variant: "destructive"
        })
      }
      return null
    }
    
    try {
      if (!silent) setSubmitting(true)
      
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }))
      
      const isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase()
      
      if (!token) {
        if (!silent) {
          toast({
            title: "Erro",
            description: "Problemas com seus dados de estudante. Por favor, contate o suporte.",
            variant: "destructive"
          })
        }
        return null
      }
      
      const existingResponse = await checkStudentResponse(
        user.student_id || 0, 
        currentQuestion.id || 0
      )
      
      let result
      if (existingResponse) {
        result = await updateStudentResponse(existingResponse.id, {
          response: answer,
          booleaniscorrect: isCorrect
        })
      } else {
        result = await saveStudentResponse({
          student: user.student_id || 0,
          question: currentQuestion.id,
          response: answer,
          booleaniscorrect: isCorrect
        })
      }
      
      setSavedStatus(prev => ({
        ...prev,
        [currentQuestion.id]: true
      }))
      
      if (!silent) {
        toast({
          title: "Resposta salva",
          description: "Sua resposta foi salva com sucesso",
          variant: "default"
        })
      }
      
      return result
    } catch (error) {
      console.error("Erro ao salvar resposta:", error)
      if (!silent) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar sua resposta. Tente novamente.",
          variant: "destructive"
        })
      }
      return null
    } finally {
      if (!silent) setSubmitting(false)
    }
  }

  const handleSelectQuestion = (index: number) => {
    saveCurrentAnswer(false)
    setCurrentQuestionIndex(index)
  }

  const handleFinishQuiz = async () => {
    if (!user || !user.student_id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado como estudante para finalizar o quiz",
        variant: "destructive"
      })
      return
    }
    
    try {
      setSubmitting(true)
      
      // First save the current answer and wait for it to complete
      const currentQuestion = questions[currentQuestionIndex]
      if (currentQuestion && currentAnswer.trim() !== "") {
        // Update userAnswers immediately for the current question to ensure it's included
        setUserAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: currentAnswer
        }))
        
        // Then save it to the server
        await saveCurrentAnswer(true)
      }
      
      // After current answer is saved, get updated userAnswers state
      const updatedUserAnswers = {
        ...userAnswers,
        // Include current answer again to be extra safe (in case state update hasn't propagated)
        ...(currentQuestion && currentAnswer.trim() !== "" ? { [currentQuestion.id]: currentAnswer } : {})
      }
      
      // Formato adaptado para o novo endpoint
      const formattedResponses = Object.entries(updatedUserAnswers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === parseInt(questionId))
        const isCorrect = question ? answer.toLowerCase() === question.answer.toLowerCase() : false
        
        return {
          question_id: parseInt(questionId),
          response: answer,
          is_correct: isCorrect
        }
      })
      
      console.log("Todas as respostas do usuário:", updatedUserAnswers);
      console.log("Respostas formatadas para o novo endpoint:", formattedResponses);
      
      // Filtrar apenas respostas não vazias
      const validResponses = formattedResponses.filter(r => r.response && r.response.trim() !== "")
      
      if (validResponses.length === 0) {
        toast({
          title: "Nenhuma resposta",
          description: "Você não forneceu nenhuma resposta para enviar",
          variant: "destructive"
        })
        return
      }
      
      const result = await saveMultipleResponses(user.student_id, validResponses)
      console.log("Resultado do envio com o novo endpoint:", result);
      
      const successCount = result.created + (result.updated || 0);
      
      toast({
        title: "Quiz finalizado",
        description: `${successCount} respostas foram salvas com sucesso`,
        variant: "default"
      })
      
      setQuizFinished(true)
      
      setTimeout(() => {
        router.push(`/subjects/${subjectSlug}`)
      }, 3000)
      
    } catch (error) {
      console.error("Erro ao finalizar quiz:", error)
      toast({
        title: "Erro",
        description: "Não foi possível finalizar o quiz. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuestionNavigation = (questionId: number) => {
    if (questions[currentQuestionIndex]?.id === questionId) {
      return;
    }
    
    saveCurrentAnswer(false);
    
    const index = questions.findIndex((q) => q.id === questionId);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
    } else {
      let url = `/subjects/${params.subjectsname}/questions?question=${questionId}`;
      
      if (subthemeId) {
        url += `&subtheme=${subthemeId}`;
      }
      
      router.push(url);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || ({} as Question)
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isSaved = savedStatus[currentQuestion.id] || false

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando questões...</div>
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  if (questions.length === 0)
    return <div className="flex items-center justify-center h-screen">Nenhuma questão disponível</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{currentQuestion.theme_name}</h1>
        <p className="text-muted-foreground">Questões sobre {currentQuestion.theme_name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Questão {currentQuestionIndex + 1} de {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)} restantes</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-muted-foreground">
                  <p>
                    Dificuldade:{" "}
                    {currentQuestion.difficulty === "EASY"
                      ? "Fácil"
                      : currentQuestion.difficulty === "MEDIUM"
                        ? "Médio"
                        : "Difícil"}
                  </p>
                </div>

                {/* Área para resposta discursiva */}
                <div className="space-y-2">
                  <label htmlFor="answer" className="text-sm font-medium">
                    Sua resposta:
                  </label>
                  <Textarea
                    id="answer"
                    placeholder="Digite sua resposta aqui..."
                    className="min-h-[200px] resize-y"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    disabled={quizFinished}
                  />
                </div>

                {quizFinished && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border">
                      <h4 className="font-medium mb-2">Resposta esperada:</h4>
                      <p className="text-sm">{currentQuestion.answer}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border">
                      <h4 className="font-medium mb-2">Explicação:</h4>
                      <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" disabled={quizFinished}>
                  <Flag className="h-4 w-4" />
                  Marcar para revisão
                </Button>

                {isSaved && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Salvo
                  </span>
                )}
              </div>

              {!quizFinished ? (
                <Button size="sm" className="gap-1" onClick={() => saveCurrentAnswer(false)} disabled={currentAnswer.trim() === ""}>
                  <Save className="h-4 w-4" />
                  Salvar resposta
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={handleNext}
                  disabled={currentQuestionIndex >= questions.length - 1}
                >
                  Próxima questão
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" className="gap-1" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button className="gap-1" onClick={handleNext}>
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : !quizFinished ? (
              <Button className="gap-1" onClick={handleFinishQuiz}>
                Finalizar Quiz
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" className="gap-1" asChild>
                <Link href={`/subjects/${params.subjectsname}`}>Voltar para o Tema</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Informações do Quiz */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Tema</h4>
                <p className="text-sm text-muted-foreground">{currentQuestion.theme_name}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Limite de Tempo</h4>
                <p className="text-sm text-muted-foreground">30 minutos</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Questões</h4>
                <p className="text-sm text-muted-foreground">{questions.length} questões</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">SubThema</h4>
                <p className="text-sm text-muted-foreground">
                  {subthemeId && subthemeName ? subthemeName : currentQuestion.subtheme_name || "Questões Gerais"}
                </p>
              </div>
              <Separator />
              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/subjects/`}>Sair do Quiz</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {themeId && (
            <QuestionNavigator
              themeId={themeId} // Use o themeId do estado, não o params.subjectsname
              currentQuestionId={questions[currentQuestionIndex]?.id}
              onQuestionSelect={handleQuestionNavigation} // Use a nova função
              answeredQuestions={Object.keys(userAnswers).map(Number)}
              flaggedQuestions={[]} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
