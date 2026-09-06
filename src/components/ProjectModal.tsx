import React from 'react';
import { X, ExternalLink, Sparkles, Code2, Layers, Cpu } from 'lucide-react';
import { ProjectItem } from '../data/studioData';
import { audio } from '../utils/audioSystem';
import { ProjectVisualRenderer } from './project-visuals/ProjectVisualRenderer';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenContact }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a10] border border-white/10 rounded-2xl p-6 md:p-12 text-white shadow-[0_0_100px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors z-40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8">
          {/* Project Featured Image Banner */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl">
            <ProjectVisualRenderer project={project} isModal={true} />
            
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono-code text-purple-300 uppercase tracking-widest pointer-events-none z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ARCHITECTURE VISUAL</span>
            </div>
          </div>

          {/* Header Tag */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
            <span>{project.category}</span>
            <span>&bull;</span>
            <span>{project.year}</span>
            <span>&bull;</span>
            <span>{project.client}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-cinzel font-light tracking-wide text-white">
            {project.title}
          </h2>

          <p className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-xl bg-white/5 border border-white/10">
            {project.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block">
                  {stat.label}
                </span>
                <span className="text-2xl md:text-3xl font-syne font-bold text-purple-200">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Impact Statement */}
          <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-mono-code text-purple-300 uppercase tracking-widest mb-1">
                MEASURABLE BUSINESS & TECHNICAL IMPACT
              </h4>
              <p className="text-sm text-neutral-200">{project.impact}</p>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              DEPLOYED TECHNOLOGIES & SHADERS
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono-code text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono-code text-neutral-400">
              Need a similar architecture for your organization?
            </div>
            <button
              onClick={() => {
                audio.playClick();
                onClose();
                onOpenContact();
              }}
              className="px-6 py-3 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all flex items-center gap-2"
            >
              <span>COMMISSION SIMILAR PROJECT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
