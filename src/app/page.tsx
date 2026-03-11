'use client';

import { useEffect, useState } from 'react';
import EndpointForm from '@/components/EndpointForm';
import EndpointList from '@/components/EndpointList';
import { Endpoint } from '@/types';
import { Zap } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEndpoints = async () => {
    try {
      const res = await fetch('/api/endpoints');
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
    fetchEndpoints();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-20 bg-primary/40 dark:bg-primary/20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-20 bg-rose-500/40 dark:bg-rose-500/20" />
      </div>

      <main className="container max-w-6xl mx-auto py-12 px-4 md:px-6 flex gap-8 flex-col lg:flex-row">
        
        {/* Left Sidebar: Branding & Form */}
        <div className="flex-1 flex flex-col gap-8 max-w-lg">
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="w-32 h-32" />
            </div>
            <CardContent className="p-8 text-center sm:text-left relative z-10">
              <h1 className="flex items-center justify-center sm:justify-start gap-3 mb-4 text-4xl font-black tracking-tighter">
                <span>Mock</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-500">
                  Flow
                </span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The visual API mocking tool for frontend teams. Design endpoints, simulate latency, and test errors in seconds.
              </p>
            </CardContent>
          </Card>

          <EndpointForm onCreated={fetchEndpoints} />
        </div>

        {/* Right Content: Endpoints List */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Endpoints</h2>
              <p className="text-muted-foreground">Manage your available mock routes here.</p>
            </div>
            <Badge variant="secondary" className="font-mono py-1 px-3 text-sm">
              <span className="text-muted-foreground mr-1">Base URL:</span> 
              /mock
            </Badge>
          </div>

          {loading ? (
            <Card className="text-center py-12 border-dashed">
              <CardContent className="flex justify-center p-0">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </CardContent>
            </Card>
          ) : (
            <EndpointList endpoints={endpoints} onRefresh={fetchEndpoints} />
          )}
        </div>
      </main>
    </div>
  );
}
