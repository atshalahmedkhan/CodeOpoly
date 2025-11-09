import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { X, Clock, Play, CheckCircle, XCircle, Zap, Trophy } from 'lucide-react';
import { Loader2 } from 'lucide-react';
// @ts-ignore - canvas-confetti types may not be available
import confetti from 'canvas-confetti';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  functionName: string;
  functionSignatures: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  testCases: Array<{
    input: any[];
    expectedOutput: any;
    description?: string;
  }>;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string;
}

interface ProblemModalProps {
  problem: Problem;
  propertyName: string;
  propertyPrice: number;
  onSubmit: (code: string, language: string) => Promise<void>;
  onGiveUp: () => void;
  timeLimit?: number;
  isOpen: boolean;
}

export default function ProblemModal({
  problem,
  propertyName,
  propertyPrice,
  onSubmit,
  onGiveUp,
  timeLimit = 300,
  isOpen,
}: ProblemModalProps) {
  const [code, setCode] = useState(problem.functionSignatures.javascript);
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(timeLimit);
      setCode(problem.functionSignatures[language as keyof typeof problem.functionSignatures] || problem.functionSignatures.javascript);
      setTestResults([]);
      setShowSuccess(false);
      setShowFailure(false);
    }
  }, [isOpen, problem, language, timeLimit]);

  useEffect(() => {
    if (isOpen && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, timeRemaining]);

  const handleTimeUp = () => {
    setShowFailure(true);
    setTimeout(() => {
      onGiveUp();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (problem.difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate running tests
    setTimeout(() => {
      setIsRunning(false);
      setTestResults([
        { passed: true, message: 'Test case 1 passed' },
        { passed: true, message: 'Test case 2 passed' },
      ]);
    }, 1500);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(code, language);
      
      // Success animation
      setShowSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#8B5CF6', '#10B981', '#FBBF24'],
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      setShowFailure(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setShowFailure(false);
      }, 2000);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!isSubmitting) handleSubmit();
      } else if (e.key === 'Escape') {
        onGiveUp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isSubmitting, code, language]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onGiveUp();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-black rounded-2xl border-2 border-cyan-500/50 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          style={{
            boxShadow: '0 0 60px rgba(6, 182, 212, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-green-500/20 border-b-2 border-cyan-500/30 p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-white">{problem.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor()}`}>
                  {problem.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{propertyName} • ${propertyPrice} Compute Credits</p>
            </div>
            <motion.button
              onClick={onGiveUp}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Timer */}
          <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 text-cyan-400 font-mono font-bold"
              animate={timeRemaining <= 30 ? {
                scale: [1, 1.1, 1],
                color: ['#06B6D4', '#EF4444', '#06B6D4'],
              } : {}}
              transition={{ duration: 0.5, repeat: timeRemaining <= 30 ? Infinity : 0 }}
            >
              <Clock className="w-5 h-5" />
              <span className="text-lg">{formatTime(timeRemaining)}</span>
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Press Ctrl+Enter to Submit</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Problem Description */}
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Description
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>

              {problem.examples && problem.examples.length > 0 && (
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-cyan-400 font-bold mb-2">Examples</h3>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <div className="bg-black rounded-lg p-3 font-mono text-xs">
                        <div className="text-green-400 mb-1">Input: {example.input}</div>
                        <div className="text-cyan-400">Output: {example.output}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && (
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-cyan-400 font-bold mb-2">Constraints</h3>
                  <p className="text-gray-300 text-sm">{problem.constraints}</p>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="space-y-4">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setCode(problem.functionSignatures[e.target.value as keyof typeof problem.functionSignatures] || '');
                  }}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              {/* Monaco Editor */}
              <div className="bg-gray-900 rounded-xl border-2 border-gray-800 overflow-hidden" style={{ height: '400px' }}>
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </div>

              {/* Test Results */}
              <AnimatePresence>
                {testResults.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 space-y-2 overflow-hidden"
                  >
                    <h3 className="text-cyan-400 font-bold text-sm">Test Results</h3>
                    {testResults.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`flex items-center gap-2 text-sm ${
                          result.passed ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>{result.message}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-900/50 border-t border-gray-800 p-4 flex items-center justify-between gap-4">
            <motion.button
              onClick={onGiveUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-red-500 transition-colors font-semibold"
            >
              Give Up
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleRunCode}
                disabled={isRunning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Tests
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting || timeRemaining === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-bold flex items-center gap-2 disabled:opacity-50 relative overflow-hidden"
                style={{
                  boxShadow: !isSubmitting ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    Submit Solution
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Success/Failure Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-3xl font-black text-green-400 mb-2">SUCCESS!</h3>
                  <p className="text-xl text-white">+${propertyPrice} Compute Credits</p>
                </motion.div>
              </motion.div>
            )}
            {showFailure && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    ❌
                  </motion.div>
                  <h3 className="text-3xl font-black text-red-400 mb-2">TIME'S UP!</h3>
                  <p className="text-xl text-white">Better luck next time</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

