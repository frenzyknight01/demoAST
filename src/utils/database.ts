// Simple localStorage-based database for demo purposes
// In production, replace with actual database like Supabase

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this should be hashed
  plan: 'free' | 'standard' | 'premium';
  isStudent: boolean;
  createdAt: string;
  wellnessLevel: number;
  totalSessions: number;
  journalEntries: number;
  mindfulMinutes: number;
  badges: any[];
}

export interface StoredMoodEntry {
  id: string;
  userId: string;
  mood: number;
  emotions: string[];
  intensity: number;
  triggers: string[];
  notes?: string;
  timestamp: string;
  sessionId?: string;
}

export interface StoredJournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  prompt?: string;
}

export interface StoredChatSession {
  id: string;
  userId: string;
  title: string;
  messages: any[];
  startTime: string;
  endTime?: string;
  averageMood?: number;
}

export interface StoredMindfulnessSession {
  id: string;
  userId: string;
  type: 'breathing' | 'meditation' | 'grounding' | 'visualization';
  duration: number;
  completedAt: string;
  rating?: number;
}

class LocalDatabase {
  private getKey(table: string): string {
    return `moodtalk_${table}`;
  }

  // Users
  async createUser(userData: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser> {
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: StoredUser = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(this.getKey('users'), JSON.stringify(users));
    return newUser;
  }

  getUsers(): StoredUser[] {
    const data = localStorage.getItem(this.getKey('users'));
    return data ? JSON.parse(data) : [];
  }

  getUserByEmail(email: string): StoredUser | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  getUserById(id: string): StoredUser | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  updateUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(this.getKey('users'), JSON.stringify(users));
    return users[userIndex];
  }

  // Mood Entries
  createMoodEntry(entry: Omit<StoredMoodEntry, 'id'>): StoredMoodEntry {
    const entries = this.getMoodEntries();
    const newEntry: StoredMoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: entry.timestamp || new Date().toISOString(),
    };

    entries.push(newEntry);
    localStorage.setItem(this.getKey('mood_entries'), JSON.stringify(entries));
    return newEntry;
  }

  getMoodEntries(userId?: string): StoredMoodEntry[] {
    const data = localStorage.getItem(this.getKey('mood_entries'));
    const entries = data ? JSON.parse(data) : [];
    return userId ? entries.filter((e: StoredMoodEntry) => e.userId === userId) : entries;
  }

  // Journal Entries
  createJournalEntry(entry: Omit<StoredJournalEntry, 'id'>): StoredJournalEntry {
    const entries = this.getJournalEntries();
    const newEntry: StoredJournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || new Date().toISOString(),
    };

    entries.push(newEntry);
    localStorage.setItem(this.getKey('journal_entries'), JSON.stringify(entries));
    return newEntry;
  }

  getJournalEntries(userId?: string): StoredJournalEntry[] {
    const data = localStorage.getItem(this.getKey('journal_entries'));
    const entries = data ? JSON.parse(data) : [];
    return userId ? entries.filter((e: StoredJournalEntry) => e.userId === userId) : entries;
  }

  updateJournalEntry(id: string, updates: Partial<StoredJournalEntry>): StoredJournalEntry | null {
    const entries = this.getJournalEntries();
    const entryIndex = entries.findIndex(e => e.id === id);
    
    if (entryIndex === -1) return null;
    
    entries[entryIndex] = { 
      ...entries[entryIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(this.getKey('journal_entries'), JSON.stringify(entries));
    return entries[entryIndex];
  }

  deleteJournalEntry(id: string): boolean {
    const entries = this.getJournalEntries();
    const filteredEntries = entries.filter(e => e.id !== id);
    
    if (filteredEntries.length === entries.length) return false;
    
    localStorage.setItem(this.getKey('journal_entries'), JSON.stringify(filteredEntries));
    return true;
  }

  // Chat Sessions
  createChatSession(session: Omit<StoredChatSession, 'id'>): StoredChatSession {
    const sessions = this.getChatSessions();
    const newSession: StoredChatSession = {
      ...session,
      id: crypto.randomUUID(),
      startTime: session.startTime || new Date().toISOString(),
    };

    sessions.push(newSession);
    localStorage.setItem(this.getKey('chat_sessions'), JSON.stringify(sessions));
    return newSession;
  }

  getChatSessions(userId?: string): StoredChatSession[] {
    const data = localStorage.getItem(this.getKey('chat_sessions'));
    const sessions = data ? JSON.parse(data) : [];
    return userId ? sessions.filter((s: StoredChatSession) => s.userId === userId) : sessions;
  }

  updateChatSession(id: string, updates: Partial<StoredChatSession>): StoredChatSession | null {
    const sessions = this.getChatSessions();
    const sessionIndex = sessions.findIndex(s => s.id === id);
    
    if (sessionIndex === -1) return null;
    
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
    localStorage.setItem(this.getKey('chat_sessions'), JSON.stringify(sessions));
    return sessions[sessionIndex];
  }

  // Mindfulness Sessions
  createMindfulnessSession(session: Omit<StoredMindfulnessSession, 'id'>): StoredMindfulnessSession {
    const sessions = this.getMindfulnessSessions();
    const newSession: StoredMindfulnessSession = {
      ...session,
      id: crypto.randomUUID(),
      completedAt: session.completedAt || new Date().toISOString(),
    };

    sessions.push(newSession);
    localStorage.setItem(this.getKey('mindfulness_sessions'), JSON.stringify(sessions));
    return newSession;
  }

  getMindfulnessSessions(userId?: string): StoredMindfulnessSession[] {
    const data = localStorage.getItem(this.getKey('mindfulness_sessions'));
    const sessions = data ? JSON.parse(data) : [];
    return userId ? sessions.filter((s: StoredMindfulnessSession) => s.userId === userId) : sessions;
  }

  // Data Export
  exportUserData(userId: string): any {
    return {
      user: this.getUserById(userId),
      moodEntries: this.getMoodEntries(userId),
      journalEntries: this.getJournalEntries(userId),
      chatSessions: this.getChatSessions(userId),
      mindfulnessSessions: this.getMindfulnessSessions(userId),
      exportedAt: new Date().toISOString(),
    };
  }

  // Data Cleanup
  deleteAllUserData(userId: string): void {
    // Remove user
    const users = this.getUsers().filter(u => u.id !== userId);
    localStorage.setItem(this.getKey('users'), JSON.stringify(users));

    // Remove user's mood entries
    const moodEntries = this.getMoodEntries().filter(e => e.userId !== userId);
    localStorage.setItem(this.getKey('mood_entries'), JSON.stringify(moodEntries));

    // Remove user's journal entries
    const journalEntries = this.getJournalEntries().filter(e => e.userId !== userId);
    localStorage.setItem(this.getKey('journal_entries'), JSON.stringify(journalEntries));

    // Remove user's chat sessions
    const chatSessions = this.getChatSessions().filter(s => s.userId !== userId);
    localStorage.setItem(this.getKey('chat_sessions'), JSON.stringify(chatSessions));

    // Remove user's mindfulness sessions
    const mindfulnessSessions = this.getMindfulnessSessions().filter(s => s.userId !== userId);
    localStorage.setItem(this.getKey('mindfulness_sessions'), JSON.stringify(mindfulnessSessions));
  }
}

export const db = new LocalDatabase();