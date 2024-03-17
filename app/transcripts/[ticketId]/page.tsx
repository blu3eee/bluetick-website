'use client';

import Messages from '@/components/bluetick/discord/messages';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchTicketTranscript } from '@/hooks/api/tickets/transcript';
import { cn } from '@/lib/utils';
import { rubikFont } from '@/styles/fonts';
import type { TicketTranscriptDetails } from '@/types/bluetick/db/tickets';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

const Page = ({
  params,
}: {
  params: {
    serverId: string;
    ticketId: string;
  };
}): JSX.Element => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session && !!session.user; // Check if the user is logged in and the user object is present

  // Convert ticketId to a number since useFetchTicketTranscript expects a number for ticketID.
  const ticketIdNumber = Number(params.ticketId);

  // Ensure you have a valid user ID to pass to the hook. Use an empty string or a fallback value if needed.
  const userId = session?.user?.id ?? '';

  const { data: ticketData, status: transcriptStatus } =
    useFetchTicketTranscript(ticketIdNumber, userId, {
      // Only enable the query if the user is logged in and we have a non-empty userId
      enabled: isLoggedIn && !!userId && !!ticketIdNumber,
    });

  React.useEffect(() => {
    if (transcriptStatus !== 'loading' && !ticketData) {
      // router.push('/');
      return;
    }
    console.log(ticketData);
  }, [transcriptStatus, ticketData]);
  if (status === 'loading') {
    return <Skeleton className="w-full h-36" />;
  }

  return (
    <div className="p-4">
      {transcriptStatus === 'loading' ? (
        <Skeleton className="w-full h-36" />
      ) : !ticketData ? (
        <div>cannot load ticket data</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="rounded-lg bg-secondary p-4 flex items-center gap-4 font-semibold">
            This transcript was generated at{' '}
            {new Date(ticketData.generated * 1000).toLocaleString()}
          </div>
          <div className="rounded-lg bg-secondary p-4 flex items-center gap-4">
            <Image
              src={ticketData.guildInfo.iconURL}
              alt={'server-icon'}
              width={100}
              height={100}
              className="max-h-[50px] w-auto rounded-lg border-2"
            />
            <div className="flex flex-col">
              <span className={cn(rubikFont.className, 'text-xl font-bold')}>
                Server: {ticketData.guildInfo.name}
              </span>
              <span className="text-sm text-foreground/50">
                ID: {ticketData.guildInfo.guildID}
              </span>
            </div>
          </div>
          <Discord transcript={ticketData} />
        </div>
      )}
    </div>
  );
};

export default Page;

const Discord: React.FC<{ transcript: TicketTranscriptDetails }> = ({
  transcript,
}) => {
  return (
    <div className="flex flex-col gap-2 bg-[#38343c] rounded-lg text-white">
      <div className="p-2">
        <span className={cn('text-3xl font-bold', rubikFont.className)}>
          Welcome to #{transcript.threadInfo.name}
        </span>
        <div className="flex flex-wrap">
          {Object.entries(transcript.usersInfo).map(([userId, userInfo]) => (
            <div key={userId} className="p-2">
              <Image
                src={userInfo.avatarURL}
                alt={userInfo.name}
                className="rounded-full" // Assuming you want circular avatars
                width={30}
                height={30}
              />
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-white/70" />
      <Messages
        messages={transcript.messagesInfo}
        users={transcript.usersInfo}
      />
    </div>
  );
};
