// src/lib/utils.ts
import { v5 as uuidv5 } from 'uuid';

// Create a namespace for converting Google IDs to UUIDs
const GOOGLE_ID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // A standard namespace UUID

export function convertGoogleIdToUuid(googleId: string): string {
  // Create a deterministic UUID from the Google ID
  return uuidv5(googleId, GOOGLE_ID_NAMESPACE);
}