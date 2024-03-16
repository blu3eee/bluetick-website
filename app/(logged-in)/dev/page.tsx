'use client';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { BLUETICK_BOT_ID } from '@/config/bluetick';
import { BluetickContext } from '@/context/bluetick-context';
import { useFetchBotGuilds } from '@/hooks/api/discord/bot-guilds';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { toast } from 'sonner';

const DevPage = (): JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();
  React.useEffect(
    () => {
      if (status === 'loading' || !session) {
        return;
      }
      if (!session.developerMode) {
        router.push('/');
        toast.info(`Invalid page request`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, status]
  );

  const { botDetails, isLoading: isLoadingBot } = useContext(BluetickContext);

  const { data: guilds, isLoading: isLoadingGuilds } =
    useFetchBotGuilds(BLUETICK_BOT_ID);

  if (status === 'loading' || !session) {
    return <Skeleton className="w-full h-36" />;
  }

  if (isLoadingBot || !botDetails) {
    return <div>Loading bot Info</div>;
  }

  return (
    <div>
      {isLoadingGuilds || !guilds ? (
        <Skeleton className="w-full h-36" />
      ) : (
        <div className="flex flex-col gap-2 rounded-lg bg-secondary p-4">
          <Label className="uppercase text-red-400">Guilds Stat</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 items-center">
              <Label>Total guilds:</Label>
              <span className="text-blue-500 text-sm font-semibold">
                {guilds.length}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Label>Total members:</Label>
              <span className="text-blue-500 text-sm font-semibold">
                {guilds.reduce(
                  (acc, guild) => acc + guild.approximate_member_count,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevPage;
