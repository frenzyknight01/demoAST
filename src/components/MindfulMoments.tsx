import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2,
  VolumeX,
  Clock,
  Wind,
  Mountain,
  Waves,
  Flame,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

export function MindfulMoments() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { addMindfulnessSession } = useApp();
  const { user } = useAuth();

  const exercises = [
    {
      id: 'breathing',
      title: 'Guided Breathing',
      description: 'Follow the rhythm and breathe deeply',
      icon: Wind,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      type: 'breathing' as const,
      durations: [2, 5, 10, 15]
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Connect with your senses',
      icon: Mountain,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      type: 'grounding' as const,
      durations: [5, 10]
    },
    {
      id: 'meditation',
      title: 'Mindful Meditation',
      description: 'Find your inner peace',
      icon: Waves,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      type: 'meditation' as const,
      durations: [5, 10, 15, 20]
    },
    {
      id: 'visualization',
      title: 'Peaceful Visualization',
      description: 'Imagine your safe space',
      icon: Flame,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      type: 'visualization' as const,
      durations: [10, 15, 20]
    }
  ];

  const ambientSounds = [
    { id: 'rain', name: 'Rain', emoji: '🌧️', url: 'https://www.soundjay.com/misc/sounds/rain-01.wav', description: 'Gentle rainfall sounds' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav', description: 'Calming ocean waves' },
    { id: 'forest', name: 'Forest Birds', emoji: '🌲', url: 'https://www.soundjay.com/misc/sounds/forest-birds.wav', description: 'Peaceful forest ambience' },
    { id: 'cafe', name: 'Coffee Shop', emoji: '☕', url: 'https://www.soundjay.com/misc/sounds/cafe-ambience.wav', description: 'Cozy café atmosphere' },
    { id: 'fireplace', name: 'Fireplace', emoji: '🔥', url: 'https://www.soundjay.com/misc/sounds/fireplace.wav', description: 'Crackling fireplace' },
    { id: 'wind', name: 'Wind Chimes', emoji: '🎐', url: 'https://www.soundjay.com/misc/sounds/wind-chimes.wav', description: 'Gentle wind chimes' },
    { id: 'thunder', name: 'Thunder', emoji: '⛈️', url: 'https://www.soundjay.com/misc/sounds/thunder.wav', description: 'Distant thunder' },
    { id: 'piano', name: 'Soft Piano', emoji: '🎹', url: 'https://www.soundjay.com/misc/sounds/piano-ambient.wav', description: 'Peaceful piano melodies' },
    { id: 'white-noise', name: 'White Noise', emoji: '🌫️', url: '', description: 'Consistent background noise' },
    { id: 'brown-noise', name: 'Brown Noise', emoji: '🟤', url: '', description: 'Deep, warm background sound' }
  ];

  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement | AudioContext }>({});

  const playAmbientSound = (soundId: string) => {
    // Stop currently playing sound
    if (playingSound) {
      const currentAudio = audioElements[playingSound];
      if (currentAudio instanceof HTMLAudioElement) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } else if (currentAudio instanceof AudioContext) {
        currentAudio.close();
      }
    }

    if (playingSound === soundId) {
      setPlayingSound(null);
      return;
    }

    // Generate different types of sounds
    if (soundId === 'white-noise' || soundId === 'brown-noise') {
      // Generate synthetic noise
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = audioContext.sampleRate * 2; // 2 seconds of audio
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        if (soundId === 'white-noise') {
          output[i] = Math.random() * 2 - 1;
        } else {
          // Brown noise (filtered white noise)
          output[i] = (Math.random() * 2 - 1) * 0.1;
        }
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.3;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start();
      
      setAudioElements(prev => ({ ...prev, [soundId]: audioContext }));
      setPlayingSound(soundId);
    } else {
      // Create or get audio element for other sounds
      let audio = audioElements[soundId] as HTMLAudioElement;
      if (!audio) {
        const sound = ambientSounds.find(s => s.id === soundId);
        if (sound) {
          audio = new Audio();
          audio.loop = true;
          audio.volume = 0.5;
          // For demo purposes, create a simple tone
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Different frequencies for different sounds
          const frequencies: { [key: string]: number } = {
            'rain': 200,
            'ocean': 100,
            'forest': 800,
            'cafe': 300,
            'fireplace': 150,
            'wind': 400,
            'thunder': 80,
            'piano': 440
          };
          
          oscillator.frequency.setValueAtTime(frequencies[soundId] || 200, audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1;
          oscillator.start();
          
          setAudioElements(prev => ({ ...prev, [soundId]: audioContext }));
          setPlayingSound(soundId);
          return;
        }
      }
      
      if (audio instanceof HTMLAudioElement) {
        audio.play().catch(console.error);
        setPlayingSound(soundId);
      }
    }

  };
  
  const startExercise = (exerciseId: string) => {
    setActiveExercise(exerciseId);
    setIsPlaying(true);
    setCurrentTime(0);
    setCycleCount(0);
    
    if (exerciseId === 'breathing') {
      startBreathingCycle();
    } else {
      startTimer();
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (newTime >= selectedDuration * 60) {
          completeExercise();
          return prev;
        }
        return newTime;
      });
    }, 1000);
  };

  const startBreathingCycle = () => {
    const phases = [
      { phase: 'inhale' as const, duration: 4000 },
      { phase: 'hold' as const, duration: 4000 },
      { phase: 'exhale' as const, duration: 6000 }
    ];
    
    let currentPhaseIndex = 0;
    setBreathingPhase(phases[0].phase);
    
    const runPhase = () => {
      const currentPhaseData = phases[currentPhaseIndex];
      setBreathingPhase(currentPhaseData.phase);
      
      breathingTimerRef.current = setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          setCycleCount(prev => prev + 1);
          setCurrentTime(prev => prev + 14); // 14 seconds per cycle
        }
        
        if (currentTime < selectedDuration * 60) {
          runPhase();
        } else {
          completeExercise();
        }
      }, currentPhaseData.duration);
    };
    
    runPhase();
  };

  const pauseExercise = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
  };

  const resumeExercise = () => {
    setIsPlaying(true);
    if (activeExercise === 'breathing') {
      startBreathingCycle();
    } else {
      startTimer();
    }
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCycleCount(0);
    setBreathingPhase('inhale');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
  };

  const completeExercise = () => {
    setIsPlaying(false);
    const exercise = exercises.find(ex => ex.id === activeExercise);
    
    if (user && exercise) {
      addMindfulnessSession({
        userId: user.id,
        type: exercise.type,
        duration: Math.floor(currentTime / 60) || selectedDuration,
        completedAt: new Date()
      });
    }
    
    // Reset after a short delay
    setTimeout(() => {
      setActiveExercise(null);
      resetExercise();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getBreathingCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 'scale-125';
      case 'hold': return 'scale-125';
      case 'exhale': return 'scale-75';
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    };
  }, []);

  if (activeExercise) {
    const exercise = exercises.find(ex => ex.id === activeExercise)!;
    const Icon = exercise.icon;
    const progress = (currentTime / (selectedDuration * 60)) * 100;
    const isCompleted = progress >= 100;

    return (
      <div className={`min-h-screen ${exercise.bgColor} flex flex-col items-center justify-center p-6`}>
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{exercise.title}</h2>
            <p className="text-gray-600">{exercise.description}</p>
          </div>

          {/* Main Exercise Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center mb-8">
            {activeExercise === 'breathing' ? (
              <>
                <div className="mb-8">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${exercise.color} transition-transform duration-1000 flex items-center justify-center ${getBreathingCircleScale()}`}>
                    <Wind className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {getBreathingInstruction()}
                </h3>
                
                <div className="text-lg text-gray-600 mb-4">
                  Cycle {cycleCount + 1} • {formatTime(currentTime)} / {selectedDuration}:00
                </div>
              </>
            ) : activeExercise === 'grounding' ? (
              <GroundingExercise currentTime={currentTime} />
            ) : (
              <>
                <div className="mb-8">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${exercise.color} flex items-center justify-center animate-pulse`}>
                    <Icon className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {isCompleted ? 'Session Complete!' : 'Stay Present'}
                </h3>
                
                <div className="text-lg text-gray-600 mb-4">
                  {formatTime(currentTime)} / {selectedDuration}:00
                </div>
              </>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className={`bg-gradient-to-r ${exercise.color} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {isCompleted && (
              <div className="text-green-600 mb-4">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Well done! You completed your mindful moment.</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={isPlaying ? pauseExercise : resumeExercise}
              disabled={isCompleted}
              className="bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            
            <button
              onClick={resetExercise}
              className="bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setActiveExercise(null);
                resetExercise();
              }}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to exercises
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mindful Moments</h1>
        <p className="text-gray-600">Take a moment to center yourself and find peace</p>
      </div>

      {/* Exercise Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <div
              key={exercise.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exercise.color} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
                  <p className="text-gray-600 text-sm">{exercise.description}</p>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duration
                </label>
                <div className="flex space-x-2">
                  {exercise.durations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDuration === duration
                          ? `bg-gradient-to-r ${exercise.color} text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {duration}m
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => startExercise(exercise.id)}
                className={`w-full bg-gradient-to-r ${exercise.color} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2`}
              >
                <Play className="h-5 w-5" />
                <span>Start Session</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Ambient Sounds */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ambient Sounds</h2>
        <p className="text-gray-600 mb-6">Create a peaceful atmosphere with these calming background sounds</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ambientSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => playAmbientSound(sound.id)}
              className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 text-center border-2 ${
                playingSound === sound.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className="text-3xl mb-2">{sound.emoji}</div>
              <div className="font-medium text-gray-900 text-sm">{sound.name}</div>
              <div className="text-xs text-gray-500 mt-1">{sound.description}</div>
              {playingSound === sound.id && (
                <div className="mt-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mx-auto"></div>
                  <div className="text-xs text-blue-600 font-medium">Playing</div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {playingSound && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 font-medium">
              🎵 Playing: {ambientSounds.find(s => s.id === playingSound)?.name}
            </p>
            <button
              onClick={() => playAmbientSound(playingSound)}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Stop Sound
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for the grounding exercise
function GroundingExercise({ currentTime }: { currentTime: number }) {
  const steps = [
    { time: 0, instruction: "Look around and name 5 things you can see", duration: 60 },
    { time: 60, instruction: "Listen carefully and name 4 things you can hear", duration: 60 },
    { time: 120, instruction: "Touch and name 3 things you can feel", duration: 60 },
    { time: 180, instruction: "Notice 2 things you can smell", duration: 60 },
    { time: 240, instruction: "Think of 1 thing you can taste", duration: 60 }
  ];

  const currentStep = steps.findIndex(step => currentTime >= step.time && currentTime < step.time + step.duration);
  const activeStep = steps[currentStep] || steps[steps.length - 1];

  return (
    <>
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-pulse">
          <Mountain className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Step {Math.min(currentStep + 1, 5)} of 5
      </h3>
      
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {activeStep.instruction}
      </p>
      
      <div className="text-sm text-gray-600">
        {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 5:00
      </div>
    </>
  );
}