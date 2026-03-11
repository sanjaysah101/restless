export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Endpoint {
  id: string;
  path: string;
  method: HttpMethod;
  responseBody: string; // JSON string
  latencyMs: number;
  errorRate: number; // 0 to 1 (e.g. 0.5 is 50%)
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEndpointInput = Omit<Endpoint, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEndpointInput = Partial<CreateEndpointInput>;
