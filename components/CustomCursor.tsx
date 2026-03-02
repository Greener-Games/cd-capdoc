
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ViewState } from '../types';

interface CustomCursorProps {
  view?: ViewState;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ view }) => {
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const updateInteractivity = () => {
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea');
      
      const handleHover = () => setHovering(true);
      const handleUnhover = () => setHovering(false);

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleUnhover);
      });

      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', handleHover);
          el.removeEventListener('mouseleave', handleUnhover);
        });
      };
    };

    window.addEventListener('mousemove', moveCursor);
    const cleanupInteractivity = updateInteractivity();

    // Re-run interactivity check when view changes or DOM updates
    const observer = new MutationObserver(updateInteractivity);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cleanupInteractivity();
      observer.disconnect();
    };
  }, [cursorX, cursorY, view]);

  const isLandingMode = view === ViewState.LANDING && !hovering;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        x: '-50%',
        y: '-50%',
        width: isLandingMode ? 120 : 32,
        height: isLandingMode ? 120 : 32,
      }}
    >
      <motion.div 
        animate={{
          scale: hovering ? 2.5 : 1,
          backgroundColor: hovering ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0)',
          borderWidth: isLandingMode ? 1 : 1,
          borderColor: '#ffffff',
        }}
        className="w-full h-full rounded-full border flex items-center justify-center transition-colors duration-300"
      >
        <AnimatePresence mode="wait">
          {isLandingMode ? (
            <motion.span
              key="enter-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[10px] font-black tracking-[0.4em] uppercase text-white"
            >
              Enter
            </motion.span>
          ) : (
            hovering && (
              <motion.div 
                key="hover-dot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-1 h-1 bg-white rounded-full"
              />
            )
          )}
        </AnimatePresence>
        
        {/* Standard center dot when not hovering and not in landing mode */}
        {!isLandingMode && !hovering && (
           <div className="w-1 h-1 bg-white rounded-full" />
        )}
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
