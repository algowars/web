import { buttonVariants } from "@/components/ui/button";
import AuthLoginButton from "@/features/auth/auth-login/auth-login-button";
import AuthSignupButton from "@/features/auth/auth-signup/auth-signup-button";
import { cn } from "@/lib/utils";
import React from "react";

export default function Hero() {
  return (
    <section>
      <article className="flex flex-col gap-5 items-center text-center py-34">
        <h1 className="text-6xl font-bold">
          Battle and Compete
          <br /> in Fast-Paced Coding Challenges
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Code and compete in fast-paced coding challenges, sharpening your
          problem-solving skills while racing against time and other coders.
        </p>
        <ul className="flex items-center gap-3">
          <li>
            <AuthLoginButton
              className={cn(buttonVariants({ variant: "default" }), "w-48")}
            >
              Get Started
            </AuthLoginButton>
          </li>
          <li>
            <AuthSignupButton
              className={cn(buttonVariants({ variant: "secondary" }), "w-48")}
            >
              Join Today
            </AuthSignupButton>
          </li>
        </ul>
      </article>
    </section>
  );
}
