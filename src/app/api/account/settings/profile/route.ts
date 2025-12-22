import { NextResponse } from 'next/server';

// Simple route handler to return profile settings.
// TODO: replace with real authorization and account ownership checks.
export async function GET(request: Request) {
  try {
    // In a real app, validate session/auth and ensure the requester
    // is authorized to view the profile. For now, support a dev
    // header `x-user` to return a specific username for testing.
    const usernameFromHeader = request.headers.get('x-user');

    const username = usernameFromHeader ?? 'dev-user';

    return NextResponse.json({ username }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Unable to fetch profile' }, { status: 500 });
  }
}
