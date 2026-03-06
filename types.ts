
export enum View {
  DASHBOARD = 'DASHBOARD',
  AI_IMPORT = 'AI_IMPORT',
  SONG_DETAIL = 'SONG_DETAIL',
  SETTINGS = 'SETTINGS'
}

export interface Song {
  id: string;
  title: string;
  lyrics: string;
  category: string;
  author?: string;
  addedAt: string;
  notes?: string;
  audioUrl?: string;
  pdfUrl?: string;
  imageUrl?: string; // Saha vaovao hitahirizana sary
  pdfAnnotations?: string; // Raha misy fanamarihana natao teo ambonin'ny PDF
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string;
  timestamp: Date;
}

export interface Project {
  name: string;
  description: string;
  language: string;
  platform: string;
}
