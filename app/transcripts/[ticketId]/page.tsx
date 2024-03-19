'use client';

import Messages from '@/components/bluetick/discord/messages';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BLUETICK_BOT_ID } from '@/config/bluetick';
import { useGuildData } from '@/hooks/api/discord/guild';
import { useQueryGuildChannels } from '@/hooks/api/discord/guild-channels';
import { useFetchTicketTranscript } from '@/hooks/api/tickets/transcript';
import { cn, intToHexColor } from '@/lib/utils';
import { rubikFont } from '@/styles/fonts';
import type { TicketTranscriptDetails } from '@/types/bluetick/db/tickets';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const Page = ({
  params,
}: {
  params: {
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

  const router = useRouter();
  React.useEffect(
    () => {
      // Redirect if the user is not logged in
      // if (status !== 'loading' && !isLoggedIn) {
      //   signIn('discord', {
      //     callbackUrl: `/transcripts/${params.ticketId}`,
      //   }).catch(() => {
      //     toast.error('Failed to initiate log in with Discord');
      //   });
      //   return;
      // }

      if (transcriptStatus === 'success' && !ticketData) {
        toast.error(`Unavailable ticket transcript`);
        router.push('/'); // Adjust the path as needed for your error handling or fallback page
        return;
      }

      // Redirect if the ticket data loading is finished and no data is found
      if (transcriptStatus !== 'loading' && !ticketData) {
        if (transcriptStatus === 'error') {
          router.push('/'); // Adjust the path as needed for your error handling or fallback page
          toast.error(`You are not allowed to view this transcript`);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, transcriptStatus, ticketData]
  );

  if (status === 'loading') {
    return <Skeleton className="w-full h-36" />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex w-full h-[70vh] items-center justify-center">
        <div className="flex flex-row h-24 gap-8 items-center justify-center">
          <h2 className="text-3xl font-bold">401</h2>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center justify-center gap-3">
            <p>Log in to see transcript</p>
            <Button
              onClick={() => {
                signIn('discord', {
                  callbackUrl: `/transcripts/${params.ticketId}`,
                }).catch(() => {
                  toast.error('Failed to initiate log in with Discord');
                });
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {transcriptStatus === 'loading' ? (
        <Skeleton className="w-full h-36" />
      ) : !ticketData ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="rounded-lg bg-secondary p-4 flex items-center gap-4 font-semibold text-sm">
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
  const { data: guild, isLoading } = useGuildData(
    BLUETICK_BOT_ID,
    transcript.guildInfo.guildID
  );

  const { data: channels, isLoading: isLoadingChannels } =
    useQueryGuildChannels(BLUETICK_BOT_ID, transcript.guildInfo.guildID);

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
      {isLoading || !guild || isLoadingChannels || !channels ? (
        <Skeleton className="w-full h-36" />
      ) : (
        <Messages
          messages={transcript.messagesInfo}
          users={transcript.usersInfo}
          roles={guild.guildInfo.roles.reduce<
            Record<string, { name: string; color: string }>
          >((acc, role) => {
            acc[role.id] = {
              name: role.name,
              color: intToHexColor(role.color),
            };
            return acc;
          }, {})}
          channels={channels.reduce<Record<string, { name: string }>>(
            (acc, role) => {
              acc[role.id] = {
                name: role.name,
              };
              return acc;
            },
            {}
          )}
        />
      )}
    </div>
  );
};
