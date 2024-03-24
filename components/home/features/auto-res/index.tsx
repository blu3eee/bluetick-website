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
import {
  ArrowDown,
  ArrowRight,
  Gift,
  PlusCircle,
  Smile,
  Sticker,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const AutoResFeature = (): JSX.Element => {
  const { isLoading, botDetails } = useContext(BluetickContext);
  const users: Record<string, { name: string; avatarURL: string }> = {
    bot: {
      name: botDetails?.username ?? 'Bluetick',
      avatarURL: botDetails ? getBotAvatarURL(botDetails) : '',
    },
    '1': {
      name: 'Wumpus',
      avatarURL:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6XONaI6wOpVvQ0GJ-YyBGxzWdr60xrKxnL2zzzH4SmA&s',
    },
    '2': {
      name: 'Clyde',
      avatarURL:
        'https://res.cloudinary.com/apideck/image/upload/v1678484810/marketplaces/ckhg56iu1mkpc0b66vj7fsj3o/listings/tried-to-make-the-discord-clyde-logo-more-similar-to-the-v0-g2bha52fh9v91_w9wnla.webp',
    },
    '3': {
      name: 'Nelly',
      avatarURL:
        'https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/6192fd9364ed4731031c10c1_Author-Nelly-Webflow.png',
    },
  };

  const channels: Record<string, { name: string }> = {
    '1': { name: 'support-tickets' },
    '2': { name: 'server-information' },
    '3': { name: 'rules' },
    '4': { name: 'general' },
  };
  const triggers = ['ticket', 'rules', 'cinema'];

  const [messages, setMessages] = React.useState<TranscriptMessage[]>([
    {
      userID: 'bot',
      content:
        "Hello <@1>! Let's send some trigger messages for auto-responders!",
      embeds: [],
      attachments: [],
      timestamp: new Date(2024, 0, 1).valueOf(),
    },
  ]);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSendTriggerMessage = (trigger: string): void => {
    setIsProcessing(true);
    // Generate a random user ID from 1 to 3
    const randomUserId = Math.floor(Math.random() * 3) + 1; // This will be 1, 2, or 3

    const response = responseTemplates[trigger](randomUserId.toString());
    setMessages((prev) => [
      ...(prev.length > 10 ? prev.slice(-10) : prev),
      {
        userID: randomUserId.toString(),
        content: trigger,
        embeds: [],
        attachments: [],
        timestamp: new Date().valueOf(),
      },
    ]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { ...response }]);
      setIsProcessing(false);
    }, 1000);
  };

  const lastMessageRef = React.useRef<HTMLDivElement | null>(null);

  const { data, status } = useSession();
  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [messages]);

  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 m-4">
      <div className="w-full text-sm px-2">
        <FeatureLabel text="Auto Responders ✨" />
        <div className="text-foreground/70 mt-4">
          <p className="text-foreground/90">
            The Auto Responder allows admins to set up automated responses for
            specific triggers. When a user&apos;s message matches a trigger
            exactly, the bot instantly replies with the predefined response
            within seconds.
          </p>
          <div className="ml-2 mt-2">
            <p className="border-b font-semibold text-info">
              Examples include:
            </p>
            <div className="pl-4">
              - FAQs (e.g., Trigger: &apos;rules&apos; → Response: &apos;Server
              rules&apos;)
              <br />- Welcome messages for new members 👋
              <br />- Event reminders (e.g., Trigger: &apos;next meeting&apos; →
              Response: &apos;The next team meeting is on... 📅&apos;)
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
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
          <Button size={'sm'} variant={'warning'} className="gap-2" disabled>
            Send a message
            <ArrowRight className="hidden md:block" size={16} />
            <ArrowDown className="block md:hidden" size={16} />
          </Button>
        </div>
      </div>

      <div className="w-full rounded-lg bg-discord p-4 min-h-[400px] flex flex-col justify-between">
        <div>
          <div
            className={cn(
              'text-warning uppercase font-semibold',
              poppinsFont.className
            )}
          >
            Discord Demo
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
                      previousMsg.userID !== msg.userID ||
                      timeDiff >= fiveMinutes
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
                        channels={channels}
                        displayUser={displayUser}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2 border-t border-discord-gray pt-1">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="uppercase text-sm font-semibold text-discord-gray">
              send a trigger!
            </span>
            <div className="flex flex-wrap gap-1">
              {triggers.map((trigger, index) => (
                <Button
                  key={index}
                  variant={'warning'}
                  size={'xs'}
                  className="rounded-xl"
                  disabled={isProcessing}
                  onClick={() => {
                    handleSendTriggerMessage(trigger);
                  }}
                >
                  {trigger}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-1 bg-discord-gray/20 text-discord-gray rounded-lg px-3 py-2 cursor-not-allowed flex justify-between">
            <div className="flex items-center gap-2 truncate">
              <PlusCircle />
              Choose from the options above
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

export default AutoResFeature;

const responseTemplates: Record<string, (userId: string) => TranscriptMessage> =
  {
    ticket: (userId: string) => ({
      userID: 'bot',
      content: `<@${userId}>, you can open tickets at <#1>!`,
      embeds: [],
      attachments: [],
      timestamp: Date.now(),
    }),
    rules: (userId: string) => ({
      userID: 'bot',
      content: `READ THE RULES!!`,
      embeds: [
        {
          title: `Bluetick`,
          url: null,
          author: null,
          description: `- Read our server information at <#2> and rules at <#3>\n\nHave fun!!`,
          footer: null,
          thumbnailURL: '',
          imageURL: '',
          timestamp: null,
          color: '#06d6a0',
        },
      ],
      attachments: [],
      timestamp: Date.now(),
    }),
    cinema: (userId: string) => ({
      userID: 'bot',
      content: `Absolute **CINEMAAAA**!!!`,
      embeds: [],
      attachments: [],
      timestamp: Date.now(),
    }),
  };
