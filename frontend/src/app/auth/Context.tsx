'use client'; 
import React, { createContext, useContext, useState, useEffect } from 'react'; 
import Cookies from 'js-cookie'; 
import { useRouter } from 'next/navigation';

export interface User {
    id: number; 
    name: string; 
    email: string; 
    username: string; 
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    signIn: (username: string, password: string) => Promise<{ok: boolean; error?: string}>;
    signUp: (name: string, username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    error: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); 
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const cookieToken = Cookies.get('token');
  
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else if (cookieToken) {
        setToken(cookieToken);
        localStorage.setItem('token', cookieToken);
      }
  
      setIsReady(true);
    }, []);

    const signIn = async (username: string, password: string): Promise<{ok: boolean; error?: string}> => {
        const data = {username, password};
    
        try {
            const response = await fetch("http://localhost:8000/api/user/login/", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.json(); 

            if(!response.ok) {
                console.error("Error while logging in");
                setError(result.detail || "Login failed")
                return { ok: false, error: result.detail || "login failed"}
            }
            localStorage.setItem("token", result.token); 
            localStorage.setItem("user", JSON.stringify(result.user))
            setToken(result.token);
            setUser(result.user);
            router.push("/");
            return { ok: true }; 
    }catch(error) {
        console.error("loggin error", error);
        setError("An error occured while loggin in"); 
        return { ok: false, error: "An error occured while loggin in" }
   }
}; 
    
const signUp = async (name: string, username: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
        
        const data = { name, username, email, password }; 
        
        try{
            const response = await fetch("http://localhost:8000/api/user/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(response.ok) {
                return { ok: true }; 
            } else {
                const result = await response.json();
                return { ok: false, error: result.error }; 
            }
        }catch(error) {
            return { ok: false, error: "An error occurred while signing up" }; 
        }
    };
    
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null); 
    router.push('/'); 
}; 
    
    return (
        <AuthContext.Provider value={{ user, token, signIn, signUp, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
  
export { AuthContext, AuthProvider };