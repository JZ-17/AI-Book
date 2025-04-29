// Updated BookPage.tsx with Garamond font and gold randomization
'use client';
import { BookEntry } from "@/types";
import { useState, useEffect } from "react";

interface BookPageProps {
  content: BookEntry;
  currentPage: number;
  totalPages: number;
  userResponse: string;
  setUserResponse: (value: string) => void;
  onSubmitResponse: () => void;
  onNextPrompt: () => void;
  onFlipPage: (direction: 'prev' | 'next') => void;
  onReturnToCover: () => void;
  isLoading: boolean;
}

export default function BookPage({
  content,
  currentPage,
  totalPages,
  userResponse,
  setUserResponse,
  onSubmitResponse,
  onNextPrompt,
  onFlipPage,
  onReturnToCover,
  isLoading
}: BookPageProps) {

  const [isPageTurning, setIsPageTurning] = useState(false);

  useEffect(() => {
    if (content && content.userResponse === "") {
      setUserResponse("");
    } else if (content && content.userResponse) {
      setUserResponse(content.userResponse);
    }
  }, [content, setUserResponse]);

  const handleFlipPage = (direction: 'prev' | 'next') => {
    setIsPageTurning(true);
    setTimeout(() => {
      onFlipPage(direction);
      setIsPageTurning(false);
    }, 300);
  };

  const formatAiResponse = (text: string) => {
    if (!text) return "";

    return text.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const colors = ["text-red-900", "text-blue-800", "text-yellow-700"];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      return `<span class="${colorClass} font-semibold">${content}</span>`;
    });
  };

  const hasUserResponded = content.userResponse && content.userResponse.trim() !== '';
  const hasAiResponded = content.aiResponse && content.aiResponse.trim() !== '';

  return (
    <div 
      className={`flex flex-col h-full p-8 bg-amber-50 bg-opacity-90 bg-[url('/paper-texture.png')] bg-cover transition-transform duration-300 ${
        isPageTurning ? 'scale-95 opacity-80' : ''
      }`}
    >
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleFlipPage('prev')}
            disabled={currentPage <= 1 || isLoading}
            className="bg-red-900 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed font-eb-garamond text-sm"
          >
            Previous Page
          </button>
          <button 
            onClick={onReturnToCover}
            className="bg-blue-900 text-white px-4 py-2 rounded font-eb-garamond text-sm"
          >
            Return to Cover
          </button>
        </div>
        <span className="font-eb-garamond text-lg">Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handleFlipPage('next')}
          disabled={currentPage >= totalPages || isLoading}
          className="bg-red-900 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed font-eb-garamond text-sm"
        >
          Next Page
        </button>
      </div>

      <div className="flex flex-1 bg-amber-50/80 rounded-lg shadow-inner">
        <div className="w-56 p-4 font-italianno text-[20px] text-medieval-red bg-amber-100 bg-opacity-70 border-r-4 border-amber-300 rounded-l-lg overflow-y-auto space-y-6">
          {content.randomQuotes?.map((quote, index) => (
            <div key={index} className={quote.style}>
              {quote.text}
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <h2 
            className="font-eb-garamond text-2xl text-red-900 mb-6"
            dangerouslySetInnerHTML={{ __html: formatAiResponse(content.prompt) }}
          ></h2>

          {isLoading ? (
            <div className="flex justify-center items-center my-8">
              <div className="text-red-900 flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing your wisdom...
              </div>
            </div>
          ) : (
            <>
              {!hasUserResponded && !hasAiResponded ? (
                <div className="my-8">
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Write your response here..."
                    className="w-full h-40 p-4 font-eb-garamond text-base border border-amber-400 bg-white bg-opacity-70 rounded focus:ring-1 focus:ring-red-900 focus:border-red-900 outline-none"
                  />
                  <button 
                    onClick={onSubmitResponse}
                    disabled={!userResponse.trim()}
                    className="mt-4 bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 font-eb-garamond disabled:bg-gray-400"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <>
                  {hasUserResponded && (
                    <div className="mb-8 p-4 bg-blue-50 bg-opacity-70 rounded border-l-4 border-blue-900">
                      <h3 className="text-blue-900 font-eb-garamond text-xl mb-2">Your Response:</h3>
                      <p className="font-eb-garamond">{content.userResponse}</p>
                    </div>
                  )}
                  {hasAiResponded && (
                    <div className="p-4 bg-white bg-opacity-70 rounded border-l-4 border-red-900">
                      <h3 className="text-red-900 font-eb-garamond text-xl mb-2">Guidance:</h3>
                      <p
                        className="first-letter:text-5xl first-letter:text-red-900 first-letter:italic first-letter:font-normal first-letter:float-left first-letter:mr-1 font-eb-garamond text-lg"
                        dangerouslySetInnerHTML={{ __html: formatAiResponse(content.aiResponse) }}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </div>

      {currentPage === totalPages && !isLoading && hasAiResponded && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onNextPrompt}
            className="bg-red-900 text-white px-6 py-3 rounded hover:bg-red-800 font-eb-garamond"
          >
            Enter Greatness
          </button>
        </div>
      )}
    </div>
  );
}






