import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ButtonInfoDetails, MessageInfoDetails } from "@/types/bluetick";

import React, { useState } from "react";

import { HexColorPicker } from "@/components/custom-ui/color-picker";
import MessagePreview from "./message-preview";
import { CollapsibleFields } from "./collapsible-fields";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import CustomEmojiPicker from "./custom-emoji-picker";
import type { DiscordPartialEmoji } from "@/types/bluetick/discord";

type InputField = "author" | "title" | "description" | "images" | "footer";

interface MessageFormProps {
  type: string;
  initialMessage: MessageInfoDetails;
  onChange?: (message: MessageInfoDetails) => void;
  onSave?: (message: MessageInfoDetails) => void;
  showPreview?: boolean;
  disabledEmbedFields?: InputField[];
  initButton?: ButtonInfoDetails;
  buttonEmojis?: DiscordPartialEmoji[];
  onButtonChange?: (button: ButtonInfoDetails) => void;
  placeholders?: Record<string, string>;
}

const MessageForm: React.FC<MessageFormProps> = ({
  type,
  initialMessage,
  onSave,
  onChange,
  showPreview = true,
  disabledEmbedFields = [],
  initButton,
  buttonEmojis,
  onButtonChange,
  placeholders,
}): JSX.Element => {
  const [message, setMessage] = useState<MessageInfoDetails>(initialMessage);
  const [button, setButton] = useState<ButtonInfoDetails>(
    initButton ?? {
      color: "Green",
      text: "",
      emoji: "✉️",
    },
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    setMessage((prev) => ({ ...prev, type }));
  }, [type]);

  React.useEffect(() => {
    if (onChange) {
      onChange(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  React.useEffect(() => {
    if (onButtonChange) {
      onButtonChange(button);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button]);

  const handleEmbedChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      embed: {
        ...(prevMessage.embed ?? {}),
        [name]: !value ? null : value,
      },
    }));
  };

  // const handleFieldChange = (
  //   index: number,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ): void => {
  //   const { name, value } = event.target;
  //   setMessage((prevMessage) => ({
  //     ...prevMessage,
  //     embed: {
  //       ...(prevMessage.embed ?? {}),
  //       fields:
  //         prevMessage.embed?.fields?.map((field, i) =>
  //           i === index ? { ...field, [name]: value } : field
  //         ) ?? [],
  //     },
  //   }));
  // };

  const handleButtonChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setButton((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (): void => {
    if (
      type.includes("Embed") &&
      (!message.embed ||
        (!message.embed.author &&
          !message.embed.description &&
          !message.embed.title))
    ) {
      toast.error("Can's save empty embed message");
      return;
    }

    if (onSave) {
      onSave(message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {type !== "Embed" && (
        <div>
          <Label
            htmlFor="content"
            className="uppercase font-semibold text-red-400"
          >
            Message Content
          </Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Enter message content"
            value={message.content ?? ""}
            onChange={handleChange}
          />
        </div>
      )}
      {type.includes("Embed") && (
        <div>
          <Label
            htmlFor="embed"
            className="uppercase font-semibold text-red-400"
          >
            Embed
          </Label>
          {!disabledEmbedFields.includes("title") && (
            <div className="flex gap-2 items-center flex-col md:flex-row">
              <div className="w-full">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={message.embed?.title ?? ""}
                  onChange={handleEmbedChange}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="url">Title URL</Label>

                <Input
                  id="url"
                  name="url"
                  placeholder="Title URL"
                  value={message.embed?.url ?? ""}
                  onChange={handleEmbedChange}
                />
              </div>
            </div>
          )}
          {!disabledEmbedFields.includes("description") && (
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description"
                value={message.embed?.description ?? ""}
                onChange={handleEmbedChange}
              />
            </div>
          )}
          {!disabledEmbedFields.includes("author") && (
            <CollapsibleFields label="Author">
              <div className="flex gap-2 items-center flex-col md:flex-row">
                <div className="w-full">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Author"
                    value={message.embed?.author ?? ""}
                    onChange={handleEmbedChange}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="titleURL">Author URL</Label>
                  <Input
                    id="authorURL"
                    name="authorURL"
                    placeholder="Author URL"
                    value={message.embed?.authorURL ?? ""}
                    onChange={handleEmbedChange}
                  />
                </div>
              </div>
            </CollapsibleFields>
          )}
          {!disabledEmbedFields.includes("footer") && (
            <CollapsibleFields label="Footer">
              <div className="flex gap-2 items-center flex-col md:flex-row">
                <div className="w-full">
                  <Label htmlFor="footer">Footer</Label>
                  <Input
                    id="footer"
                    name="footer"
                    placeholder="Footer"
                    value={message.embed?.footer ?? ""}
                    onChange={handleEmbedChange}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="footerURL">Footer icon URL</Label>
                  <Input
                    id="footerURL"
                    name="footerURL"
                    placeholder="Footer icon URL"
                    value={message.embed?.footerURL ?? ""}
                    onChange={handleEmbedChange}
                  />
                </div>
              </div>
            </CollapsibleFields>
          )}
          {!disabledEmbedFields.includes("images") && (
            <CollapsibleFields label="Images">
              <div className="flex gap-2 items-center flex-col md:flex-row">
                <div className="w-full">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="Large image URL"
                    value={message.embed?.image ?? ""}
                    onChange={handleEmbedChange}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    placeholder="Small image URL"
                    value={message.embed?.thumbnail ?? ""}
                    onChange={handleEmbedChange}
                  />
                </div>
              </div>
            </CollapsibleFields>
          )}
          <div className="mt-1">
            <Label htmlFor="color">Color</Label>

            <div className="mt-1">
              <HexColorPicker
                initColor={message.embed?.color ?? "#ffffff"}
                onColorChange={(newVal) => {
                  setMessage((prevMessage) => ({
                    ...prevMessage,
                    embed: {
                      ...(prevMessage.embed ?? {}),
                      color: newVal,
                    },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}
      {initButton && (
        <div className="flex flex-col gap-2">
          <Label className="uppercase font-semibold text-red-400">Button</Label>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-2 w-fit">
              <Label htmlFor="button_color">Color</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="text-sm px-3 py-2 border rounded-md bg-background w-fit font-semibold flex items-center gap-2 cursor-pointer">
                    {button.color}
                    <ChevronsUpDown size={16} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="flex flex-col gap-1"
                >
                  {["Green", "Blue", "Red", "Grey"].map((text, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={`flex items-center focus:bg-accent/60 ${
                        button.color === text
                          ? "bg-secondary/80 focus:bg-accent:50"
                          : ""
                      }`}
                      onClick={() => {
                        setButton((prev) => ({ ...prev, color: text }));
                      }}
                    >
                      {text}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-fit flex flex-col gap-2">
              <Label htmlFor="button_text">Text</Label>
              <Input
                id="button_text"
                name="text"
                placeholder="Click!"
                value={button.text ?? ""}
                onChange={handleButtonChange}
              />
            </div>
            <div className="w-fit flex flex-col gap-2">
              <Label htmlFor="button_text">Emoji</Label>
              <CustomEmojiPicker
                defaultEmoji={button.emoji}
                onEmojiSelect={(newEmoji) => {
                  setButton((prev) => ({ ...prev, emoji: newEmoji }));
                }}
                discordEmojis={buttonEmojis}
              />
            </div>
          </div>
        </div>
      )}
      {onSave && (
        <Button
          onClick={handleSave}
          variant={"outline"}
          size={"sm"}
          className="mt-4 text-red-400 border-[2px] font-semibold border-red-400 hover:bg-red-400 focus:bg-red-400/50 w-fit"
        >
          Save
        </Button>
      )}
      {showPreview && (
        <MessagePreview
          type={type}
          message={message}
          buttons={initButton ? [button] : undefined}
          placeholders={placeholders}
        />
      )}
    </div>
  );
};

export default MessageForm;
