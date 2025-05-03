'use client';

// Imports 
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { generateBookContent } from "@/lib/gpt";
import { usePersistence } from "@/hooks/usePersistence";
import BookCover from "./BookCover";
import BookPage from "./BookPage";
import SavingIndicator from "./SavingIndicator";
import { BookEntry } from "@/types";
import { useToast } from "./ui/toast";

export default function BookClient() {
  // Authentication and session management
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(0);
  const [bookContent, setBookContent] = useState<BookEntry[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [authorImage, setAuthorImage] = useState("/default-author-image.png");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Persistence and saving management
  const {
    isSaving,
    lastSaveTime,
    saveEntry,
    createSession,
    updateSessionAccess,
  } = usePersistence();

  // Start on the cover page
  useEffect(() => {
    if (session?.user?.id) {
      loadUserSession();
      setAuthorImage("/default-author-image.png");
      setCurrentPage(0);
    }
  }, [session]);

  // A BUNCHHHHHH of random quotes
  const quotesPool = [
    `"This book changed my life!" — Albert Einstein`,
    `"I owe all my success to these exercises." — Oprah Winfrey`,
    `"The wisdom within these pages is timeless." — William Shakespeare`,
    `"An essential guide to personal greatness." — Leonardo da Vinci`,
    `"I would not be who I am without it." — Marie Curie`,
    `"An eternal source of inspiration." — Maya Angelou`,
    `"The secret to all my success." — Benjamin Franklin`,
    `"A masterpiece for the soul." — Socrates`,
    `"It spoke directly to my spirit." — Frida Kahlo`,
    `"Truly transformative!" — Nikola Tesla`,
    `"Straight to the point! Wish it! Want it! Do it" — Brian Griffin`,
    `"The book of the century!" — David Stern`,
    `"I gave Josh Zhang a 100 for this book!" — Deborah Thompson`,
    `"When the student has become the master. He truly understands what a book is" — Oana Capatina`,
    `"Inspirational for the ages" — Maria Dabija`,
    `"Even Big Baller Brand's CEO, LaVar Ball, would be impressed!" — LaVar Ball`,
    `"A must-read for anyone on a journey of self-discovery." — Carl Jung`,
    `"This book is a treasure trove of wisdom." — Socrates`,
    `"A guide to unlocking your true potential." — Aristotle`,
    `"The pages of this book are filled with magic." — J.K. Rowling`,
    `"A beacon of light in the darkness." — Helen Keller`,
    `"This book is a gift to humanity." — Mahatma Gandhi`,
    `"A journey worth taking." — Mark Twain`,
    `"The ultimate guide to self-improvement." — Tony Robbins`,
    `"A roadmap to success and happiness." — Zig Ziglar`,
    `"This book is a masterpiece." — Vincent van Gogh`,
  ];

  // Retrieve random quotes, and also randomize colors, and font variation (bold, ital, neither or both)
  const getRandomQuotes = () => {
    const colors = ['text-gold', 'text-medieval-blue', 'text-medieval-red'];
    const fonts = ['', 'italic', 'font-bold', 'italic font-bold'];

    const shuffled = [...quotesPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    return selected.map(q => ({
      text: q,
      style: `${colors[Math.floor(Math.random() * colors.length)]} ${fonts[Math.floor(Math.random() * fonts.length)]}`,
    }));
  };

  // Load user session and book content (Had to use GPT to debug this a lottttt)
  const loadUserSession = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { data: existingSession, error } = await supabase
        .from('book_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('last_accessed', { ascending: false })
        .limit(1);
    
      if (error) throw error;
    
      if (existingSession && existingSession.length > 0) {
        const latestSession = existingSession[0];
        setCurrentSessionId(latestSession.id);
    
        const { data: entries, error: entriesError } = await supabase
          .from('book_entries')
          .select('*')
          .eq('session_id', latestSession.id)
          .order('created_at', { ascending: true });
    
        if (entriesError) throw entriesError;
    
        if (entries && entries.length > 0) {
          const processedEntries = entries.map((entry: any) => ({
            id: entry.id,
            sessionId: entry.session_id,
            prompt: entry.prompt,
            userResponse: entry.user_response || "",
            aiResponse: entry.ai_response || "",
            createdAt: entry.created_at,
            updatedAt: entry.updated_at,
            randomQuotes: entry.random_quotes ?? [],
          }));
  
          setBookContent(processedEntries as BookEntry[]);
          
          // Don't set the current page - we want to start at cover
          // Just load the data for when user clicks "Continue"
          
          await updateSessionAccess(latestSession.id);
        } else {
          // No entries found, but don't initialize yet
          // Wait for user to click "Start"
        }
      } else {
        // No session found, but don't initialize yet
        // Wait for user to click "Start"
      }
    } catch (error) {
      console.error("Error loading user session:", error);
      toast({
        title: "Error",
        description: "Could not load your progress. Please try again.",
        variant: "error",
      });
    }
    
    setIsLoading(false);
  };

  // Start a new book session and entry for new user
  const initializeNewBook = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);

    try {
      const newSession = await createSession({ user_id: session.user.id });

      if (!newSession) {
        throw new Error("Failed to create new session");
      }

      setCurrentSessionId(newSession.id);

      const introContent = await generateBookContent(
        "Generate an inspiring introduction for a personalized self-help book that will guide the user through a journey of self-improvement. Make it grand and slightly exaggerated.",
        [{ role: "user", content: "I'm ready to begin my self-improvement journey. What should I know first?" }]
      );

      const newEntry = await saveEntry({
        sessionId: newSession.id,
        prompt: "Welcome to your Personal Journey Book. This is not just another self-help guide - this is a living text that will grow and evolve with you. As you engage with these pages, you'll discover personalized insights and guidance crafted specifically for your needs. Each chapter builds upon your previous reflections, creating a unique narrative that honors your individual path. To begin, I'd like to understand what brings you here today. What area of your life are you most seeking to improve or understand better? Whether it's finding purpose, building better habits, nurturing relationships, or something else entirely - your journey starts with this first honest reflection. Remember, there are no wrong answers here. This is your story, and I'm here to help you write it. What would you like to explore first?",
        userResponse: "",
        aiResponse: introContent,
        randomQuotes: getRandomQuotes(),
      });

      if (newEntry) {
        setBookContent([newEntry as BookEntry]);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error initializing new book:", error);
    }

    setIsLoading(false);
  };

  // Open book to most recent page if old book, else start a new book
  const handleOpen = async () => {
    if (bookContent.length === 0) {
      // No existing content, start new book
      await initializeNewBook();
    } else {
      // Existing content, find where to continue
      const firstIncompleteIndex = bookContent.findIndex(entry => !entry.userResponse?.trim());
      const targetPage = firstIncompleteIndex !== -1 ? firstIncompleteIndex + 1 : bookContent.length;
      
      setCurrentPage(targetPage);
      if (targetPage > 0 && targetPage <= bookContent.length) {
        setUserResponse(bookContent[targetPage - 1]?.userResponse || "");
      }
    }
  };

  // Handle user response and generate AI response
  const handleUserResponse = async () => {
    if (!userResponse.trim() || !currentSessionId) return;

    setIsLoading(true);

    try {
      const currentEntry = { ...bookContent[currentPage - 1] };
      const updatedContent = [...bookContent];

      updatedContent[currentPage - 1] = {
        ...currentEntry,
        userResponse,
      } as BookEntry;
      setBookContent(updatedContent);

      const messages = bookContent.slice(0, currentPage).map(entry => [
        { role: "user", content: entry.prompt },
        { role: "assistant", content: entry.aiResponse || "" },
        { role: "user", content: entry.userResponse || "" }
      ]).flat();

      messages.push({ role: "user", content: currentEntry.prompt });
      messages.push({ role: "user", content: userResponse });

      const aiResponse = await generateBookContent(
        "Respond to the user's input with personalized advice. Be encouraging but not too helpful.",
        messages
      );

      updatedContent[currentPage - 1] = {
        ...updatedContent[currentPage - 1],
        aiResponse,
      } as BookEntry;
      setBookContent(updatedContent);

      await saveEntry({
        id: currentEntry.id,
        sessionId: currentSessionId,
        prompt: currentEntry.prompt,
        userResponse,
        aiResponse,
        randomQuotes: currentEntry.randomQuotes,
      });

    } catch (error) {
      console.error("Error handling user response:", error);
    }

    setIsLoading(false);
    setUserResponse("");
  };

  // Generate next prompt based on current book content
  const handleNextPrompt = async () => {
    if (!currentSessionId) return;

    setIsLoading(true);

    try {
      const messages = bookContent.map(entry => [
        { role: "user", content: entry.prompt },
        { role: "assistant", content: entry.aiResponse || "" },
        { role: "user", content: entry.userResponse || "" }
      ]).flat();

      const nextPrompt = await generateBookContent(
        "Based on our conversation so far, generate the next question or prompt for the user's self-improvement journey.",
        messages
      );

      const newEntry = await saveEntry({
        sessionId: currentSessionId,
        prompt: nextPrompt,
        userResponse: "",
        aiResponse: "",
        randomQuotes: getRandomQuotes(),
      });

      if (newEntry) {
        setBookContent([...bookContent, newEntry as BookEntry]);
        setCurrentPage(bookContent.length + 1);
      }
    } catch (error) {
      console.error("Error generating next prompt:", error);
    }

    setIsLoading(false);
  };

  const flipPage = async (direction: 'prev' | 'next') => {
    if (!currentSessionId) return;

    if (direction === 'next' && currentPage < bookContent.length) {
      setCurrentPage(currentPage + 1);
      setUserResponse(bookContent[currentPage]?.userResponse || "");
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setUserResponse(bookContent[currentPage - 2]?.userResponse || "");
    }
  };

  // Function to return to cover page
  const handleReturnToCover = () => {
    setCurrentPage(0);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-cinzel text-red-900">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-8 w-8 text-red-900" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading your personalized book...
          </div>
        </div>
      </div>
    );
  }

  // When starting home page to sign in
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-amber-50 bg-[url('/paper-texture.png')] bg-cover">
        <h1 className="font-cinzel text-5xl text-red-900 mb-8">Odyssey of Dreams</h1>
        <p className="text-xl mb-8 font-eb-garamond">Sign in to begin your journey</p>
        <button 
          onClick={() => signIn("google")}
          className="bg-red-900 text-white font-cinzel px-6 py-3 rounded hover:bg-red-800"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="flex justify-between items-center mb-8 bg-red-900 text-white p-4 rounded shadow-lg">
        <h2 className="font-cinzel text-2xl">Welcome, {session?.user?.name}</h2>
        <button
          onClick={() => signOut()}
          className="bg-white text-red-900 font-cinzel px-4 py-2 rounded hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-[800px] min-h-[600px] bg-amber-50 shadow-2xl relative overflow-hidden rounded">
          {currentPage === 0 ? (
            <BookCover 
              authorImage={authorImage}
              userName={session?.user?.name || "Anonymous"}
              onOpen={handleOpen}
              hasExistingContent={bookContent.length > 0}
            />
          ) : (
            <BookPage
              content={bookContent[currentPage - 1]}
              currentPage={currentPage}
              totalPages={bookContent.length}
              userResponse={userResponse}
              setUserResponse={setUserResponse}
              onSubmitResponse={handleUserResponse}
              onNextPrompt={handleNextPrompt}
              onFlipPage={flipPage}
              onReturnToCover={handleReturnToCover}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <SavingIndicator isSaving={isSaving} lastSaveTime={lastSaveTime} offlineEntryCount={0} />
    </div>
  );
}

