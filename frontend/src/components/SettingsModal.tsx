'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { X, Server, Database, Activity } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadHealth = async () => {
    setIsLoading(true);
    try {
      const data = await api.checkHealth();
      setHealth(data);
    } catch (e) {
      console.error(e);
      setHealth({ status: 'error', error: String(e) });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold">Workspace Settings</h2>
          <button onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">System Health</h3>
            
            {isLoading ? (
              <div className="text-sm text-slate-500">Checking connections...</div>
            ) : health ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Server size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">API Server</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${health.status === 'ok' || health.status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {health.status || 'Offline'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-purple-500" />
                    <span className="text-sm font-medium">Storage Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {health.storage_mode === 'firestore' ? (
                      <span className="text-xs px-2 py-1 rounded-full font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500">
                        Firebase
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {health.storage_mode || 'unknown'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-orange-500" />
                    <span className="text-sm font-medium">AI Agent Mode</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {health.ai_mode || 'unknown'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-500">Failed to load system health.</div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
