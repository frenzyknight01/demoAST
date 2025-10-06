import React, { createContext, useContext, useState, useEffect } from 'react';
import { MoodEntry, JournalEntry, ChatSession, MindfulnessSession, AIPersona } from '../types';
import { db } from '../utils/database';
import { useAuth } from './AuthContext';

interface AppContextType {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  chatSessions: ChatSession[];
  mindfulnessSessions: MindfulnessSession[];
  selectedPersona: AIPersona;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  addChatSession: (session: Omit<ChatSession, 'id'>) => void;
  updateChatSession: (id: string, updates: Partial<ChatSession>) => void;
  addMindfulnessSession: (session: Omit<MindfulnessSession, 'id'>) => void;
  setPersona: (persona: AIPersona) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

const defaultPersona: AIPersona = {
  id: 'default',
  name: 'Luna',
  description: 'Your warm and empathetic AI companion',
  personality: 'Warm, understanding, and supportive. Always ready to listen without judgment.',
  avatar: '🌙',
  communicationStyle: 'warm'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [mindfulnessSessions, setMindfulnessSessions] = useState<MindfulnessSession[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(defaultPersona);
  const { user } = useAuth();

  useEffect(() => {
    // Load data from database for current user
    if (user) {
      const storedMoods = db.getMoodEntries(user.id).map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      
      const storedJournal = db.getJournalEntries(user.id).map(entry => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      }));
      
      const storedChats = db.getChatSessions(user.id).map(session => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined
      }));
      
      const storedMindfulness = db.getMindfulnessSessions(user.id).map(session => ({
        ...session,
        completedAt: new Date(session.completedAt)
      }));
      
      setMoodEntries(storedMoods);
      setJournalEntries(storedJournal);
      setChatSessions(storedChats);
      setMindfulnessSessions(storedMindfulness);
    }
    
    // Load persona preference
    const storedPersona = localStorage.getItem('moodtalk_persona');
    if (storedPersona) setSelectedPersona(JSON.parse(storedPersona));
  }, [user]);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const storedEntry = db.createMoodEntry({
      ...entry,
      timestamp: entry.timestamp.toISOString()
    });
    
    const newEntry = {
      ...storedEntry,
      timestamp: new Date(storedEntry.timestamp)
    };
    
    const updated = [...moodEntries, newEntry];
    setMoodEntries(updated);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const storedEntry = db.createJournalEntry({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    });
    
    const newEntry = {
      ...storedEntry,
      createdAt: new Date(storedEntry.createdAt),
      updatedAt: new Date(storedEntry.updatedAt)
    };
    
    const updated = [...journalEntries, newEntry];
    setJournalEntries(updated);
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    const updatedEntry = db.updateJournalEntry(id, {
      ...updates,
      createdAt: updates.createdAt?.toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    if (updatedEntry) {
      const updated = journalEntries.map(entry => 
        entry.id === id ? {
          ...updatedEntry,
          createdAt: new Date(updatedEntry.createdAt),
          updatedAt: new Date(updatedEntry.updatedAt)
        } : entry
      );
      setJournalEntries(updated);
    }
  };

  const deleteJournalEntry = (id: string) => {
    const success = db.deleteJournalEntry(id);
    if (success) {
      const updated = journalEntries.filter(entry => entry.id !== id);
      setJournalEntries(updated);
    }
  };

  const addChatSession = (session: Omit<ChatSession, 'id'>) => {
    const storedSession = db.createChatSession({
      ...session,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime?.toISOString()
    });
    
    const newSession = {
      ...storedSession,
      startTime: new Date(storedSession.startTime),
      endTime: storedSession.endTime ? new Date(storedSession.endTime) : undefined
    };
    
    const updated = [...chatSessions, newSession];
    setChatSessions(updated);
    return newSession;
  };

  const updateChatSession = (id: string, updates: Partial<ChatSession>) => {
    const updatedSession = db.updateChatSession(id, {
      ...updates,
      startTime: updates.startTime?.toISOString(),
      endTime: updates.endTime?.toISOString()
    });
    
    if (updatedSession) {
      const updated = chatSessions.map(session => 
        session.id === id ? {
          ...updatedSession,
          startTime: new Date(updatedSession.startTime),
          endTime: updatedSession.endTime ? new Date(updatedSession.endTime) : undefined
        } : session
      );
      setChatSessions(updated);
    }
  };

  const addMindfulnessSession = (session: Omit<MindfulnessSession, 'id'>) => {
    const storedSession = db.createMindfulnessSession({
      ...session,
      completedAt: session.completedAt.toISOString()
    });
    
    const newSession = {
      ...storedSession,
      completedAt: new Date(storedSession.completedAt)
    };
    
    const updated = [...mindfulnessSessions, newSession];
    setMindfulnessSessions(updated);
  };

  const setPersona = (persona: AIPersona) => {
    setSelectedPersona(persona);
    localStorage.setItem('moodtalk_persona', JSON.stringify(persona));
  };

  return (
    <AppContext.Provider value={{
      moodEntries,
      journalEntries,
      chatSessions,
      mindfulnessSessions,
      selectedPersona,
      addMoodEntry,
      addJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      addChatSession,
      updateChatSession,
      addMindfulnessSession,
      setPersona
    }}>
      {children}
    </AppContext.Provider>
  );
}