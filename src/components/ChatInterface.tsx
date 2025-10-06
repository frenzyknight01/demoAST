import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: number;
}

export function ChatInterface() {
  const { user } = useAuth();
  const { addChatSession, updateChatSession, chatSessions } = useApp();
  const [currentMood, setCurrentMood] = useState(5);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const moodSliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      if (chatSessions.length > 0) {
        const latestSession = chatSessions[chatSessions.length - 1];
        setMessages(latestSession.messages || []);
        setCurrentSessionId(latestSession.id);
      }
    }
  }, [user, chatSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus on middle of slider when component mounts
    if (showMoodSelector && moodSliderRef.current) {
      setTimeout(() => {
        moodSliderRef.current?.focus();
        moodSliderRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [showMoodSelector]);

  const handleMoodSet = () => {
    setShowMoodSelector(false);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `I can see you're feeling at a ${currentMood}/10 today. I'm here to listen and support you. How can I help you right now?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    if (user) {
      const newSession = addChatSession({
        userId: user.id,
        title: `Chat ${new Date().toLocaleDateString()}`,
        messages: [welcomeMessage],
        startTime: new Date()
      });
      setCurrentSessionId(newSession.id);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      mood: currentMood
    };

    setMessages(prev => [...prev, userMessage]);
    if (user) {
      if (currentSessionId) {
        const currentSession = chatSessions.find(s => s.id === currentSessionId);
        if (currentSession) {
          updateChatSession(currentSessionId, {
            messages: [...(currentSession.messages || []), userMessage]
          });
        }
      } else {
        const newSession = addChatSession({
          userId: user.id,
          title: `Chat ${new Date().toLocaleDateString()}`,
          messages: [userMessage],
          startTime: new Date()
        });
        setCurrentSessionId(newSession.id);
      }
    }
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're feeling at a ${currentMood}/10. Thank you for sharing that with me. It takes courage to reach out. What's been on your mind lately?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      if (user) {
        if (currentSessionId) {
          const currentSession = chatSessions.find(s => s.id === currentSessionId);
          if (currentSession) {
            updateChatSession(currentSessionId, {
              messages: [...(currentSession.messages || []), aiResponse]
            });
          }
        }
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return 'text-red-500';
    if (mood <= 4) return 'text-orange-500';
    if (mood <= 6) return 'text-yellow-500';
    if (mood <= 8) return 'text-blue-500';
    return 'text-green-500';
  };

  if (showMoodSelector) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <Bot className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How are you feeling today?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Setting your mood helps me provide better support tailored to how you're feeling right now.
          </p>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">😢</span>
              <span className="text-4xl">{getMoodEmoji(currentMood)}</span>
              <span className="text-2xl">😊</span>
            </div>
            <input
              ref={moodSliderRef}
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={(e) => setCurrentMood(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Very Low</span>
              <span className={`font-semibold ${getMoodColor(currentMood)}`}>
                {currentMood}/10
              </span>
              <span>Very High</span>
            </div>
          </div>

          <button
            onClick={handleMoodSet}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Start Conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-indigo-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Mental Health Companion
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mood: {getMoodEmoji(currentMood)} {currentMood}/10
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            </select>
            <button
              onClick={() => setShowMoodSelector(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Change mood"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <Bot className="h-5 w-5 mt-0.5 text-indigo-600" />
                )}
                {message.sender === 'user' && (
                  <User className="h-5 w-5 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-indigo-600" />
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}