'use client';

import { useEffect, useState } from 'react';
import { WorkspaceShell } from '../components/WorkspaceShell';
import { api } from '../lib/api';
import { ProjectResponse } from '@/types';

export default function Home() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.listProjects();
      setProjects(data);
      if (data.length > 0 && !activeProject) {
        setActiveProject(data[0]);
      }
    } catch (error) {
      console.error('Failed to load projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (project: ProjectResponse) => {
    setProjects(prev => [project, ...prev]);
    setActiveProject(project);
  };

  const handleSelectProject = async (id: string) => {
    try {
      const project = await api.getProject(id);
      setActiveProject(project);
    } catch (error) {
      console.error('Failed to load project details', error);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">Loading workspace...</div>;
  }

  return (
    <WorkspaceShell
      activeProject={activeProject}
      onNewProject={() => setActiveProject(null)}
      onProjectCreated={handleProjectCreated}
      projects={projects}
      onSelectProject={handleSelectProject}
      onRefreshProject={() => {
        if (activeProject) handleSelectProject(activeProject.id);
      }}
    />
  );
}
