'use client';

import { useState } from 'react';
import { Play, Save, AlertCircle, Clock } from 'lucide-react';
import { HttpMethod } from '@/types';

export default function EndpointForm({ onCreated }: { onCreated: () => void }) {
  const [path, setPath] = useState('/api/test');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [responseBody, setResponseBody] = useState('{\n  "status": "success",\n  "message": "Hello from MockFlow!"\n}');
  const [latencyMs, setLatencyMs] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          method,
          responseBody,
          latencyMs,
          errorRate: errorRate / 100, // convert percentage to 0-1
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create endpoint');
      }

      setPath('');
      setResponseBody('{}');
      setLatencyMs(0);
      setErrorRate(0);
      onCreated();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 className="flex items-center gap-2 mb-4">
        <Play className="w-5 h-5 text-primary" />
        New Mock Endpoint
      </h2>
      
      {errorMsg && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-4">
          <div className="input-group" style={{ flex: '0 0 120px' }}>
            <label className="input-label">Method</label>
            <select
              className="input-field"
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          
          <div className="input-group" style={{ flex: '1' }}>
            <label className="input-label">Path</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="/api/v1/users"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">JSON Response Body</label>
          <textarea
            className="input-field"
            rows={6}
            required
            spellCheck={false}
            value={responseBody}
            onChange={(e) => setResponseBody(e.target.value)}
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <div className="flex gap-4">
          <div className="input-group" style={{ flex: '1' }}>
            <label className="input-label flex items-center gap-2">
              <Clock className="w-4 h-4" /> Latency (ms)
            </label>
            <input
              type="number"
              className="input-field"
              min="0"
              step="100"
              value={latencyMs}
              onChange={(e) => setLatencyMs(Number(e.target.value))}
            />
          </div>

          <div className="input-group" style={{ flex: '1' }}>
            <label className="input-label flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Error Rate (%)
            </label>
            <input
              type="number"
              className="input-field"
              min="0"
              max="100"
              value={errorRate}
              onChange={(e) => setErrorRate(Number(e.target.value))}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary mt-4"
        >
          {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Create Endpoint</>}
        </button>
      </form>
    </div>
  );
}
