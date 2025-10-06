import React from 'react';
import { 
  Brain, 
  Shield, 
  Heart, 
  BookOpen, 
  TrendingUp, 
  Users,
  Check,
  Star,
  ChevronRight,
  Play,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative z-50 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MoodTalk AI
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-blue-200/50">
            <Shield className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-700">100% Private • No Cloud Storage • No Tracking</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI Companion for
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent block mt-2">
              Mental Wellness
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Combat academic stress, social anxiety, and emotional burnout with your personal AI companion. 
            Private, supportive, and available 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Student Offer Banner */}
          <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full px-6 py-3 font-semibold shadow-lg">
            <Star className="h-5 w-5 mr-2" />
            <span>Students get 12 months Premium FREE! </span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for students and young adults
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Chat Companion</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Talk to Luna, your empathetic AI companion who understands your emotions and provides personalized support without judgment.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  24/7 availability
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Mood-adaptive responses
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Crisis support integration
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Journal</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Express your thoughts in a private, secure journal with AI-powered prompts and insights to guide your reflection.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Guided prompts
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Mood tracking
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Pattern recognition
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Mindful Moments</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access guided breathing exercises, meditation sessions, and grounding techniques whenever you need them.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Breathing exercises
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Ambient sounds
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Progress tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-700 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">5 AI conversations per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">5 journal entries/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Basic breathing exercises</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Mood tracking</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full border-2 border-gray-400 text-gray-800 py-3 rounded-full font-semibold hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
            
            {/* Standard Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-300 relative hover:border-blue-400 transition-all duration-200">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Standard</h3>
              <p className="text-gray-700 mb-6">For regular users</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $9<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Unlimited AI conversations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Unlimited journal entries</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Advanced mood analytics & insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">All mindfulness exercises</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Data export capabilities</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                Choose Standard
              </button>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border-2 border-green-300 relative hover:border-green-400 transition-all duration-200">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                FREE for Students
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-700 mb-6">Complete wellness package - FREE for students!</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                <span className="line-through text-gray-500">$19</span>
                <span className="text-green-600 ml-2">FREE</span>
                <div className="text-lg text-gray-700 mt-1">12 months FREE for students</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Everything in Standard</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">4 personalized AI personas</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Advanced guided programs</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">10 premium ambient sounds</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Dark/Light mode themes</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800">Priority crisis support</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
              >
                Get FREE Student Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="px-4 py-20 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Privacy is Our Priority</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We believe mental health support should be completely private. That's why MoodTalk AI processes everything locally on your device.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Privacy</h3>
              <p className="text-gray-600 text-sm">Your conversations and journal entries are stored locally on your device only</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Data Collection</h3>
              <p className="text-gray-600 text-sm">We never collect, analyze, or share any of your personal information</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Data, Your Control</h3>
              <p className="text-gray-600 text-sm">Export or delete your data anytime with complete transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">MoodTalk AI</span>
          </div>
          <p className="text-gray-400 mb-6">
            Your AI companion for mental wellness. Private, supportive, and always here for you.
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © 2025 MoodTalk AI. All rights reserved. • Privacy Policy • Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}