import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Play, BookOpen, Zap, Trophy, Users } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  {
    icon: '🚀',
    title: 'Welcome to CODEOPOLY',
    description: 'The coding board game where you solve problems to build your tech empire!',
    details: 'Combine strategy, coding skills, and a bit of luck to dominate the board.',
  },
  {
    icon: '🎲',
    title: 'How to Play',
    description: 'Roll dice, move around the board, and solve coding challenges.',
    details: 'Each property requires solving a coding problem. Success earns you the property and rent from opponents!',
  },
  {
    icon: '💻',
    title: 'Code Challenges',
    description: 'Solve problems in JavaScript, Python, C++, or Java.',
    details: 'Each challenge has a time limit. Solve it correctly to purchase the property and earn Compute Credits!',
  },
  {
    icon: '⚔️',
    title: 'Code Duels',
    description: 'Challenge opponents when you land on their properties!',
    details: 'Race to solve a coding problem faster than your opponent. Winner takes the rent pot!',
  },
  {
    icon: '🏆',
    title: 'Win the Game',
    description: 'Build your empire and outlast your opponents.',
    details: 'Collect properties, earn rent, and be the last player standing with the most Compute Credits!',
  },
];

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-black rounded-2xl border-2 border-cyan-500/50 shadow-2xl max-w-2xl w-full p-8 relative"
          style={{
            boxShadow: '0 0 60px rgba(6, 182, 212, 0.4)',
          }}
        >
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition-colors"
            aria-label="Skip tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <motion.div
                className="text-7xl mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                {steps[currentStep].icon}
              </motion.div>
              
              <h2 className="text-3xl font-black text-white mb-4">
                {steps[currentStep].title}
              </h2>
              
              <p className="text-xl text-cyan-400 mb-4 font-semibold">
                {steps[currentStep].description}
              </p>
              
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                {steps[currentStep].details}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-cyan-400 w-8' : 'bg-gray-700 w-2'
                }`}
                animate={{
                  width: idx === currentStep ? 32 : 8,
                }}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors font-semibold"
            >
              Skip Tutorial
            </button>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-cyan-500 transition-colors font-semibold"
                >
                  Previous
                </button>
              )}
              
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-bold flex items-center gap-2"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Playing!
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

