import { buttonVariants } from "@/components/ui/button";
import AuthLoginButton from "@/features/auth/auth-login/auth-login-button";
import AuthSignupButton from "@/features/auth/auth-signup/auth-signup-button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section>
      <article className="flex flex-col gap-5 items-center text-center px-3 py-34">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
          Battle against other Developers in
          <br /> Fast-Paced Coding Challenges
        </h1>
        <p className="text-muted-foreground max-[420px]:text-sm max-w-md md:max-w-lg lg:max-w-2xl">
          Solve as many challenges as you can within the allotted time. Compete
          with your peers, collaborate, and communicate with other developers in
          real time.
        </p>
        <ul className="flex max-[520px]:flex-col justify-center items-center gap-3 w-full">
          <li className="w-full sm:w-fit">
            <AuthLoginButton
              className={cn(
                buttonVariants({ variant: "default" }),
                "max-[375px]:w-full w-52 sm:w-64 md:w-48",
              )}
            >
              Get Started
            </AuthLoginButton>
          </li>
          <li className="w-full sm:w-fit">
            <AuthSignupButton
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "max-[375px]:w-full w-52 sm:w-64 md:w-48",
              )}
            >
              Join Today
            </AuthSignupButton>
          </li>
        </ul>
      </article>
    </section>
  );
}
