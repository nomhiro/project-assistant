"use client";

import React, { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';

interface Project {
  id: string;
  name: string;
}

const ProjectSelector = () => {
  const { selectedProject, setSelectedProject } = useProject();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/getall');
        const data = await response.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error('プロジェクトデータが不正です', data);
        }
      } catch (error) {
        console.error('プロジェクトの取得に失敗しました', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };

  return (
    <div>
      <label htmlFor="project">プロジェクト：</label>  
      <select id="project" value={selectedProject || ''} onChange={handleProjectChange} className="border rounded p-2 w-auto" >
        <option value="">選択してください</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;