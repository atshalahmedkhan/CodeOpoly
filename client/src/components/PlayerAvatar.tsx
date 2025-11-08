import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type AvatarStyle = 'robot' | 'human' | 'cat' | 'fox' | 'owl' | 'penguin';
export type Expression = 'default' | 'happy' | 'thinking' | 'frustrated' | 'excited' | 'sleeping' | 'shocked' | 'devastated' | 'ecstatic';

interface PlayerAvatarProps {
  avatar: string;
  name: string;
  expression?: Expression;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
  showSpeechBubble?: boolean;
  speechText?: string;
  onExpressionChange?: (expression: Expression) => void;
}

const AVATAR_EMOJIS: Record<AvatarStyle, string> = {
  robot: '🤖',
  human: '👨‍💻',
  cat: '🐱',
  fox: '🦊',
  owl: '🦉',
  penguin: '🐧',
};

const EXPRESSION_MAP: Record<Expression, string> = {
  default: '😐',
  happy: '😊',
  thinking: '🤔',
  frustrated: '😤',
  excited: '✨',
  sleeping: '😴',
  shocked: '😱',
  devastated: '😢',
  ecstatic: '🎉',
};

export default function PlayerAvatar({
  avatar,
  name,
  expression = 'default',
  size = 'medium',
  isActive = false,
  showSpeechBubble = false,
  speechText,
  onExpressionChange,
}: PlayerAvatarProps) {
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-20 h-20 text-4xl',
  };

  const [currentExpression, setCurrentExpression] = useState<Expression>(expression);

  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  const expressionEmoji = EXPRESSION_MAP[currentExpression] || avatar;

  return (
    <div className="relative inline-block">
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative ${
          isActive ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''
        }`}
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          y: currentExpression === 'sleeping' ? [0, -2, 0] : 0,
        }}
        transition={{
          duration: isActive ? 2 : 0.5,
          repeat: isActive ? Infinity : currentExpression === 'sleeping' ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{
          backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.5)',
        }}
      >
        <motion.div
          key={currentExpression}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          {expressionEmoji}
        </motion.div>

        {/* Idle animation for default expression */}
        {currentExpression === 'default' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 0px rgba(16, 185, 129, 0)',
                '0 0 10px rgba(16, 185, 129, 0.5)',
                '0 0 0px rgba(16, 185, 129, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white/95 rounded-lg shadow-lg border-2 border-emerald-400 whitespace-nowrap z-50"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
            }}
          >
            <div className="text-xs font-mono text-slate-900 font-semibold">
              {speechText}
            </div>
            {/* Speech bubble tail */}
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid white',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing avatar expressions based on game events
export function useAvatarExpression() {
  const [expression, setExpression] = useState<Expression>('default');

  const setExpressionForEvent = (event: string) => {
    switch (event) {
      case 'dice-roll':
        setExpression('excited');
        setTimeout(() => setExpression('default'), 2000);
        break;
      case 'landed-expensive':
        setExpression('shocked');
        setTimeout(() => setExpression('frustrated'), 1000);
        break;
      case 'purchased-property':
        setExpression('happy');
        setTimeout(() => setExpression('default'), 2000);
        break;
      case 'passed-go':
        setExpression('happy');
        setTimeout(() => setExpression('default'), 2000);
        break;
      case 'bankrupt':
        setExpression('devastated');
        break;
      case 'won':
        setExpression('ecstatic');
        break;
      case 'waiting':
        setExpression('thinking');
        setTimeout(() => setExpression('sleeping'), 5000);
        break;
      case 'low-money':
        setExpression('frustrated');
        setTimeout(() => setExpression('default'), 3000);
        break;
      default:
        setExpression('default');
    }
  };

  return { expression, setExpression, setExpressionForEvent };
}








