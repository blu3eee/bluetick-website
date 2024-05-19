"use client";
import * as React from "react";

import type { JSX } from "react"; // Changed to import type
import { cn } from "@/lib/utils";
import type { AdditionalProps } from "./ui";
import { ModeToggle } from "./mode-toggle";
import { Icons } from "./icons";
import { rubikFont } from "@/styles/fonts";

/**
 * Renders the footer section of the application
 * @param {AdditionalProps} props - The props object for the Footer component.
 * @param {string} props.className - Optional CSS class to apply to the footer element for custom styling.
 * @returns {JSX.Element} The Footer component with subscription form and social media links.
 */
export function Footer({ className }: AdditionalProps): JSX.Element {
  return (
    <footer className={cn(className)}>
      <div className="flex w-full items-center justify-between bg-secondary px-2 py-8 md:px-4 lg:px-6 ">
        <div className="container flex flex-col items-start text-center">
          <a className="text-md flex items-center gap-4 text-info" href="/">
            <Icons.logo height={40} width={40} />
            <span
              className={cn(
                rubikFont.className,
                "text-xl font-bold uppercase ",
              )}
            >
              Bluetick
            </span>
          </a>
          <span className="mt-2 text-sm text-muted-foreground">
            Made everything easier. @2023-2024
          </span>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
