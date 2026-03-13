'use client';

import { Zap, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProject } from '@/hooks/use-create-project';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmptyDashboardState() {
  const {
    newProjectName,
    setNewProjectName,
    creatingProject,
    handleCreateProject,
  } = useCreateProject();

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-muted/10 min-h-full">
      <Card className="max-w-md w-full border-dashed shadow-sm border-2">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to RESTless</CardTitle>
          <CardDescription className="text-base mt-2">
            You don't have any projects selected yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8 pt-4">
          <p className="text-sm text-muted-foreground mb-8">
            Create a new project to start building powerful mock APIs, defining responses, and simulating network conditions.
          </p>
          
          <form onSubmit={handleCreateProject} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <Input
              placeholder="e.g. My Awesome API"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="bg-background"
              disabled={creatingProject}
            />
            <Button 
              type="submit" 
              className="w-full sm:w-auto shrink-0" 
              disabled={creatingProject || !newProjectName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              {creatingProject ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
