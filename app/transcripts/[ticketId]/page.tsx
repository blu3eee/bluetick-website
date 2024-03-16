'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchTicketTranscript } from '@/hooks/api/tickets/transcript';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = ({
  params,
}: {
  params: {
    serverId: string;
    ticketId: string;
  };
}) => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session && !!session.user; // Check if the user is logged in and the user object is present

  // Convert ticketId to a number since useFetchTicketTranscript expects a number for ticketID.
  const ticketIdNumber = Number(params.ticketId);

  // Ensure you have a valid user ID to pass to the hook. Use an empty string or a fallback value if needed.
  const userId = session?.user?.id || '';

  const { data: ticketData, status: transcriptStatus } =
    useFetchTicketTranscript(ticketIdNumber, userId, {
      // Only enable the query if the user is logged in and we have a non-empty userId
      enabled: isLoggedIn && !!userId && !!ticketIdNumber,
    });
  const router = useRouter();

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
        <div className="flex flex-col">
          <div className="rounded-lg bg-secondary p-4">
            {/* {ticketData.guildInfo.guildID} */}
          </div>
          Generated: {new Date(ticketData.generated * 1000).toISOString()}
        </div>
      )}
    </div>
  );
};

export default Page;
