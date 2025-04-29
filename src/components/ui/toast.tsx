// Basically the notification system
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Toast component to display notifications
interface Toast {
  id: string;
  title: string;
  description: string;
  variant: 'default' | 'success' | 'error' | 'warning';
}

// Context to manage toast notifications
interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Create a context for the toast notifications
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Wrapper comment for toast
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md max-w-sm animate-slide-in ${
            toast.variant === 'success' ? 'bg-green-100 text-green-800' :
            toast.variant === 'error' ? 'bg-red-100 text-red-800' :
            toast.variant === 'warning' ? 'bg-amber-100 text-amber-800' :
            'bg-gray-100 text-gray-800'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{toast.title}</h3>
              <p className="text-sm">{toast.description}</p>
            </div>
            <button className="text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}