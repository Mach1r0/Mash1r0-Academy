import { CheckCircle, Code, FileText, PenTool, ListChecks, FileQuestion, Coins } from "lucide-react"
import Link from "next/link"

interface themes {
    id: number;
    name: string;
    description: string;
    created?: string;
    modified?: string;
} 

interface questions { 
    id: number; 
    question: string; 
    options: string[]; 
    answer: string; 
    explanation: string; 
}

export default function CourseDetail() {
    
  return (
    <div className="min-h-screen bg-white">


      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-black mr-2">
            Cursos
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <span className="font-medium">Data Structures & Algorithms</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white p-4 rounded-full mr-4">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Data Structures & Algorithms</h2>
                  <p className="text-gray-500">Fundamentos de programação</p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center text-gray-600">
                  <ListChecks className="h-5 w-5 mr-2" />
                  <span>45 questões no total</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>5 módulos</span>
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
                  <h4 className="font-medium">Introdução às Estruturas de Dados</h4>
                </div>
                <span className="text-sm text-gray-500">9 questões • 3 resolvidas</span>
              </div>

              <div className="divide-y">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Definição de Estruturas de Dados</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Classificação de Estruturas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Notação Big O</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Médio</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileQuestion className="h-5 w-5 text-blue-500 mr-3" />
                    <span>Análise de Complexidade</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Médio</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileQuestion className="h-5 w-5 text-blue-500 mr-3" />
                    <span>Comparação de Algoritmos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Médio</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 border rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                    2
                  </span>
                  <h4 className="font-medium">Arrays e Listas Encadeadas</h4>
                </div>
                <span className="text-sm text-gray-500">12 questões • 8 resolvidas</span>
              </div>

              <div className="divide-y">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Operações em Arrays</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Busca em Arrays</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Arrays Multidimensionais</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Médio</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileQuestion className="h-5 w-5 text-blue-500 mr-3" />
                    <span>Implementação de Lista Encadeada</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Difícil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileQuestion className="h-5 w-5 text-blue-500 mr-3" />
                    <span>Operações em Listas Encadeadas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Difícil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 border rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                    3
                  </span>
                  <h4 className="font-medium">Pilhas e Filas</h4>
                </div>
                <span className="text-sm text-gray-500">8 questões • 5 resolvidas</span>
              </div>

              <div className="divide-y">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Conceito de Pilhas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Operações em Pilhas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Médio</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Conceito de Filas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Fácil</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileQuestion className="h-5 w-5 text-blue-500 mr-3" />
                    <span>Implementação de Filas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Médio</span>
                    <PenTool className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg flex items-center">
                <PenTool className="h-5 w-5 mr-2" />
                Continuar Estudando
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

