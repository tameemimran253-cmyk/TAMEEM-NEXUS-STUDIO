import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../../data/studioData';

interface ProjectVisualRendererProps {
  project: ProjectItem;
  className?: string;
  isModal?: boolean;
}

export const ProjectVisualRenderer: React.FC<ProjectVisualRendererProps> = ({
  project,
  className = '',
  isModal = false,
}) => {
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Load custom image from localStorage if saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`custom_project_img_${project.id}`);
      if (saved) {
        setCustomImage(saved);
      }
    } catch {
      // ignore
    }
  }, [project.id]);

  const displayImage = customImage || project.image;

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-2xl group/visual bg-black ${className}`}
    >
      <img
        src={displayImage}
        alt={project.imageAlt || project.title}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover object-center ${
          isModal
            ? 'scale-100'
            : 'group-hover/visual:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover/visual:opacity-100'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
};
