'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ProjectResponse, ResearchPlan, Finding, ResearchQuestionDetail } from '../types';
import { Play, CheckCircle, AlertCircle, Clock, FileSearch } from 'lucide-react';

interface ResearchViewProps {
  project: ProjectResponse;
  onRefreshProject?: () => void;
}

export function ResearchView({ project, onRefreshProject }: ResearchViewProps) {
  const [plan, setPlan] = useState<ResearchPlan | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (project.workflow_state !== 'draft' && project.workflow_state !== 'breakdown_complete') {
        try {
          const p = await api.getResearchPlan(project.id);
          setPlan(p);
        } catch (e: any) {
          if (e.status !== 404) console.error("Error loading plan:", e);
        }
      }
      try {
        const f = await api.getFindings(project.id);
        setFindings(f);
      } catch (e: any) {
        if (e.status !== 404) console.error("Error loading findings:", e);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [project.id, project.workflow_state]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (project.workflow_state === 'research_running') {
      interval = setInterval(() => {
        loadData();
        if (onRefreshProject) onRefreshProject();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [project.workflow_state, project.id]);

  useEffect(() => {
    if (plan && selectedQuestionIds.size === 0) {
      setSelectedQuestionIds(new Set(plan.questions.map(q => q.id)));
    }
  }, [plan]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const p = await api.generateResearchPlan(project.id);
      setPlan(p);
      if (onRefreshProject) onRefreshProject();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunResearch = async () => {
    if (!plan) return;
    const selectedIds = Array.from(selectedQuestionIds);
    if (selectedIds.length === 0) return;
    setIsGenerating(true);
    try {
      await api.runResearch(project.id, selectedIds);
      if (onRefreshProject) onRefreshProject();
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (findingId: string) => {
    await api.updateFindingStatus(project.id, findingId, 'approved');
    loadData();
  };

  if (isLoading) return <div>Loading research data...</div>;

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <FileSearch className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">No Research Plan Yet</h3>
        <p className="text-slate-500 mb-6 max-w-md">Generate a structured research plan based on the script breakdown to begin autonomous web searches.</p>
        <button 
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Research Plan'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Plan Section */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-semibold text-lg">Research Plan</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Select the questions you want the AI agents to research, then click "Run Selected Questions". Once the agents gather evidence, review and approve their findings below to include them in your final Production Brief.
            </p>
          </div>
          <button 
            onClick={handleRunResearch}
            disabled={isGenerating || project.workflow_state === 'research_running'}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <Play size={16} /> {isGenerating ? 'Starting Agents...' : 'Run Selected Questions'}
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {plan.questions.map((q: ResearchQuestionDetail) => (
            <div key={q.id} className="p-4 flex gap-4 items-start">
              <input 
                type="checkbox" 
                checked={selectedQuestionIds.has(q.id)} 
                onChange={() => {
                  setSelectedQuestionIds(prev => {
                    const next = new Set(prev);
                    if (next.has(q.id)) next.delete(q.id);
                    else next.add(q.id);
                    return next;
                  });
                }}
                className="mt-1" 
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{q.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${q.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{q.priority}</span>
                </div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">{q.question}</h4>
                <p className="text-sm text-slate-500 mb-2">{q.search_objective}</p>
                <div className="text-xs text-slate-400"><strong>Affects:</strong> {q.production_decision_affected}</div>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                {findings.some(f => f.question_id === q.id) ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Clock className="text-slate-300" size={20} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Findings Section */}
      {findings.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Evidentiary Findings</h3>
          <div className="grid grid-cols-1 gap-4">
            {findings.map((f: Finding) => (
              <div key={f.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded-sm uppercase ${f.confidence_level === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {f.confidence_level} Confidence
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-sm uppercase ${f.status === 'approved' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {f.status}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2">{f.claim}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{f.evidence_summary}</p>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm mb-4">
                  <strong>Sources:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {f.supporting_sources.map((s, idx) => (
                      <li key={idx}><a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{s.title || s.url}</a></li>
                    ))}
                  </ul>
                </div>

                {f.status !== 'approved' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(f.id)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Approve Finding</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
