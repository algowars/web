import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/account/settings/profile', () => {
  it('returns username from x-user header', async () => {
    const req = new Request('http://localhost', { headers: { 'x-user': 'testuser' } });

    const res = await GET(req as Request);

    expect(res.status).toBe(200);

    const body = await (res as Response).json();
    expect(body).toEqual({ username: 'testuser' });
  });

  it('returns default dev-user when header missing', async () => {
    const req = new Request('http://localhost');

    const res = await GET(req as Request);

    expect(res.status).toBe(200);

    const body = await (res as Response).json();
    expect(body).toEqual({ username: 'dev-user' });
  });
});
