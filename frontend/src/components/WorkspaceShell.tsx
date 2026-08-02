'use client';

import React, { useState } from 'react';
import { LayoutDashboard, FileText, CheckSquare, Search, BookOpen, Activity, PlusCircle, Settings, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { ProjectDetails } from './ProjectDetails';
import { ScriptInputForm } from './ScriptInputForm';
import { ResearchView } from './ResearchView';
import { BriefView } from './BriefView';
import { ActivityView } from './ActivityView';
import { SettingsModal } from './SettingsModal';
import { OverviewView } from './OverviewView';
import { ProjectResponse, api } from '../lib/api';

interface WorkspaceShellProps {
  activeProject: ProjectResponse | null;
  onNewProject: () => void;
  onProjectCreated: (project: ProjectResponse) => void;
  projects: ProjectResponse[];
  onSelectProject: (id: string) => void;
  onRefreshProject?: () => void;
}

export function WorkspaceShell({ activeProject, onNewProject, onProjectCreated, projects, onSelectProject, onRefreshProject }: WorkspaceShellProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async (data: any) => {
    setIsCreating(true);
    try {
      const project = await api.createProject(data);
      onProjectCreated(project);
    } catch (error) {
      console.error('Failed to create project', error);
      alert('Failed to create project. See console for details.');
    } finally {
      setIsCreating(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, enabled: true },
    { id: 'script', label: 'Script', icon: FileText, enabled: true },
    { id: 'breakdown', label: 'Breakdown', icon: CheckSquare, enabled: !!activeProject?.breakdown },
    { id: 'research', label: 'Research', icon: Search, enabled: !!activeProject?.breakdown },
    { id: 'brief', label: 'Production Brief', icon: BookOpen, enabled: !!activeProject?.breakdown },
    { id: 'activity', label: 'Activity', icon: Activity, enabled: !!activeProject },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`transition-all duration-300 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2 font-bold text-lg text-primary">
                <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-white text-xs">S</div>
                SceneScout
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                <ChevronLeft size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="mx-auto text-slate-400 hover:text-slate-600">
              <Menu size={20} />
            </button>
          )}
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          <button 
            onClick={onNewProject}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors mb-6 ${isSidebarOpen ? 'w-full px-3' : 'w-8 h-8 mx-auto p-0 rounded-full'}`}
            title="New Project"
          >
            <PlusCircle size={16} />
            {isSidebarOpen && <span>New Project</span>}
          </button>

          {isSidebarOpen && <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Projects</div>}
          <div className="space-y-1">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                title={p.title}
                className={`w-full flex items-center rounded-md text-sm ${
                  isSidebarOpen ? 'px-3 py-2 text-left truncate' : 'justify-center h-8'
                } ${activeProject?.id === p.id ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {isSidebarOpen ? p.title : <FileText size={16} />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 ${isSidebarOpen ? 'gap-2 w-full px-2 py-2' : 'justify-center w-full'}`} 
            title="Settings"
          >
            <Settings size={16} />
            {isSidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeProject ? (
          <>
            {/* Header */}
            <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <h1 className="font-semibold text-lg truncate max-w-md">{activeProject.title}</h1>
              </div>
              <div className="flex items-center gap-3 text-sm shrink-0">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                  {activeProject.workflow_state.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </header>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    disabled={!tab.enabled}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                    } ${!tab.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
              <div className="max-w-6xl mx-auto">
                {activeTab === 'overview' && (
                  <OverviewView project={activeProject} />
                )}
                {activeTab === 'script' && (
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold mb-4">Scene Text</h2>
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-md border border-slate-100 dark:border-slate-800">
                      {activeProject.scene_text}
                    </pre>
                  </div>
                )}
                {activeTab === 'breakdown' && activeProject.breakdown && (
                  <ProjectDetails project={activeProject} />
                )}
                {activeTab === 'research' && (
                  <ResearchView project={activeProject} onRefreshProject={onRefreshProject} />
                )}
                {activeTab === 'brief' && (
                  <BriefView project={activeProject} onRefreshProject={onRefreshProject} />
                )}
                {activeTab === 'activity' && (
                  <ActivityView project={activeProject} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
            <div className="min-h-full flex flex-col items-center justify-center py-10">
              <div className="max-w-2xl w-full text-center">
                <h2 className="text-2xl font-bold mb-2">Create New Project</h2>
                <p className="text-slate-500 mb-8">Enter your scene text below to begin the autonomous breakdown and research process.</p>
                <div className="text-left">
                  <ScriptInputForm onSubmit={handleCreateProject} isLoading={isCreating} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
