import { Button } from "@/components/ui/button";
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
            <Button className="w-48">Get Started</Button>
          </li>
          <li>
            <Button className="w-48" variant="secondary">
              Get Started
            </Button>
          </li>
        </ul>
      </article>
    </section>
  );
}
