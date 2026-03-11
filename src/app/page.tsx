'use client';

import { useEffect, useState } from 'react';
import EndpointForm from '@/components/EndpointForm';
import EndpointList from '@/components/EndpointList';
import { Endpoint } from '@/types';
import { Zap } from 'lucide-react';

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
    <>
      <div className="bg-glow-wrapper">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      <main className="container py-12 flex gap-8 flex-col lg:flex-row">
        
        {/* Left Sidebar: Branding & Form */}
        <div className="flex-1 flex flex-col gap-8 max-w-lg">
          <div className="glass-panel p-8 text-center sm:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24" />
            </div>
            <h1 className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <span className="text-white text-4xl font-black tracking-tighter">Mock</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-4xl font-black tracking-tighter">
                Flow
              </span>
            </h1>
            <p className="text-muted text-lg">
              The visual API mocking tool for frontend teams. Design endpoints, simulate latency, and test errors in seconds.
            </p>
          </div>

          <EndpointForm onCreated={fetchEndpoints} />
        </div>

        {/* Right Content: Endpoints List */}
        <div className="flex-[2]">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">Your Endpoints</h2>
              <p className="text-muted">Manage your available mock routes here.</p>
            </div>
            <div className="text-sm font-mono bg-white/5 border border-white/10 px-3 py-1 rounded text-primary">
              Base URL: <span className="text-white">/mock</span>
            </div>
          </div>

          {loading ? (
            <div className="glass-card text-center py-12 animate-pulse">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            </div>
          ) : (
            <EndpointList endpoints={endpoints} onRefresh={fetchEndpoints} />
          )}
        </div>
      </main>
    </>
  );
}
