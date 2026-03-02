
import React from 'react';
import { motion } from 'framer-motion';
import { LIFECYCLE_MILESTONES } from '../constants';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

interface LifecycleOverviewProps {
  onBack: () => void;
  onProceed: () => void;
}

const LifecycleOverview: React.FC<LifecycleOverviewProps> = ({ onBack, onProceed }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-full p-12 md:p-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group flex items-center space-x-3 mb-16 opacity-50 active:opacity-100 transition-opacity pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Return to Selection</span>
        </motion.button>

        <div className="mb-24 flex justify-between items-end">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
            >
              Lifecycle <span className="text-white/20">Overview</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.5, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[10px] font-bold tracking-[0.5em] uppercase"
            >
              Strategic Infrastructure Lifecycle — 6 Operational Phases
            </motion.p>
          </div>

          <motion.button
            onClick={onProceed}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4 px-8 py-4 bg-white text-black rounded-full font-black text-[10px] tracking-[0.3em] uppercase transition-transform"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>View Chapters</span>
          </motion.button>
        </div>

        <div className="relative pt-32 pb-32">
          {/* Main Timeline Axis */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
          
          <div className="relative flex justify-between items-center">
            {LIFECYCLE_MILESTONES.map((milestone, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative flex flex-col items-center"
                style={{ width: `${100 / LIFECYCLE_MILESTONES.length}%` }}
              >
                {/* Horizontal Connector segments */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-full h-[1px] ${index === LIFECYCLE_MILESTONES.length - 1 ? 'hidden' : 'bg-gradient-to-r from-white/20 to-transparent'}`} style={{ left: '50%' }} />

                {/* The Node Dot */}
                <div className="relative z-10 w-4 h-4 rounded-full border border-white/40 bg-black">
                   <div className="absolute inset-0 m-1 rounded-full bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                </div>

                {/* Title below the node */}
                <div className="absolute top-10 text-center w-full px-2">
                   <h3 className="text-xs md:text-sm font-black tracking-[0.1em] uppercase leading-tight opacity-80">
                     {milestone.event}
                   </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer info for Lifecycle page */}
        <div className="mt-24 flex justify-center opacity-10">
           <div className="text-[8px] font-bold tracking-[0.8em] uppercase">End-to-End Asset Management Protocol</div>
        </div>
      </div>
    </motion.div>
  );
};

export default LifecycleOverview;
