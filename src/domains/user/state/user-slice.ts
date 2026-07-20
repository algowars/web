import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { User as AuthUser } from "@auth0/nextjs-auth0/types";
import { AuthEvents } from "@/domains/auth/state/auth-events";
import type { User } from "../models/user";
import type { RootState } from "@/shared/state/store";
import { UserEvents } from "./user-events";

interface UserState {
  authProfile: AuthUser | null;

  user: User | null;

  isAuthLoading: boolean;
  isUserLoading: boolean;

  authError: string | null;
  userError: string | null;
}

const initialState: UserState = {
  authProfile: null,
  user: null,
  isAuthLoading: false,
  isUserLoading: false,
  authError: null,
  userError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(AuthEvents.authCheckStarted, (state) => {
        state.isAuthLoading = true;
        state.authError = null;
      })

      .addCase(AuthEvents.userAuthenticated, (state, action) => {
        state.authProfile = action.payload.user;
        state.isAuthLoading = false;
        state.authError = null;
      })

      .addCase(AuthEvents.userUnauthenticated, (state) => {
        state.authProfile = null;
        state.user = null;
        state.isAuthLoading = false;
      })

      .addCase(AuthEvents.authCheckFailed, (state, action) => {
        state.authError = action.payload.message;
        state.isAuthLoading = false;
      })

      .addCase(AuthEvents.sessionExpired, () => initialState)

      .addCase(UserEvents.upsertUserRequested, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })

      .addCase(UserEvents.upsertUserSuccess, (state) => {
        state.userError = null;
      })

      .addCase(UserEvents.upsertUserFailure, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload.message;
      })

      .addCase(UserEvents.initializeUser, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })

      .addCase(UserEvents.initializeUserSuccess, (state, action) => {
        state.user = action.payload;
        state.isUserLoading = false;
      })

      .addCase(UserEvents.initializeUserFailure, (state, action) => {
        state.userError = action.payload.message;
        state.isUserLoading = false;
      })

      .addCase(UserEvents.updateUsernameRequested, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })

      .addCase(UserEvents.updateUsernameSuccess, (state, action) => {
        state.user = action.payload;
        state.isUserLoading = false;
        state.userError = null;
      })

      .addCase(UserEvents.updateUsernameFailure, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload.message;
      })

      .addCase(UserEvents.loggedOut, () => initialState);
  },
});

export const userReducer = userSlice.reducer;

export const selectAuthProfile = (s: RootState) => s.user.authProfile;
export const selectUser = (s: RootState) => s.user.user;
export const selectUserRoles = (s: RootState) => s.user.user?.roles ?? [];
export const selectUserPermissions = (s: RootState) =>
  s.user.user?.permissions ?? [];
export const selectIsAuthLoading = (s: RootState) => s.user.isAuthLoading;
export const selectIsUserLoading = (s: RootState) => s.user.isUserLoading;
export const selectAuthError = (s: RootState) => s.user.authError;
export const selectUserError = (s: RootState) => s.user.userError;

export const selectIsAuthenticated = (s: RootState): boolean =>
  s.user.authProfile !== null;

export const selectIsFullyLoaded = (s: RootState): boolean =>
  !s.user.isAuthLoading && !s.user.isUserLoading;

export const selectHasError = (s: RootState): boolean =>
  s.user.authError !== null || s.user.userError !== null;

export const selectDisplayName = createSelector(
  [selectUser, selectAuthProfile],
  (user, authProfile): string =>
    user?.username ?? authProfile?.name ?? authProfile?.email ?? "Anonymous"
);

export const selectAvatarUrl = createSelector(
  [selectUser, selectAuthProfile],
  (_, authProfile): string | null => authProfile?.picture ?? null
);

export const selectUserEmail = createSelector(
  [selectUser, selectAuthProfile],
  (_, authProfile): string | null => authProfile?.email ?? null
);

export const selectUserStatus = createSelector(
  [selectIsAuthLoading, selectIsUserLoading, selectAuthError, selectUserError],
  (isAuthLoading, isUserLoading, authError, userError) => ({
    isLoading: isAuthLoading || isUserLoading,
    error: authError ?? userError ?? null,
  })
);
