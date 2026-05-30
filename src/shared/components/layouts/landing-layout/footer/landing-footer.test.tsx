import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingFooter from "./landing-footer";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/logos/app-logo", () => ({
  default: () => <span data-testid="app-logo">AppLogo</span>,
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    problems: { path: "/problems" },
    contests: { path: "/contests" },
    leaderboard: { path: "/leaderboard" },
    tutorials: { path: "/tutorials" },
    about: { path: "/about" },
    careers: { path: "/careers" },
    blog: { path: "/blog" },
    contact: { path: "/contact" },
    privacy: { path: "/privacy" },
    terms: { path: "/terms" },
    cookies: { path: "/cookies" },
    dmca: { path: "/dmca" },
  },
  externalLinks: {
    github: { path: "https://github.com/algowars" },
    mail: { path: "contact@algowars.io" },
  },
}));

describe("LandingFooter", () => {
  it("renders footer element", () => {
    render(<LandingFooter />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders AppLogo", () => {
    render(<LandingFooter />);

    expect(screen.getByTestId("app-logo")).toBeInTheDocument();
  });

  it("renders Product section links", () => {
    render(<LandingFooter />);

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Problems" })).toHaveAttribute(
      "href",
      "/problems"
    );
    expect(screen.getByRole("link", { name: "Contests" })).toHaveAttribute(
      "href",
      "/contests"
    );
    expect(screen.getByRole("link", { name: "Leaderboard" })).toHaveAttribute(
      "href",
      "/leaderboard"
    );
    expect(screen.getByRole("link", { name: "Tutorials" })).toHaveAttribute(
      "href",
      "/tutorials"
    );
  });

  it("renders Company section links", () => {
    render(<LandingFooter />);

    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute(
      "href",
      "/careers"
    );
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders Legal section links", () => {
    render(<LandingFooter />);

    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: "Terms of Service" })
    ).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "Cookie Policy" })).toHaveAttribute(
      "href",
      "/cookies"
    );
    expect(screen.getByRole("link", { name: "DMCA" })).toHaveAttribute(
      "href",
      "/dmca"
    );
  });

  it("renders social links", () => {
    render(<LandingFooter />);

    expect(screen.getByLabelText("GitHub")).toHaveAttribute(
      "href",
      "https://github.com/algowars"
    );
    expect(screen.getByLabelText("Linkedin")).toBeInTheDocument();
    expect(screen.getByLabelText("Mail")).toHaveAttribute(
      "href",
      "mailto:contact@algowars.io"
    );
  });

  it("renders copyright notice", () => {
    render(<LandingFooter />);

    expect(
      screen.getByText(/© 2025 AlgoWars. All rights reserved./i)
    ).toBeInTheDocument();
  });

  it("renders made with love message", () => {
    render(<LandingFooter />);

    expect(
      screen.getByText(/Made with ❤️ for developers/i)
    ).toBeInTheDocument();
  });
});
