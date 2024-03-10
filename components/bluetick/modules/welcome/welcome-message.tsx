'use client';
import React, { useState } from 'react';
import TypeAndChannel from './basics';
import { Label } from '@/components/ui/label';

import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import { useFetchGuildWelcome } from '@/hooks/api/welcome/fetch';

import MessageForm from '../../ui/message-form';
import { Skeleton } from '@/components/ui/skeleton';
import type { MessageInfoDetails } from '@/types/bluetick';
import { toast } from 'sonner';

interface WelcomeMessageProps {
  serverId: string;
}
const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ serverId }) => {
  const [type, setType] = useState('Message');

  const { data: guildWelcome, isLoading } = useFetchGuildWelcome(
    BLUETICK_BOT_ID,
    serverId
  );

  React.useEffect(() => {
    if (guildWelcome) {
      // eslint-disable react-hooks/exhaustive-deps
      setType(guildWelcome.message.type ?? 'Message');
    }
    // eslint-disable react-hooks/exhaustive-deps
  }, [guildWelcome]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!guildWelcome) {
    return <div>error fetching welcome config</div>;
  }

  const handleSaveWelcomeMessages = async (
    newMessage: MessageInfoDetails
  ): Promise<void> => {
    // Send the patch request to update the message type
    try {
      const response = await apiInstance.patch(
        `${ROUTES.BOTGUILDWELCOMES}/${BLUETICK_BOT_ID}/${serverId}`,
        { message: { content: newMessage.content, embed: newMessage.embed } }
      );
      if (response.status === 200) {
        toast.success(`Welcome message updated`);
      } else {
        toast.error('Failed to update welcome message');
      }
    } catch (error) {
      toast.error(`An error happened while trying to update welcome message`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TypeAndChannel initType={type} serverId={serverId} setType={setType} />
      <div className="bg-secondary rounded-lg p-4 w-full">
        <Label className="text-sm text-gray-500">
          * All fields are optional
        </Label>
        <MessageForm
          initialMessage={guildWelcome.message}
          type={guildWelcome.message.type ?? type}
          onSave={(msg) => {
            handleSaveWelcomeMessages(msg).catch((error) => {
              console.error('Failed to save welcome message', error);
              // Handle the error appropriately
            });
          }}
        />
      </div>
    </div>
  );
};

export default WelcomeMessage;
