import Logo from "@/shared/logo/logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-dashed py-6">
      <div className="flex max-w-7xl flex-col md:flex-row items-center justify-between gap-2 mx-auto px-4">
        <Logo />
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Algowars. Practice through
          competition.
        </p>
      </div>
    </footer>
  );
}
