import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  disabled?: boolean;
}

/**
 * A card component designed for MDX content, providing a styled container for various types of content.
 * It optionally supports navigation via a `href` prop.
 * @param {CardProps} props - The props for the MdxCard component.
 * @param {string} [props.href] - Optional. The URL the card should link to. If not provided, the card will not be a link.
 * @param {string} [props.className] - Optional. Additional class names to apply to the card for custom styling.
 * @param {boolean} [props.disabled] - Optional. If true, disables link functionality and lowers the opacity for a "disabled" look.
 * @param {React.ReactNode} props.children - The content to be displayed within the card.
 * @returns {JSX.Element} The MdxCard component.
 */
export function MdxCard({
  href,
  className,
  children,
  disabled,
  ...props
}: CardProps): JSX.Element {
  return (
    <div
      className={cn(
        "group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col justify-between space-y-4">
        <div className="space-y-2 [&>h3]:!mt-0 [&>h4]:!mt-0 [&>p]:text-muted-foreground">
          {children}
        </div>
      </div>
      {href && (
        <Link href={disabled ? "#" : href} className="absolute inset-0">
          <span className="sr-only">View</span>
        </Link>
      )}
    </div>
  );
}
