"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { QueryStatus } from "@tanstack/react-query";
import { Account } from "./models/account.model";
import { useAccount as useAccountQuery } from "./api/get-account";
import { User } from "@auth0/nextjs-auth0/types";
import { getAccessToken, useUser } from "@auth0/nextjs-auth0";

export enum AuthStatus {
  UNAUTHENTICATED = "unauthenticated",
  PARTIALLY_AUTHENTICATED = "partially-authenticated",
  FULLY_AUTHENTICATED = "fully-authenticated",
}

interface AccountContextType {
  auth0: {
    user: User | null | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null | undefined;
  };
  account: Account | null | undefined;
  isAuthenticated: boolean;
  isPending: boolean;
  error: Error | null | undefined;
  status: QueryStatus;
  authStatus: AuthStatus;
  refreshAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export function AccountProvider({ children }: AccountProviderProps) {
  const { user, isLoading: isAuthLoading, error: auth0Error } = useUser();

  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (user) {
        const token = await getAccessToken();

        if (token) {
          setAccessToken(token);
        }
      }
    })();
  }, [user]);

  const {
    data: account,
    isPending: isPendingAccount,
    error: accountError,
    status: accountStatus,
    refetch: refetchAccount,
  } = useAccountQuery({
    accessToken,
  });

  const isAuth0Authenticated = !!user;

  const getAuthStatus = (): AuthStatus => {
    if (account && isAuth0Authenticated) {
      return AuthStatus.FULLY_AUTHENTICATED;
    }

    if (isAuth0Authenticated) {
      return AuthStatus.PARTIALLY_AUTHENTICATED;
    }

    return AuthStatus.UNAUTHENTICATED;
  };

  const contextValue: AccountContextType = {
    isPending: isPendingAccount || isAuthLoading,
    error: accountError ?? auth0Error,
    isAuthenticated: isAuth0Authenticated && !!account,
    account,
    status: accountStatus,
    authStatus: getAuthStatus(),
    auth0: {
      user,
      isAuthenticated: isAuth0Authenticated,
      isLoading: isAuthLoading,
      error: auth0Error,
    },
    refreshAccount: refetchAccount,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
