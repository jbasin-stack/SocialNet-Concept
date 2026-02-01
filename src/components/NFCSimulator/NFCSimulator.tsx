import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NFCSimulatorProps {
  onTap: () => void;
}

export default function NFCSimulator({ onTap }: NFCSimulatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleTap = () => {
    setIsAnimating(true);
    onTap();

    // Reset animation
    setTimeout(() => {
      setIsAnimating(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary-600 active:scale-95 flex items-center justify-center text-3xl z-header transition-all duration-200"
        aria-label="Simulate NFC tap"
      >
        📱
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isAnimating && setShowModal(false)}
              className="fixed inset-0 bg-black/50 z-modal-backdrop"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-elevated rounded-2xl shadow-elevated p-8 z-modal text-center max-w-sm w-full mx-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="nfc-modal-title"
            >
              <h2 id="nfc-modal-title" className="text-2xl font-semibold text-neutral-900 tracking-tight mb-4">
                NFC Connection
              </h2>
              <p className="text-neutral-600 mb-6">
                Tap to simulate an NFC connection
              </p>

              {/* Tap Button with Ripple Animation */}
              <motion.button
                onClick={handleTap}
                disabled={isAnimating}
                animate={isAnimating ? {
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.7)',
                    '0 0 0 40px rgba(59, 130, 246, 0)'
                  ]
                } : {}}
                transition={{ duration: 0.8, repeat: isAnimating ? Infinity : 0 }}
                className="w-24 h-24 bg-primary-500 text-white rounded-full text-4xl hover:bg-primary-600 disabled:opacity-50 mx-auto transition-all duration-200 shadow-md active:scale-95"
                aria-label={isAnimating ? 'Connection in progress' : 'Tap to connect'}
              >
                {isAnimating ? '✓' : '👋'}
              </motion.button>

              {isAnimating && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-success font-semibold animate-fade-in"
                >
                  Connection added!
                </motion.p>
              )}

              {!isAnimating && (
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
