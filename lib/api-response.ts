import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  message?: string;
};

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, error: null }, { status });
}

export function errorResponse(message: string, status = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ data: null, error: message }, { status });
}

export function unauthorizedResponse(): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
}

export function forbiddenResponse(): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 });
}

export function notFoundResponse(resource = 'Resource'): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ data: null, error: `${resource} not found` }, { status: 404 });
}

export function serverErrorResponse(error?: unknown): NextResponse<ApiResponse<null>> {
  if (process.env.NODE_ENV !== 'production' && error) {
    console.error('[API Error]', error);
  }
  return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse<null>> {
  const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
  return NextResponse.json({ data: null, error: `Validation error: ${message}` }, { status: 422 });
}
