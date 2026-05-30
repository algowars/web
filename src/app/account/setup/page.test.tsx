import "@/domains/auth/__mocks__/auth0.mock";
import { setSessionMock } from "@/domains/auth/__mocks__/auth0.mock";
import { sessionStates } from "@/domains/auth/__mocks__/auth0.mocks";
import AccountSetupPage from "./page";
import { render } from "@testing-library/react";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";
import { expect } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/shared/components/layouts/landing-layout/landing-layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="landing-layout">{children}</div>
  ),
}));

vi.mock(
  "@/features/account/setup/account-setup-form/account-setup-form",
  () => ({
    default: () => <div data-testid="account-setup-form">Setup Form</div>,
  })
);

describe("AccountSetupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSessionMock(sessionStates.authenticated());
  });

  it("should redirect to home page if the user is not authenticated", async () => {
    setSessionMock(sessionStates.unauthenticated());

    await AccountSetupPage();

    expect(redirect).toHaveBeenCalledWith(routerConfig.home.path);
  });

  it("should not redirect the user if they are authenticated", async () => {
    render(await AccountSetupPage());
  });
});
