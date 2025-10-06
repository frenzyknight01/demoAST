import React, { useState } from 'react';
import { 
  MessageCircle, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  Settings,
  User,
  Trophy,
  Clock,
  Heart,
  Target,
  ArrowRight,
  Calendar,
  BarChart3,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { ChatInterface } from './ChatInterface';
import { Journal } from './Journal';
import { MoodJourney } from './MoodJourney';
import { MindfulMoments } from './MindfulMoments';
import { UserSettings } from './UserSettings';
import { CrisisHelpModal } from './CrisisHelpModal';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const { user, logout } = useAuth();
  const { moodEntries, journalEntries, mindfulnessSessions } = useApp();

  if (!user) return null;

  const getWellnessLevel = () => {
    const totalActivities = user.totalSessions + user.journalEntries + user.mindfulMinutes / 5;
    return Math.min(Math.floor(totalActivities / 10) + 1, 10);
  };

  const getProgressToNextLevel = () => {
    const currentLevel = getWellnessLevel();
    const totalActivities = user.totalSessions + user.journalEntries + user.mindfulMinutes / 5;
    const activitiesInCurrentLevel = totalActivities - ((currentLevel - 1) * 10);
    return (activitiesInCurrentLevel % 10) * 10;
  };

  // Calculate recent mood trend
  const recentMoods = moodEntries.slice(-7);
  const avgMood = recentMoods.length > 0 
    ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
    : 5;

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'journal', label: 'My Journal', icon: BookOpen },
    { id: 'mood', label: 'Mood Journey', icon: TrendingUp },
    { id: 'mindful', label: 'Mindful Moments', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'journal':
        return <Journal />;
      case 'mood':
        return <MoodJourney />;
      case 'mindful':
        return <MindfulMoments />;
      case 'settings':
        return <UserSettings />;
      default:
        return (
          <div className="p-6 space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                  <p className="text-blue-100 text-lg">
                    Ready to continue your wellness journey today?
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl mb-1">{getMoodEmoji(avgMood)}</div>
                  <p className="text-blue-100 text-sm">Current Mood</p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{user.totalSessions}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Chat Sessions</h3>
                <p className="text-gray-600 text-sm">Total conversations</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-600">{user.journalEntries}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Journal Entries</h3>
                <p className="text-gray-600 text-sm">Reflections written</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{user.mindfulMinutes}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Mindful Minutes</h3>
                <p className="text-gray-600 text-sm">Time spent in peace</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{getWellnessLevel()}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Wellness Level</h3>
                <p className="text-gray-600 text-sm">Your progress rank</p>
              </div>
            </div>

            {/* Progress and Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Wellness Progress */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Wellness Progress</h3>
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Level {getWellnessLevel()}</span>
                    <span>{getProgressToNextLevel()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressToNextLevel()}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Keep going! Complete more activities to reach Level {getWellnessLevel() + 1}
                </p>
              </div>

              {/* Recent Badges */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Achievements</h3>
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                
                {user.badges.length > 0 ? (
                  <div className="space-y-3">
                    {user.badges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{badge.name}</h4>
                          <p className="text-gray-600 text-xs">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Start your journey to earn your first badge!</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left group w-full"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">Start Chat</h4>
                    <p className="text-gray-600 text-sm">Talk to your AI companion</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveTab('journal')}
                  className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left group w-full"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-700">Write in Journal</h4>
                    <p className="text-gray-600 text-sm">Express your thoughts</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveTab('mindful')}
                  className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left group w-full"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700">Mindful Session</h4>
                    <p className="text-gray-600 text-sm">Find your center</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 ml-auto" />
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600 capitalize">{user.plan} Plan</p>
            </div>
          </div>
          
          {user.plan === 'premium' && user.isStudent && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-green-700 text-xs font-medium">🎓 Student Premium - 12 months free!</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Crisis Help Button */}
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-3">
            <button 
              onClick={() => setShowCrisisModal(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              Tele MANAS Crisis Help
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">24/7 Mental Health Support</p>
              <p className="text-xs text-red-600 font-bold">📞 080-46110007</p>
              <p className="text-xs text-gray-500 mt-1">Free, confidential support in 20+ languages</p>
            </div>
          </div>
        </div>



        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full text-gray-600 hover:text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderContent()}
        <CrisisHelpModal 
          isOpen={showCrisisModal} 
          onClose={() => setShowCrisisModal(false)} 
        />
      </div>
    </div>
  );
}