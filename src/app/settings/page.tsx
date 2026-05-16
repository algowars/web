import { Suspense } from "react";
import AccountSettings from "@/features/settings/account-settings/account-settings";
import AccountSettingsLoading from "@/features/settings/account-settings/account-settings-loading";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <Suspense fallback={<AccountSettingsLoading />}>
      <AccountSettings />
    </Suspense>
  );
}
