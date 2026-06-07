import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-response';

describe('API Response Helpers', () => {
  it('successResponse returns 200 with data', async () => {
    const res = successResponse({ id: '1', name: 'test' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual({ id: '1', name: 'test' });
    expect(body.error).toBeNull();
  });

  it('successResponse accepts custom status', async () => {
    const res = successResponse({ created: true }, 201);
    expect(res.status).toBe(201);
  });

  it('errorResponse returns 400 with error', async () => {
    const res = errorResponse('Bad input');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bad input');
    expect(body.data).toBeNull();
  });

  it('unauthorizedResponse returns 401', async () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('notFoundResponse returns 404 with resource name', async () => {
    const res = notFoundResponse('Trade');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('Trade');
  });

  it('serverErrorResponse returns 500', async () => {
    const res = serverErrorResponse();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Internal server error');
  });
});
