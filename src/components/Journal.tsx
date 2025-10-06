import React, { useState } from 'react';
import { Plus, Search, Calendar, Tag, Edit3, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { JournalEntry } from '../types';

export function Journal() {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useApp();
  const { user } = useAuth();

  const journalPrompts = [
    "What am I grateful for today?",
    "What challenged me today and how did I handle it?",
    "What would I tell my past self from a year ago?",
    "What brings me the most peace right now?",
    "What's one thing I learned about myself recently?",
    "If today had a color, what would it be and why?",
    "What's something I want to let go of?",
    "What makes me feel most like myself?"
  ];

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600 bg-green-50';
    if (mood >= 6) return 'text-blue-600 bg-blue-50';
    if (mood >= 4) return 'text-yellow-600 bg-yellow-50';
    if (mood >= 2) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const NewEntryForm = ({ initialEntry }: { initialEntry?: JournalEntry }) => {
    const [title, setTitle] = useState(initialEntry?.title || '');
    const [content, setContent] = useState(initialEntry?.content || '');
    const [mood, setMood] = useState(initialEntry?.mood || 5);
    const [tags, setTags] = useState(initialEntry?.tags.join(', ') || '');
    const [selectedPrompt, setSelectedPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !content.trim() || !user) return;

      const entryData = {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: initialEntry?.createdAt || new Date(),
        updatedAt: new Date(),
        prompt: selectedPrompt || undefined
      };

      if (initialEntry) {
        updateJournalEntry(initialEntry.id, entryData);
        setIsEditing(false);
        setSelectedEntry({ ...initialEntry, ...entryData });
      } else {
        addJournalEntry(entryData);
        setShowNewEntry(false);
      }

      // Reset form
      setTitle('');
      setContent('');
      setMood(5);
      setTags('');
      setSelectedPrompt('');
    };

    const usePrompt = (prompt: string) => {
      setSelectedPrompt(prompt);
      setTitle(prompt);
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {initialEntry ? 'Edit Entry' : 'New Journal Entry'}
          </h3>
          <button
            onClick={() => {
              if (initialEntry) {
                setIsEditing(false);
              } else {
                setShowNewEntry(false);
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {!initialEntry && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              <Sparkles className="h-4 w-4 inline mr-2" />
              Need inspiration? Try one of these prompts:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {journalPrompts.slice(0, 4).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => usePrompt(prompt)}
                  className="text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Express your thoughts freely..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood (1-10) {getMoodEmoji(mood)}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span className="font-medium">{mood}</span>
                <span>Amazing</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="stress, work, gratitude..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {initialEntry ? 'Update Entry' : 'Save Entry'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (initialEntry) {
                  setIsEditing(false);
                } else {
                  setShowNewEntry(false);
                }
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const EntryView = ({ entry }: { entry: JournalEntry }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{entry.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {entry.createdAt.toLocaleDateString()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
              {getMoodEmoji(entry.mood)} Mood: {entry.mood}/10
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this entry?')) {
                deleteJournalEntry(entry.id);
                setSelectedEntry(null);
              }
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="prose prose-sm max-w-none mb-4">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
      </div>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setSelectedEntry(null)}
        className="mt-6 text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        ← Back to entries
      </button>
    </div>
  );

  if (showNewEntry) {
    return (
      <div className="p-6">
        <NewEntryForm />
      </div>
    );
  }

  if (selectedEntry) {
    if (isEditing) {
      return (
        <div className="p-6">
          <NewEntryForm initialEntry={selectedEntry} />
        </div>
      );
    }
    return (
      <div className="p-6">
        <EntryView entry={selectedEntry} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Journal</h1>
          <p className="text-gray-600 mt-1">Your private space for reflection and growth</p>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search your entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Entries Grid */}
      {filteredEntries.length > 0 ? (
        <div className="grid gap-6">
          {filteredEntries
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{entry.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                    {getMoodEmoji(entry.mood)} {entry.mood}/10
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
                  {entry.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {entry.createdAt.toLocaleDateString()}
                  </div>
                  
                  {entry.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {entry.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          +{entry.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No matching entries' : 'Start your journal journey'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Express your thoughts, track your mood, and reflect on your experiences.'
            }
          </p>
          <button
            onClick={() => setShowNewEntry(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Write Your First Entry</span>
          </button>
        </div>
      )}
    </div>
  );
}