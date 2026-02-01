import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { User } from '../../types';

interface BusinessCardModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onViewNetwork: (userId: string) => void;
}

export default function BusinessCardModal({
  user,
  isOpen,
  onClose,
  onViewNetwork
}: BusinessCardModalProps) {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!user) return null;

  // Calculate word count - handle empty strings correctly
  const trimmedBio = user.profile.bio.trim();
  const wordCount = trimmedBio ? trimmedBio.split(/\s+/).length : 0;

  // Color based on word count
  let countColor = 'text-green-600';
  if (wordCount >= 130 && wordCount <= 150) countColor = 'text-yellow-600';
  if (wordCount > 150) countColor = 'text-red-600';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-modal-backdrop"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-surface-elevated rounded-2xl shadow-elevated z-modal max-w-2xl w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 id="modal-title" className="text-2xl font-semibold text-neutral-900 tracking-tight">
                    {user.name}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">{user.profile.location}</p>
                  <p className="text-sm text-neutral-500">{user.profile.industry}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-lg hover:bg-neutral-100"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Bio */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Bio</h3>
                <p className="text-neutral-900 leading-relaxed">{user.profile.bio}</p>
                <p className={`text-xs mt-2 font-medium ${wordCount > 150 ? 'text-error' : wordCount >= 130 ? 'text-warning' : 'text-neutral-400'}`}>
                  {wordCount} / 150 words
                </p>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Fun Fact</h3>
                <p className="text-neutral-900 italic leading-relaxed">{user.profile.funFact}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onViewNetwork(user.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:scale-98 transition-all duration-150 font-medium shadow-sm"
              >
                View Their Network
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 active:scale-98 transition-all duration-150 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
