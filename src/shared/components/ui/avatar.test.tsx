import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AvatarImage } from "@/shared/components/ui/avatar";

vi.mock("@radix-ui/react-avatar", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@radix-ui/react-avatar")>();
  return {
    ...actual,
    Image: ({
      src,
      onLoadingStatusChange,
      ...props
    }: {
      src?: string;
      onLoadingStatusChange?: (status: string) => void;
      [key: string]: unknown;
    }) => (
      <img
        data-testid="avatar-primitive-image"
        src={src}
        onClick={() => onLoadingStatusChange?.("error")}
        {...props}
      />
    ),
  };
});

describe("AvatarImage (fallbackSrc)", () => {
  it("renders the src when provided", () => {
    render(<AvatarImage src="https://example.com/avatar.png" />);

    const img = screen.getByTestId("avatar-primitive-image");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("renders null when neither src nor fallbackSrc is provided", () => {
    const { container } = render(<AvatarImage />);

    expect(container.firstChild).toBeNull();
  });

  it("uses fallbackSrc when src is undefined", () => {
    render(<AvatarImage fallbackSrc="/default-pfp.png" />);

    const img = screen.getByTestId("avatar-primitive-image");
    expect(img).toHaveAttribute("src", "/default-pfp.png");
  });

  it("prefers src over fallbackSrc when both are provided", () => {
    render(
      <AvatarImage
        src="https://example.com/avatar.png"
        fallbackSrc="/default-pfp.png"
      />
    );

    const img = screen.getByTestId("avatar-primitive-image");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("switches to fallbackSrc on image load error", () => {
    render(
      <AvatarImage
        src="https://example.com/broken.png"
        fallbackSrc="/default-pfp.png"
      />
    );

    const img = screen.getByTestId("avatar-primitive-image");
    expect(img).toHaveAttribute("src", "https://example.com/broken.png");

    // Simulate image error via the radix onLoadingStatusChange callback
    act(() => {
      img.click();
    });

    expect(img).toHaveAttribute("src", "/default-pfp.png");
  });

  it("does not switch to fallbackSrc when already showing fallback", () => {
    render(<AvatarImage fallbackSrc="/default-pfp.png" />);

    const img = screen.getByTestId("avatar-primitive-image");
    // Already on fallback — clicking should not change it
    act(() => {
      img.click();
    });

    expect(img).toHaveAttribute("src", "/default-pfp.png");
  });

  it("calls the external onLoadingStatusChange handler", () => {
    const handler = vi.fn();
    render(
      <AvatarImage
        src="https://example.com/avatar.png"
        fallbackSrc="/default-pfp.png"
        onLoadingStatusChange={handler}
      />
    );

    act(() => {
      screen.getByTestId("avatar-primitive-image").click();
    });

    expect(handler).toHaveBeenCalledWith("error");
  });
});
