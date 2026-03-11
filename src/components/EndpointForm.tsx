'use client';

import { useState } from 'react';
import { Play, Save, AlertCircle, Clock } from 'lucide-react';
import { HttpMethod } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          New Mock Endpoint
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}

        <form id="endpointForm" onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2" style={{ flex: '0 0 120px' }}>
              <Label>Method</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2" style={{ flex: '1' }}>
              <Label>Path</Label>
              <Input
                type="text"
                required
                placeholder="/api/v1/users"
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>JSON Response Body</Label>
            <Textarea
              rows={6}
              required
              spellCheck={false}
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Latency (ms)
              </Label>
              <Input
                type="number"
                min="0"
                step="100"
                value={latencyMs}
                onChange={(e) => setLatencyMs(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Error Rate (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={errorRate}
                onChange={(e) => setErrorRate(Number(e.target.value))}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          form="endpointForm"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Create Endpoint</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
