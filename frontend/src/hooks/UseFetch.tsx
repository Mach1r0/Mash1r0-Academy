import axios from 'axios';

export interface Questions { 
    id: number; 
    question: string; 
    options: string[]; 
    answer: string; 
    explanation: string; 
} 

export interface QuestionsResponse {
    ok: boolean;
    questions: Questions[];
    error?: string;
}

export interface ThemesResponse {
    ok: boolean;
    name: string[];
    description: string;
    error?: string;
}

export async function fetchThemes() {
    try { 
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
        if (!apiUrl) {
            throw new Error("API URL is not defined in the environment variables.");
        }
        const response = await axios.get(`${apiUrl}/theme`);
        return response.data as ThemesResponse;
    }
    catch (error) {
        console.error("Error fetching themes:", error);
        throw error;
    }
}

export async function fetchQuestions() {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/questions`;
        if (!apiUrl) {
            throw new Error("API URL is not defined in the environment variables.");
        }
        const response = await axios.get(`${apiUrl}/questions`);
        return response.data as QuestionsResponse;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}


export async function fetchThemeBySlug(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const response = await axios.get(`${baseUrl}/theme/?slug=${slug}`);
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching theme details:", error);
    throw error;
  }
}

export async function fetchQuestionsByTheme(themeId: string | undefined) {
  if (!themeId || themeId === 'undefined') {
    console.error("Theme ID is undefined or null");
    return { results: [] };
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    console.log("Chamando API com themeId:", themeId);
    console.log("URL completa:", `${baseUrl}/api/questions/by-theme/${themeId}/`);
    
    const response = await axios.get(`${baseUrl}/api/questions/by-theme/${themeId}/`);
    console.log("Response from fetchQuestionsByTheme:", response.data);
    
    if (response.data && Array.isArray(response.data.results)) {
      return response.data;
    } else if (Array.isArray(response.data)) {
      return { results: response.data };
    } else {
      return { results: [] };
    }
  } catch (error) {
    console.error(`Error fetching theme questions for theme ID ${themeId}:`, error);
    return { results: [] };
  }
}

export async function fetchQuestionsBySubtheme(subthemeId: string | undefined) {

  if (!subthemeId || subthemeId === 'undefined') {
    console.error("Subtheme ID is undefined or null");
    return { results: [] };
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    console.log("Chamando API com subthemeId:", subthemeId);
    console.log("URL completa:", `${baseUrl}/api/questions/by-subtheme/${subthemeId}/`);
    
    const response = await axios.get(`${baseUrl}/api/questions/by-subtheme/${subthemeId}/`);
    console.log("Response from fetchQuestionsBySubtheme:", response.data);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching subtheme questions for subtheme ID ${subthemeId}:`, error);
    return { results: [] };
  }
}

export async function fetchSubThemesByTheme(themeId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const response = await axios.get(`${apiUrl}theme/${themeId}/subthemes/`);
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching subthemes:", error);
    throw error;
  }
}

export async function fetchStudentResponses() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const response = await axios.get(`${baseUrl}/studentresponse/`) 
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching student responses:", error)
    return [];
  }
}

export async function saveStudentResponse(data: {
  student: number;
  question: number;
  response: string;
  booleaniscorrect?: boolean;
}) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    
    const response = await axios.post(`${baseUrl}/studentresponse/`, data, { headers });
    console.log("Resposta salva com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving student response:", error);
    throw error;
  }
}

export async function updateStudentResponse(id: number, data: {
  response: string;
  booleaniscorrect?: boolean;
}) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await axios.patch(`${baseUrl}/studentresponse/${id}/`, data);
    console.log("Resposta atualizada com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating student response:", error);
    throw error;
  }
}

// Função para verificar se uma resposta já existe
export async function checkStudentResponse(studentId: number, questionId: number) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await axios.get(`${baseUrl}/studentresponse/?student=${studentId}&question=${questionId}`);
    return response.data.results && response.data.results.length > 0 ? response.data.results[0] : null;
  } catch (error) {
    console.error("Error checking student response:", error);
    return null;
  }
}

export async function saveMultipleStudentResponses(responses: Array<{
  student: number;
  question: number;
  response: string;
  booleaniscorrect?: boolean;
}>) {
  console.log("Iniciando salvamento de múltiplas respostas:", responses);
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    console.log("Headers para autenticação:", headers);
    
    const savedResponses = await Promise.all(
      responses.map(async (response, index) => {
        console.log(`Processando resposta ${index + 1}/${responses.length} para questão ${response.question}`);
        
        try {
          const existingResponse = await checkStudentResponse(response.student, response.question);
          console.log(`Questão ${response.question}: ${existingResponse ? 'atualizar existente' : 'criar nova'}`);
          
          if (existingResponse) {
            const updated = await updateStudentResponse(existingResponse.id, {
              response: response.response,
              booleaniscorrect: response.booleaniscorrect
            });
            console.log(`Resposta atualizada com sucesso para questão ${response.question}`);
            return updated;
          } else {
            const created = await saveStudentResponse(response);
            console.log(`Nova resposta criada com sucesso para questão ${response.question}`);
            return created;
          }
        } catch (err) {
          console.error(`Erro ao salvar resposta para questão ${response.question}:`, err);
          return null;
        }
      })
    );
    
    const successfulResponses = savedResponses.filter(response => response !== null);
    console.log(`${successfulResponses.length}/${responses.length} respostas salvas com sucesso`);
    
    return successfulResponses;
  } catch (error) {
    console.error("Erro geral ao salvar múltiplas respostas:", error);
    throw error;
  }
}

export async function fetchAnsweredQuestions(studentId: number, QuestionId: number) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await axios.get(  `${baseUrl}/api/student-response/question-marked/?student_id=${studentId}&question_id=${QuestionId}`);
    return response.data.results && response.data.results.length > 0 ? response.data.results[0] : null;
  } catch (error) {
    console.error("Error fetching student mark:", error);
    return null;
  }
}