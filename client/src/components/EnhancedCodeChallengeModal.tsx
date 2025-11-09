import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Loader2, Play, CheckCircle, XCircle, Clock, Zap, Lightbulb } from 'lucide-react';
import ConfettiParticles from './particles/ConfettiParticles';
import { soundManager } from '../lib/soundEffects';

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

interface EnhancedCodeChallengeModalProps {
  problem: Problem;
  propertyName: string;
  propertyPrice: number;
  onSubmit: (code: string, language: string) => Promise<void>;
  onGiveUp: () => void;
  timeLimit?: number;
}

export default function EnhancedCodeChallengeModal({
  problem,
  propertyName,
  propertyPrice,
  onSubmit,
  onGiveUp,
  timeLimit = 180,
}: EnhancedCodeChallengeModalProps) {
  const [code, setCode] = useState(problem.functionSignatures.javascript);
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [syntaxValid, setSyntaxValid] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const editorRef = useRef<any>(null);

  // Calculate speed multiplier based on time
  useEffect(() => {
    const elapsed = timeLimit - timeRemaining;
    if (elapsed < 30) {
      setSpeedMultiplier(3);
    } else if (elapsed < 60) {
      setSpeedMultiplier(2);
    } else if (elapsed < 120) {
      setSpeedMultiplier(1.5);
    } else {
      setSpeedMultiplier(1);
    }
  }, [timeRemaining, timeLimit]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playCodeFailure();
          onGiveUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGiveUp]);

  // Syntax validation
  useEffect(() => {
    try {
      // Basic syntax check
      if (code.trim()) {
        new Function(code);
        setSyntaxValid(true);
      }
    } catch {
      setSyntaxValid(false);
    }
  }, [code]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const elapsed = timeLimit - timeRemaining;
    if (elapsed < 30) return '#FFD700'; // Gold
    if (elapsed < 60) return '#00FF88'; // Green
    if (elapsed < 120) return '#FFFF00'; // Yellow
    if (elapsed < 180) return '#FFA500'; // Orange
    return '#FF4444'; // Red
  };

  const getHints = () => {
    const hints = [
      'Think about the problem step by step. What data structure might help?',
      `Consider using built-in methods like ${problem.difficulty === 'easy' ? 'split(), reverse(), join()' : 'map(), filter(), reduce()'}`,
      `Here's a hint: ${problem.title.includes('Reverse') ? 'Try iterating backwards' : problem.title.includes('Sum') ? 'Use a loop to accumulate values' : 'Consider using a hash map or set'}`,
    ];
    return hints.slice(0, hintsUsed + 1);
  };

  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(hintsUsed + 1);
      setShowHints(true);
      // Reduce reward by 10% per hint
      setSpeedMultiplier(prev => prev * 0.9);
    }
  };

  const calculateReward = () => {
    const baseReward = propertyPrice;
    const hintPenalty = hintsUsed * 0.1;
    const finalMultiplier = speedMultiplier * (1 - hintPenalty);
    return Math.floor(baseReward * finalMultiplier);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    soundManager.playCodeSuccess();
    
    // Simulate test execution
    setTimeout(() => {
      const mockResults = problem.testCases.map((testCase, idx) => ({
        id: idx,
        passed: Math.random() > 0.3, // 70% pass rate for demo
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: testCase.expectedOutput, // Mock
      }));
      setTestResults(mockResults);
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!syntaxValid) return;
    
    setIsSubmitting(true);
    soundManager.playCodeSuccess();
    
    try {
      const reward = calculateReward();
      await onSubmit(code, language);
      
      // Success animation
      setConfetti(true);
      soundManager.playCodeSuccess();
      
      setTimeout(() => {
        setConfetti(false);
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSkip = timeRemaining < timeLimit - 30; // Can skip after 30 seconds
  const finalReward = calculateReward();

  return (
    <>
      <ConfettiParticles trigger={confetti} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && !isSubmitting && onGiveUp()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-4 border-emerald-400 shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
          style={{
            boxShadow: '0 0 60px rgba(16, 185, 129, 0.6), 0 0 100px rgba(16, 185, 129, 0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-white font-mono">
                {problem.title}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                problem.difficulty === 'easy' ? 'bg-green-500' :
                problem.difficulty === 'medium' ? 'bg-yellow-500' :
                'bg-red-500'
              } text-white`}>
                {problem.difficulty.toUpperCase()}
              </div>
            </div>
            
            {/* Timer with multiplier */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="text-white" size={20} />
                <div className="relative">
                  <div
                    className="text-2xl font-bold font-mono"
                    style={{ color: getTimerColor() }}
                  >
                    {formatTime(timeRemaining)}
                  </div>
                  {/* Circular progress */}
                  <svg className="absolute -top-1 -left-1" width="60" height="60">
                    <circle
                      cx="30"
                      cy="30"
                      r="28"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="30"
                      cy="30"
                      r="28"
                      fill="none"
                      stroke={getTimerColor()}
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 1 }}
                      animate={{ pathLength: timeRemaining / timeLimit }}
                      transition={{ duration: 1, ease: 'linear' }}
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Speed Multiplier */}
              <motion.div
                animate={{ scale: speedMultiplier > 1 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: speedMultiplier > 1 ? Infinity : 0 }}
                className="flex items-center gap-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg px-3 py-1"
              >
                <Zap className="text-yellow-400" size={16} />
                <span className="text-yellow-400 font-bold font-mono">
                  {speedMultiplier.toFixed(1)}x
                </span>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Description */}
            <div className="w-1/3 bg-slate-800/50 p-6 overflow-y-auto border-r border-slate-700">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Examples</h3>
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-lg p-3 mb-2">
                        <div className="text-emerald-400 text-xs font-mono mb-1">
                          Input: {example.input}
                        </div>
                        <div className="text-yellow-400 text-xs font-mono">
                          Output: {example.output}
                        </div>
                        {example.explanation && (
                          <div className="text-white/60 text-xs mt-1">
                            {example.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Constraints</h3>
                    <p className="text-white/60 text-xs font-mono">
                      {problem.constraints}
                    </p>
                  </div>
                )}

                {/* Hints Section */}
                <div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
                  >
                    <Lightbulb size={16} />
                    <span className="text-sm font-semibold">Hints ({hintsUsed}/3)</span>
                  </button>
                  {showHints && (
                    <div className="space-y-2">
                      {getHints().map((hint, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
                        >
                          <div className="text-yellow-400 text-xs">
                            Hint {idx + 1}: {hint}
                          </div>
                        </motion.div>
                      ))}
                      {hintsUsed < 3 && (
                        <button
                          onClick={useHint}
                          className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg p-2 text-yellow-400 text-xs font-semibold transition-colors"
                        >
                          Use Hint (-10% reward)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="flex-1 flex flex-col">
              {/* Editor */}
              <div className="flex-1 relative">
                <div
                  className={`absolute inset-0 border-4 transition-all duration-300 ${
                    syntaxValid
                      ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  } rounded-lg pointer-events-none z-10`}
                />
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
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                />
              </div>

              {/* Test Results */}
              <div className="bg-slate-900 border-t border-slate-700 p-4 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {testResults.length > 0 ? (
                    <div className="space-y-2">
                      {testResults.map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex items-center gap-2 p-2 rounded ${
                            result.passed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {result.passed ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          <span className="text-sm font-mono">
                            Test {idx + 1}: {result.passed ? 'PASSED' : `FAILED - Expected ${result.expected}, got ${result.actual}`}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/40 text-sm text-center">
                      Run tests to see results
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer - Actions */}
          <div className="bg-slate-800 border-t border-slate-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm">
                Property: <span className="text-emerald-400 font-semibold">{propertyName}</span>
              </div>
              <div className="text-white/60 text-sm">
                Base Reward: <span className="text-yellow-400 font-semibold">${propertyPrice}</span>
              </div>
              <div className="text-white/60 text-sm">
                Final Reward: <span className="text-green-400 font-bold text-lg">${finalReward}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {canSkip && (
                <button
                  onClick={onGiveUp}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Skip (25% reward)
                </button>
              )}
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run Tests
                  </>
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !syntaxValid}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg"
                style={{
                  boxShadow: !isSubmitting && syntaxValid
                    ? '0 0 20px rgba(16, 185, 129, 0.5)'
                    : 'none',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Submit Solution
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}






