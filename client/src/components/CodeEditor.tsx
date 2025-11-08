import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  problem: any;
  onSubmit: (code: string, language: string) => void;
  onClose: () => void;
  timeLimit?: number;
}

export default function CodeEditor({ problem, onSubmit, onClose, timeLimit = 300 }: CodeEditorProps) {
  const [code, setCode] = useState(problem?.functionSignatures?.javascript || 'function solution() {\n    // Your code here\n}');
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit(code, language);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLanguageName = (lang: string) => {
    const names: Record<string, string> = {
      python: 'Python',
      javascript: 'JavaScript',
      cpp: 'C++',
      java: 'Java',
    };
    return names[lang] || lang;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-xl">{problem?.title}</h2>
              <p className="text-white/80 text-sm">
                {problem?.difficulty?.toUpperCase()} • {problem?.category}
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
            {problem?.description}
          </pre>
          {problem?.examples && problem.examples.length > 0 && (
            <div className="mt-2">
              <p className="text-white/80 text-sm font-semibold">Examples:</p>
              {problem.examples.map((ex: any, i: number) => (
                <div key={i} className="text-white/70 text-xs mt-1">
                  <div>Input: {ex.input}</div>
                  <div>Output: {ex.output}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="p-2 bg-gray-800 border-b border-gray-700 flex gap-2">
          {['javascript', 'python', 'cpp', 'java'].map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setCode(problem?.functionSignatures?.[lang] || `function ${problem?.functionName || 'solution'}() {\n    // Your code here\n}`);
              }}
              className={`px-3 py-1 rounded text-sm ${
                language === lang
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white/80 hover:bg-gray-600'
              }`}
            >
              {getLanguageName(lang)}
            </button>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1 min-h-0">
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
            }}
            loading={<div className="h-full bg-gray-900 flex items-center justify-center text-white">Loading editor...</div>}
          />
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-800 rounded-b-lg flex items-center justify-between border-t border-gray-700">
          <div className="text-white/60 text-sm">
            Function: <code className="bg-gray-700 px-2 py-1 rounded">{problem?.functionName}</code>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || timeRemaining === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              {isSubmitting ? 'Submitting...' : '✓ Submit Solution'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

