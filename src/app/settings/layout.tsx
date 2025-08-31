import { AuthGuard } from "@/features/auth/guards/auth.guard";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <>{children}</>
    </AuthGuard>
  );
}
