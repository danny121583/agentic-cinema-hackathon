'use client';

import React from 'react';
import { ProjectResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Sun, User, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  project: ProjectResponse;
}

export function OverviewView({ project }: Props) {
  const breakdown = project.breakdown;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scene Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {breakdown ? (
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-md border border-slate-100 dark:border-slate-800">
                  {breakdown.short_scene_summary}
                </p>
              ) : (
                <p className="text-slate-400 italic">Breakdown not yet generated.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Director&apos;s Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {project.notes ? (
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-md border border-slate-100 dark:border-slate-800">
                  {project.notes}
                </p>
              ) : (
                <p className="text-slate-400 italic">No notes provided for this scene.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-blue-500" />
                <div>
                  <div className="text-xs text-slate-400">Status</div>
                  <div className="text-sm font-medium">{project.workflow_state.replace(/_/g, ' ').toUpperCase()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Created</div>
                  <div className="text-sm font-medium">{new Date(project.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Last Updated</div>
                  <div className="text-sm font-medium">{new Date(project.updated_at).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {breakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-purple-500" />
                  <div>
                    <div className="text-xs text-slate-400">Setting</div>
                    <div className="text-sm font-medium">{breakdown.setting} ({breakdown.interior_or_exterior})</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-orange-500" />
                  <div>
                    <div className="text-xs text-slate-400">Time Period</div>
                    <div className="text-sm font-medium">{breakdown.time_period}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sun size={16} className="text-yellow-500" />
                  <div>
                    <div className="text-xs text-slate-400">Time of Day</div>
                    <div className="text-sm font-medium">{breakdown.time_of_day}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
