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
        borderRadius: '8px',
        border: `2px solid rgba(255, 255, 255, 0.6)`, // 2px white border for definition
        boxShadow: isHovered
          ? `0 0 25px ${property.color}90, 0 0 40px ${property.color}60, 0 4px 16px rgba(0, 0, 0, 0.7), inset 0 0 12px ${property.color}30, 0 0 0 2px rgba(255, 255, 255, 0.5)`
          : `0 0 8px ${property.color}50, 0 2px 10px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.3)`,
        minHeight: '100%',
        minWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Color stripe at top/left - Optimized height */}
      <div
        className={`flex-shrink-0 ${
          orientation === 'horizontal' 
            ? 'h-10 w-full' 
            : 'w-10 h-full absolute left-0 top-0'
        }`}
        style={{
          background: `linear-gradient(135deg, ${property.color}, ${property.color}dd)`,
          boxShadow: `0 0 12px ${property.color}90, inset 0 0 6px ${property.color}50`,
        }}
      />

      {/* Property content - Optimized spacing */}
      <div className={`flex-1 flex flex-col justify-between min-h-0 px-2 py-2`}>
        {/* Property Name - Better wrapping to prevent truncation */}
        <div className="flex-1 flex items-center justify-center min-h-0 px-1">
          <h3 
            className="font-bold text-center leading-tight"
            style={{
              fontSize: orientation === 'horizontal' 
                ? 'clamp(14px, 1.8vmin, 20px)' // Optimized to fit without truncation
                : 'clamp(12px, 1.5vmin, 18px)', // Optimized for vertical
              color: property.color === '#FF8C00' || property.color === '#FFA500' ? '#FFFFFF' : '#FFFFFF',
              textShadow: property.color === '#FF8C00' || property.color === '#FFA500'
                ? '0 2px 8px rgba(0, 0, 0, 1), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6)'
                : '0 2px 6px rgba(0, 0, 0, 1), 0 0 16px rgba(255, 255, 255, 0.3), 0 0 20px rgba(6, 182, 212, 0.5)',
              letterSpacing: '0.02em',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              lineHeight: orientation === 'horizontal' ? '1.1' : '1.2',
              fontWeight: 800,
              writingMode: orientation === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
              textOrientation: 'mixed',
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={property.name} // Show full name on hover
          >
            {property.name}
          </h3>
        </div>

        {/* Price and Rent - Optimized sizing to prevent overflow */}
        {!property.isSpecial && (
          <div className="space-y-1.5 mt-1.5 flex-shrink-0">
            <div className="flex flex-col gap-1 px-1.5 font-bold">
              <div className="font-mono text-center font-extrabold" style={{ 
                fontSize: 'clamp(14px, 1.8vmin, 20px)', // Optimized to fit better
                color: property.color === '#FF8C00' || property.color === '#FFA500' ? '#FFFFFF' : '#FEF3C7',
                textShadow: property.color === '#FF8C00' || property.color === '#FFA500' 
                  ? '0 2px 8px rgba(0, 0, 0, 1), 0 0 16px rgba(255, 255, 255, 0.8), 0 0 24px rgba(255, 255, 255, 0.5)'
                  : '0 2px 6px rgba(0, 0, 0, 1), 0 0 12px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.5)',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: property.color === '#FF8C00' || property.color === '#FFA500' ? '#FFFFFF' : '#FCD34D' }}>💰</span> ${property.price}
              </div>
              <div className="font-mono text-center font-bold" style={{ 
                fontSize: 'clamp(11px, 1.4vmin, 16px)', // Optimized to fit better
                color: property.color === '#FF8C00' || property.color === '#FFA500' ? '#FFFFFF' : '#A5F3FC',
                textShadow: property.color === '#FF8C00' || property.color === '#FFA500'
                  ? '0 1px 5px rgba(0, 0, 0, 1), 0 0 10px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 255, 255, 0.5)'
                  : '0 1px 4px rgba(0, 0, 0, 1), 0 0 8px rgba(34, 211, 238, 0.7), 0 0 12px rgba(34, 211, 238, 0.4)',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: property.color === '#FF8C00' || property.color === '#FFA500' ? '#FFFFFF' : '#6EE7B7' }}>💰</span>${property.rent}
              </div>
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
