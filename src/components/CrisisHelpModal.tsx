import React from 'react';
import { X, Phone, Globe, Clock, Heart, Shield } from 'lucide-react';

interface CrisisHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisHelpModal({ isOpen, onClose }: CrisisHelpModalProps) {
  if (!isOpen) return null;

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Crisis Support Available
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You're not alone. Help is available 24/7
            </p>
          </div>

          <div className="space-y-4">
            {/* Tele MANAS - Primary */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">Tele MANAS</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">National Mental Health Helpline</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCall('08046110007')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Call Now
                </button>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-800 dark:text-red-200 mb-1">080-46110007</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-red-700 dark:text-red-300">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    24/7 Available
                  </span>
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    20+ Languages
                  </span>
                </div>
              </div>
            </div>

            {/* Other Emergency Contacts */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Other Emergency Contacts</h4>
              
              <button
                onClick={() => handleCall('102')}
                className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🚨</span>
                  </div>
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">Emergency Services</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">102</p>
                  </div>
                </div>
                <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </button>

              <button
                onClick={() => handleCall('+919152987821')}
                className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💜</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900 dark:text-purple-100">AASRA Suicide Prevention</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">+91 91529 87821</p>
                  </div>
                </div>
                <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </button>

              <button
                onClick={() => handleCall('+914066202000')}
                className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🌱</span>
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">Vandrevala Foundation</p>
                    <p className="text-sm text-green-700 dark:text-green-300">+91 40 6620 2000</p>
                  </div>
                </div>
                <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Your Privacy Matters</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">All calls are confidential and free. Trained counselors are available to help.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}