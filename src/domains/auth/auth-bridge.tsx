import { useEffect } from "react";
import { useAppDispatch } from "@/shared/state/hooks";
import { AuthActions } from "./state/auth-actions";
import { SessionData } from "@auth0/nextjs-auth0/types";

type Auth0BridgeProps = {
  session: SessionData | null;
};

export function AuthBridge({ session }: Readonly<Auth0BridgeProps>) {
  const dispatch = useAppDispatch();
  const user = session?.user;

  useEffect(() => {
    dispatch(AuthActions.authCheckStarted());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(AuthActions.userAuthenticated({ user }));
    } else {
      dispatch(AuthActions.userUnauthenticated());
    }
  }, [dispatch, user]);

  return null;
}
