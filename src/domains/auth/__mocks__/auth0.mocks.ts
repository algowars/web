import { SessionData, User } from "@auth0/nextjs-auth0/types";

export function createMockSessionUser(overrides: Partial<User> = {}): User {
  return {
    sub: "auth0|123456789",
    email: "test@example.com",
    name: "Test User",
    picture: "https://example.com/avatar.jpg",
    role: "user",
    ...overrides,
  };
}

export function createMockSession(
  overrides: Partial<SessionData> = {}
): SessionData {
  return {
    user: createMockSessionUser(),
    tokenSet: {
      accessToken: "mock-access-token",
      expiresAt: Date.now() + 3600,
    },
    internal: {
      sid: "mock-session-id",
      createdAt: Date.now(),
    },
    ...overrides,
  };
}

export const sessionStates = {
  authenticated: () => createMockSession(),
  unauthenticated: () => null,
  admin: () =>
    createMockSession({
      user: createMockSessionUser({
        role: "admin",
        email: "admin@example.com",
      }),
    }),
};
