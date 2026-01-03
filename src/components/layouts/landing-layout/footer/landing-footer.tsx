import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail } from "lucide-react";
import { externalLinks, routerConfig } from "@/router-config";
import AppLogo from "@/components/logos/app-logo";

export default function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <AppLogo />
            <div className="flex space-x-2">
              <a
                href={externalLinks.github.path}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={buttonVariants({ variant: "ghost" })}
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={externalLinks.github.path}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linkedin"
                className={buttonVariants({ variant: "ghost" })}
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${externalLinks.mail.path}`}
                aria-label="Mail"
                className={buttonVariants({ variant: "ghost" })}
              >
                <Mail className="h-4 w-h" />
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href={routerConfig.problems.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Problems
              </Link>
              <Link
                href={routerConfig.contests.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contests
              </Link>
              <Link
                href={routerConfig.leaderboard.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href={routerConfig.tutorials.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tutorials
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href={routerConfig.about.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href={routerConfig.careers.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Careers
              </Link>
              <Link
                href={routerConfig.blog.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                href={routerConfig.contact.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href={routerConfig.privacy.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href={routerConfig.terms.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href={routerConfig.cookies.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href={routerConfig.dmca.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                DMCA
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 AlgoWars. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
