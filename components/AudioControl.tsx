
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AudioControlProps {
  volume: number;
  onVolumeChange: (val: number) => void;
}

const AudioControl: React.FC<AudioControlProps> = ({ volume, onVolumeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when tapping outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleMute = () => {
    if (volume > 0) {
      onVolumeChange(0);
    } else {
      onVolumeChange(0.5);
    }
  };

  const getIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 z-[1000] flex items-center"
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '160px' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-l-full h-12 flex items-center px-6 mr-[-24px] pr-10"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
              style={{
                background: `linear-gradient(to right, white ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        onDoubleClick={toggleMute}
        whileTap={{ scale: 0.9 }}
        className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500 backdrop-blur-md ${
          isExpanded 
          ? 'bg-white text-black border-white' 
          : 'bg-black/20 text-white border-white/20 active:border-white/60'
        }`}
      >
        {getIcon()}
      </motion.button>
      
      {/* Visual Volume Indicator Tooltip */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-8 right-0 text-[10px] font-black tracking-widest text-white/40 uppercase"
          >
            Level: {Math.round(volume * 100)}%
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioControl;
