import { Button } from "@/shared/components/ui/button";
import { routerConfig } from "@/shared/router-config";
import Link from "next/link";

export default function Hero() {
  return (
    <article className="flex flex-col gap-5 items-center text-center px-4 py-34">
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold max-w-[25ch]">
        Compete against other developers in fast paced coding challenges
      </h1>
      <p className="text-muted-foreground max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        Practice coding through competition. Fast-paced challenges help you
        improve your skills quickly.
      </p>
      <ul className="flex items-center gap-3">
        <li>
          <Button asChild size="lg" className="w-40">
            <Link href={routerConfig.authLogIn.path}>Get Started</Link>
          </Button>
        </li>
        <li>
          <Button asChild size="lg" variant="secondary" className="w-40">
            <Link href={routerConfig.authLogIn.path}>Join Today</Link>
          </Button>
        </li>
      </ul>
    </article>
  );
}
