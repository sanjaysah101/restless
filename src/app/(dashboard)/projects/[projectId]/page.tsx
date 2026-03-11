'use client';

import { useState, useEffect, use } from 'react';
import { Project, Endpoint } from '@/types';
import EndpointList from '@/components/EndpointList';
import EndpointForm from '@/components/EndpointForm';
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, Plus, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects?id=${projectId}`);
      // NOTE: Our current API doesn't support fetching a single project by ID easily.
      // We will fetch all and find it, or we could just use the id from params for the UI until
      // we need the project name.
      const allRes = await fetch('/api/projects');
      if (allRes.ok) {
        const allProj: Project[] = await allRes.json();
        const found = allProj.find(p => p.id === projectId);
        if (found) setProject(found);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEndpoints = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/endpoints?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setEndpoints(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchEndpoints();
    setEditingEndpoint(null);
  }, [projectId]);

  const handleRefreshEndpoints = () => {
    fetchEndpoints();
  };

  const handleEditClick = (ep: Endpoint) => {
    setEditingEndpoint(ep);
    setIsDialogOpen(true);
  };

  const handleNewClick = () => {
    setEditingEndpoint(null);
    setIsDialogOpen(true);
  };

  const onFormComplete = () => {
    setIsDialogOpen(false);
    handleRefreshEndpoints();
  };

  if (!project) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur-sm z-10 sticky top-0 px-8 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{project.name}</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Folder className="w-4 h-4" /> Project details</span>
            <span>•</span>
            <Badge variant="outline" className="font-mono bg-muted/50">
              Base: /mock/{project.id}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className={buttonVariants()} onClick={handleNewClick}>
              <Plus className="w-4 h-4 mr-2" /> New Endpoint
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingEndpoint ? 'Edit Mock Endpoint' : 'Create Mock Endpoint'}</DialogTitle>
                <DialogDescription>
                  Configure your mock route, HTTP method, and desired latency/error behavior.
                </DialogDescription>
              </DialogHeader>
              <EndpointForm 
                projectId={project.id}
                onCreated={onFormComplete}
                editingEndpoint={editingEndpoint}
                onCancelEdit={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-8 bg-muted/10 h-full">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <EndpointList 
              projectId={project.id}
              endpoints={endpoints} 
              onRefresh={handleRefreshEndpoints}
              onEdit={handleEditClick}
            />
          )}
        </div>
      </div>
    </>
  );
}
