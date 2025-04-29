// src/components/SavingIndicator.tsx
'use client';

// Inferface for saving
interface SavingIndicatorProps {
  isSaving: boolean;
  lastSaveTime: Date | null;
  offlineEntryCount: number;
}

// Saving Notif layout
export default function SavingIndicator({ 
  isSaving, 
  lastSaveTime, 
  offlineEntryCount 
}: SavingIndicatorProps) {
  if (isSaving) {
    return (
      <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-md shadow-md flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving your progress...
      </div>
    );
  }
  
  if (offlineEntryCount > 0) {
    return (
      <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-md shadow-md">
        {offlineEntryCount} {offlineEntryCount === 1 ? 'entry' : 'entries'} saved locally, waiting to sync
      </div>
    );
  }
  
  if (lastSaveTime) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md opacity-80">
        Last saved: {lastSaveTime.toLocaleTimeString()}
      </div>
    );
  }
  
  return null;
}