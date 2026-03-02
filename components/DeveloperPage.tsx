
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, LayoutGrid, X, Edit3 } from 'lucide-react';
import { Project } from '../types';

interface DeveloperPageProps {
  onBack: () => void;
  onLaunchCurated: () => void;
  allProjects: Project[];
  favouriteIds: string[];
  onToggleFavourite: (id: string) => void;
  onSelectProject: (project: Project) => void;
  curatedTitle: string;
  onCuratedTitleChange: (title: string) => void;
}

const DeveloperPage: React.FC<DeveloperPageProps> = ({ 
  onBack, 
  onLaunchCurated, 
  allProjects, 
  favouriteIds, 
  onToggleFavourite,
  onSelectProject,
  curatedTitle,
  onCuratedTitleChange
}) => {
  const [search, setSearch] = useState('');

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return allProjects;
    return allProjects.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [allProjects, search]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-black/60 backdrop-blur-3xl overflow-hidden">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-64">
        <div className="w-full max-w-6xl mx-auto px-12 md:px-24 space-y-16">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center">
                <LayoutGrid className="w-8 h-8 text-white/60" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Global Library</h1>
                <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40">System Portfolio & Curation Tools</p>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH PORTFOLIO..."
                className="bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-12 text-[10px] font-black tracking-[0.2em] uppercase focus:bg-white/10 focus:border-white/30 md:w-80 w-64 transition-all outline-none backdrop-blur-md"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group relative aspect-[4/5] bg-white/5 border border-white/5 rounded-3xl overflow-hidden cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">
                        {project.id}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavourite(project.id);
                        }}
                        className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                          favouriteIds.includes(project.id) 
                          ? 'bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                          : 'bg-black/40 text-white/40 hover:text-white hover:border-white/30'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favouriteIds.includes(project.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-black tracking-tight uppercase leading-none">{project.title}</h3>
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 group-hover:opacity-70 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Action Bar - Strictly sticky to window bottom center */}
      <AnimatePresence>
        {favouriteIds.length > 0 && (
          <div className="fixed bottom-12 left-0 w-full flex justify-center pointer-events-none z-[60]">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex items-center space-x-6 p-2 pr-8 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl min-w-[320px] md:min-w-[500px] pointer-events-auto"
            >
              <div className="flex -space-x-3 ml-4 hidden sm:flex">
                {favouriteIds.slice(0, 3).map((id, i) => {
                  const p = allProjects.find(proj => proj.id === id);
                  return (
                    <div key={id} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-zinc-900" style={{ zIndex: 3-i }}>
                      <img src={p?.imageUrl} className="w-full h-full object-cover opacity-60" />
                    </div>
                  );
                })}
                {favouriteIds.length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-black z-0">
                    +{favouriteIds.length - 3}
                  </div>
                )}
              </div>
              
              <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
              
              <div className="flex-1 flex flex-col justify-center px-4">
                 <div className="flex items-center space-x-2 text-[10px] font-black tracking-widest uppercase mb-1">
                   <Edit3 className="w-3 h-3 opacity-40" />
                   <input 
                     type="text" 
                     value={curatedTitle}
                     maxLength={26}
                     onChange={(e) => onCuratedTitleChange(e.target.value.slice(0, 26))}
                     className="bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder:text-white/20 w-full"
                     placeholder="Enter Collection Name..."
                   />
                 </div>
                <span className="text-[8px] font-bold tracking-[0.2em] opacity-40 uppercase">{favouriteIds.length} Assets Selected</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLaunchCurated}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase transition-all shadow-xl whitespace-nowrap"
              >
                Launch Timeline
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperPage;
