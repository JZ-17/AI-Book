// src/app/page.tsx
import { Suspense } from "react";
import BookClient from "@/components/BookClient";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-cinzel text-red-900">Loading your personalized book...</div>
        </div>
      }>
        <BookClient />
      </Suspense>
    </main>
  );
}