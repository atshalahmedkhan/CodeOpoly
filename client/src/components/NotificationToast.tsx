import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, DollarSign, Home, Trophy, Zap } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'money' | 'property' | 'achievement' | 'special';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const NOTIFICATION_CONFIG = {
  success: { icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500 to-green-500' },
  error: { icon: AlertCircle, color: 'red', gradient: 'from-red-500 to-rose-500' },
  info: { icon: Info, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
  money: { icon: DollarSign, color: 'yellow', gradient: 'from-yellow-500 to-amber-500' },
  property: { icon: Home, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
  achievement: { icon: Trophy, color: 'orange', gradient: 'from-orange-500 to-red-500' },
  special: { icon: Zap, color: 'indigo', gradient: 'from-indigo-500 to-purple-500' },
};

export function NotificationToast({ notifications, onClose }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onClose={() => onClose(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const config = NOTIFICATION_CONFIG[notification.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification.duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="pointer-events-auto"
      whileHover={{ scale: 1.02 }}
    >
      <div
        className="relative overflow-hidden rounded-xl p-4 pr-12 min-w-[320px] shadow-2xl"
        style={{
          background: 'rgba(15, 25, 45, 0.9)',
          backdropFilter: 'blur(10px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Gradient border effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20`}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
          }}
        />

        {/* Progress bar */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${config.gradient}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (notification.duration || 4000) / 1000, ease: 'linear' }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-start gap-3">
          {/* Icon with glow */}
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}
              style={{
                boxShadow: `0 0 20px ${config.color}-500`,
              }}
            >
              <Icon className="text-white" size={20} />
            </div>
          </motion.div>

          {/* Text */}
          <div className="flex-1">
            <h4 className="text-white font-bold font-mono text-sm mb-1">
              {notification.title}
            </h4>
            {notification.message && (
              <p className="text-white/70 text-xs font-mono leading-relaxed">
                {notification.message}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${20 + i * 30}%`,
                top: '50%',
              }}
              animate={{
                y: [-5, -15, -5],
                opacity: [0, 0.5, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const closeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, showNotification, closeNotification };
}





