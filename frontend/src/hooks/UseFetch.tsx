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
    
    console.log("Fetching theme with slug:", slug);
    
    try {
      const directResponse = await axios.get(`${baseUrl}/theme/${encodeURIComponent(slug)}/`);
      console.log("Direct theme lookup response:", directResponse.data);
      
      if (directResponse.data && directResponse.data.id) {
        return directResponse.data;
      }
    } catch (directError) {
      console.log("Direct lookup failed, trying filter approach:", directError);
    }
    
    const response = await axios.get(`${baseUrl}/theme/?slug=${encodeURIComponent(slug)}`);
    console.log("Theme API filter response:", response.data);
    
    if (response.data.results && response.data.results.length > 0) {
      const exactMatch = response.data.results.find((theme: any) => theme.slug === slug);
      if (exactMatch) {
        console.log("Found exact theme match:", exactMatch);
        return exactMatch;
      }
      
      console.log("Warning: No exact match found, returning first result:", response.data.results[0]);
      return response.data.results[0];
    }
    
    if (response.data && response.data.id && response.data.slug === slug) {
      console.log("Theme returned directly:", response.data);
      return response.data;
    }
    
    console.error("No theme found with slug:", slug);
    return null;
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
    
    // First, try to get subtheme details to get the name
    let subthemeName = "";
    try {
      const subthemeResponse = await axios.get(`${baseUrl}/subtheme/${subthemeId}`);
      if (subthemeResponse.data && subthemeResponse.data.name) {
        subthemeName = subthemeResponse.data.name;
        console.log("Subtheme name:", subthemeName);
      }
    } catch (subthemeErr) {
      console.warn("Could not fetch subtheme details:", subthemeErr);
    }
    
    console.log("URL completa:", `${baseUrl}/api/questions/by-subtheme/${subthemeId}/`);
    const response = await axios.get(`${baseUrl}/api/questions/by-subtheme/${subthemeId}/`);
    console.log("Response from fetchQuestionsBySubtheme:", response.data);
    
    // Add subtheme_name to each question in the results
    let results = [];
    if (response.data && response.data.results) {
      results = response.data.results.map((question: any) => ({
        ...question,
        subtheme_name: subthemeName || `Subtema ${subthemeId}`
      }));
    } else if (Array.isArray(response.data)) {
      results = response.data.map((question: any) => ({
        ...question,
        subtheme_name: subthemeName || `Subtema ${subthemeId}`
      }));
    }
    
    return { results, subtheme_name: subthemeName || `Subtema ${subthemeId}` };
  } catch (error) {
    console.error(`Error fetching subtheme questions for subtheme ID ${subthemeId}:`, error);
    return { results: [], subtheme_name: `Subtema ${subthemeId}` };
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

export async function fetchAnsweredQuestions(studentId: number): Promise<number[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await axios.get(
      `${baseUrl}/api/student-response/answered-questions`,
      { 
        params: { student_id: studentId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    console.log("Answered questions response:", response.data);
    
    if (response.data && Array.isArray(response.data.answered_question_ids)) {
      return response.data.answered_question_ids;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching student answered questions:", error);
    return [];
  }
}

export async function saveMultipleResponses(
  studentId: number,
  responses: Array<{
    question_id: number;
    response: string;
    is_correct: boolean;
  }>
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const response = await axios.post(
      `${baseUrl}/api/student-response/save-multiple/`, 
      {
        student_id: studentId,
        responses: responses
      },
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar múltiplas respostas:", error);
    throw error;
  }
}

export async function fetchAllSubthemeQuestions(themeId: string) {
  if (!themeId || themeId === 'undefined') {
    console.error("Theme ID is undefined or null");
    return {};
  }
  
  try {
    // First, get the theme with its subthemes
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    console.log("Fetching theme details for ID:", themeId);
    
    // First try to get the theme using the main API endpoint
    let themeData = null;
    try {
      const response = await axios.get(`${baseUrl}/theme/${themeId}`);
      themeData = response.data;
    } catch (themeError) {
      console.warn("Could not fetch theme directly, trying alternative endpoint:", themeError);
      
      // Try to fetch all themes and find the one with the matching ID
      const allThemesResponse = await axios.get(`${baseUrl}/theme/`);
      if (allThemesResponse.data && allThemesResponse.data.results) {
        themeData = allThemesResponse.data.results.find((t: any) => t.id.toString() === themeId);
      }
      
      if (!themeData) {
        console.error("Could not find theme with ID:", themeId);
        return {};
      }
    }
    
    console.log("Theme data retrieved:", themeData);
    
    if (!themeData || !themeData.subthemes || !Array.isArray(themeData.subthemes)) {
      console.error("No subthemes found for theme:", themeId);
      return {};
    }
    
    const subthemes = themeData.subthemes;
    console.log(`Found ${subthemes.length} subthemes for theme ${themeId}:`, subthemes);
    
    // Create object to store questions by subtheme
    const questionsBySubtheme: { [key: number]: any[] } = {};
    
    // Fetch questions for each subtheme in parallel
    await Promise.all(
      subthemes.map(async (subtheme: any) => {
        try {
          console.log(`Fetching questions for subtheme ${subtheme.id}: ${subtheme.name}`);
          const response = await axios.get(`${baseUrl}/api/questions/by-subtheme/${subtheme.id}/`);
          
          const questions = response.data.results || response.data || [];
          console.log(`Got ${questions.length} questions for subtheme ${subtheme.id}`);
          
          questionsBySubtheme[subtheme.id] = questions;
        } catch (err) {
          console.error(`Error fetching questions for subtheme ${subtheme.id}:`, err);
          questionsBySubtheme[subtheme.id] = [];
        }
      })
    );
    
    return questionsBySubtheme;
  } catch (error) {
    console.error(`Error fetching all subtheme questions for theme ${themeId}:`, error);
    return {};
  }
}

export async function checkQuestionMarked(studentId: number, questionId: number): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await axios.get(`${baseUrl}/api/student-response/question-marked/`, {
      params: { 
        student_id: studentId, 
        question_id: questionId 
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data && response.data.marked === true;
  } catch (error) {
    console.error(`Error checking if question ${questionId} is marked for student ${studentId}:`, error);
    return false;
  }
}

export async function fetchThemeWithDetails(slug: string) {
  if (!slug) {
    console.error("Theme slug is undefined or empty");
    return null;
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    console.log("Fetching detailed theme data for slug:", slug);
    
    // First try to get the theme by slug
    try {
      const directResponse = await axios.get(`${baseUrl}/theme`, {
        params: { slug: slug }
      });
      
      console.log("Theme API response:", directResponse.data);
      
      // Handle different response structures
      let themeData = null;
      if (directResponse.data.results && directResponse.data.results.length > 0) {
        // Find the theme with matching slug
        themeData = directResponse.data.results.find((theme: any) => 
          theme.slug === slug
        );
        
        if (!themeData) {
          // If no exact match, get the first result
          themeData = directResponse.data.results[0];
          console.warn("No exact slug match found, using first result:", themeData);
        }
      } else if (directResponse.data && directResponse.data.id) {
        // Theme returned directly
        themeData = directResponse.data;
      }
      
      if (!themeData) {
        console.error("No theme found with slug:", slug);
        return null;
      }
      
      // Initialize container for all questions from all sources
      const allQuestions: any[] = [];
      const questionsBySubtheme: { [key: number]: any[] } = {};

      // Make sure subthemes array exists
      if (!themeData.subthemes) {
        themeData.subthemes = [];
      }
      
      console.log(`Theme has ${themeData.subthemes.length} subthemes:`, 
        themeData.subthemes.map((st: any) => `${st.id}: ${st.name}`).join(', ')
      );
      
      // First, fetch questions for each subtheme individually
      await Promise.all(
        themeData.subthemes.map(async (subtheme: any) => {
          try {
            console.log(`Fetching questions for subtheme ${subtheme.id}: ${subtheme.name}`);
            const subthemeResponse = await axios.get(
              `${baseUrl}/api/questions/by-subtheme/${subtheme.id}/`
            );
            
            let subthemeQuestions = [];
            if (subthemeResponse.data.results) {
              subthemeQuestions = subthemeResponse.data.results;
            } else if (Array.isArray(subthemeResponse.data)) {
              subthemeQuestions = subthemeResponse.data;
            }
            
            // Add subtheme name to each question
            subthemeQuestions = subthemeQuestions.map((q: any) => ({
              ...q,
              subtheme_name: subtheme.name
            }));
            
            console.log(`Found ${subthemeQuestions.length} questions for subtheme ${subtheme.id}`);
            
            // Add to collective arrays
            questionsBySubtheme[subtheme.id] = subthemeQuestions;
            allQuestions.push(...subthemeQuestions);
          } catch (err) {
            console.error(`Error fetching questions for subtheme ${subtheme.id}:`, err);
            questionsBySubtheme[subtheme.id] = [];
          }
        })
      );
      
      // If no questions were found using subthemes, fallback to fetching all theme questions
      if (allQuestions.length === 0) {
        console.log("No questions found via subthemes, fetching all theme questions");
        try {
          const questionsResponse = await axios.get(
            `${baseUrl}/api/questions/by-theme/${themeData.id}/`
          );
          
          const themeQuestions = questionsResponse.data.results || 
                          (Array.isArray(questionsResponse.data) ? questionsResponse.data : []);
          
          console.log(`Found ${themeQuestions.length} questions for theme ${themeData.id}`);
          
          // Group questions by subtheme
          themeQuestions.forEach((question: any) => {
            const subthemeId = question.subtheme || 0;
            if (!questionsBySubtheme[subthemeId]) {
              questionsBySubtheme[subthemeId] = [];
            }
            
            // Find subtheme name if available
            const subtheme = themeData.subthemes.find((st: any) => st.id === subthemeId);
            const subthemeName = subtheme ? subtheme.name : `Subtema ${subthemeId}`;
            
            // Add subtheme name to question
            const questionWithSubtheme = {
              ...question,
              subtheme_name: subthemeName
            };
            
            questionsBySubtheme[subthemeId].push(questionWithSubtheme);
          });
          
          // Update all questions with this data
          allQuestions.push(...themeQuestions);
        } catch (error) {
          console.error("Error fetching theme questions:", error);
        }
      }
      
      console.log("Final organization of questions:");
      console.log(`- Total questions: ${allQuestions.length}`);
      Object.entries(questionsBySubtheme).forEach(([subthemeId, questions]) => {
        console.log(`- Subtheme ${subthemeId}: ${questions.length} questions`);
      });
      
      // Make sure all questions have subtheme names
      allQuestions.forEach(q => {
        if (!q.subtheme_name) {
          const subthemeId = q.subtheme;
          const matchingSubtheme = themeData.subthemes.find((s: any) => s.id === subthemeId);
          q.subtheme_name = matchingSubtheme ? matchingSubtheme.name : `Subtema ${subthemeId}`;
        }
      });

      // Make sure each subtheme's questions are correctly identified
      Object.keys(questionsBySubtheme).forEach(subthemeKey => {
        const subthemeId = parseInt(subthemeKey, 10);
        const matchingSubtheme = themeData.subthemes.find((s: any) => s.id === subthemeId);
        const subthemeName = matchingSubtheme ? matchingSubtheme.name : `Subtema ${subthemeId}`;
        
        questionsBySubtheme[subthemeId].forEach(q => {
          q.subtheme_name = subthemeName;
        });
      });
      
      // Return combined data
      return {
        ...themeData,
        allQuestions,
        questionsBySubtheme
      };
    } catch (error) {
      console.error("Error fetching theme by slug:", error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching theme with details:", error);
    return null;
  }
}