'use client';

// Imports
import { SessionProvider } from "next-auth/react";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { Session } from "next-auth";

// Allows user's session data to be accessed in the app
export function Providers({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </SessionProvider>
  );
}