import AccountSettings from "@/features/settings/account-settings/account-settings";
import AccountSettingsLoading from "@/features/settings/account-settings/account-settings-loading";
import { Suspense } from "react";

export default function SettingsAccountPage() {
  return (
    <Suspense fallback={<AccountSettingsLoading />}>
      <AccountSettings />
    </Suspense>
  );
}
