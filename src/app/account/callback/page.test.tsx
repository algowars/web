vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

vi.mock("@/lib/auth0", () => ({
    auth0: {
        getSession: vi.fn().mockResolvedValue({ user: { sub: "auth0|123456" } }),
    },
}));

import AccountCallbackPage from "./page";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";
import AuthCallback from "@/features/auth/auth-callback/auth-callback";

describe("AccountCallbackPage", () => {
    it("redirects to home if no session", async () => {
        vi.mocked(auth0.getSession).mockResolvedValueOnce(null);
        await AccountCallbackPage();

        expect(auth0.getSession).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith(routerConfig.home.path);
    });

    it("displays AuthCallback if session exists", async () => {
       
        const result = await AccountCallbackPage();

        expect(auth0.getSession).toHaveBeenCalled();
        expect(result).toEqual(<AuthCallback />);
    });
});