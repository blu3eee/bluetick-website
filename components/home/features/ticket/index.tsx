"use client";

import React, { useContext } from "react";
import FeatureLabel from "../feature-label";
import AnimatedButton from "@/components/motions/animated-button";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { poppinsFont } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import DiscordMessage from "@/components/bluetick/discord/message";

import { BluetickContext } from "@/context/bluetick-context";
import { getBotAvatarURL } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import type { TranscriptMessage } from "@/types/bluetick/db/tickets";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  Bug,
  ChevronDown,
  CornerDownRight,
  Hash,
  Mail,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TicketFeature = (): JSX.Element => {
  const [channels, setChannels] = React.useState<
    Record<string, { name: string }>
  >({});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 m-4">
      <div className="block md:hidden">
        <Description />
        <ChannelsDisplay channels={channels} />
      </div>
      <div className="w-full rounded-lg bg-discord p-4 text-white h-fit">
        <div
          className={cn(
            "text-warning uppercase font-semibold",
            poppinsFont.className,
          )}
        >
          Ticket Panel Channel
        </div>
        <TicketDemo channels={channels} setChannels={setChannels} />
      </div>
      <div className="hidden md:block">
        <Description />
        <ChannelsDisplay channels={channels} />
      </div>
    </div>
  );
};

export default TicketFeature;

interface TicketDemoProps {
  channels: Record<string, { name: string }>;
  setChannels: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        {
          name: string;
        }
      >
    >
  >;
}

const TicketDemo: React.FC<TicketDemoProps> = ({
  channels,
  setChannels,
}): JSX.Element => {
  const { isLoading, botDetails } = useContext(BluetickContext);
  // Generate a random user ID from 1 to 3

  const users: Record<string, { name: string; avatarURL: string }> = {
    bot: {
      name: botDetails?.username ?? "Bluetick",
      avatarURL: botDetails ? getBotAvatarURL(botDetails) : "",
    },
    "1": {
      name: "Wumpus",
      avatarURL: "",
    },
    "2": {
      name: "Clyde",
      avatarURL: "",
    },
    "3": {
      name: "Nelly",
      avatarURL: "",
    },
  };

  const [messages, setMessages] = React.useState<TranscriptMessage[]>([]);
  const [counter, setCounter] = React.useState(0);

  const lastMessageRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [messages]);

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
      userID: "bot",
      content: `<@${userIdString}>, your ticket 🎟️ is opened`,
      embeds: [
        {
          title: null,
          url: null,
          author: null,
          description: `Your ticket is opened here: <#${counter + 1}>`,
          footer: null,
          thumbnailURL: "",
          imageURL: "",
          timestamp: null,
          color: "#06d6a0",
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
          name: botDetails?.username ?? "Bluetick",
          avatarURL: botDetails ? getBotAvatarURL(botDetails) : "",
        }}
        message={{
          userID: "bot",
          content: "",
          embeds: [
            {
              title: "Get Support",
              url: null,
              author: null,
              description: "Click button to open support ticket 🎟️!",
              footer: null,
              thumbnailURL: "",
              imageURL: "",
              timestamp: null,
              color: "#d8fcff",
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
          size={"sm"}
          variant={"success"}
          onClick={() => {
            handleCreateTicket(`ticket-support`);
          }}
        >
          <Mail />
          Support
        </Button>
        <Button
          className="gap-2"
          size={"sm"}
          variant={"error"}
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
            className="mt-1 "
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

interface ChannelsDisplayProps {
  channels: Record<string, { name: string }>;
}

const ChannelsDisplay: React.FC<ChannelsDisplayProps> = ({
  channels,
}): JSX.Element => {
  const [curChannels, setCurChannels] = React.useState<
    Array<{ name: string; isThread: boolean }>
  >([]);
  const [isThread, setIsThread] = React.useState(true);
  React.useEffect(
    () => {
      const newChannels = Array.from(Object.entries(channels).values());
      const newChannel = newChannels[newChannels.length - 1];
      if (newChannel) {
        setCurChannels((prev) => [
          ...prev,
          { name: newChannel[1].name, isThread },
        ]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channels],
  );

  return (
    <div className="flex flex-col mt-4 gap-2">
      <div className="flex items-center gap-2">
        <Label className="uppercase font-semibold text-info">
          Ticket Channel Mode
        </Label>
        <Switch
          size={"xs"}
          checked={isThread}
          onClick={() => {
            setIsThread(!isThread);
          }}
        />
        <span>{isThread ? `Thread Channel` : "Text Channel"}</span>
      </div>
      <div className="bg-discord text-white rounded-lg px-3 py-4 max-h-[320px] overflow-auto">
        {/* category */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#99aab5] uppercase">
          <ChevronDown size={14} />
          Ticket Category
        </div>
        <div className="ml-4 mt-1 ">
          <div className="font-semibold text-md flex items-center gap-1 rounded-lg px-2 py-1 bg-[#99aab522]">
            <Hash size={16} />
            ticket-panel-channel
          </div>
          <div className="ml-3 text-[#99aab5] flex items-center gap-1 font-semibold text-md flex items-center">
            <CornerDownRight size={16} />
            ticket-support-0
          </div>
          {curChannels
            .filter((c) => c.isThread)
            .slice(-3)
            .map((channel) => (
              <motion.div
                key={channel.name}
                layoutId={`ticket-${channel.name}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                className={
                  "ml-3 text-discord-gray flex items-center gap-1 font-semibold text-md flex items-center"
                }
              >
                <CornerDownRight size={16} />
                {channel.name}
              </motion.div>
            ))}

          {curChannels
            .filter((c) => !c.isThread)
            .slice(-3)
            .map((channel) => (
              <motion.div
                key={channel.name}
                layoutId={`ticket-${channel.name}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                className="ml-2 font-semibold text-md flex items-center text-discord-gray gap-1"
              >
                <Hash size={16} />
                {channel.name}
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

const Description = (): JSX.Element => {
  const router = useRouter();
  const { data, status } = useSession();
  return (
    <div className="w-full text-sm px-2 text-start md:text-end">
      <FeatureLabel text="Ticket System 🎟️" />
      <p className="text-foreground/80 mt-4">
        Customize our slick Ticket System for seamless support! Create dedicated
        topic channels - members open tickets with ease. Built for reliability &
        scalability. 🚀 Streamline communication, boost engagement!
      </p>
      <div className="flex items-center justify-start gap-2 mt-2">
        <Button
          size={"sm"}
          variant={"warning"}
          disabled
          className="w-fit gap-2"
        >
          <ArrowLeft className="hidden md:block" />
          <ArrowDown className="block md:hidden" />
          See how it works
        </Button>
        <AnimatedButton
          size={"sm"}
          variant={"info"}
          onClick={() => {
            if (status === "loading") {
              toast.error("This is still loading");
            } else {
              if (data) {
                router.push("/servers");
              } else {
                signIn("discord", { callbackUrl: "/servers" }).catch(() => {
                  toast.error("Failed to initiate log in with Discord");
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
