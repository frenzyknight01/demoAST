export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'standard' | 'premium';
  isStudent?: boolean;
  createdAt: Date;
  wellnessLevel: number;
  totalSessions: number;
  journalEntries: number;
  mindfulMinutes: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'journal' | 'mindfulness' | 'consistency' | 'milestone';
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-10 scale
  emotions: string[];
  intensity: number;
  triggers: string[];
  notes?: string;
  timestamp: Date;
  sessionId?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  prompt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mood?: number;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  startTime: Date;
  endTime?: Date;
  averageMood?: number;
}

export interface MindfulnessSession {
  id: string;
  userId: string;
  type: 'breathing' | 'meditation' | 'grounding' | 'visualization';
  duration: number; // in minutes
  completedAt: Date;
  rating?: number;
}

export interface GuidedProgram {
  id: string;
  title: string;
  description: string;
  sessions: ProgramSession[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'anxiety' | 'confidence' | 'focus' | 'stress' | 'sleep';
  thumbnail: string;
}

export interface ProgramSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'chat' | 'exercise' | 'reflection';
  content: string;
  order: number;
}

export interface AIPersona {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string;
  communicationStyle: 'warm' | 'direct' | 'poetic' | 'professional';
}