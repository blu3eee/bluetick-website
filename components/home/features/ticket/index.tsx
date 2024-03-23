'use client';

import React, { useContext } from 'react';
import FeatureLabel from '../feature-label';
import AnimatedButton from '@/components/motions/animated-button';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { poppinsFont } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import DiscordMessage from '@/components/bluetick/discord/message';

import { BluetickContext } from '@/context/bluetick-context';
import { getBotAvatarURL } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import type { TranscriptMessage } from '@/types/bluetick/db/tickets';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, Bug, Mail } from 'lucide-react';

const TicketFeature = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 m-4">
      <div className="block md:hidden">
        <Description />
      </div>
      <div className="w-full rounded-lg bg-discord p-4">
        <div
          className={cn(
            'text-warning uppercase font-semibold',
            poppinsFont.className
          )}
        >
          Ticket Panel Channel
        </div>
        <TicketDemo />
      </div>
      <div className="hidden md:block">
        <Description />
      </div>
    </div>
  );
};

export default TicketFeature;

const TicketDemo = (): JSX.Element => {
  const { isLoading, botDetails } = useContext(BluetickContext);
  // Generate a random user ID from 1 to 3

  const users: Record<string, { name: string; avatarURL: string }> = {
    bot: {
      name: botDetails?.username ?? 'Bluetick',
      avatarURL: botDetails ? getBotAvatarURL(botDetails) : '',
    },
    '1': {
      name: 'Wumpus',
      avatarURL: '',
    },
    '2': {
      name: 'Clyde',
      avatarURL: '',
    },
    '3': {
      name: 'Nelly',
      avatarURL: '',
    },
  };

  const [messages, setMessages] = React.useState<TranscriptMessage[]>([]);
  const [counter, setCounter] = React.useState(0);

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

  const [channels, setChannels] = React.useState<
    Record<string, { name: string }>
  >({});

  const handleCreateTicket = (panel: string): void => {
    // randomize the opened dummy user
    const randomUserId = Math.floor(Math.random() * 3) + 1; // This will be 1, 2, or 3
    const userIdString = randomUserId.toString(); // Convert to string if necessary

    // add new channels
    setChannels((prev) => ({
      ...prev,
      [`${counter + 1}`]: {
        name: `${panel}-${counter + 1}`,
      },
    }));

    const newMsg = {
      userID: 'bot',
      content: `<@${userIdString}>, your ticket 🎟️ is opened`,
      embeds: [
        {
          title: null,
          url: null,
          author: null,
          description: `Your ticket is opened here: <#${counter + 1}>`,
          footer: null,
          thumbnailURL: '',
          imageURL: '',
          timestamp: null,
          color: '#06d6a0',
        },
      ],
      attachments: [],
      timestamp: new Date().valueOf(),
    };
    // update messages and counter
    const updated = [...messages, newMsg];
    setMessages(updated.length > 3 ? [newMsg] : updated);
    setCounter((prev) => prev + 1);
  };

  if (isLoading || !botDetails) {
    return <div>Loading details...</div>;
  }

  return (
    <>
      <DiscordMessage
        author={{
          name: botDetails?.username ?? 'Bluetick',
          avatarURL: botDetails ? getBotAvatarURL(botDetails) : '',
        }}
        message={{
          userID: 'bot',
          content: '',
          embeds: [
            {
              title: 'Get Support',
              url: null,
              author: null,
              description: 'Click button to open support ticket 🎟️!',
              footer: null,
              thumbnailURL: '',
              imageURL: '',
              timestamp: null,
              color: '#d8fcff',
            },
          ],
          attachments: [],
          timestamp: new Date(2024, 0, 1).valueOf(),
        }}
        users={users}
      />
      <div className="mt-2 ml-12 flex items-center gap-2">
        <Button
          className="text-white bg-success-dark hover:bg-success gap-2"
          size={'sm'}
          variant={'success'}
          onClick={() => {
            handleCreateTicket(`ticket-support`);
          }}
        >
          <Mail />
          Support
        </Button>
        <Button
          className="gap-2"
          size={'sm'}
          variant={'error'}
          onClick={() => {
            handleCreateTicket(`ticket-bug`);
          }}
        >
          <Bug />
          Report a bug
        </Button>
      </div>
      {messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1; // Check if it's the last message
        const author = users[msg.userID];
        return (
          <motion.div
            key={index}
            layoutId={`ticket-open-${counter + 1}`}
            className="mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            ref={isLastMessage ? lastMessageRef : null} // Attach the ref here
          >
            <DiscordMessage
              key={index}
              author={author}
              message={msg}
              users={users}
              displayUser={true}
              channels={channels}
            />
          </motion.div>
        );
      })}
    </>
  );
};

const Description = (): JSX.Element => {
  const router = useRouter();
  const { data, status } = useSession();
  return (
    <div className="w-full text-sm  px-2 md:px-8">
      <FeatureLabel text="Ticket System" />
      <p className="text-foreground/80">
        🎟️ Customize our slick Ticket System for seamless support! Create
        dedicated topic channels - members open tickets with ease. Built for
        reliability & scalability. 🚀 Streamline communication, boost
        engagement!
      </p>
      <div className="flex items-center justify-start gap-2 mt-2">
        <Button
          size={'sm'}
          variant={'warning'}
          disabled
          className="w-fit gap-2"
        >
          <ArrowLeft className="hidden md:block" />
          <ArrowDown className="block md:hidden" />
          See how it works{' '}
        </Button>
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
      </div>
    </div>
  );
};
