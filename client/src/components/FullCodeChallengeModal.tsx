import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

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

interface FullCodeChallengeModalProps {
  problem: Problem;
  propertyName: string;
  propertyPrice: number;
  onSubmit: (code: string, language: string) => Promise<void>;
  onGiveUp: () => void;
  timeLimit?: number;
}

export default function FullCodeChallengeModal({
  problem,
  propertyName,
  propertyPrice,
  onSubmit,
  onGiveUp,
  timeLimit = 300,
}: FullCodeChallengeModalProps) {
  const [code, setCode] = useState(problem.functionSignatures.javascript);
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGiveUp(); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGiveUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // This will be handled by Judge0 service
    // For now, show placeholder
    setTimeout(() => {
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // MOCKED SUBMISSION: 3-second delay, then success
    setTimeout(async () => {
      try {
        // Show success notification
        const successMessage = `✅ PASS: Accepted Solution! +${propertyPrice} Algo-Coins`;
        
        // Create a temporary success state
        setTestResults([
          { passed: true, message: successMessage },
          { passed: true, message: 'All test cases passed!' },
        ]);
        
        // Wait a moment to show the success, then submit
        setTimeout(() => {
          onSubmit(code, language);
        }, 1000);
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }, 3000);
  };

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col border-4 border-emerald-400"
        style={{
          boxShadow: '0 0 60px rgba(16, 185, 129, 0.5)',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-mono">{problem.title}</h2>
            <p className="text-white/80 text-sm font-mono">
              {propertyName} • ${propertyPrice} • {problem.difficulty.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold font-mono ${timeRemaining < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={onGiveUp}
              className="mt-2 text-white/80 hover:text-white text-sm font-mono"
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0 overflow-hidden">
          {/* Left Side - Problem Description (40%) */}
          <div className="flex flex-col space-y-4 overflow-y-auto pr-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-bold font-mono ${difficultyColors[problem.difficulty]}`}>
                  {problem.difficulty.toUpperCase()}
                </span>
                <span className="text-white/60 text-sm font-mono">• {problem.category}</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <pre className="text-white/90 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                  {problem.description}
                </pre>
              </div>
            </div>

            {problem.examples && problem.examples.length > 0 && (
              <div>
                <h3 className="text-emerald-400 font-semibold mb-2 font-mono">Examples:</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3 mb-2 border border-slate-700">
                    <div className="text-blue-400 text-sm font-mono mb-1">
                      <strong>Input:</strong> {ex.input}
                    </div>
                    <div className="text-green-400 text-sm font-mono">
                      <strong>Output:</strong> {ex.output}
                    </div>
                    {ex.explanation && (
                      <div className="text-white/60 text-xs font-mono mt-1">
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && (
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2 font-mono">Constraints:</h3>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <pre className="text-white/80 text-sm font-mono whitespace-pre-wrap">
                    {problem.constraints}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Code Editor (60%) */}
          <div className="flex flex-col space-y-4">
            {/* Language Selector */}
            <div className="flex gap-2">
              {['javascript', 'python', 'cpp', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setCode(problem.functionSignatures[lang as keyof typeof problem.functionSignatures] || '');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                    language === lang
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-slate-700 text-white/80 hover:bg-slate-600'
                  }`}
                  style={{
                    boxShadow: language === lang ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none',
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  fontFamily: 'Monaco, "Courier New", monospace',
                  lineNumbers: 'on',
                }}
              />
            </div>

            {/* Test Results */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 max-h-48 overflow-y-auto">
              <h3 className="text-white font-semibold mb-2 font-mono">Test Results:</h3>
              {testResults.length === 0 ? (
                <p className="text-white/60 text-sm font-mono">Run your code to see results...</p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-900/30 border-green-500'
                          : 'bg-red-900/30 border-red-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{result.passed ? '✅' : '❌'}</span>
                        <span className="text-white font-mono text-sm">
                          Test Case {i + 1}
                        </span>
                      </div>
                      {!result.passed && (
                        <div className="text-white/80 text-xs font-mono space-y-1 mt-2">
                          <div>Input: {JSON.stringify(result.input)}</div>
                          <div>Expected: {JSON.stringify(result.expected)}</div>
                          <div>Got: {JSON.stringify(result.actual)}</div>
                          {result.error && (
                            <div className="text-red-400">Error: {result.error}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all font-mono flex items-center justify-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running...
                  </>
                ) : (
                  '▶️ Run Code'
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isRunning}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg font-mono flex items-center justify-center gap-2"
                style={{
                  boxShadow: isSubmitting ? 'none' : '0 0 25px rgba(16, 185, 129, 0.6)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  '✅ Submit Solution'
                )}
              </button>
              <button
                onClick={onGiveUp}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all font-mono"
              >
                ❌ Give Up
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

