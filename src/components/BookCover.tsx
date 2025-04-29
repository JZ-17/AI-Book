// src/components/BookCover.tsx
'use client';

import React from 'react';

interface BookCoverProps {
  authorImage: string;
  userName: string;
  onOpen: () => void;
  hasExistingContent?: boolean;
}

const BookCover: React.FC<BookCoverProps> = ({ 
  authorImage, 
  userName, 
  onOpen,
  hasExistingContent = false
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-[#7a1b1b] text-center p-8">
      {/* Ornate gold and navy border */}
      <div className="absolute inset-0 border-8 border-yellow-600 m-8 rounded-xl">
        <div className="absolute inset-2 border-4 border-[#001f3f] rounded-lg"></div>
        <div className="absolute inset-4 border-4 border-yellow-500 rounded-lg"></div>
      </div>

      <div className="z-10 flex flex-col items-center mt-12">
        <h1 className="font-cinzel font-bold text-3xl text-yellow-400 mb-2 tracking-wide">
          The Story of
        </h1>

        <h2 className="font-cinzel font-extrabold text-5xl text-yellow-300 mb-6 tracking-widest">
          {userName}
        </h2>

        <p className="font-eb-garamond font-semibold text-2xl italic text-yellow-200 mb-10">
          An Odyssey of Dreams
        </p>

        {/* Enlarged author image with ornate gold frame and navy accent */}
        {authorImage ? (
          <div className="relative w-80 h-80 mb-12">
            {/* Ornate frame with navy accent */}
            <div className="absolute -inset-5 rounded-full border-4 border-yellow-500" style={{ boxShadow: '0 0 0 6px #001f3f' }}></div>

            {/* Image container */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img 
                src={authorImage} 
                alt="Author portrait" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
            </div>
          </div>
        ) : (
          <div className="relative w-80 h-80 mb-12">
            {/* Ornate frame with navy accent */}
            <div className="absolute -inset-5 rounded-full border-4 border-yellow-500" style={{ boxShadow: '0 0 0 6px #001f3f' }}></div>

            {/* Fallback initial */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
              <span className="text-7xl font-cinzel font-bold text-yellow-300">{userName.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Decorative divider */}
        <div className="w-64 h-2 mb-10 bg-yellow-600 rounded-full"></div>

        <p className="font-italianno text-3xl text-yellow-300 mb-6">An Interactive Legacy</p>

        <button 
          onClick={onOpen}
          className="relative bg-[#001f3f] text-yellow-300 font-cinzel font-bold px-10 py-5 rounded-lg hover:bg-[#00102a] transition-colors shadow-lg overflow-hidden group mb-10 text-xl border-2 border-yellow-400"
        >
          <span className="relative z-10">{hasExistingContent ? "Continue the Adventure" : "Begin the Adventure"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#00102a]/40 to-[#000818]/40 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default BookCover;