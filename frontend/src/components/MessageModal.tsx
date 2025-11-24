import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import SecureChat from './SecureChat';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    _id: string;
    name: string;
    role: 'creator' | 'brand';
  };
}

export default function MessageModal({ isOpen, onClose, recipient }: MessageModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-transparent rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SecureChat recipient={recipient} onMinimize={onClose} onNewMessage={() => {}} />
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <FaTimes className="text-gray-700" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
