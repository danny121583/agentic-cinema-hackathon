'use client';

import React, { useState } from 'react';
import { LayoutDashboard, FileText, CheckSquare, Search, BookOpen, Activity, PlusCircle, Settings, ChevronLeft, ChevronRight, Menu, Trash2, AlertTriangle } from 'lucide-react';
import { ProjectDetails } from './ProjectDetails';
import { ScriptInputForm } from './ScriptInputForm';
import { ResearchView } from './ResearchView';
import { BriefView } from './BriefView';
import { ActivityView } from './ActivityView';
import { SettingsModal } from './SettingsModal';
import { OverviewView } from './OverviewView';
import { api } from '../lib/api';
import { ProjectResponse } from '@/types';

interface WorkspaceShellProps {
  activeProject: ProjectResponse | null;
  onNewProject: () => void;
  onProjectCreated: (project: ProjectResponse) => void;
  projects: ProjectResponse[];
  onSelectProject: (id: string) => void;
  onRefreshProject?: () => void;
  onRefreshProjectList?: () => void;
}

export function WorkspaceShell({ activeProject, onNewProject, onProjectCreated, projects, onSelectProject, onRefreshProject, onRefreshProjectList }: WorkspaceShellProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

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

  const handleReanalyze = async (id: string) => {
    setIsReanalyzing(true);
    try {
      await api.reanalyzeProject(id);
      if (onRefreshProject) {
        onRefreshProject();
      }
    } catch (error) {
      console.error('Failed to reanalyze', error);
      alert('Failed to reanalyze. See console for details.');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setDeleteConfirm({ id, title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await api.deleteProject(deleteConfirm.id);
      if (activeProject?.id === deleteConfirm.id) {
        onSelectProject("");
      }
      if (onRefreshProjectList) {
        onRefreshProjectList();
      }
    } catch (error) {
      console.error('Failed to delete project', error);
    } finally {
      setDeleteConfirm(null);
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
              <div
                key={p.id}
                className={`group relative flex items-center rounded-md text-sm ${
                  isSidebarOpen ? 'px-3 py-2' : 'justify-center h-8'
                } ${activeProject?.id === p.id ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <button
                  onClick={() => onSelectProject(p.id)}
                  title={p.title}
                  className="flex-1 flex items-center text-left truncate overflow-hidden"
                >
                  {isSidebarOpen ? <span className="truncate">{p.title}</span> : <FileText size={16} />}
                </button>
                {isSidebarOpen && (
                  <button
                    onClick={(e) => handleDeleteClick(e, p.id, p.title)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity absolute right-2 bg-white dark:bg-slate-950 rounded-sm"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
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
                  <ProjectDetails 
                    project={activeProject} 
                    onReanalyze={handleReanalyze} 
                    isReanalyzing={isReanalyzing} 
                  />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          {/* Modal */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Delete Project</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Are you sure you want to delete <span className="font-medium text-slate-700 dark:text-slate-300">&ldquo;{deleteConfirm.title}&rdquo;</span>? This action cannot be undone and all associated data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
