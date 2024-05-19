import React from "react";
import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import { cn } from "./lib/utils";
import { MdxCard } from "./components/mdx-card";
import { Callout } from "./components/callout";
import { Icons } from "./components/icons";
import { poppinsFont, rubikFont } from "./styles/fonts";
// This function removes all non-alphanumeric characters except hyphens and underscores,
// converts the string to lowercase, and replaces spaces with hyphens.
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/g, "") // Remove all non-alphanumeric characters except hyphens and underscores.
    .split(" ")
    .join("-");
};

/**
 * Provides custom React components to be used in MDX files.
 *
 * This file allows you to provide custom React components
 * to be used in MDX files. You can import and use any
 * React component you want, including inline styles,
 * components from other libraries, and more.
 * @param {MDXComponents} components - The default MDX components.
 * @returns {MDXComponents} The customized MDX components.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children, className, ...props }) => (
      <h1
        id={generateId(String(children))}
        className={cn(
          "mt-8 scroll-m-20 text-6xl font-bold tracking-tight",
          rubikFont.className,
          className,
        )}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, className, ...props }) => (
      <h2
        id={generateId(String(children))}
        className={cn(
          "mt-8 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
          poppinsFont.className,
          className,
        )}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, className, ...props }) => (
      <h3
        id={generateId(String(children))}
        className={cn(
          "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
          poppinsFont.className,
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, className, ...props }) => (
      <h4
        id={generateId(String(children))}
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, className, ...props }) => (
      <h5
        id={generateId(String(children))}
        className={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className,
        )}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, className, ...props }) => (
      <h6
        id={generateId(String(children))}
        className={cn(
          "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
          className,
        )}
        {...props}
      >
        {children}
      </h6>
    ),
    a: ({ className, ...props }) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "font-medium text-blue-500 underline underline-offset-4",
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("my-4 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("my-4 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ children, className, ...props }) => (
      <blockquote
        className={cn(
          "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
        )}
        {...props}
      >
        {children}
      </blockquote>
    ),
    img: (props) => {
      const { alt, ...rest } = props as ImageProps;
      return (
        <Image
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt={alt ?? "image alt"}
          {...rest}
        />
      );
    },
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
      </div>
    ),
    tr: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn("m-0 border-t p-0 even:bg-muted", className)}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black/80 py-4 pl-4 text-white",
          className,
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn("relative font-mono text-sm", className)}
        {...props}
      />
    ),
    Image,
    Callout,
    Card: MdxCard,
    Icons,
    ...components,
  };
}
