import React from "react";
import { MutualGuildsProvider } from "./_context/mutual-guilds";

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
    <MutualGuildsProvider>
      <div className="relative">{children}</div>
    </MutualGuildsProvider>
  );
}
