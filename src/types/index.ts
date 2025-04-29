// Contains all the types used in the app
export interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
  }
  
  export interface BookSession {
    id: string;
    userId: string;
    createdAt: string;
    lastAccessed: string;
    progress: number;
  }
  
  export interface BookEntry {
    id: string;
    tempId?: string;
    sessionId: string;
    prompt: string;
    userResponse: string;
    aiResponse: string;
    createdAt: string;
    updatedAt: string;
    randomQuotes?: { text: string; style: string }[];
  }
  
  export interface Message {
    role: "system" | "user" | "assistant";
    content: string;
  }
  