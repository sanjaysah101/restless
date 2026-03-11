import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpMethod } from '@/types';

async function handleRequest(request: Request, projectId: string, slug: string[], method: HttpMethod) {
  const path = '/' + slug.join('/');

  try {
    // 1. Find the active endpoint configured by the user for this specific project
    const endpoint = await prisma.endpoint.findFirst({
      where: {
        projectId: projectId,
        path: path,
        method: method,
        active: true,
      },
    });

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Mock endpoint not found or inactive in this project.' },
        { status: 404 }
      );
    }

    // 2. Simulate latency
    if (endpoint.latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, endpoint.latencyMs));
    }

    // 3. Simulate error rate
    if (endpoint.errorRate > 0) {
      const randomValue = Math.random(); // 0 to 1
      if (randomValue < endpoint.errorRate) {
        // Decide randomly between 500 and 404 for realism, or just 500
        const errorCodes = [500, 502, 503, 504];
        const randomErrorStatus = errorCodes[Math.floor(Math.random() * errorCodes.length)];
        return NextResponse.json(
          { error: `Simulated network error (Rate: ${endpoint.errorRate * 100}%)` },
          { status: randomErrorStatus }
        );
      }
    }

    // 4. Return the configured response body
    // We try to parse it as JSON. If it fails, we return it as text.
    let responseBody;
    let isJson = false;
    try {
      if (endpoint.responseBody) {
        responseBody = JSON.parse(endpoint.responseBody);
        isJson = true;
      } else {
        responseBody = {};
        isJson = true;
      }
    } catch {
      responseBody = endpoint.responseBody;
    }

    if (isJson) {
      return NextResponse.json(responseBody, { status: 200 });
    } else {
      return new NextResponse(responseBody, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    console.error(`Mockflow Error on [${method}] /mock/${projectId}${path}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

type ParamsProps = { params: Promise<{ projectId: string, slug: string[] }> };

export async function GET(req: Request, { params }: ParamsProps) {
  const resolvedParams = await params;
  return handleRequest(req, resolvedParams.projectId, resolvedParams.slug, 'GET');
}

export async function POST(req: Request, { params }: ParamsProps) {
  const resolvedParams = await params;
  return handleRequest(req, resolvedParams.projectId, resolvedParams.slug, 'POST');
}

export async function PUT(req: Request, { params }: ParamsProps) {
  const resolvedParams = await params;
  return handleRequest(req, resolvedParams.projectId, resolvedParams.slug, 'PUT');
}

export async function PATCH(req: Request, { params }: ParamsProps) {
  const resolvedParams = await params;
  return handleRequest(req, resolvedParams.projectId, resolvedParams.slug, 'PATCH');
}

export async function DELETE(req: Request, { params }: ParamsProps) {
  const resolvedParams = await params;
  return handleRequest(req, resolvedParams.projectId, resolvedParams.slug, 'DELETE');
}

export async function OPTIONS(req: Request, { params }: ParamsProps) {
  // Always return 200 for CORS preflight on mock endpoints
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
