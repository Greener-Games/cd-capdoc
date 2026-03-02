
import React from 'react';
import { motion } from 'framer-motion';

interface HomeScreenProps {
  onEnter: () => void;
  onDevAccess: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={onEnter}
      className="relative flex flex-col items-center justify-center w-full h-full p-8 overflow-hidden cursor-none"
    >
      <div className="relative z-10 max-w-4xl text-center space-y-12 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase drop-shadow-2xl"
        >
          Complex to<br />Clarity
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xs font-bold tracking-[0.5em] uppercase"
        >
          CREATIVE DESIGN
        </motion.p>
      </div>
      
      {/* Aesthetic Border Accents */}
      <div className="absolute top-12 left-12 w-8 h-8 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute top-12 right-12 w-8 h-8 border-t border-r border-white/10 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-8 h-8 border-b border-l border-white/10 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-white/10 pointer-events-none" />
    </motion.div>
  );
};

export default HomeScreen;
