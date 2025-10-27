"use client";

import { env } from "@/env";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export function useUserRoles() {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      setIsLoading(true);
      try {
        const token = await getAccessToken();
        const decoded: any = jwtDecode(token);
        const claim = `${env.NEXT_PUBLIC_AUTH_NAMESPACE}/roles`;
        setRoles(decoded[claim] || []);
      } catch {
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoles();
  }, [getAccessToken, jwtDecode]);

  return { roles, isLoading };
}
