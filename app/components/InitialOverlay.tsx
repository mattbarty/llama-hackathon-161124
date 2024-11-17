'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2 } from 'lucide-react';

export function InitialOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  // Hide overlay when user clicks anywhere
  const handleClick = () => {
    setIsVisible(false);
  };

  // Add event listener for escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-white p-8 rounded-lg max-w-md"
          >
            <Globe2 className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-4">Welcome to Little Expat</h2>
            <p className="text-xl opacity-90">
              Click on any country to begin your journey
            </p>
            <p className="mt-6 text-sm opacity-75">
              Click anywhere or press ESC to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 