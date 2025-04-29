import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import { v4 as uuidv4 } from 'uuid';
import { BookEntry } from '@/types';
import { useSession } from "next-auth/react";

//
interface SaveEntryParams {
  id?: string;
  sessionId: string;
  prompt: string;
  userResponse: string;
  aiResponse?: string;
  randomQuotes?: { text: string; style: string }[];
}

interface SaveSessionParams {
  user_id: string;
}

export const usePersistence = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const createSession = async ({ user_id }: SaveSessionParams) => {
    if (!user_id) {
      console.error("No user_id provided to createSession");
      return null;
    }
    setIsSaving(true);
    try {
      const sessionId = uuidv4();
      const { data, error } = await supabase
        .from('book_sessions')
        .insert([{
          id: sessionId,
          user_id: user_id,
          created_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
          progress: 0,
        }])
        .select();
      if (error) throw error;
      setLastSaveTime(new Date());
      return data[0];
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const saveEntry = async ({ id, sessionId, prompt, userResponse, aiResponse = '', randomQuotes }: SaveEntryParams) => {
    if (!sessionId || !prompt) return null;
    setIsSaving(true);

    try {
      if (id) {
        // Try updating an existing entry
        const { data, error } = await supabase
          .from('book_entries')
          .update({
            user_response: userResponse,
            ai_response: aiResponse,
            random_quotes: randomQuotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select();

        if (error) throw error;
        setLastSaveTime(new Date());
        return data[0] as BookEntry;
      } else {
        // Insert a new entry
        const entryId = uuidv4();
        const { data, error } = await supabase
          .from('book_entries')
          .insert([{
            id: entryId,
            session_id: sessionId,
            prompt,
            user_response: userResponse,
            ai_response: aiResponse,
            random_quotes: randomQuotes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select();
        
        if (error) throw error;
        setLastSaveTime(new Date());
        return data[0] as BookEntry;
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: 'Error',
        description: 'Could not save your response. Please try again.',
        variant: 'error',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateSessionAccess = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const { error } = await supabase
        .from('book_sessions')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', sessionId);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to update session access time:', error);
    }
  };

  return {
    isSaving,
    lastSaveTime,
    saveEntry,
    createSession,
    updateSessionAccess,
  };
};
