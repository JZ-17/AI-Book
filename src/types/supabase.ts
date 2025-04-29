export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            name: string | null;
            avatar_url: string | null;
            created_at: string;
          };
          Insert: {
            id: string;
            email: string;
            name?: string | null;
            avatar_url?: string | null;
            created_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            name?: string | null;
            avatar_url?: string | null;
            created_at?: string;
          };
        };
        book_sessions: {
          Row: {
            id: string;
            user_id: string;
            created_at: string;
            last_accessed: string;
            progress: number;
          };
          Insert: {
            id?: string;
            user_id: string;
            created_at?: string;
            last_accessed?: string;
            progress?: number;
          };
          Update: {
            id?: string;
            user_id?: string;
            created_at?: string;
            last_accessed?: string;
            progress?: number;
          };
        };
        book_entries: {
          Row: {
            id: string;
            temp_id: string | null;
            session_id: string;
            prompt: string;
            user_response: string | null;
            ai_response: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            temp_id?: string | null;
            session_id: string;
            prompt: string;
            user_response?: string | null;
            ai_response?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            temp_id?: string | null;
            session_id?: string;
            prompt?: string;
            user_response?: string | null;
            ai_response?: string | null;
            created_at?: string;
            updated_at?: string;
          };
        };
      };
    };
  }