'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Folder, Plus, LayoutDashboard } from "lucide-react";
import { Project } from '@/types';

export function Sidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreatingProject(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (res.ok) {
        const newProj = await res.json();
        setNewProjectName('');
        await fetchProjects();
        router.push(`/projects/${newProj.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingProject(false);
    }
  };

  return (
    <aside className="w-64 border-r bg-muted/30 hidden flex-col lg:flex shrink-0 h-screen sticky top-0">
      <div className="p-6 pb-2 border-b shrink-0 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none">
            MockFlow
          </h1>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dashboard</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" /> Your Projects
            </h3>
          </div>
          <div className="space-y-1">
            {projects.map(proj => {
              const isActive = pathname.startsWith(`/projects/${proj.id}`);
              return (
                <Link 
                  href={`/projects/${proj.id}`}
                  key={proj.id}
                  className={buttonVariants({
                    variant: isActive ? 'secondary' : 'ghost',
                    className: `w-full justify-start font-medium ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}`
                  })}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span className="truncate">{proj.name}</span>
                </Link>
              );
            })}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground px-2 py-4">No projects yet. Create one below.</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-background/50">
        <form onSubmit={handleCreateProject} className="flex gap-2">
          <Input 
            placeholder="New project name" 
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            className="h-8 text-sm bg-background"
          />
          <Button type="submit" size="sm" disabled={creatingProject || !newProjectName.trim()} className="shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </form>
      </div>
    </aside>
  );
}
