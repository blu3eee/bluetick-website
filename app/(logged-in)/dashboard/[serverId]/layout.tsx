// /app/bluetick/(logged-in)/dashboard/[serverId]/layout.tsx
import { BLUETICK_BOT_ID } from '@/config/bluetick';
import { GuildContextProvider } from '@/context/guild-context';
import type { Metadata } from 'next';
import React from 'react';

interface GuildLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Bluetick - All in one discord bot',
};

/**
 * GuildLayout provides a context wrapper for the guild dashboard.
 * It uses the GuildContextProvider to pass down the server ID and bot ID to child components.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @param {object} props.params - Parameters passed to the component, containing a `serverId`.
 * @returns {JSX.Element} The GuildLayout component wrapped with the GuildContextProvider.
 */
export default function GuildLayout({
  children,
  params,
}: GuildLayoutProps): JSX.Element {
  const { serverId } = params;
  const botId = BLUETICK_BOT_ID;

  return (
    <GuildContextProvider serverId={serverId} botId={botId}>
      {children}
    </GuildContextProvider>
  );
}
