
import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowLeft, ExternalLink, ChevronRight, Home } from 'lucide-react';

interface DetailViewProps {
  project: Project;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
}

const DetailView: React.FC<DetailViewProps> = ({ project, onBack, onNext, isLast }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] w-full h-full bg-black overflow-y-auto no-scrollbar"
    >
      <section className="relative w-full h-[70vh] flex items-end p-8 md:p-24">
        <motion.div 
          layoutId={`image-${project.id}`}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="group flex items-center space-x-3 mb-12 opacity-50 active:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Return to Timeline</span>
          </motion.button>

          <div className="space-y-4">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase"
             >
               Chapter {project.id} / Strategic Phase
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
               className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-none"
             >
               {project.title}
             </motion.h1>
          </div>
        </div>
      </section>

      <section className="relative w-full p-8 md:p-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-12">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-3xl font-medium leading-tight opacity-90"
            >
              {project.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg leading-relaxed opacity-60"
            >
              <p>{project.longDescription}</p>
              <p>Excellence in delivery requires meticulous attention to detail at every turn. Our process is designed to bridge the gap between abstract concept and tangible high-performance output, ensuring your vision is realized with uncompromising quality.</p>
            </motion.div>

            {/* Embedded Case Study Image Section */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                alt="Case Study Context"
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
              />
              <div className="absolute bottom-6 left-6 text-[8px] font-black tracking-[0.4em] uppercase opacity-40">
                Contextual Visualisation — Series 2026
              </div>
            </motion.div>

            {/* Additional Copy Block */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg leading-relaxed opacity-60"
            >
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 pt-4">Strategic Implementation</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.</p>
            </motion.div>
          </div>

          <div className="md:col-span-4 md:col-start-9 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 sticky top-24"
            >
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-4">CAPABILITIES</h4>
                <ul className="text-sm font-bold space-y-2">
                  <li>Strategic Ideation</li>
                  <li>Digital Craftsmanship</li>
                  <li>Visual Engineering</li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-4">SECTOR</h4>
                <div className="text-sm font-bold">Premium Digital & Visual Solutions</div>
              </div>

              <button className="flex items-center space-x-2 text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/20 pb-2 active:border-white transition-colors group">
                <span className="group-hover:mr-2 transition-all">Request Case Study</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Next Chapter Navigation Button */}
        <div className="max-w-6xl mx-auto mt-32 border-t border-white/10 pt-16 flex justify-center">
          <motion.button
            onClick={onNext}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-between w-full max-w-2xl px-12 py-10 bg-white/5 rounded-2xl border border-white/10 transition-all active:bg-white active:text-black active:border-white shadow-2xl"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 group-active:opacity-60 mb-2">
                {isLast ? 'STRATEGIC ARC COMPLETE' : 'READY FOR SEQUENTIAL PHASE'}
              </span>
              <span className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                {isLast ? 'Protocol Summary' : 'Proceed to Next Chapter'}
              </span>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full border border-white/20 group-active:border-black/20">
              {isLast ? <Home className="w-6 h-6" /> : <ChevronRight className="w-8 h-8" />}
            </div>
          </motion.button>
        </div>
      </section>

      <footer className="w-full p-8 pt-32 text-center">
        <div className="text-[10px] font-bold tracking-[0.3em] text-white/10 uppercase">
          CAPABILITY TOOL &copy; 2026
        </div>
      </footer>
    </motion.div>
  );
};

export default DetailView;
