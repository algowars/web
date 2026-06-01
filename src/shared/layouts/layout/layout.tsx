import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import { cn } from "@/shared/lib/utils";

type LayoutProps = {
  mainClassName: string;
} & React.ComponentProps<"div">;
export default function Layout({
  className,
  children,
  mainClassName,
  ...props
}: LayoutProps) {
  return (
    <div
      className={cn("min-block-svh grid grid-rows-[auto_1fr_auto]", className)}
      {...props}
    >
      <header>
        <Navbar />
      </header>
      <main className={mainClassName}>{children}</main>
      <Footer />
    </div>
  );
}
