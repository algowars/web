import React from "react";
import { vi } from "vitest";

export interface Auth0MockState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  error: any;
  loginWithRedirect: ReturnType<typeof vi.fn>;
  logout: ReturnType<typeof vi.fn>;
  getAccessTokenSilently: ReturnType<typeof vi.fn>;
  getAccessTokenWithPopup: ReturnType<typeof vi.fn>;
}

const defaultState: Auth0MockState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  loginWithRedirect: vi.fn(async () => {}),
  logout: vi.fn(async () => {}),
  getAccessTokenSilently: vi.fn(async () => "test-access-token"),
  getAccessTokenWithPopup: vi.fn(async () => "test-access-token"),
};

let state: Auth0MockState = { ...defaultState };

export function setAuth0State(partial: Partial<Auth0MockState>) {
  state = { ...state, ...partial };
}
export function setAuthenticatedUser(
  user: any = { sub: "user_123", name: "Test User", email: "test@example.com" }
) {
  setAuth0State({ isAuthenticated: true, user });
}
export function resetAuth0State() {
  state = { ...defaultState };
  // reset spies
  Object.values(state).forEach((v) => {
    if (typeof v === "function" && "mockReset" in v) {
      v.mockReset();
    }
  });
}

vi.mock("@auth0/auth0-react", () => {
  return {
    Auth0Provider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useAuth0: () => state,
    withAuthenticationRequired:
      (Component: React.ComponentType<any>) => (props: any) =>
        <Component {...props} />,
  };
});
