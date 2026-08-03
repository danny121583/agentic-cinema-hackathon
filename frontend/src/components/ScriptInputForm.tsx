"use client";

import { useState, useEffect } from "react";
import { ProjectCreate } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (data: ProjectCreate) => Promise<void>;
  isLoading: boolean;
}

export function ScriptInputForm({ onSubmit, isLoading }: Props) {
  const [title, setTitle] = useState("");
  const [sceneText, setSceneText] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTitle = localStorage.getItem("scenecout_title");
    const savedScene = localStorage.getItem("scenecout_scene");
    const savedNotes = localStorage.getItem("scenecout_notes");
    if (savedTitle) setTitle(savedTitle);
    if (savedScene) setSceneText(savedScene);
    if (savedNotes) setNotes(savedNotes);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("scenecout_title", title);
      localStorage.setItem("scenecout_scene", sceneText);
      localStorage.setItem("scenecout_notes", notes);
    }
  }, [title, sceneText, notes, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, scene_text: sceneText, notes });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Script Breakdown</CardTitle>
        <CardDescription>Enter your scene details to generate a breakdown.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title (Optional)</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., The Great Heist (Leave blank for AI generation)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sceneText">Scene Text</Label>
            <Textarea 
              id="sceneText" 
              value={sceneText} 
              onChange={(e) => setSceneText(e.target.value)} 
              placeholder="EXT. ALLEYWAY - NIGHT..."
              className="min-h-[200px]"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Director Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Any specific focus areas?"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !sceneText} className="w-full">
            {isLoading ? "Analyzing..." : "Analyze Scene"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
