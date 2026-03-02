
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Heart } from 'lucide-react';
import { ViewState, Project, CategoryType } from './types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, ALL_PROJECTS } from './constants';
import HomeScreen from './components/HomeScreen';
import SelectionMenu from './components/SelectionMenu';
import Timeline from './components/Timeline';
import DetailView from './components/DetailView';
import Canvas3D from './components/Canvas3D';
import CustomCursor from './components/CustomCursor';
import DeveloperPage from './components/DeveloperPage';
import SearchPage from './components/SearchPage';

const DEFAULT_ACCENT = '#1e293b';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [prevView, setPrevView] = useState<ViewState>(ViewState.LANDING);
  const [filterType, setFilterType] = useState<CategoryType>(CategoryType.CAPABILITY);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('brand');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string>(DEFAULT_ACCENT);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [curatedTitle, setCuratedTitle] = useState('Curated Collection');

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const flattenedAllProjects = useMemo(() => {
    const all: Project[] = [];
    const seen = new Set<string>();
    Object.values(ALL_PROJECTS).forEach(categoryProjects => {
      categoryProjects.forEach(p => {
        if (!seen.has(p.id)) {
          all.push(p);
          seen.add(p.id);
        }
      });
    });
    return all;
  }, []);

  const currentCategoryData = useMemo(() => {
    const dataSet = filterType === CategoryType.CAPABILITY ? CAPABILITY_DATA : 
                    filterType === CategoryType.MARKET ? MARKET_DATA : REGION_DATA;
    return dataSet.find(d => d.id === activeCategoryId) || dataSet[0];
  }, [filterType, activeCategoryId]);

  const currentProjects = useMemo(() => {
    if (view === ViewState.FAVOURITES) {
      return flattenedAllProjects.filter(p => favouriteIds.includes(p.id));
    }
    
    return currentCategoryData.projects;
  }, [currentCategoryData, view, favouriteIds, flattenedAllProjects]);

  const toggleFavourite = useCallback((id: string) => {
    setFavouriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }, []);

  const handleEnter = useCallback(() => {
    setView(ViewState.SELECTOR);
    setScrollProgress(0);
  }, []);

  const handleDevAccess = useCallback(() => {
    setView(ViewState.DEVELOPER);
  }, []);

  const handleSelection = useCallback((id: string, type: CategoryType) => {
    setActiveCategoryId(id);
    setFilterType(type);
    setView(ViewState.TIMELINE);
    setSearchQuery('');
    setScrollProgress(0);
  }, []);

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setView(ViewState.DETAIL);
  }, []);

  const handleBackToTimeline = useCallback(() => {
    if (view === ViewState.DEVELOPER) {
      setView(ViewState.DEVELOPER);
    } else {
      setView(view === ViewState.FAVOURITES ? ViewState.FAVOURITES : ViewState.TIMELINE);
    }
  }, [view]);

  const handleGoHome = useCallback(() => {
    setView(ViewState.LANDING);
    setSelectedProject(null);
    setHoveredColor(DEFAULT_ACCENT);
    setSearchQuery('');
    setScrollProgress(0);
  }, []);

  const handleNextChapter = useCallback(() => {
    if (!selectedProject) return;
    
    const currentIndex = currentProjects.findIndex(p => p.id === selectedProject.id);
    if (currentIndex !== -1 && currentIndex < currentProjects.length - 1) {
      setSelectedProject(currentProjects[currentIndex + 1]);
      const detailContainer = document.querySelector('.fixed.inset-0.overflow-y-auto');
      if (detailContainer) detailContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleBackToTimeline();
    }
  }, [selectedProject, currentProjects, handleBackToTimeline]);

  const handleBackToSelector = useCallback(() => {
    setView(ViewState.SELECTOR);
    setSearchQuery('');
    setScrollProgress(0);
  }, []);

  const handleHover = useCallback((color: string | null) => {
    setHoveredColor(color || selectedProject?.accentColor || DEFAULT_ACCENT);
  }, [selectedProject]);

  const handleLaunchCurated = useCallback(() => {
    setView(ViewState.FAVOURITES);
    setScrollProgress(0);
  }, []);

  const handleOpenSearch = useCallback(() => {
    if (view !== ViewState.DEVELOPER) {
      setPrevView(view);
      setView(ViewState.DEVELOPER);
    }
  }, [view]);

  const currentOrbColor = view === ViewState.DETAIL 
    ? (selectedProject?.accentColor || DEFAULT_ACCENT)
    : hoveredColor;

  const isLastChapter = selectedProject 
    ? currentProjects.findIndex(p => p.id === selectedProject.id) === currentProjects.length - 1 
    : false;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black selection:bg-white selection:text-black">
      {/* Full Bleed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas3D 
          view={view} 
          scrollProgress={scrollProgress} 
          accentColor={currentOrbColor} 
        />
      </div>

      {/* Frosted Glass Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none backdrop-blur-[100px] bg-black/40">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%) pointer-events-none" />
      </div>

      <main className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {view === ViewState.LANDING && (
            <HomeScreen key="landing" onEnter={handleEnter} onDevAccess={handleDevAccess} />
          )}

          {view === ViewState.SELECTOR && (
            <SelectionMenu 
              key="selector" 
              onSelect={handleSelection} 
              onHover={handleHover}
              initialFilter={filterType}
            />
          )}

          {(view === ViewState.TIMELINE || view === ViewState.FAVOURITES) && (
            <Timeline 
              key={`timeline-${activeCategoryId}-${view}`} 
              projects={currentProjects} 
              onSelect={handleProjectSelect}
              onScroll={setScrollProgress}
              onHover={handleHover}
              onBack={view === ViewState.FAVOURITES ? () => setView(ViewState.DEVELOPER) : handleBackToSelector}
              capabilityTitle={view === ViewState.FAVOURITES ? curatedTitle : currentCategoryData.title}
              isEditableTitle={view === ViewState.FAVOURITES}
              onTitleChange={setCuratedTitle}
            />
          )}

          {view === ViewState.DETAIL && selectedProject && (
            <DetailView 
              key={selectedProject.id} 
              project={selectedProject} 
              onBack={handleBackToTimeline}
              onNext={handleNextChapter}
              isLast={isLastChapter}
            />
          )}

          {view === ViewState.DEVELOPER && (
            <DeveloperPage 
              key="developer" 
              onBack={() => setView(prevView)} 
              onLaunchCurated={handleLaunchCurated}
              allProjects={flattenedAllProjects}
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
              onSelectProject={handleProjectSelect}
              curatedTitle={curatedTitle}
              onCuratedTitleChange={setCuratedTitle}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Global Navigation */}
      <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-50 pointer-events-none">
        <motion.button 
          onClick={handleGoHome}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 pointer-events-auto hover:opacity-100 transition-opacity flex items-center space-x-2 cursor-pointer"
        >
          <span>AtkinsRéalis</span>
        </motion.button>
        
        <div className="flex items-center space-x-8 pointer-events-auto">
          { view !== ViewState.DEVELOPER && (
            <motion.button 
              onClick={handleOpenSearch}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-6 py-2.5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40 group-hover:text-white">Search Library</span>
            </motion.button>
          )}

          {view === ViewState.FAVOURITES && (
            <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-white/40 uppercase">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>{favouriteIds.length} Curated</span>
            </div>
          )}
        </div>
      </div>

      {!isTouchDevice && <CustomCursor view={view} />}
    </div>
  );
};

export default App;
