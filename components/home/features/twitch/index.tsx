'use client';
import React, { useContext } from 'react';
import FeatureLabel from '../feature-label';
import { BluetickContext } from '@/context/bluetick-context';
import { Skeleton } from '@/components/ui/skeleton';
import { getBotAvatarURL } from '@/lib/helper';
import type { TranscriptMessage } from '@/types/bluetick/db/tickets';
import DiscordMessage from '@/components/bluetick/discord/message';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/motions/animated-button';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { poppinsFont } from '@/styles/fonts';
import { Gift, Hash, PlusCircle, Smile, Sticker } from 'lucide-react';
import { Icons } from '@/components/icons';
import { botUsers } from '@/config/dummies';
import { images } from '@/config/images';

const TwitchFeature = (): JSX.Element => {
  const { data, status } = useSession();

  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 m-4">
      <div className="w-full text-sm px-2">
        <FeatureLabel text="Twitch Watcher 📺" />
        <div className="text-foreground/70 mt-4">
          <p className="text-foreground/90">
            Twitch Watchers allows servers to follow Twitch Streamers/Users
            streams and get notifications as they go online, offline, or if
            there is any updates with the streams.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-2 mt-2">
          <div className="flex gap-2">
            <AnimatedButton
              size={'sm'}
              variant={'info'}
              onClick={() => {
                if (status === 'loading') {
                  toast.error('This is still loading');
                } else {
                  if (data) {
                    router.push('/servers');
                  } else {
                    signIn('discord', { callbackUrl: '/servers' }).catch(() => {
                      toast.error('Failed to initiate log in with Discord');
                    });
                  }
                }
              }}
            >
              Set this up
            </AnimatedButton>
            {/* <Button size={'sm'} variant={'warning'} className="gap-2" disabled>
              Try the feature demo
              <ArrowRight className="hidden md:block" size={16} />
              <ArrowDown className="block md:hidden" size={16} />
            </Button> */}
          </div>
          {/* <div>Choose the streamer</div> */}
        </div>
      </div>

      <div className="w-full rounded-lg bg-discord p-4 min-h-[400px] flex flex-col justify-between">
        <DiscordDemo />

        <div className="flex flex-col gap-1 mt-2 border-t border-discord-gray pt-1">
          <div className="mt-1 bg-discord-gray/20 text-discord-gray rounded-lg px-3 py-2 cursor-not-allowed flex justify-between">
            <div className="flex items-center gap-2 truncate">
              <PlusCircle />
              Send a message
            </div>
            <div className="flex items-center gap-1">
              <Gift />
              <Icons.gif width={30} height={30} />
              <Sticker />
              <Smile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitchFeature;

const DiscordDemo = (): JSX.Element => {
  const { isLoading, botDetails } = useContext(BluetickContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = React.useState<TranscriptMessage[]>([
    {
      userID: 'bot',
      content: '<@100>, your favorite streamer is live!',
      embeds: [
        {
          title: `Let's have some fun!`,
          url: null,
          author: {
            name: 'Bluetick is live!',
            iconURL: botDetails ? getBotAvatarURL(botDetails) : '',
          },
          description: null,
          footer: {
            text: 'Live notifcations by Bluetick',
            iconURL: botDetails ? getBotAvatarURL(botDetails) : '',
          },
          thumbnailURL: botDetails ? getBotAvatarURL(botDetails) : '',
          imageURL: images.twitchLive,
          timestamp: null,
          color: '#06d6a0',
        },
      ],
      attachments: [],
      timestamp: new Date(2024, 0, 1).valueOf(),
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = React.useState(false);
  const users: Record<string, { name: string; avatarURL: string }> = {
    bot: {
      name: botDetails?.username ?? 'Bluetick',
      avatarURL: botDetails ? getBotAvatarURL(botDetails) : '',
    },
    ...botUsers,
  };

  const lastMessageRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [messages]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSendTriggerMessage = (trigger: string): void => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <div
          className={cn(
            'text-warning uppercase font-semibold',
            poppinsFont.className
          )}
        >
          Discord Demo
        </div>
        <div
          className={
            'rounded-md bg-discord/60 p-1 flex items-center gap-1 cursor-pointer hover:bg-discord-gray/20 bg-discord-gray/10'
          }
        >
          <Hash size={16} />
          streams
        </div>
      </div>
      <div className="max-h-[400px] overflow-auto">
        {isLoading || !botDetails ? (
          <Skeleton className="w-full h-12" />
        ) : (
          <div className="flex flex-col gap-1 text-white">
            {messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1; // Check if it's the last message
              const author = users[msg.userID];
              const displayUser = (() => {
                // Always display for the first message
                if (index === 0) return true;

                const previousMsg = messages[index - 1];
                const timeDiff = msg.timestamp - previousMsg.timestamp;
                const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

                // Display user if:
                // 1. The previous message was sent by a different user, or
                // 2. The gap between the current message and the previous message is 5 minutes or more
                return (
                  previousMsg.userID !== msg.userID || timeDiff >= fiveMinutes
                );
              })();

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  ref={isLastMessage ? lastMessageRef : null} // Attach the ref here
                >
                  <DiscordMessage
                    key={index}
                    author={author}
                    message={msg}
                    users={users}
                    displayUser={displayUser}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
