// /app/bluetick/(logged-in)/dashboard/[serverId]/modules/(module)/layout.tsx
import React from "react";
import GuildInfo from "../../_components/guild-info";

interface ModuleLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}
/**
 * ModuleLayout is a component designed to provide a consistent layout for dashboard modules.
 * It includes the GuildInfo component at the top, followed by any child components passed into it.
 * This layout ensures that guild information is displayed consistently across different modules within the dashboard.
 * @param {ModuleLayoutProps} props - The properties passed to the ModuleLayout component.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @param {object} props.params - Parameters passed to the component, including the server ID.
 * @returns {JSX.Element} The ModuleLayout component, which includes the GuildInfo component and any child components.
 */
export default function ModuleLayout({
  children,
  params,
}: ModuleLayoutProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <GuildInfo />
      {children}
    </div>
  );
}
