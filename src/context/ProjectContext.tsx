/**
 * ProjectContext.tsx
 * 選択されたプロジェクトを管理するコンテキスト
 * @package Context
 * @module ProjectContext
 */

"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ProjectContextType {
  selectedProject: string | null;
  setSelectedProject: (project: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};