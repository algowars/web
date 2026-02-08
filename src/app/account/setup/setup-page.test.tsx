import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import { redirect } from "next/navigation";
import AccountSetupPage from "./page";
import { AccountAlreadyExistsGuard } from "@/features/auth/guards/account-already-exists.guard";
import LandingLayout from "@/components/layouts/landing-layout/landing-layout";
import AccountSetupForm from "@/features/account/setup/account-setup-form/account-setup-form";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: vi.fn().mockResolvedValue({ user: { sub: "auth0|123456" } }),
  },
}));

describe("AccountSetupPage", () => {
  it("can be initialized", () => {
    expect(AccountSetupPage).toBeDefined();
  });

  it("redirects to home if no session", async () => {
    vi.mocked(auth0.getSession).mockResolvedValueOnce(null);

    await AccountSetupPage();

    expect(auth0.getSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(routerConfig.home.path);
  });

  it("renders the setup page if session exists", async () => {
    const result = await AccountSetupPage();

    expect(auth0.getSession).toHaveBeenCalled();
    expect(result).toEqual(
      <AccountAlreadyExistsGuard>
        <LandingLayout mainClassName="flex justify-center items-center py-9">
          <AccountSetupForm className="w-full max-w-96" />
        </LandingLayout>
      </AccountAlreadyExistsGuard>,
    );
  });
});
