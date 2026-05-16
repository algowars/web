import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import { useProfileStore, useProfileStoreWithQuery } from "./profile-store";
import { Profile } from "./models/profile";

const mockUseSuspenseProfile = vi.fn();

vi.mock("./api/get-profile", () => ({
  useSuspenseProfile: (...args: unknown[]) => mockUseSuspenseProfile(...args),
}));

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    username: faker.internet.username(),
    bio: faker.lorem.sentence(),
    imageUrl: faker.image.avatar(),
    createdOn: faker.date.past(),
    ...overrides,
  };
}

describe("useProfileStore", () => {
  beforeEach(() => {
    useProfileStore.setState({ profile: null });
  });

  describe("initial state", () => {
    it("has null profile", () => {
      expect(useProfileStore.getState().profile).toBeNull();
    });

    it("exposes initProfile action", () => {
      expect(typeof useProfileStore.getState().initProfile).toBe("function");
    });
  });

  describe("initProfile", () => {
    it("sets the profile", () => {
      const profile = makeProfile();

      useProfileStore.getState().initProfile(profile);

      expect(useProfileStore.getState().profile).toEqual(profile);
    });

    it("sets username correctly", () => {
      const profile = makeProfile({ username: "testuser" });

      useProfileStore.getState().initProfile(profile);

      expect(useProfileStore.getState().profile?.username).toBe("testuser");
    });

    it("sets bio correctly", () => {
      const profile = makeProfile({ bio: "My bio" });

      useProfileStore.getState().initProfile(profile);

      expect(useProfileStore.getState().profile?.bio).toBe("My bio");
    });

    it("sets imageUrl correctly", () => {
      const imageUrl = faker.image.avatar();
      const profile = makeProfile({ imageUrl });

      useProfileStore.getState().initProfile(profile);

      expect(useProfileStore.getState().profile?.imageUrl).toBe(imageUrl);
    });

    it("sets createdOn correctly", () => {
      const createdOn = new Date("2024-01-15T00:00:00Z");
      const profile = makeProfile({ createdOn });

      useProfileStore.getState().initProfile(profile);

      expect(useProfileStore.getState().profile?.createdOn).toEqual(createdOn);
    });

    it("works when imageUrl is omitted", () => {
      const profile = makeProfile({ imageUrl: undefined });

      useProfileStore.getState().initProfile(profile);

      expect(useProfileStore.getState().profile?.imageUrl).toBeUndefined();
    });

    it("replaces an existing profile", () => {
      const first = makeProfile({ username: "first" });
      const second = makeProfile({ username: "second" });

      useProfileStore.getState().initProfile(first);
      useProfileStore.getState().initProfile(second);

      expect(useProfileStore.getState().profile?.username).toBe("second");
    });

    it("does not retain fields from the previous profile after replacement", () => {
      const first = makeProfile({ bio: "old bio" });
      const second = makeProfile({ bio: "new bio" });

      useProfileStore.getState().initProfile(first);
      useProfileStore.getState().initProfile(second);

      expect(useProfileStore.getState().profile?.bio).toBe("new bio");
    });
  });

  describe("state isolation between tests", () => {
    it("profile is null at the start of this test", () => {
      expect(useProfileStore.getState().profile).toBeNull();
    });

    it("profile is still null after the previous test", () => {
      expect(useProfileStore.getState().profile).toBeNull();
    });
  });
});

describe("useProfileStoreWithQuery", () => {
  beforeEach(() => {
    mockUseSuspenseProfile.mockReset();
    mockUseSuspenseProfile.mockReturnValue({ data: null });
  });

  it("calls useSuspenseProfile with the given username", () => {
    const username = faker.internet.username();
    renderHook(() => useProfileStoreWithQuery(username));
    expect(mockUseSuspenseProfile).toHaveBeenCalledWith(
      expect.objectContaining({ username })
    );
  });

  it("calls useSuspenseProfile with optional queryConfig", () => {
    const username = faker.internet.username();
    const queryConfig = { staleTime: 1000 };
    renderHook(() => useProfileStoreWithQuery(username, queryConfig));
    expect(mockUseSuspenseProfile).toHaveBeenCalledWith(
      expect.objectContaining({ username, queryConfig })
    );
  });

  it("returns the result of useSuspenseProfile", () => {
    const mockData = { data: { username: "testuser" } };
    mockUseSuspenseProfile.mockReturnValue(mockData);
    const { result } = renderHook(() => useProfileStoreWithQuery("testuser"));
    expect(result.current).toBe(mockData);
  });
});
