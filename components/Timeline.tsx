
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Project } from '../types';
import { ArrowLeft, ChevronRight, SearchX, Edit2 } from 'lucide-react';

interface TimelineProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onScroll: (progress: number) => void; 
  onHover: (color: string | null) => void;
  onBack: () => void;
  capabilityTitle?: string;
  searchActive?: boolean;
  isEditableTitle?: boolean;
  onTitleChange?: (title: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  projects, 
  onSelect, 
  onHover, 
  onBack, 
  onScroll, 
  capabilityTitle,
  searchActive = false,
  isEditableTitle = false,
  onTitleChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  
  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);

  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = scrollXProgress.on('change', (latest) => {
      onScroll(latest);
    });
    return () => unsubscribe();
  }, [scrollXProgress, onScroll]);

  const splitTitle = useMemo(() => {
    let title = (capabilityTitle || 'DETAILED CHAPTERS').toUpperCase();
    if (title.length > 26) title = title.substring(0, 26);
    
    const words = title.split(' ');
    if (words.length <= 1) return { first: title, second: '' };
    
    // Split at roughly 2/3 of the words to follow the width rule
    const splitIndex = Math.ceil(words.length * 0.66);
    const firstPart = words.slice(0, splitIndex).join(' ');
    const secondPart = words.slice(splitIndex).join(' ');
    
    return { first: firstPart, second: secondPart };
  }, [capabilityTitle]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    setIsCurrentlyDragging(true);
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.scrollSnapType = 'none';
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    setIsCurrentlyDragging(false);
    containerRef.current.style.scrollSnapType = 'x proximity';
    containerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    setIsCurrentlyDragging(false);
    containerRef.current.style.scrollSnapType = 'x proximity';
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
    <div className="relative w-full h-full flex flex-col pt-24 pb-12 overflow-hidden">
      {/* Dynamic Discipline Header */}
      <div className="px-12 md:px-24 mb-12 z-10 shrink-0">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.5, x: 0 }}
          whileHover={{ opacity: 1, x: -5 }}
          className="group flex items-center space-x-4 mb-10 pointer-events-auto w-fit transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">Back to Library</span>
        </motion.button>

        <div className="space-y-4">
          <div className="flex items-baseline space-x-6">
            {isEditableTitle ? (
              <div className="relative group max-w-4xl flex items-center">
                <input 
                  type="text"
                  value={capabilityTitle}
                  maxLength={26}
                  onChange={(e) => onTitleChange?.(e.target.value.slice(0, 26))}
                  className="bg-transparent border-none focus:ring-0 text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none outline-none w-full placeholder:text-white/10"
                />
                <Edit2 className="w-6 h-6 opacity-0 group-hover:opacity-40 transition-opacity ml-4 shrink-0" />
              </div>
            ) : (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] max-w-[66vw]"
              >
                {splitTitle.first} <br />
                <span className="text-white/20">{splitTitle.second}</span>
              </motion.h2>
            )}
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-bold tracking-[0.6em] uppercase"
          >
            {searchActive ? 'Filtring active assets' : 'Project Delivery Lifecycle / Sequence 2026'}
          </motion.p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex-1 flex items-start space-x-12 px-12 md:px-24 overflow-x-auto no-scrollbar select-none ${isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ scrollSnapType: 'x proximity' }}
      >
        <AnimatePresence mode="popLayout">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <TimelineTile 
                key={project.id} 
                project={project} 
                index={index} 
                onSelect={onSelect}
                onHover={onHover}
                isDragging={isCurrentlyDragging}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center space-y-6 pt-20 text-center opacity-40"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">No specific matches</h3>
                <p className="text-[9px] font-black tracking-[0.4em] uppercase">Refine your search parameters</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {projects.length > 0 && <div className="min-w-[20vw] flex-shrink-0 h-1" />}
      </div>

      {/* Footer Interface */}
      <div className="px-12 md:px-24 flex items-center justify-between pointer-events-none mt-8 shrink-0">
        <div className="flex-1 max-w-sm h-[1px] bg-white/5 relative overflow-hidden">
          <motion.div 
            style={{ scaleX }}
            className="absolute inset-0 bg-white origin-left opacity-25 shadow-[0_0_10px_white]"
          />
        </div>
        
        <div className="flex items-center space-x-16 ml-16">
          <div className="hidden lg:flex space-x-8 text-[9px] tracking-[0.5em] font-black opacity-10 uppercase">
            <span>Audit</span>
            <span>Concept</span>
            <span>Refine</span>
            <span>Build</span>
            <span>Launch</span>
          </div>
          <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
            {projects.length} Total Projects found
          </div>
        </div>
      </div>
    </div>
  );
};

interface TileProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
  onHover: (color: string | null) => void;
  isDragging: boolean;
}

export const TimelineTile: React.FC<TileProps> = ({ project, index, onSelect, onHover, isDragging }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="relative flex-shrink-0 w-[85vw] sm:w-[48vw] md:w-[35vw] h-[52vh]"
      style={{ scrollSnapAlign: 'start' }}
    >
      <button 
        onClick={() => !isDragging && onSelect(project)}
        onMouseEnter={() => onHover(project.accentColor)}
        onMouseLeave={() => onHover(null)}
        className="group relative w-full h-full overflow-hidden text-left bg-zinc-950/50 rounded-[2.5rem] border border-white/5 transition-all duration-700 active:scale-[0.98] flex flex-col pointer-events-auto shadow-2xl"
      >
        <div className="absolute inset-0 z-0">
          <motion.img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000 ease-out pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 p-12 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-5">
              <span className="text-[11px] font-black tracking-widest text-white/30 group-hover:text-white transition-colors uppercase">
                {project.id}
              </span>
              <div className="h-[1px] w-8 bg-white/10 group-hover:w-14 group-hover:bg-white transition-all duration-700" />
            </div>
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-700 backdrop-blur-md">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] uppercase group-hover:translate-x-3 transition-transform duration-700">
              {project.title.split(' & ').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < project.title.split(' & ').length - 1 && <><br /><span className="text-white/10 group-hover:text-white/30">& </span></>}
                </React.Fragment>
              ))}
            </h3>
            
            <p className="text-sm leading-relaxed opacity-30 max-w-[85%] group-hover:opacity-70 transition-opacity duration-700 line-clamp-3 font-medium">
              {project.description}
            </p>

            <div className="pt-8 flex items-center space-x-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-700">
              <span className="text-[9px] font-black tracking-[0.4em] uppercase">Enter Experience</span>
              <div className="flex-1 h-[1px] bg-white/20" />
            </div>
          </div>
        </div>
        
        <div 
          className="absolute bottom-0 left-0 w-full h-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"
          style={{ backgroundColor: project.accentColor }}
        />
      </button>
    </motion.div>
  );
};

export default Timeline;
