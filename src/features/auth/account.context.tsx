"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import { QueryStatus } from "@tanstack/react-query";
import { Account } from "./models/account.model";
import { useAccount as useAccountQuery } from "./api/get-account";

export enum AuthStatus {
  UNAUTHENTICATED = "unauthenticated",
  PARTIALLY_AUTHENTICATED = "partially-authenticated",
  FULLY_AUTHENTICATED = "fully-authenticated",
}

interface AccountContextType {
  auth0: {
    user: User | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | undefined;
  };
  account: Account | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPending: boolean;
  error: Error | null;
  status: QueryStatus;
  authStatus: AuthStatus;
  refreshAccount: () => void;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
  initialAccount?: Account | null;
  initialAuth0State?: {
    user?: User;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    error?: Error;
  };
}

export function AccountProvider({
  children,
  initialAuth0State,
}: AccountProviderProps) {
  const {
    user,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    error: auth0Error,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (auth0IsAuthenticated) {
        const token = await getAccessTokenSilently();

        if (token) {
          setAccessToken(token);
        }
      }
    })();
  }, [auth0IsAuthenticated]);

  const {
    data: account,
    isLoading: isLoadingAccount,
    isPending: isPendingAccount,
    error: accountError,
    status: accountStatus,
    refetch: refetchAccount,
  } = useAccountQuery({
    accessToken,
  });

  const isAuthenticated = auth0IsAuthenticated && !!account;
  const isLoading = auth0IsLoading || isLoadingAccount;

  const getAuthStatus = (): AuthStatus => {
    if (!auth0IsAuthenticated) {
      return AuthStatus.UNAUTHENTICATED;
    }

    if (auth0IsAuthenticated && !account) {
      return AuthStatus.PARTIALLY_AUTHENTICATED;
    }

    if (auth0IsAuthenticated && account) {
      return AuthStatus.FULLY_AUTHENTICATED;
    }

    return AuthStatus.UNAUTHENTICATED;
  };

  const authStatus = getAuthStatus();

  const refreshAccount = () => {
    refetchAccount();
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const contextValue: AccountContextType = {
    auth0: {
      user: user || initialAuth0State?.user,
      isAuthenticated:
        auth0IsAuthenticated ?? initialAuth0State?.isAuthenticated ?? false,
      isLoading: auth0IsLoading ?? initialAuth0State?.isLoading ?? false,
      error: auth0Error || initialAuth0State?.error,
    },
    account: account || null,
    isAuthenticated,
    isLoading,
    isPending: isPendingAccount,
    error: accountError,
    status: accountStatus,
    authStatus,
    refreshAccount,
    logout,
    getAccessTokenSilently,
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

export function useAuth0Data() {
  const { auth0 } = useAccount();
  return auth0;
}

export function useAccountData() {
  const { account } = useAccount();
  return account;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAccount();
  return isAuthenticated;
}

export function useAuthStatus() {
  const { authStatus } = useAccount();
  return authStatus;
}
