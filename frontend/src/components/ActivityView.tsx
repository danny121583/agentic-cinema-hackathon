'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ProjectResponse, ActivityEvent } from '../types';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ActivityViewProps {
  project: ProjectResponse;
}

export function ActivityView({ project }: ActivityViewProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
    // Connect to websocket or long-polling here
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [project.id]);

  const loadData = async () => {
    try {
      const e = await api.getActivity(project.id);
      setEvents(e);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-bold mb-6">Workflow Timeline</h2>
      
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {events.map((e, idx) => (
          <div key={e.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              {e.status === 'complete' ? <CheckCircle className="text-green-500" size={20} /> :
               e.status === 'failed' ? <AlertTriangle className="text-red-500" size={20} /> :
               <Clock size={20} />}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-950 p-4 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{e.agent_name}</span>
                <span className="text-xs text-slate-500">
                  {new Date(e.started_timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{e.action}</p>
              {e.error_message && (
                <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">{e.error_message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
