'use client';
import React, { useContext } from 'react';
import FeatureLabel from '../feature-label';
import { BluetickContext } from '@/context/bluetick-context';
import { Skeleton } from '@/components/ui/skeleton';
import { getBotAvatarURL } from '@/lib/helper';
import type { TranscriptMessage } from '@/types/bluetick/db/tickets';
import { subDays } from 'date-fns';
import DiscordMessage from '@/components/bluetick/discord/message';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/motions/animated-button';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

const WelcomeFeature = (): JSX.Element => {
  const { isLoading, botDetails } = useContext(BluetickContext);

  const [messages, setMessages] = React.useState<TranscriptMessage[]>([
    {
      userID: 'bot',
      content: 'Hello <@1>!',
      embeds: [],
      attachments: [],
      timestamp: subDays(new Date(), 1).valueOf(),
    },
  ]);

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

  const handleJoinServerDemo = (): void => {
    // Generate a random user ID from 1 to 3
    const randomUserId = Math.floor(Math.random() * 3) + 1; // This will be 1, 2, or 3
    const userIdString = randomUserId.toString(); // Convert to string if necessary

    // Select a random greeting template
    const templateIndex = Math.floor(Math.random() * greetingTemplates.length);
    const newMessage = greetingTemplates[templateIndex](userIdString); // Assuming '1' is the userId of the new member
    // limit the message length to 10 max
    // Add the new message to the messages state and ensure the array doesn't exceed 10 messages
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      // Check if the array length exceeds 10
      if (updatedMessages.length > 10) {
        // Remove the oldest messages to keep the array length at 10
        return updatedMessages.slice(-10);
      }
      return updatedMessages;
    });
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 m-4">
      <div className="w-full text-sm  px-2 md:px-8">
        <FeatureLabel text="Welcome New Members" />
        <p className="text-foreground/80">
          👋 Welcome newbies with our custom greeting! As server admin,
          personalize the message to introduce rules, activities & vibe. Roll
          out the 🚀 red carpet with a warm hello tailored to your unique
          community. Keep it fresh - update anytime!
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <AnimatedButton
            size={'sm'}
            variant={'info'}
            onClick={() => {
              signIn('discord', { callbackUrl: '/servers' }).catch(() => {
                toast.error('Failed to initiate log in with Discord');
              });
            }}
          >
            Set this up
          </AnimatedButton>
          <AnimatedButton
            size={'sm'}
            variant={'warning'}
            onClick={() => {
              handleJoinServerDemo();
            }}
          >
            Demo: Join the server
          </AnimatedButton>
        </div>
      </div>

      <div className="w-full rounded-lg bg-discord p-4">
        <div className="text-warning uppercase font-semibold">Discord Demo</div>
        <div className="max-h-[300px] overflow-auto">
          {isLoading || !botDetails ? (
            <Skeleton className="w-full h-12" />
          ) : (
            <div className="flex flex-col gap-1 text-white">
              {messages
                .filter(
                  (msg) =>
                    msg.content ||
                    msg.embeds.length !== 0 ||
                    msg.attachments.length !== 0
                )
                .map((msg, index) => {
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
                        displayUser={displayUser}
                      />
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeFeature;

const greetingTemplates: Array<(userId: string) => TranscriptMessage> = [
  (userId: string) => ({
    userID: 'bot',
    content: `Hello <@${userId}>! Welcome to our server. We're glad to have you here!`,
    embeds: [],
    attachments: [],
    timestamp: Date.now(),
  }),
  (userId: string) => ({
    userID: 'bot',
    content: `Welcome aboard <@${userId}>! Feel free to introduce yourself and join the fun.`,
    embeds: [],
    attachments: [],
    timestamp: Date.now(),
  }),
  (userId: string) => ({
    userID: 'bot',
    content: `Hey <@${userId}>! You've just joined the coolest server on Discord. Enjoy your stay!`,
    embeds: [],
    attachments: [],
    timestamp: Date.now(),
  }),
];
