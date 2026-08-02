import { ProjectResponse, ScriptBreakdown } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  project: ProjectResponse;
  onReanalyze: (id: string) => Promise<void>;
  isReanalyzing: boolean;
}

export function ProjectDetails({ project, onReanalyze, isReanalyzing }: Props) {
  const bd: ScriptBreakdown | undefined = project.breakdown;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
          <p className="text-muted-foreground">Status: {project.status}</p>
        </div>
        <Button 
          onClick={() => onReanalyze(project.id)} 
          disabled={isReanalyzing}
          variant="outline"
        >
          {isReanalyzing ? "Reanalyzing..." : "Reanalyze"}
        </Button>
      </div>

      {!bd ? (
        <Card>
          <CardContent className="pt-6">
            <p>No breakdown available yet. {project.status === 'processing' ? 'Analysis in progress...' : ''}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Scene Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{bd.short_scene_summary}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Setting:</span> {bd.setting}</div>
                <div><span className="font-semibold">Time:</span> {bd.time_period} / {bd.time_of_day}</div>
                <div><span className="font-semibold">Type:</span> {bd.interior_or_exterior}</div>
                <div><span className="font-semibold">Model:</span> {bd.model_metadata}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cast & Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {bd.characters.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Props & Wardrobe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Props</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {bd.props.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Wardrobe</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {bd.wardrobe_requirements.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Logistics & Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Logistical Considerations</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {bd.logistical_considerations.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safety Considerations</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {bd.safety_considerations.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-primary/50">
            <CardHeader>
              <CardTitle>Research Questions (Parallel Target)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {bd.research_questions.map((rq, i) => (
                  <li key={i} className="bg-muted p-4 rounded-md">
                    <p className="font-medium text-lg">{rq.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">Reason: {rq.reason}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
