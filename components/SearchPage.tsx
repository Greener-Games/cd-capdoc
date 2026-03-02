
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SearchX, ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import { TimelineTile } from './Timeline';

interface SearchPageProps {
  allProjects: Project[];
  onSelect: (project: Project) => void;
  onBack: () => void;
  onHover: (color: string | null) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ allProjects, onSelect, onBack, onHover }) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allProjects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.id.toLowerCase().includes(lowerQuery)
    );
  }, [allProjects, query]);

  // Handle manual dragging logic for consistency with other pages
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
    containerRef.current.style.scrollSnapType = 'none';
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    setIsCurrentlyDragging(false);
    containerRef.current.style.scrollSnapType = 'x proximity';
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    setIsCurrentlyDragging(false);
    containerRef.current.style.scrollSnapType = 'x proximity';
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
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] w-full h-full bg-black/60 backdrop-blur-3xl overflow-hidden flex flex-col pt-32"
    >
      <div className="px-12 md:px-24 mb-16 space-y-8 z-10 shrink-0">
        <div className="flex justify-between items-start">
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            whileHover={{ opacity: 1, x: -5 }}
            className="group flex items-center space-x-4 pointer-events-auto transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">Close Search</span>
          </motion.button>
          
          <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20">
            System Database / Global Index
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Find <span className="text-white/20">Assets</span>
          </h2>
          
          <div className="relative group max-w-4xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors" />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH PROJECT, CAPABILITY, OR ID..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-10 pl-20 pr-12 text-2xl md:text-4xl font-black tracking-tighter uppercase focus:bg-white/10 focus:border-white/30 transition-all outline-none backdrop-blur-md placeholder:text-white/10"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-4 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex-1 flex items-center space-x-12 px-12 md:px-24 overflow-x-auto no-scrollbar select-none pb-24 ${isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ scrollSnapType: 'x proximity' }}
      >
        <AnimatePresence mode="popLayout">
          {query.trim() === '' ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className="w-full h-full flex items-center justify-center text-center px-12"
            >
              <div className="max-w-md space-y-4">
                <p className="text-[10px] font-black tracking-[0.6em] uppercase">Awaiting Query Input</p>
                <p className="text-xs font-medium opacity-60">Begin typing to filter through the extensive project lifecycle database.</p>
              </div>
            </motion.div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
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
              className="w-full flex flex-col items-center justify-center space-y-6 text-center opacity-40"
            >
              <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                <SearchX className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tighter uppercase">No results found</h3>
                <p className="text-[10px] font-black tracking-[0.4em] uppercase">Try searching for a different keyword or project ID</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {filteredProjects.length > 0 && <div className="min-w-[20vw] flex-shrink-0 h-1" />}
      </div>

      <div className="px-12 md:px-24 py-8 border-t border-white/5 flex items-center justify-between shrink-0">
        <div className="text-[9px] font-black tracking-[0.4em] uppercase opacity-20">
          AtkinsRéalis Creative Design — v4.0.2
        </div>
        <div className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
          {query ? `${filteredProjects.length} MATCHES FOUND` : 'READY'}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;
