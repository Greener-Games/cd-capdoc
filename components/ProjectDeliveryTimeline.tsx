
import React from 'react';
import { motion } from 'framer-motion';
import { MILESTONES } from '../constants';
import { ArrowLeft } from 'lucide-react';

interface ProjectDeliveryTimelineProps {
  onBack: () => void;
}

const ProjectDeliveryTimeline: React.FC<ProjectDeliveryTimelineProps> = ({ onBack }) => {
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

        <div className="mb-24 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
          >
            Delivery <span className="text-white/20">Schedule</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-bold tracking-[0.5em] uppercase"
          >
            Technical Milestone Visualization — Proto-V4
          </motion.p>
        </div>

        <div className="relative pt-32 pb-32">
          {/* Main Timeline Axis */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
          
          <div className="relative flex justify-between items-center">
            {MILESTONES.map((milestone, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative flex flex-col items-center"
                style={{ width: `${100 / MILESTONES.length}%` }}
              >
                {/* Connector Line */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-full h-[1px] ${index === MILESTONES.length - 1 ? 'hidden' : 'bg-gradient-to-r from-white/20 to-transparent'}`} style={{ left: '50%' }} />

                {/* Node */}
                <div className="relative z-10 w-4 h-4 rounded-full border border-white/40 bg-black">
                   <div className="absolute inset-0 m-1 rounded-full bg-white opacity-40" />
                </div>

                {/* Content Top (Date) */}
                <div className="absolute bottom-10 text-center whitespace-nowrap">
                   <span className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">
                     {milestone.date}
                   </span>
                </div>

                {/* Content Bottom (Details) */}
                <div className="absolute top-10 text-center w-48 space-y-2">
                   <h3 className="text-xs font-bold tracking-tight uppercase">
                     {milestone.event}
                   </h3>
                   <p className="text-[9px] font-medium leading-relaxed opacity-40">
                     {milestone.detail}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend / Status */}
        <div className="mt-24 grid grid-cols-3 gap-12 border-t border-white/5 pt-12">
          {[
            { label: 'System Integrity', val: 'Verified' },
            { label: 'Project Status', val: 'On Track' },
            { label: 'Asset ID', val: 'X-77A' }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="text-[8px] font-bold tracking-[0.3em] text-white/20 uppercase">{item.label}</div>
              <div className="text-xs font-black tracking-widest uppercase">{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDeliveryTimeline;
