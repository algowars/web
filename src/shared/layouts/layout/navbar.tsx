import { Button } from "@/shared/components/ui/button";
import Logo from "@/shared/logo/logo";
import { routerConfig } from "@/shared/router-config";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border border-bottom border-dashed">
      <div className="container py-3 mx-auto flex items-center gap-3 justify-between">
        <Logo />
        <ul className="flex items-center gap-3">
          <li>
            <Link href={routerConfig.home.path}>
              Home
            </Link>

          </li>
          <li>
            <Link href={routerConfig.problems.path}>
              Problems
            </Link>
          </li>

        </ul>
        <ul className="flex items-center gap-3">
          <li>
            <Button asChild variant="outline">
              <Link href={routerConfig.authLogIn.path}>
                Log In
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="default">
              <Link href={routerConfig.authSignUp.path}>
                Sign Up
              </Link>
            </Button>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  )
}
