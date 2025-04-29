import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import OpenAI from 'openai';

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log("API route called");
    
    // Authentication check
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to use this API" },
        { status: 401 }
      );
    }
    
    // Get request body
    const { prompt, messages } = await req.json();
    console.log("Received prompt:", prompt);
    console.log("Received messages:", messages);
    
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }
    
    // GPT System Prompt for the interactive book experience
    const systemPrompt = `
    You are a personalized interactive book that guides users on their journey of self-improvement and personal growth. Your responses should be written in an elegant, slightly formal style with occasional bold emphasis on key points.

    IMPORTANT FORMATTING:
    - For emphasis, use **bold text** which will be randomly colored in red or blue when displayed to the user
    - Begin key sections of your response with a visually distinctive first letter that will be displayed as larger and italicized
    - Never mention AI, artificial intelligence, or that you are an AI assistant - present yourself as "the book" or "these pages"
    - Use a warm, encouraging tone that balances wisdom with practical guidance
    - Keep responses concise but meaningful (2-4 paragraphs)
    - Occasionally use metaphors related to journeys, paths, or personal growth

    CONTENT GUIDELINES:
    - Provide personalized insights based on the user's specific situation and previous responses
    - Ask thoughtful follow-up questions to encourage deeper reflection
    - Offer concrete, actionable advice rather than vague platitudes
    - Balance encouragement with realistic expectations
    - When appropriate, organize advice into numbered points (maximum 5)
    - Avoid referring to specific public figures or celebrities
    - Never claim to have all the answers - encourage the user's own wisdom and intuition

    Begin each new session with a welcoming message that acknowledges the user's return to their personal journey, without using the word "Introduction" as a heading.

    Remember, your purpose is to guide without directing, inspire without preaching, and support without creating dependency.
    `;
    
    // Define type for message format
    type OpenAIMessage = {
      role: "system" | "user" | "assistant";
      content: string;
    };
    
    // Prepare messages for OpenAI
    const apiMessages: OpenAIMessage[] = [
      { role: "system", content: systemPrompt }
    ];
    
    // Add messages from client if they exist
    if (Array.isArray(messages) && messages.length > 0) {
      // Process each message to ensure it conforms to the expected types
      for (const msg of messages) {
        const role = msg.role === "user" || msg.role === "assistant" || msg.role === "system" 
          ? msg.role 
          : "user";
          
        apiMessages.push({
          role: role,
          content: typeof msg.content === 'string' ? msg.content : String(msg.content || "")
        });
      }
    } else if (prompt) {
      // Use prompt directly if no messages provided
      apiMessages.push({ role: "user", content: prompt });
    }
    
    console.log("Sending messages to OpenAI:", JSON.stringify(apiMessages));
    
    try {
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using 3.5 for wider availability
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      });
      
      console.log("OpenAI response received");
      
      return NextResponse.json({ 
        content: response.choices[0].message.content,
        usage: response.usage
      });
      
    } catch (openaiError: unknown) {
      console.error("OpenAI API error:", openaiError);
      
      if (openaiError instanceof Error) {
        return NextResponse.json(
          { 
            error: "OpenAI API error", 
            details: openaiError.message,
            stack: openaiError.stack
          },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { 
            error: "Unknown OpenAI error", 
            details: JSON.stringify(openaiError)
          },
          { status: 500 }
        );
      }
    }
    
  } catch (error: unknown) {
    console.error("General API error:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: "Route failed", 
        details: errorMessage
      },
      { status: 500 }
    );
  }
}