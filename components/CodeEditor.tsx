'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Problem } from '@/types/game';
import { executeCode } from '@/lib/codeExecutor';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-full bg-gray-900 flex items-center justify-center text-white">Loading editor...</div>
});

interface CodeEditorProps {
  problem: Problem;
  onSubmit: (code: string) => void;
  onClose: () => void;
  timeLimit?: number; // seconds
}

export default function CodeEditor({ problem, onSubmit, onClose, timeLimit = 600 }: CodeEditorProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRun = () => {
    setIsRunning(true);
    const result = executeCode(code, problem);
    setTestResults(result);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    const result = executeCode(code, problem);
    if (result.success) {
      onSubmit(code);
    } else {
      setTestResults(result);
      alert(`Solution incorrect: ${result.error}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-xl">{problem.title}</h2>
              <p className="text-white/80 text-sm">
                {problem.difficulty.toUpperCase()} • {problem.category}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={onClose}
                className="mt-2 text-white/80 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 max-h-32 overflow-y-auto">
          <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono">
            {problem.description}
          </pre>
        </div>

        {/* Code Editor */}
        <div className="flex-1 min-h-0">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Test Results */}
        {testResults && (
          <div className={`p-4 border-t border-gray-700 ${
            testResults.success ? 'bg-green-900/30' : 'bg-red-900/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold ${testResults.success ? 'text-green-400' : 'text-red-400'}`}>
                  {testResults.success ? '✓ All tests passed!' : '✗ Tests failed'}
                </p>
                <p className="text-white/80 text-sm">
                  {testResults.passedTests} / {testResults.totalTests} tests passed
                </p>
                {testResults.error && (
                  <p className="text-red-400 text-sm mt-1">{testResults.error}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 bg-gray-800 rounded-b-lg flex items-center justify-between border-t border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              {isRunning ? 'Running...' : '▶ Run Tests'}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              ✓ Submit Solution
            </button>
          </div>
          <div className="text-white/60 text-sm">
            Function: <code className="bg-gray-700 px-2 py-1 rounded">{problem.functionName}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

