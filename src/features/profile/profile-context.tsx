"use client";

import React from "react";
import { useProfile } from "./api/get-profile";
import { ProfileAggregate } from "./models/profile-aggregate";

export interface ProfileContextValue {
  username: string;
  profileAggregate: ProfileAggregate | null;
  isPending: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error?: unknown;
  refetch: () => Promise<unknown>;
}

const ProfileContext = React.createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useProfile({
    username,
  });

  const value: ProfileContextValue = {
    username,
    profileAggregate: data ?? null,
    isPending: Boolean(isLoading || isFetching),
    isLoading,
    isFetching,
    isError,
    error,
    refetch: async () => {
      try {
        const res = await refetch();
        return res;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return ctx;
}
