import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

interface Problem {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  functionName: string;
  functionSignatures: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  testCases: any[];
  examples?: any[];
}

interface ChallengeModuleProps {
  problem: Problem | null;
  propertyName: string;
  propertyPrice: number;
  onSubmit: (code: string, language: string) => void;
  onClose: () => void;
}

export default function ChallengeModule({
  problem,
  propertyName,
  propertyPrice,
  onSubmit,
  onClose,
}: ChallengeModuleProps) {
  const [code, setCode] = useState(problem?.functionSignatures?.javascript || '');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!problem) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit(code, language);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-4 border-emerald-400 shadow-2xl z-50"
      style={{
        boxShadow: '0 -10px 50px rgba(16, 185, 129, 0.3), inset 0 0 50px rgba(16, 185, 129, 0.1)',
      }}
    >
      <div className="container mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge Description */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-mono mb-1">
                  {problem.title}
                </h2>
                <p className="text-emerald-400 text-sm font-mono">
                  {propertyName} • ${propertyPrice}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 max-h-64 overflow-y-auto">
              <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono">
                {problem.description}
              </pre>
              
              {problem.examples && problem.examples.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-emerald-400 font-semibold text-sm font-mono">Examples:</p>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-slate-900/50 p-2 rounded text-xs font-mono">
                      <div className="text-blue-400">Input: {ex.input}</div>
                      <div className="text-green-400">Output: {ex.output}</div>
                    </div>
                  ))}
                </div>
              )}
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
                  className={`px-3 py-1 rounded text-sm font-mono transition-all ${
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
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700" style={{ height: '300px' }}>
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
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg font-mono text-lg"
              style={{
                boxShadow: isSubmitting 
                  ? 'none' 
                  : '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3)',
              }}
            >
              {isSubmitting ? 'SUBMITTING...' : '✓ SUBMIT & BUY PROPERTY'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

