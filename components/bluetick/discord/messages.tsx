import React from 'react';
import DiscordMessage from './message';
import type { TranscriptMessage } from '@/types/bluetick/db/tickets';

interface Props {
  messages: TranscriptMessage[];
  users: Record<string, { name: string; avatarURL: string }>;
  roles?: Record<string, { name: string; color?: string }>;
  channels?: Record<string, { name: string }>;
}

const Messages: React.FC<Props> = ({ messages, users, roles, channels }) => {
  return (
    <div className="flex flex-col gap-1">
      {messages
        .filter(
          (msg) =>
            msg.content ||
            msg.embeds.length !== 0 ||
            msg.attachments.length !== 0
        )
        .map((msg, index) => {
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
            return previousMsg.userID !== msg.userID || timeDiff >= fiveMinutes;
          })();

          return (
            <DiscordMessage
              key={index}
              author={author}
              message={msg}
              users={users}
              displayUser={displayUser}
              roles={roles}
              channels={channels}
            />
          );
        })}
    </div>
  );
};

export default Messages;
