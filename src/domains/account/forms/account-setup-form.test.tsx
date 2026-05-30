import { render } from "@testing-library/react";
import { describe } from "vitest";
import AccountSetupForm from "./account-setup-form";

vi.mock("../api/update-username", () => ({
  updateUsername: vi.fn(),
  useUpdateUsername: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("@/router-config", () => ({
  routerConfig: {
    home: { path: "/" },
    dashboard: { path: "/dashboard" },
  },
}));

describe("AccountSetupForm", () => {
  it("should render username input field", () => {
    render(<AccountSetupForm />);

    expect(screen.getByTestId("username")).toBeInTheDocument();
  });

  it("should render setup account button", () => {});

  it("should disable the button when the form is invalid", () => {});

  it("should enable the button when username is filled", () => {});

  it("should disable input and button when mutation is pending", () => {});

  it("should show error message when mutation fails", () => {});

  it("should call mutation with form data on submit", () => {});

  it("should apply custom className", () => {});
});
