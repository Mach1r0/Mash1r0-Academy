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
  saveMultipleStudentResponses
} from "@/hooks/UseFetch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/auth/Context" // Assume que você tem um hook de autenticação

// Interface para a estrutura da questão
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
  const { token } = useAuth() // Use o token do contexto de autenticação em vez do localStorage
  
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

export default function QuestionsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const subjectSlug = params.subjectsname as string
  const subthemeId = searchParams.get('subtheme')
  const questionId = searchParams.get('question')
  const [theme, setTheme] = useState<any | null>(null)
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
  const { user, token } = useAuth() // Use o token do contexto de autenticação
  const [submitting, setSubmitting] = useState(false)

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
          
          const specificQuestion = allQuestions.find(q => q.id.toString() === questionId)
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

  // Carregar resposta atual quando mudar de questão
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionId = questions[currentQuestionIndex]?.id
      setCurrentAnswer(userAnswers[currentQuestionId] || "")
    }
  }, [currentQuestionIndex, questions, userAnswers])

  // Timer para contagem regressiva
  useEffect(() => {
    if (quizFinished || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, quizFinished])

  // Funções auxiliares
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveCurrentAnswer()
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentAnswer()
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const saveCurrentAnswer = async () => {
    if (!user || !token) { // Verifique tanto o usuário quanto o token
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar respostas",
        variant: "destructive"
      })
      return
    }
    
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return
    
    const answer = currentAnswer 
    if (!answer || !answer.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, forneça uma resposta antes de salvar",
        variant: "destructive"
      })
      return
    }
    
    try {
      setSubmitting(true)
      
      // Salvar resposta no estado local primeiro
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }))
      
      // Verificar se é uma resposta correta
      const isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase()
      
      // Verificar se já existe uma resposta para esta questão
      if (!token) {
        toast({
          title: "Erro",
          description: "Problemas com seus dados de estudante. Por favor, contate o suporte.",
          variant: "destructive"
        })
        return null
      }
      
      const existingResponse = await checkStudentResponse(user.student_id, currentQuestion.id)
      
      let result
      if (existingResponse) {
        // Atualizar resposta existente
        result = await updateStudentResponse(existingResponse.id, {
          response: answer,
          booleaniscorrect: isCorrect
        })
      } else {
        // Criar nova resposta
        result = await saveStudentResponse({
          student: user.student_id,
          question: currentQuestion.id,
          response: answer,
          booleaniscorrect: isCorrect
        })
      }
      
      // Atualizar estado para mostrar que foi salvo
      setSavedStatus(prev => ({
        ...prev,
        [currentQuestion.id]: true
      }))
      
      toast({
        title: "Resposta salva",
        description: "Sua resposta foi salva com sucesso",
        variant: "default"
      })
      
      return result
    } catch (error) {
      console.error("Erro ao salvar resposta:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar sua resposta. Tente novamente.",
        variant: "destructive"
      })
      return null
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectQuestion = (index: number) => {
    saveCurrentAnswer()
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
    
    await saveCurrentAnswer()
    
    try {
      setSubmitting(true)
      
      // Preparar todas as respostas para envio
      const responsesToSave = Object.entries(userAnswers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === parseInt(questionId))
        const isCorrect = question ? answer.toLowerCase() === question.answer.toLowerCase() : false
        
        return {
          student: user.student_id,
          question: parseInt(questionId),
          response: answer,
          booleaniscorrect: isCorrect
        }
      })
      
      console.log("Todas as respostas do usuário:", userAnswers);
      console.log("Respostas formatadas para envio:", responsesToSave);
      
      // Filtrar apenas respostas que têm conteúdo
      const validResponses = responsesToSave.filter(r => r.response && r.response.trim() !== "")
      console.log("Respostas válidas a serem enviadas:", validResponses);
      
      if (validResponses.length === 0) {
        toast({
          title: "Nenhuma resposta",
          description: "Você não forneceu nenhuma resposta para enviar",
          variant: "destructive"
        })
        return
      }
      
      // Enviar respostas para o backend
      const result = await saveMultipleStudentResponses(validResponses)
      console.log("Resultado do envio das respostas:", result);
    
      toast({
        title: "Quiz finalizado",
        description: `${result.length} respostas foram salvas com sucesso`,
        variant: "default"
      })
      
      // Marcar o quiz como finalizado
      setQuizFinished(true)
      
      // Opcionalmente, redirecionar após alguns segundos
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
    // Verificar se já estamos nessa questão
    if (questions[currentQuestionIndex]?.id === questionId) {
      return; // Não faça nada se já estamos na questão selecionada
    }
    
    // Salvar a resposta atual antes de navegar
    saveCurrentAnswer();
    
    // Encontrar o índice da questão no array local
    const index = questions.findIndex((q) => q.id === questionId);
    if (index !== -1) {
      // Se a questão estiver no array atual, apenas atualize o índice
      setCurrentQuestionIndex(index);
    } else {
      // Se a questão não estiver no array atual, redirecione para ela
      // Construir a URL com base no contexto atual
      let url = `/subjects/${params.subjectsname}/questions?question=${questionId}`;
      
      // Se estamos em um subtema específico, mantenha esse contexto
      if (subthemeId) {
        url += `&subtheme=${subthemeId}`;
      }
      
      // Redirecionar para a nova URL
      router.push(url);
    }
  };

  // Estados computados
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
                <Button size="sm" className="gap-1" onClick={saveCurrentAnswer} disabled={currentAnswer.trim() === ""}>
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
