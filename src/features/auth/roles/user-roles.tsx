"use client";

import { env } from "@/env";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export function useUserRoles() {
  const { getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      setIsLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const decoded: any = jwtDecode(token);
        const claim = `${env.NEXT_PUBLIC_AUTH0_NAMESPACE}/roles`;
        setRoles(decoded[claim] || []);
      } catch {
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoles();
  }, [getAccessTokenSilently]);

  return { roles, isLoading };
}
