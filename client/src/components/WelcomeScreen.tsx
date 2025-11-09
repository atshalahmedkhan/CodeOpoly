import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Terminal, Play, BookOpen, X } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export default function WelcomeScreen({ onStart, onSkip }: WelcomeScreenProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to CODEOPOLY',
      content: 'A coding board game where you solve problems to buy properties and build your tech empire!',
      icon: '🚀',
    },
    {
      title: 'How to Play',
      content: 'Roll the dice, move around the board, and solve coding challenges to purchase properties. Each property earns you rent when opponents land on it.',
      icon: '🎲',
    },
    {
      title: 'Code Challenges',
      content: 'When you land on an unowned property, solve a coding problem within the time limit to purchase it. Difficulty matches property value!',
      icon: '💻',
    },
    {
      title: 'Code Duels',
      content: 'Land on an opponent\'s property? Challenge them to a code duel! Winner takes the rent pot. Speed matters!',
      icon: '⚔️',
    },
    {
      title: 'Win the Game',
      content: 'Build your tech empire by owning properties, collecting rent, and out-coding your opponents. Last player standing wins!',
      icon: '🏆',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0F172A 50%, #000000 100%)',
        }}
      >
        {!showTutorial ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="text-center max-w-2xl"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <Terminal className="w-16 h-16 text-cyan-400" />
                <motion.h1
                  className="text-6xl font-black font-mono"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #10B981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.6))',
                  }}
                  animate={{
                    filter: [
                      'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.6))',
                      'drop-shadow(0 4px 30px rgba(139, 92, 246, 0.8))',
                      'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.6))',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  CODEOPOLY
                </motion.h1>
              </div>
              <motion.p
                className="text-2xl text-cyan-400 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Where Code Meets Capitalism
              </motion.p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={onStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 text-white font-bold text-lg rounded-xl flex items-center gap-3 shadow-2xl"
                style={{
                  boxShadow: '0 0 40px rgba(6, 182, 212, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Play className="w-6 h-6" />
                Start Game
              </motion.button>
              <motion.button
                onClick={() => setShowTutorial(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800 border-2 border-cyan-500/50 text-cyan-400 font-semibold text-lg rounded-xl flex items-center gap-3 hover:border-cyan-500 transition-colors"
              >
                <BookOpen className="w-6 h-6" />
                Tutorial
              </motion.button>
              <motion.button
                onClick={onSkip}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900/50 border border-gray-700 text-gray-400 font-semibold text-lg rounded-xl hover:text-white hover:border-gray-600 transition-colors"
              >
                Skip
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black rounded-2xl border-2 border-cyan-500/50 shadow-2xl max-w-3xl w-full p-8 relative"
            style={{
              boxShadow: '0 0 60px rgba(6, 182, 212, 0.4)',
            }}
          >
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition-colors"
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
                  className="text-6xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {tutorialSteps[currentStep].icon}
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-4">
                  {tutorialSteps[currentStep].title}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {tutorialSteps[currentStep].content}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <motion.button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:border-cyan-500 transition-colors"
              >
                Previous
              </motion.button>
              
              <div className="flex gap-2">
                {tutorialSteps.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentStep ? 'bg-cyan-400' : 'bg-gray-700'
                    }`}
                    animate={{
                      scale: idx === currentStep ? 1.2 : 1,
                    }}
                  />
                ))}
              </div>

              {currentStep < tutorialSteps.length - 1 ? (
                <motion.button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  onClick={onStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-bold"
                >
                  Start Playing!
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

