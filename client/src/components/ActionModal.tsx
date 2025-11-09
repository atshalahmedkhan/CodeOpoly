import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'buy' | 'rent' | 'card' | 'jail' | 'info';
  amount?: number;
  propertyName?: string;
  ownerName?: string;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }>;
  allowClose?: boolean;
}

export default function ActionModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  amount,
  propertyName,
  ownerName,
  actions,
  allowClose = true,
}: ActionModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'buy':
        return '🏠';
      case 'rent':
        return '💸';
      case 'card':
        return '🎴';
      case 'jail':
        return '🔒';
      default:
        return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'buy':
        return 'from-code-green to-code-blue';
      case 'rent':
        return 'from-code-red to-code-orange';
      case 'card':
        return 'from-code-purple to-code-blue';
      case 'jail':
        return 'from-gray-600 to-gray-800';
      default:
        return 'from-code-blue to-code-purple';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            style={{ backdropFilter: 'blur(8px)' }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`bg-gradient-to-br ${getColor()} rounded-2xl border-2 border-white/20 shadow-2xl p-6 max-w-md w-full pointer-events-auto relative`}
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 209, 255, 0.3)',
              }}
            >
              {allowClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
              
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  {getIcon()}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <p className="text-text-muted text-sm">{message}</p>
                
                {amount && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="mt-4 text-4xl font-bold text-white"
                  >
                    ${amount.toLocaleString()}
                  </motion.div>
                )}
                
                {propertyName && (
                  <div className="mt-2 text-code-green font-semibold">{propertyName}</div>
                )}
                
                {ownerName && (
                  <div className="mt-1 text-sm text-text-muted">Owner: {ownerName}</div>
                )}
              </div>
              
              <div className="space-y-2">
                {actions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      action.onClick();
                      if (allowClose) onClose();
                    }}
                    disabled={action.disabled}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      action.variant === 'primary'
                        ? 'bg-white text-code-blue hover:bg-gray-100'
                        : action.variant === 'danger'
                        ? 'bg-code-red text-white hover:bg-red-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: action.disabled ? 1 : 1.02 }}
                    whileTap={{ scale: action.disabled ? 1 : 0.98 }}
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

