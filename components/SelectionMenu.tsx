
import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryType } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA } from '../constants';

interface SelectionMenuProps {
  onSelect: (id: string, type: CategoryType) => void;
  onHover: (color: string | null) => void;
  initialFilter?: CategoryType;
}

const SelectionMenu: React.FC<SelectionMenuProps> = ({ onSelect, onHover, initialFilter = CategoryType.CAPABILITY }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filterType, setFilterType] = useState<CategoryType>(initialFilter);
  
  const categories = useMemo(() => {
    switch (filterType) {
      case CategoryType.CAPABILITY: return CAPABILITY_DATA;
      case CategoryType.MARKET: return MARKET_DATA;
      case CategoryType.REGION: return REGION_DATA;
      default: return CAPABILITY_DATA;
    }
  }, [filterType]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    setIsCurrentlyDragging(true);
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    setIsCurrentlyDragging(false);
    containerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    setIsCurrentlyDragging(false);
    containerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col w-full h-full overflow-hidden pt-32"
    >
      <div className="px-12 md:px-24 mb-16 flex flex-col items-start z-10">
        <div className="flex items-center mb-8">
          {/* Segmented Controller - Now moved to far left */}
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 pointer-events-auto">
            {[
              { id: CategoryType.CAPABILITY, label: 'Capability' },
              { id: CategoryType.MARKET, label: 'Market' },
              { id: CategoryType.REGION, label: 'Region' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`relative px-6 py-2 rounded-full text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-500 ${
                  filterType === type.id ? 'text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {filterType === type.id && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-white rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.h2 
            key={filterType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none"
          >
            {filterType === CategoryType.CAPABILITY ? 'Capabilities' : 
             filterType === CategoryType.MARKET ? 'Market sectors' : 'Global regions'}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center space-x-6 px-12 md:px-24 overflow-x-auto no-scrollbar h-[55vh] select-none ${isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <AnimatePresence mode="popLayout">
          {categories.map((cap, idx) => (
            <motion.button
              key={`${filterType}-${cap.id}`}
              layout
              onClick={() => !isCurrentlyDragging && onSelect(cap.id, filterType)}
              onMouseEnter={() => onHover(cap.color)}
              onMouseLeave={() => onHover(null)}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex-shrink-0 w-[80vw] sm:w-[35vw] md:w-[22vw] h-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-700 bg-zinc-950/40"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={cap.image} 
                  alt={cap.title}
                  className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 h-full p-10 flex flex-col justify-end text-left">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-[10px] font-black tracking-widest text-white/30 group-hover:text-white transition-colors">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div className="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-white transition-all duration-700" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-700">
                  {cap.title}
                </h2>
                <p className="text-[9px] font-bold tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                  {cap.subtitle}
                </p>
              </div>
              
              <div 
                className="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                style={{ backgroundColor: cap.color }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
        
        <div className="min-w-[15vw] flex-shrink-0 h-1" />
      </div>

      <div className="absolute bottom-12 left-12 md:left-24 right-12 md:right-24 flex items-center justify-between pointer-events-none opacity-20">
        <div className="text-[9px] font-black tracking-[0.4em] uppercase">
          Explore sequential strategic assets
        </div>
        <div className="flex space-x-6">
          <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-white opacity-50" />
          <div className="w-1 h-1 rounded-full bg-white opacity-20" />
        </div>
      </div>
    </motion.div>
  );
};

export default SelectionMenu;
