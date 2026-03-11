'use client';

import { Endpoint } from '@/types';
import { Copy, Trash2, ExternalLink, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

export default function EndpointList({ 
  endpoints, 
  onRefresh 
}: { 
  endpoints: Endpoint[], 
  onRefresh: () => void 
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this endpoint?')) return;
    await fetch(`/api/endpoints/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/endpoints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !currentStatus }),
    });
    onRefresh();
  };

  const copyUrl = (path: string, id: string) => {
    const fullUrl = `${window.location.origin}/mock${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (endpoints.length === 0) {
    return (
      <div className="glass-card text-center text-muted py-12">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No endpoints mock yet. Create one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {endpoints.map((ep) => (
        <div key={ep.id} className="glass-card flex flex-col gap-3 relative overflow-hidden">
          {/* Status Indicator Bar */}
          <div className={`absolute top-0 left-0 w-1 h-full ${ep.active ? 'bg-green-500' : 'bg-gray-500'}`} />
          
          <div className="flex justify-between items-start pl-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-1 rounded text-xs font-bold leading-none ${getMethodColor(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="font-mono text-lg font-bold text-accent">
                  /mock{ep.path}
                </span>
              </div>
              
              <div className="flex gap-4 text-sm text-muted mt-2">
                <span className="flex items-center gap-1">
                  Delay: {ep.latencyMs}ms
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Error Rate: {ep.errorRate * 100}%
                </span>
                <span>•</span>
                <button 
                  onClick={() => handleToggleActive(ep.id, ep.active)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {ep.active ? <ToggleRight className="text-green-500 w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {ep.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-secondary !p-2"
                title="Copy URL"
                onClick={() => copyUrl(ep.path, ep.id)}
              >
                {copiedId === ep.id ? <span className="text-green-400 text-sm">Copied!</span> : <Copy className="w-4 h-4" />}
              </button>
              <a 
                href={`/mock${ep.path}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary !p-2"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                className="btn btn-secondary !p-2 !text-red-400 hover:!bg-red-500/10 hover:!text-red-500 hover:!border-red-500/30"
                onClick={() => handleDelete(ep.id)}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getMethodColor(method: string) {
  switch (method) {
    case 'GET': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'POST': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'DELETE': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case 'PATCH': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}
