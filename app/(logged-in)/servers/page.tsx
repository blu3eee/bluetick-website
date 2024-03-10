'use client';
import useUserFlags from '@/lib/user-flags';
import React from 'react';
import { poppinsFont } from '@/styles/fonts';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import { getUserAvatarURL } from '@/lib/helper';
import { BadgeDisplay } from '@/components/bluetick/ui/badge';
import { MutualServers } from '@/components/bluetick/servers/servers';
import { useSession } from 'next-auth/react';
import { Callout } from '@/components/callout';
import { Skeleton } from '@/components/ui/skeleton';

const BotsPage = (): JSX.Element => {
  const { data: session, status } = useSession();

  const { convertUserFlags } = useUserFlags();
  const [userBadges, setUserBadges] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (session?.user?.flags) {
      setUserBadges(convertUserFlags(session.user.flags));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  if (status === 'loading') {
    <div className="flex h-fit w-full items-center justify-center">
      <Skeleton className="w-full h-12" />
    </div>;
  }

  if (!session || !session.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Callout>Invalid Request</Callout>
      </div>
    );
  }

  const { user: discordUser } = session;
  return (
    <div className="flex flex-col gap-2 items-center mx-4">
      <div className="flex items-center gap-4 w-full rounded-lg border px-4 md:px-12 py-4 mb-8">
        <Image
          className="rounded-full"
          src={getUserAvatarURL(discordUser)}
          alt="user avatar"
          height={200}
          width={200}
        />
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col">
              <div className={`font-bold text-3xl ${poppinsFont.className}`}>
                {discordUser.global_name ?? discordUser.username}
              </div>
              <div className="font-bold text-md text-blue-500">
                @{discordUser.username}
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Copy />
              Copy ID
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userBadges.map((badge) => (
              <BadgeDisplay key={badge} badge={badge} />
            ))}
          </div>
        </div>
      </div>
      <MutualServers />
    </div>
  );
};
export default BotsPage;
