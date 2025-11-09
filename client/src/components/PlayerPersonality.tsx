import { useState, useEffect } from 'react';
import PlayerAvatar, { Expression } from './PlayerAvatar';
import { useAvatarExpression } from './PlayerAvatar';

export type PersonalityType = 'optimizer' | 'bug-hunter' | 'architect' | 'cowboy-coder';

interface PlayerPersonalityProps {
  avatar: string;
  name: string;
  personality: PersonalityType;
  isActive: boolean;
  gameEvent?: string;
}

const PERSONALITY_CATCHPHRASES: Record<PersonalityType, {
  celebrate: string[];
  frustrated: string[];
  thinking: string[];
  default: string[];
}> = {
  optimizer: {
    celebrate: ['Optimal move executed!', 'Efficiency achieved!', 'Performance optimized!'],
    frustrated: ['This algorithm needs refactoring...', 'Suboptimal solution detected.', 'Inefficient move!'],
    thinking: ['Calculating optimal path...', 'Analyzing efficiency...', 'Optimizing strategy...'],
    default: ['Maintaining efficiency.', 'Monitoring performance.', 'Staying optimal.'],
  },
  'bug-hunter': {
    celebrate: ["That's not a bug, it's a feature!", 'Bug squashed!', 'Issue resolved!'],
    frustrated: ['Found the bug... it\'s my luck.', 'Critical error detected.', 'Unexpected behavior!'],
    thinking: ['Investigating potential issues...', 'Debugging strategy...', 'Looking for bugs...'],
    default: ['Scanning for bugs.', 'Monitoring system.', 'On the hunt.'],
  },
  architect: {
    celebrate: ['According to my design patterns...', 'Architecture approved!', 'System designed!'],
    frustrated: ["This wasn't in the UML diagram!", 'Design violation!', 'Architecture compromised!'],
    thinking: ['Designing solution...', 'Planning architecture...', 'Structuring approach...'],
    default: ['Maintaining structure.', 'Following design.', 'Architecting solutions.'],
  },
  'cowboy-coder': {
    celebrate: ['YOLO! Ship it!', 'Works on my machine!', 'Deployed!'],
    frustrated: ["We'll fix it in prod!", 'Ship first, ask questions later!', 'Technical debt acquired!'],
    thinking: ['YOLO mode activated...', 'Sending it...', 'Going for it!'],
    default: ['Ready to ship.', 'Living dangerously.', 'Coding cowboy style.'],
  },
};

export default function PlayerPersonality({
  avatar,
  name,
  personality,
  isActive,
  gameEvent,
}: PlayerPersonalityProps) {
  const { expression, setExpressionForEvent } = useAvatarExpression();
  const [speechText, setSpeechText] = useState<string>('');

  const getRandomPhrase = (category: keyof typeof PERSONALITY_CATCHPHRASES[PersonalityType]) => {
    const phrases = PERSONALITY_CATCHPHRASES[personality][category];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  useEffect(() => {
    if (gameEvent) {
      setExpressionForEvent(gameEvent);
      
      // Set speech text based on event
      switch (gameEvent) {
        case 'dice-roll':
          setSpeechText(getRandomPhrase('thinking'));
          break;
        case 'landed-expensive':
          setSpeechText(getRandomPhrase('frustrated'));
          break;
        case 'purchased-property':
          setSpeechText(getRandomPhrase('celebrate'));
          break;
        case 'passed-go':
          setSpeechText('$200! Sweet!');
          break;
        case 'bankrupt':
          setSpeechText('GG...');
          break;
        case 'won':
          setSpeechText('I am root!');
          break;
        case 'waiting':
          setSpeechText(getRandomPhrase('thinking'));
          break;
        default:
          setSpeechText('');
      }

      // Clear speech after 3 seconds
      if (gameEvent !== 'waiting') {
        setTimeout(() => setSpeechText(''), 3000);
      }
    }
  }, [gameEvent, personality]);

  return (
    <div className="flex flex-col items-center gap-2">
      <PlayerAvatar
        avatar={avatar}
        name={name}
        expression={expression}
        size="large"
        isActive={isActive}
        showSpeechBubble={!!speechText}
        speechText={speechText}
      />
      <div className="text-xs font-mono text-white/80 text-center">
        {name}
      </div>
      <div className="text-[10px] font-mono text-emerald-400/60 capitalize">
        {personality.replace('-', ' ')}
      </div>
    </div>
  );
}

