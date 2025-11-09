import { motion } from 'framer-motion';

export function BoardSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative bg-black rounded-3xl border-4 border-cyan-500/30 shadow-2xl"
        style={{
          width: 'min(calc(100vh - 8rem), calc(100vw - 36rem), 900px)',
          height: 'min(calc(100vh - 8rem), calc(100vw - 36rem), 900px)',
          aspectRatio: '1 / 1',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export function PlayerPanelSkeleton() {
  return (
    <div className="bg-black rounded-2xl border-2 border-gray-800 p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-800 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-800 rounded w-24" />
          <div className="h-3 bg-gray-800 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-16 bg-gray-800 rounded-xl" />
        <div className="h-12 bg-gray-800 rounded-lg" />
        <div className="h-12 bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
}

export function LiveFeedSkeleton() {
  return (
    <div className="bg-black rounded-2xl border-2 border-gray-800 p-4 space-y-3 animate-pulse">
      <div className="h-6 bg-gray-800 rounded w-32" />
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

