import { useRef } from 'react';

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
  isSpecial?: boolean;
}

interface AnimatedPropertyCardProps {
  property: Property;
  owner?: { name: string; avatar: string } | null;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function AnimatedPropertyCard({
  property,
  owner,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  className = '',
  orientation = 'horizontal',
}: AnimatedPropertyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-all duration-200 ${className} ${
        orientation === 'horizontal' ? 'h-full' : 'w-full h-full'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: property.isSpecial
          ? `linear-gradient(135deg, ${property.color}50, ${property.color}70)`
          : `linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))`,
        backdropFilter: 'blur(10px)',
        borderRadius: '6px',
        border: `2px solid ${property.color}`,
        boxShadow: isHovered
          ? `0 0 20px ${property.color}80, 0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 12px ${property.color}20`
          : `0 0 6px ${property.color}40, 0 2px 8px rgba(0, 0, 0, 0.5)`,
        minHeight: '100%',
        minWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Color stripe at top/left - Enlarged */}
      <div
        className={`flex-shrink-0 ${
          orientation === 'horizontal' 
            ? 'h-10 w-full' 
            : 'w-10 h-full absolute left-0 top-0'
        }`}
        style={{
          background: `linear-gradient(135deg, ${property.color}, ${property.color}dd)`,
          boxShadow: `0 0 10px ${property.color}80, inset 0 0 6px ${property.color}40`,
        }}
      />

      {/* Property content */}
      <div className={`flex-1 flex flex-col justify-between min-h-0 px-1.5 py-1`}>
        {/* Property Name */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <h3 
            className="font-bold text-center leading-tight"
            style={{
              fontSize: 'clamp(14px, 1.8vmin, 22px)',
              color: '#E2E8F0',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 0 8px rgba(6, 182, 212, 0.3)',
              letterSpacing: '0.02em',
              wordBreak: 'break-word',
              hyphens: 'auto',
              lineHeight: '1.3',
              fontWeight: 700,
            }}
          >
            {property.name}
          </h3>
        </div>

        {/* Price and Rent - Larger */}
        {!property.isSpecial && (
          <div className="space-y-0.5 mt-0.5 flex-shrink-0" style={{ fontSize: 'clamp(12px, 1.4vmin, 16px)' }}>
            <div className="flex justify-between px-1 font-semibold">
              <span className="text-yellow-300">💰 ${property.price}</span>
              <span className="text-cyan-300">📊 ${property.rent}</span>
            </div>
          </div>
        )}

        {/* Owner indicator */}
        {owner && (
          <div 
            className="absolute top-1 right-1 text-xs bg-black/60 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm border border-white/30"
            style={{ fontSize: 'clamp(10px, 1.2vmin, 14px)' }}
          >
            {owner.avatar}
          </div>
        )}

        {/* Houses indicator */}
        {property.houses && property.houses > 0 && (
          <div 
            className="absolute bottom-1 left-1 flex gap-0.5"
            style={{ fontSize: 'clamp(8px, 1vmin, 12px)' }}
          >
            {property.houses === 5 ? '🏨' : '🏠'.repeat(Math.min(property.houses, 4))}
          </div>
        )}
      </div>
    </div>
  );
}
