import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Clock, Play, CheckCircle, XCircle, Trophy, Users, Zap } from 'lucide-react';
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
}

interface DuelModalProps {
  problem: Problem;
  opponent: { id: string; name: string; avatar: string };
  onWin: () => void;
  onLose: () => void;
  onCodeUpdate: (code: string) => void;
  opponentCode?: string;
  opponentStatus?: 'solving' | 'completed' | 'failed';
  timeLimit?: number;
  isOpen: boolean;
}

export default function DuelModal({
  problem,
  opponent,
  onWin,
  onLose,
  onCodeUpdate,
  opponentCode = '',
  opponentStatus = 'solving',
  timeLimit = 300,
  isOpen,
}: DuelModalProps) {
  const [code, setCode] = useState(problem.functionSignatures.javascript);
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'solving' | 'completed' | 'failed'>('solving');
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(timeLimit);
      setCode(problem.functionSignatures[language as keyof typeof problem.functionSignatures] || problem.functionSignatures.javascript);
      setTestResults([]);
      setStatus('solving');
      setAllTestsPassed(false);
    }
  }, [isOpen, problem, language, timeLimit]);

  useEffect(() => {
    if (isOpen && timeRemaining > 0 && status === 'solving') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus('failed');
            onLose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, timeRemaining, status, onLose]);

  // Update code to server
  useEffect(() => {
    if (code && isOpen) {
      const timeout = setTimeout(() => {
        onCodeUpdate(code);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [code, isOpen, onCodeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const mockResults = [
        { passed: true, message: 'Test case 1 passed' },
        { passed: true, message: 'Test case 2 passed' },
      ];
      setTestResults(mockResults);
      setAllTestsPassed(mockResults.every(r => r.passed));
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!allTestsPassed) {
      alert('All tests must pass before submitting!');
      return;
    }

    setIsSubmitting(true);
    
    // Calculate time-based score
    const timeBonus = timeRemaining > 0 ? Math.floor(timeRemaining / 10) : 0;
    
    setTimeout(() => {
      setStatus('completed');
      setIsSubmitting(false);
      
      // Check if we won (time-based scoring)
      const opponentTime = opponentStatus === 'completed' ? 0 : timeLimit; // Simplified
      if (timeRemaining > opponentTime || opponentStatus === 'failed') {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06B6D4', '#8B5CF6', '#10B981'],
        });
        setTimeout(() => onWin(), 2000);
      } else {
        setTimeout(() => onLose(), 2000);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-black rounded-2xl border-2 border-purple-500/50 shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col"
          style={{
            boxShadow: '0 0 80px rgba(139, 92, 246, 0.5), 0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-green-500/20 border-b-2 border-purple-500/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-black text-white">CODE DUEL</h2>
              </div>
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
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-300">You</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">{opponent.name}</span>
                <div className={`w-3 h-3 rounded-full ${
                  opponentStatus === 'completed' ? 'bg-green-400' :
                  opponentStatus === 'failed' ? 'bg-red-400' :
                  'bg-yellow-400 animate-pulse'
                }`} />
              </div>
            </div>
          </div>

          {/* Split Screen */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Your Editor */}
            <div className="border-r border-gray-800 flex flex-col">
              <div className="bg-gray-900/50 p-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-green-400 font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Your Solution
                </h3>
                <span className="text-xs text-gray-400">Time Bonus: +{Math.floor(timeRemaining / 10)}</span>
              </div>
              <div className="flex-1 bg-gray-900">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => {
                    setCode(value || '');
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: status !== 'solving',
                  }}
                />
              </div>
              <div className="bg-gray-900/50 p-3 border-t border-gray-800 flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setCode(problem.functionSignatures[e.target.value as keyof typeof problem.functionSignatures] || '');
                  }}
                  disabled={status !== 'solving'}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <motion.button
                  onClick={handleRunCode}
                  disabled={isRunning || status !== 'solving'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Run
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !allTestsPassed || status !== 'solving'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-3 h-3" />
                      Submit
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Opponent's Editor */}
            <div className="flex flex-col">
              <div className="bg-gray-900/50 p-3 border-b border-gray-800">
                <h3 className="text-purple-400 font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {opponent.name}'s Solution
                </h3>
              </div>
              <div className="flex-1 bg-gray-900">
                <Editor
                  height="100%"
                  language={language}
                  value={opponentCode || '// Waiting for opponent...'}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: true,
                  }}
                />
              </div>
              <div className="bg-gray-900/50 p-3 border-t border-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-bold ${
                    opponentStatus === 'completed' ? 'text-green-400' :
                    opponentStatus === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {opponentStatus === 'completed' ? '✓ Completed' :
                     opponentStatus === 'failed' ? '✗ Failed' :
                     '⏳ Solving...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <AnimatePresence>
            {testResults.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-900/80 border-t border-gray-800 p-4"
              >
                <h3 className="text-cyan-400 font-bold text-sm mb-2">Test Results</h3>
                <div className="grid grid-cols-2 gap-2">
                  {testResults.map((result, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className={`flex items-center gap-2 text-xs p-2 rounded ${
                        result.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{result.message}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Overlay */}
          <AnimatePresence>
            {status === 'completed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ y: 20, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    {allTestsPassed ? '🎉' : '😔'}
                  </motion.div>
                  <h3 className={`text-3xl font-black mb-2 ${
                    allTestsPassed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {allTestsPassed ? 'DUEL WON!' : 'DUEL LOST'}
                  </h3>
                  <p className="text-xl text-white">
                    {allTestsPassed ? 'You solved it faster!' : 'Opponent was faster'}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

