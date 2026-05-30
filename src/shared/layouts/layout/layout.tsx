import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import { cn } from "@/shared/lib/utils";

export default function Layout({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-block-svh grid grid-rows-[auto_1fr_auto]", className)}
      {...props}
    >
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
