import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Property {
  id: string;
  name: string;
  price: number;
  rent: number;
  rentWithHouse?: number[];
  color: string;
  position: number;
  ownerId?: string;
  houses?: number;
  category?: string;
}

interface AnimatedPropertyCardProps {
  property: Property;
  owner?: { name: string; avatar: string } | null;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

// Property flavor text database
const propertyStories: Record<string, string> = {
  'Mediterranean Avenue': 'Where all great coding journeys begin. This humble property has seen countless developers start their empire here.',
  'Baltic Avenue': 'The first steps into the world of algorithms. Many have stumbled here, but those who persist find success.',
  'Oriental Avenue': 'A gateway to string manipulation mastery. Those who master this property understand the power of text processing.',
  'Vermont Avenue': 'The foundation of data structures. Build your knowledge base here before tackling bigger challenges.',
  'Connecticut Avenue': 'Where arrays meet strings in perfect harmony. A strategic acquisition for any developer.',
  'St. Charles Place': 'Dynamic programming territory. Those who solve problems here unlock the secrets of optimization.',
  'States Avenue': 'The crossroads of logic and efficiency. A critical property in any winning strategy.',
  'Virginia Avenue': 'Advanced problem-solving begins here. Master this property to dominate the board.',
};

export default function AnimatedPropertyCard({
  property,
  owner,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  className = '',
}: AnimatedPropertyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setIsFlipped(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [isHovered]);

  const getPropertyStory = () => {
    return propertyStories[property.name] || `A valuable property in the CODEOPOLY universe. Master this space to build your coding empire.`;
  };

  const getRentProgression = () => {
    const rents = [
      { houses: 0, rent: property.rent },
      ...(property.rentWithHouse?.map((r, idx) => ({ houses: idx + 1, rent: r })) || []),
    ];
    return rents;
  };

  const rentData = getRentProgression();

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.68, -0.55, 0.265, 1.55],
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2"
          style={{
            backgroundColor: property.color + '40',
            borderColor: property.color,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="h-full flex flex-col items-center justify-center p-2 text-center">
            <div
              className="h-2 w-full mb-1"
              style={{ backgroundColor: property.color }}
            />
            <div className="text-xs sm:text-sm font-bold text-white break-words w-full px-1 leading-tight">
              {property.name}
            </div>
            <div className="text-[10px] sm:text-xs text-yellow-300 font-mono font-semibold mt-1">
              ${property.price}
            </div>
            {owner && (
              <div className="absolute top-1 right-1 text-sm">
                {owner.avatar}
              </div>
            )}
            {property.houses && property.houses > 0 && (
              <div className="absolute bottom-1 left-1 text-[10px]">
                {'🏠'.repeat(Math.min(property.houses, 4))}
              </div>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 rotate-y-180"
          style={{
            backgroundColor: '#1e293b',
            borderColor: property.color,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full p-3 overflow-y-auto text-white">
            {/* Property Name */}
            <div className="text-center mb-2">
              <div
                className="h-1 w-full mb-1 rounded"
                style={{ backgroundColor: property.color }}
              />
              <div className="text-xs font-bold font-mono truncate">
                {property.name}
              </div>
            </div>

            {/* Statistics Section */}
            <div className="mb-2">
              <div className="text-[8px] font-semibold text-emerald-400 mb-1 font-mono">
                RENT PROGRESSION
              </div>
              <div className="space-y-0.5 text-[7px]">
                <div className="flex justify-between">
                  <span className="text-white/80">Base:</span>
                  <span className="text-yellow-400 font-mono">${property.rent}</span>
                </div>
                {property.rentWithHouse?.map((rent, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-white/80">{idx + 1} house:</span>
                    <span className="text-yellow-400 font-mono">${rent}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-white/80">Mortgage:</span>
                  <span className="text-red-400 font-mono">${Math.floor(property.price / 2)}</span>
                </div>
              </div>
            </div>

            {/* Ownership History */}
            {owner && (
              <div className="mb-2 pb-2 border-b border-white/10">
                <div className="text-[8px] font-semibold text-emerald-400 mb-1 font-mono">
                  OWNER
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{owner.avatar}</span>
                  <span className="text-[7px] text-white/80 truncate">{owner.name}</span>
                </div>
                {property.houses && property.houses > 0 && (
                  <div className="text-[7px] text-white/60 mt-0.5">
                    {property.houses} {property.houses === 1 ? 'house' : 'houses'} built
                  </div>
                )}
              </div>
            )}

            {/* Simple Rent Progression Visualization */}
            {rentData.length > 1 && (
              <div className="mb-2">
                <div className="text-[8px] font-semibold text-emerald-400 mb-1 font-mono">
                  RENT GRAPH
                </div>
                <div className="h-12 w-full flex items-end justify-between gap-1">
                  {rentData.map((data, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center"
                      style={{
                        height: `${(data.rent / Math.max(...rentData.map(d => d.rent))) * 100}%`,
                      }}
                    >
                      <div
                        className="w-full rounded-t"
                        style={{
                          backgroundColor: property.color,
                          minHeight: '4px',
                        }}
                      />
                      <div className="text-[6px] text-white/60 mt-0.5">{data.houses}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Story */}
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-[8px] font-semibold text-emerald-400 mb-1 font-mono">
                STORY
              </div>
              <div className="text-[7px] text-white/70 leading-tight italic">
                {getPropertyStory()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
