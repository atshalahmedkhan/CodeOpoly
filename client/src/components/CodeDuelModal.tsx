import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Loader2, Trophy, X } from 'lucide-react';
import { Problem } from '../data/problemBank';
import { executeCode } from '../services/judge0Service';

interface CodeDuelModalProps {
  problem: Problem;
  opponent: { id: string; name: string; avatar: string };
  onWin: () => void;
  onLose: () => void;
  onCodeUpdate: (code: string) => void;
  opponentCode?: string;
  opponentStatus?: 'solving' | 'completed' | 'failed';
  timeLimit?: number;
}

export default function CodeDuelModal({
  problem,
  opponent,
  onWin,
  onLose,
  onCodeUpdate,
  opponentCode = '',
  opponentStatus = 'solving',
  timeLimit = 300,
}: CodeDuelModalProps) {
  const [code, setCode] = useState(problem.functionSignatures.javascript);
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'solving' | 'completed' | 'failed'>('solving');
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (status === 'solving') {
            setStatus('failed');
            onLose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, onLose]);

  useEffect(() => {
    // Notify parent of code changes
    const timeout = setTimeout(() => {
      onCodeUpdate(code);
    }, 500);
    return () => clearTimeout(timeout);
  }, [code, onCodeUpdate]);

  useEffect(() => {
    // Check if opponent won
    if (opponentStatus === 'completed' && status === 'solving') {
      setStatus('failed');
      onLose();
    }
  }, [opponentStatus, status, onLose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const results = await executeCode(code, language, problem.testCases);
      setTestResults(results);
      const passed = results.every(r => r.passed);
      setAllTestsPassed(passed);
    } catch (error: any) {
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const startTime = Date.now();
    try {
      const results = await executeCode(code, language, problem.testCases);
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000); // seconds
      
      setTestResults(results);
      const passed = results.every(r => r.passed);
      
      if (passed) {
        setStatus('completed');
        // Time-based scoring: <10s = full reward, otherwise scaled
        const timeBonus = timeTaken < 10 ? 1.0 : Math.max(0.5, 1.0 - (timeTaken - 10) / 100);
        setAllTestsPassed(true);
        // Notify parent with time taken for scoring
        onWin();
      } else {
        setStatus('failed');
        onLose();
      }
    } catch (error: any) {
      setStatus('failed');
      onLose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col border-4 border-red-500"
        style={{
          boxShadow: '0 0 60px rgba(239, 68, 68, 0.5)',
        }}
      >
        {/* Header - Duel Status */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-t-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white font-mono">⚔️ CODE DUEL</h2>
              <div className={`text-2xl font-bold font-mono ${timeRemaining < 60 ? 'text-yellow-300 animate-pulse' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm font-mono">vs {opponent.name}</div>
              <div className="text-white/60 text-xs font-mono">
                {opponentStatus === 'completed' && '✅ Opponent Solved!'}
                {opponentStatus === 'failed' && '❌ Opponent Failed'}
                {opponentStatus === 'solving' && '⏳ Opponent Solving...'}
              </div>
            </div>
          </div>
          
          {/* Status Bars */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-white/80 text-xs font-mono mb-1">You</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: status === 'completed' ? '100%' : status === 'failed' ? '0%' : '50%' }}
                  className={`h-full ${
                    status === 'completed' ? 'bg-green-500' : 
                    status === 'failed' ? 'bg-red-500' : 
                    'bg-blue-500'
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="text-white/80 text-xs font-mono mb-1">{opponent.name}</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: opponentStatus === 'completed' ? '100%' : opponentStatus === 'failed' ? '0%' : '50%' }}
                  className={`h-full ${
                    opponentStatus === 'completed' ? 'bg-green-500' : 
                    opponentStatus === 'failed' ? 'bg-red-500' : 
                    'bg-orange-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0 overflow-hidden">
          {/* Left Side - Your Code */}
          <div className="flex flex-col space-y-4 border-r-2 border-slate-700 pr-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white font-mono">Your Solution</h3>
            </div>
            
            {/* Language Selector */}
            <div className="flex gap-2">
              {['javascript', 'python', 'cpp', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setCode(problem.functionSignatures[lang as keyof typeof problem.functionSignatures] || '');
                  }}
                  disabled={status !== 'solving'}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    language === lang
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-slate-700 text-white/80 hover:bg-slate-600'
                  } ${status !== 'solving' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Your Editor */}
            <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => {
                  if (status === 'solving') {
                    setCode(value || '');
                  }
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: status !== 'solving',
                }}
              />
            </div>

            {/* Your Test Results */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 max-h-32 overflow-y-auto">
              <h4 className="text-white font-semibold mb-2 font-mono text-sm">Your Results:</h4>
              {testResults.length === 0 ? (
                <p className="text-white/60 text-xs font-mono">Run code to see results...</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded text-xs font-mono ${
                        result.passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {result.passed ? '✅' : '❌'} Test {i + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Your Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting || status !== 'solving'}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all font-mono text-sm flex items-center justify-center gap-2"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : '▶️ Run'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isRunning || status !== 'solving'}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all font-mono text-sm"
              >
                {isSubmitting ? 'Submitting...' : '⚔️ Submit'}
              </button>
            </div>
          </div>

          {/* Right Side - Opponent's Code (Read-only) */}
          <div className="flex flex-col space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white font-mono">{opponent.name}'s Solution</h3>
            </div>
            
            {/* Opponent's Editor (Read-only) */}
            <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden opacity-75">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={opponentCode || '// Waiting for opponent to start coding...'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: true,
                }}
              />
            </div>

            {/* Opponent Status */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <h4 className="text-white font-semibold mb-2 font-mono text-sm">Opponent Status:</h4>
              <div className="text-white/80 text-xs font-mono">
                {opponentStatus === 'completed' && '✅ All tests passed!'}
                {opponentStatus === 'failed' && '❌ Failed to solve'}
                {opponentStatus === 'solving' && '⏳ Still solving...'}
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description (Bottom) */}
        <div className="bg-slate-800/70 p-4 border-t border-slate-700 max-h-48 overflow-y-auto">
          <h3 className="text-emerald-400 font-bold mb-2 font-mono">{problem.title}</h3>
          <p className="text-white/80 text-sm font-mono whitespace-pre-wrap">{problem.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

