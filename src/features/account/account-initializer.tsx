import { auth0 } from "@/lib/auth0";

export default async function AccountInitializer() {
  const session = await auth0.getSession();

  return;
}
