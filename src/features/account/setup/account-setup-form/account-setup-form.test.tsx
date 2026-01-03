import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, expect } from "vitest";
import { z } from "zod";
import AccountSetupForm from "./account-setup-form";
import { toast } from "sonner";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/features/auth/account.context", () => ({
  useAccount: () => ({
    auth0: { user: { picture: "https://example.com/avatar.png" } },
    refreshAccount: vi.fn(),
  }),
}));

vi.mock("@/features/auth/api/create-account", () => {
  const createAccountSchema = z.object({
    username: z.string().min(1),
    imageUrl: z.string().optional(),
  });

  type FormValues = z.infer<typeof createAccountSchema>;

  return {
    createAccountSchema,
    useCreateAccount: (options: {
      mutationConfig: { onSuccess: (data: FormValues) => void };
    }) => ({
      mutate: async (data: { data: FormValues; accessToken: string }) => {
        await options.mutationConfig.onSuccess(data.data);
      },
      isPending: false,
      isError: false,
      error: null,
    }),
  };
});

vi.mock("@auth0/nextjs-auth0", () => ({
  getAccessToken: vi.fn().mockResolvedValue("mock-access-token"),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AccountSetupForm", () => {
  it("renders the form", () => {
    render(<AccountSetupForm />);
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(screen.getByText("Setup Account")).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    render(<AccountSetupForm />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText("Enter your username");
    await user.type(input, "testuser");

    const button = screen.getByText("Setup Account");
    await user.click(button);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(toast.success).toHaveBeenCalledWith(
      "Account created successfully!",
      expect.objectContaining({
        description: "Welcome, testuser!",
      })
    );
  });
});
