import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateEndpointInput } from '@/types';

export async function GET() {
  try {
    const endpoints = await prisma.endpoint.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(endpoints);
  } catch (error) {
    console.error('Failed to fetch endpoints', error);
    return NextResponse.json({ error: 'Failed to fetch endpoints' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateEndpointInput = await request.json();
    
    // Ensure path starts with a slash
    const normalizedPath = body.path.startsWith('/') ? body.path : `/${body.path}`;

    const endpoint = await prisma.endpoint.create({
      data: {
        path: normalizedPath,
        method: body.method,
        responseBody: body.responseBody,
        latencyMs: body.latencyMs || 0,
        errorRate: body.errorRate || 0,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(endpoint, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create endpoint', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'An endpoint with this exact path already exists. Use a unique path.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create endpoint' }, { status: 500 });
  }
}
