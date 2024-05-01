import { SidebarWrapped } from "@/components/bluetick/sidebar";
import React from "react";

interface ServersLayoutProps {
  children: React.ReactNode;
}

/**
 * ServersLayout wraps the page content with Bluetick-specific layout components.
 * It provides a sidebar for navigation and a content area for the children components.
 * The layout adapts for different screen sizes using responsive design.
 * @param {ServersLayoutProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} A JSX element that includes the sidebar and the content area.
 */
export default function ServersLayout({
  children,
}: ServersLayoutProps): JSX.Element {
  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <SidebarWrapped />
      <div className="px-6 md:px-0 md:pr-8 py-8 max-w-[1248px]">{children}</div>
    </div>
  );
}
