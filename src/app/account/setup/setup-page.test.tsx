import { render } from "@testing-library/react";
import AccountSetupPage from "./page";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

vi.mock("@/lib/auth0", () => ({
  auth0: { getSession: vi.fn() },
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<any>("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

vi.mock("@/components/layouts/landing-layout/landing-layout", () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

vi.mock(
  "@/features/account/setup/account-setup-form/account-setup-form",
  () => ({
    default: () => <div data-testid="form" />,
  })
);

vi.mock("@/features/auth/guards/account-already-exists.guard", () => ({
  AccountAlreadyExistsGuard: ({ children }: any) => (
    <div data-testid="guard">{children}</div>
  ),
}));

describe("AccountSetupPage", () => {
  it("redirects when no session exists", async () => {
    (auth0.getSession as any).mockResolvedValue(null);

    await AccountSetupPage(); // triggers redirect()

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("renders page when session exists", async () => {
    (auth0.getSession as any).mockResolvedValue({
      user: { sub: "test-user" },
    });

    const ui = await AccountSetupPage();
    const { getByTestId } = render(ui);

    expect(getByTestId("guard")).toBeInTheDocument();
    expect(getByTestId("layout")).toBeInTheDocument();
    expect(getByTestId("form")).toBeInTheDocument();
  });
});
