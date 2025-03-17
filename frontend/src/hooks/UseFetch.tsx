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

export async function fetchQuestions() {
    try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/questions`;
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

export async function 