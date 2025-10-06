import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Smile, Frown, Meh, Heart, Brain } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function MoodJourney() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { moodEntries } = useApp();

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return moodEntries.filter(entry => new Date(entry.timestamp) >= cutoffDate);
  }, [moodEntries, selectedPeriod]);

  const averageMood = useMemo(() => {
    if (filteredEntries.length === 0) return 0;
    return filteredEntries.reduce((sum, entry) => sum + entry.mood, 0) / filteredEntries.length;
  }, [filteredEntries]);

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600';
    if (mood >= 6) return 'text-blue-600';
    if (mood >= 4) return 'text-yellow-600';
    if (mood >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return 'Great';
    if (mood >= 6) return 'Good';
    if (mood >= 4) return 'Okay';
    if (mood >= 2) return 'Low';
    return 'Very Low';
  };

  const moodDistribution = useMemo(() => {
    const distribution = { great: 0, good: 0, okay: 0, low: 0, veryLow: 0 };
    
    filteredEntries.forEach(entry => {
      if (entry.mood >= 8) distribution.great++;
      else if (entry.mood >= 6) distribution.good++;
      else if (entry.mood >= 4) distribution.okay++;
      else if (entry.mood >= 2) distribution.low++;
      else distribution.veryLow++;
    });
    
    return distribution;
  }, [filteredEntries]);

  const totalEntries = filteredEntries.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mood Journey</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track your emotional patterns and progress</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <>
          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl">{getMoodEmoji(averageMood)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Average Mood</h3>
              <p className={`text-2xl font-bold ${getMoodColor(averageMood)}`}>
                {averageMood.toFixed(1)}/10
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getMoodLabel(averageMood)}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Total Entries</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalEntries}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mood records</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Best Day</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...filteredEntries.map(e => e.mood))}/10
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Highest mood</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Consistency</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round((totalEntries / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365)) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tracking rate</p>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Mood Distribution</h3>
            
            <div className="space-y-4">
              {[
                { key: 'great', label: 'Great (8-10)', emoji: '😊', color: 'bg-green-500', count: moodDistribution.great },
                { key: 'good', label: 'Good (6-7)', emoji: '🙂', color: 'bg-blue-500', count: moodDistribution.good },
                { key: 'okay', label: 'Okay (4-5)', emoji: '😐', color: 'bg-yellow-500', count: moodDistribution.okay },
                { key: 'low', label: 'Low (2-3)', emoji: '😔', color: 'bg-orange-500', count: moodDistribution.low },
                { key: 'veryLow', label: 'Very Low (1)', emoji: '😢', color: 'bg-red-500', count: moodDistribution.veryLow }
              ].map((mood) => {
                const percentage = totalEntries > 0 ? (mood.count / totalEntries) * 100 : 0;
                return (
                  <div key={mood.key} className="flex items-center space-x-4">
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mood.label}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{mood.count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`${mood.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Mood Entries</h3>
            
            <div className="space-y-4">
              {filteredEntries
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Mood: {entry.mood}/10 - {getMoodLabel(entry.mood)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {entry.emotions.length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Emotions: {entry.emotions.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)} bg-opacity-10`}>
                      {entry.mood}/10
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No mood data yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your mood by chatting with your AI companion or using the mood tracker.
          </p>
        </div>
      )}
    </div>
  );
}