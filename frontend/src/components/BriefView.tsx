'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ProjectResponse, ProductionBrief } from '../types';
import { FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BriefViewProps {
  project: ProjectResponse;
  onRefreshProject?: () => void;
}

export function BriefView({ project, onRefreshProject }: BriefViewProps) {
  const [brief, setBrief] = useState<ProductionBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const b = await api.getBrief(project.id);
      setBrief(b);
    } catch (e: any) {
      if (e.status !== 404) console.error("Error loading brief:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [project.id]);

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    try {
      const b = await api.generateBrief(project.id);
      setBrief(b);
      if (onRefreshProject) onRefreshProject();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div>Loading brief...</div>;

  if (!brief) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <FileText className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Production Brief Not Ready</h3>
        <p className="text-slate-500 mb-6 max-w-md">The brief is generated from the approved findings. Ensure you have reviewed and approved the necessary research first.</p>
        <button 
          onClick={handleGenerateBrief}
          disabled={isGenerating}
          className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Production Brief'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Production Brief</h2>
          <p className="text-slate-500 text-sm">Generated for: {project.title}</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline">
          Export as PDF
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Executive Summary</h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            {brief.executive_summary}
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Key Recommendations</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brief.production_recommendations.map((r, i) => (
              <li key={i} className="flex gap-3 bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brief.historical_cultural_guidance && brief.historical_cultural_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Historical & Cultural</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.historical_cultural_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.location_guidance && brief.location_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Location Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.location_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.prop_guidance && brief.prop_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Prop Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.prop_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.wardrobe_guidance && brief.wardrobe_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Wardrobe Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.wardrobe_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.vehicle_guidance && brief.vehicle_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Vehicle Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.vehicle_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.weather_guidance && brief.weather_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Weather Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.weather_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.logistics_guidance && brief.logistics_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Logistics & Permitting</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.logistics_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.safety_guidance && brief.safety_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Safety Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.safety_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {brief.continuity_guidance && brief.continuity_guidance.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Continuity Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {brief.continuity_guidance.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {(brief.open_questions?.length > 0 || brief.human_review_items?.length > 0) && (
          <section className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 text-slate-800 dark:text-slate-200">Review & Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brief.open_questions && brief.open_questions.length > 0 && (
                <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900/50 dark:bg-orange-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-800 dark:text-orange-300">Open Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-orange-900/80 dark:text-orange-200/80">
                      {brief.open_questions.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {brief.human_review_items && brief.human_review_items.length > 0 && (
                <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-800 dark:text-red-300">Human Review Needed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-red-900/80 dark:text-red-200/80">
                      {brief.human_review_items.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}
        
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Source Index</h3>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <ul className="list-disc pl-5 space-y-2 text-sm break-all">
              {brief.source_index.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {s.title || s.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
