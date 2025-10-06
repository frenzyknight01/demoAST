import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Trash2,
  Crown,
  CreditCard,
  Moon,
  Sun,
  Volume2,
  Smartphone,
  Key,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { AIPersona } from '../types';

export function UserSettings() {
  const { user, logout } = useAuth();
  const { selectedPersona, setPersona } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gpt-3.5-turbo' | 'gpt-4o' | 'gemini-pro' | 'gemini-2.5-flash'>('gpt-3.5-turbo');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!user) return null;

  const availablePersonas: AIPersona[] = [
    {
      id: 'luna',
      name: 'Luna',
      description: 'Warm and empathetic, like talking to your best friend',
      personality: 'Warm, understanding, and supportive. Always ready to listen without judgment.',
      avatar: '🌙',
      communicationStyle: 'warm'
    },
    {
      id: 'sage',
      name: 'Sage',
      description: 'Wise and insightful, perfect for deep conversations',
      personality: 'Thoughtful, wise, and introspective. Offers profound insights and gentle guidance.',
      avatar: '🦉',
      communicationStyle: 'poetic'
    },
    {
      id: 'alex',
      name: 'Alex',
      description: 'Direct and practical, great for problem-solving',
      personality: 'Straightforward, practical, and solution-focused. Gets to the point while being supportive.',
      avatar: '⚡',
      communicationStyle: 'direct'
    },
    {
      id: 'zen',
      name: 'Zen',
      description: 'Calm and mindful, perfect for finding inner peace',
      personality: 'Peaceful, mindful, and centered. Helps you find tranquility and balance.',
      avatar: '🧘',
      communicationStyle: 'professional'
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'persona', label: 'AI Persona', icon: Palette },
    { id: 'api', label: 'API Settings', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: isDark ? Moon : Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: Crown }
  ];

  const handleSaveApiKey = () => {
    if (selectedModel.startsWith('gpt')) {
      localStorage.setItem('moodtalk_openai_key', openaiApiKey);
    } else {
      localStorage.setItem('moodtalk_gemini_key', geminiApiKey);
    }
    localStorage.setItem('moodtalk_selected_model', selectedModel);
    
    setSaveMessage('API settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const loadApiKey = () => {
    const savedOpenAIKey = localStorage.getItem('moodtalk_openai_key');
    const savedGeminiKey = localStorage.getItem('moodtalk_gemini_key');
    const savedModel = localStorage.getItem('moodtalk_selected_model') as 'gpt-3.5-turbo' | 'gpt-4o' | 'gemini-pro' | 'gemini-2.5-flash';
    
    if (savedOpenAIKey) {
      setOpenaiApiKey(savedOpenAIKey);
    }
    if (savedGeminiKey) {
      setGeminiApiKey(savedGeminiKey);
    }
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  };

  React.useEffect(() => {
    loadApiKey();
  }, []);

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="student"
              defaultChecked={user.isStudent}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="student" className="text-sm text-gray-700">
              I'm a student (eligible for free Premium)
            </label>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors">
            <Trash2 className="h-5 w-5" />
            <span>Delete Account</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-700 transition-colors"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPersonaTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your AI Companion</h3>
        <p className="text-gray-600 mb-6">Select the personality that resonates most with you.</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {availablePersonas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => setPersona(persona)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedPersona.id === persona.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{persona.avatar}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{persona.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{persona.communicationStyle}</p>
                </div>
                {selectedPersona.id === persona.id && (
                  <div className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700">{persona.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Model Configuration</h3>
        <p className="text-gray-600 mb-6">
          Choose your preferred AI model and add your API key. All keys are stored locally and never shared.
        </p>
        
        {saveMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {saveMessage}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'gpt-3.5-turbo' | 'gpt-4o' | 'gemini-pro' | 'gemini-2.5-flash')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI) - Fast & Cost-effective</option>
              <option value="gpt-4o">GPT-4o (OpenAI) - Most Advanced</option>
              <option value="gemini-pro">Gemini Pro (Google) - Multimodal</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Google) - Fastest & Latest</option>
            </select>
          </div>
          
          {selectedModel.startsWith('gpt') ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="absolute right-12 top-2 text-gray-400 hover:text-gray-600"
              >
                {apiKeyVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google {selectedModel === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 'Gemini Pro'} API Key
            </label>
            <div className="relative">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-3 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                {apiKeyVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          )}
          
          <button
            onClick={handleSaveApiKey}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save API Settings</span>
          </button>
          
          {selectedModel.startsWith('gpt') ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to get your OpenAI API key:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI API Keys</a></li>
              <li>2. Sign in to your OpenAI account</li>
              <li>3. Click "Create new secret key"</li>
              <li>4. Copy and paste the key here</li>
            </ol>
          </div>
          ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">How to get your Google {selectedModel === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 'Gemini Pro'} API key:</h4>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
              <li>2. Sign in with your Google account</li>
              <li>3. Click "Create API Key"</li>
              <li>4. Copy and paste the key here</li>
              {selectedModel === 'gemini-2.5-flash' && (
                <li className="text-green-700 font-medium">5. Note: Gemini 2.5 Flash is the latest and fastest model!</li>
              )}
            </ol>
          </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Theme Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDark ? <Moon className="h-5 w-5 text-blue-600" /> : <Sun className="h-5 w-5 text-yellow-600" />}
              <div>
                <h4 className="font-medium text-gray-900">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </h4>
                <p className="text-sm text-gray-600">
                  {isDark ? 'Easy on the eyes for evening use' : 'Bright and clear for daytime use'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Daily Check-ins</h4>
              <p className="text-sm text-gray-600">Gentle reminders to reflect on your day</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Mindfulness Reminders</h4>
              <p className="text-sm text-gray-600">Prompts for breathing exercises and meditation</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Goal Celebrations</h4>
              <p className="text-sm text-gray-600">Celebrate your wellness achievements</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Crisis Support</h4>
              <p className="text-sm text-gray-600">Important mental health resources and alerts</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sound & Vibration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900">Sound Notifications</span>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900">Vibration</span>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy & Security</h3>
        <p className="text-gray-600 mb-6">Your privacy is our top priority. All data stays on your device.</p>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Local Storage Only</h4>
              <p className="text-sm text-gray-600">Your conversations, journal entries, and mood data never leave your device</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">No Tracking</h4>
              <p className="text-sm text-gray-600">We don't collect, analyze, or share any of your personal information</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Complete Control</h4>
              <p className="text-sm text-gray-600">Export or delete your data at any time with full transparency</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <button className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors">
            <Download className="h-5 w-5" />
            <span>Export My Data</span>
          </button>
          <button className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors">
            <Trash2 className="h-5 w-5" />
            <span>Delete All Data</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600">Manage your subscription</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.plan === 'premium' ? 'bg-purple-100 text-purple-700' :
            user.plan === 'standard' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
          </div>
        </div>
        
        {user.plan === 'premium' && user.isStudent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">Student Premium - FREE</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              You're enjoying 12 months of Premium access at no cost!
            </p>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {user.plan !== 'free' && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <CreditCard className="h-8 w-8 text-gray-400 mb-2" />
              <h4 className="font-medium text-gray-900">Billing</h4>
              <p className="text-sm text-gray-600">
                {user.isStudent ? 'Free' : user.plan === 'premium' ? '$19/month' : '$9/month'}
              </p>
            </div>
          )}
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <span className="text-2xl mb-2 block">🎯</span>
            <h4 className="font-medium text-gray-900">Features</h4>
            <p className="text-sm text-gray-600">
              {user.plan === 'premium' ? 'All features' : 
               user.plan === 'standard' ? 'Advanced features' : 'Basic features'}
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <span className="text-2xl mb-2 block">📊</span>
            <h4 className="font-medium text-gray-900">Usage</h4>
            <p className="text-sm text-gray-600">
              {user.totalSessions} sessions this month
            </p>
          </div>
        </div>
        
        {user.plan === 'free' && (
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
              Upgrade to Standard - $9/month
            </button>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200">
              Upgrade to Premium - $19/month
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'persona': return renderPersonaTab();
      case 'api': return renderApiTab();
      case 'appearance': return renderAppearanceTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      case 'subscription': return renderSubscriptionTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your MoodTalk AI experience</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}