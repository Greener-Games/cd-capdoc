
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, ChevronRight } from 'lucide-react';

interface GatewayScreenProps {
  onProceed: () => void;
}

const GatewayScreen: React.FC<GatewayScreenProps> = ({ onProceed }) => {
  const [joinId, setJoinId] = useState('');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      onProceed();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center w-full h-full p-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-center mb-16 space-y-4"
      >
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          SUBMARINE<br />DELIVERY SYSTEMS
        </h1>
        <div className="h-[1px] w-24 bg-white/20 mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Host Tile */}
        <motion.button
          onClick={onProceed}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative h-[40vh] bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-12 transition-all hover:border-white/30 hover:bg-white/[0.07]"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Host</h2>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                Initialize New Session
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>

        {/* Join Tile */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="group relative h-[40vh] bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-12 transition-all hover:border-white/30"
        >
          <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-xs">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-500">
              <UserPlus className="w-8 h-8" />
            </div>
            
            <div className="text-center w-full">
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">Join</h2>
              <form onSubmit={handleJoinSubmit} className="space-y-4 w-full">
                <input 
                  type="text" 
                  placeholder="ENTER SESSION ID"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-center text-sm font-black tracking-[0.4em] outline-none focus:border-white transition-colors placeholder:text-white/10"
                />
                <button 
                  type="submit"
                  disabled={!joinId.trim()}
                  className="w-full py-3 rounded-full bg-white text-black text-[10px] font-black tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 disabled:opacity-0"
                >
                  Confirm Entry
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 text-[10px] tracking-[0.4em] font-medium uppercase"
      >
        Secured Network Protocol / V.04
      </motion.div>
    </motion.div>
  );
};

export default GatewayScreen;
