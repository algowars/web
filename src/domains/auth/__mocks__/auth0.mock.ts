import { SessionData } from "@auth0/nextjs-auth0/types";
import { createMockSession } from "./auth0.mocks";
import { auth0 } from "@/shared/lib/auth0";

vi.mock("@/shared/lib/auth0", () => ({
  auth0: {
    getSession: vi.fn().mockResolvedValue(createMockSession()),
    getAccessToken: vi.fn().mockResolvedValue({
      token: "mock-access-token",
      expiresAt: Date.now() + 3600,
    }),
  },
}));

export const setSessionMock = (session: SessionData | null) => {
  vi.mocked(auth0.getSession).mockResolvedValue(session);
};
