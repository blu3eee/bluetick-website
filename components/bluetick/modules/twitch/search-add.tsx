'use client';
import type { TwitchUser } from '@/types/twitch';
import React, { useContext } from 'react';
import { toast } from 'sonner';

import { twitchInstance } from '@/config/twitch-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TwitchUserDisplay from '@/components/dev/twitch/user';
import type { MessageInfoDetails } from '@/types/bluetick';
import { BluetickContext } from '@/context/bluetick-context';
import EditNotificationDialog from './edit-dialog';
import { BLUETICK_BOT_ID, apiInstance } from '@/config/bluetick';
import type { CreateTwitchWatcherDto } from '@/types/twitch/watcher';
import { GuildContext } from '@/context/guild-context';
import { Label } from '@/components/ui/label';
import { ChannelSelect } from '@/components/bluetick/ui/channel-select';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayNotificationMessage from './display-noti';

interface Props {
  refetch: () => void;
}

const SearchAndAdd: React.FC<Props> = ({ refetch }) => {
  const { botDetails } = useContext(BluetickContext);
  const {
    discordGuild,
    isLoading: loadingGuild,
    channels,
    isLoadingChannels,
  } = useContext(GuildContext);
  const [twitchSearch, setTwitchSearch] = React.useState('');
  const [foundUser, setFoundUser] = React.useState<TwitchUser | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  const [message, setMessage] = React.useState<MessageInfoDetails>({
    type: 'Embed and Text',
    content: '{everyone} Your favorite streamer is live!',
    embed: {
      description: '',
      message: '',
      color: '#6441a5',
      title: '{streamTitle}',
      titleURL: '{streamLink}',
      author: '{streamer} is live!',
      authorURL: '{streamerAvatar}',
      image: '{streamPreview}',
      thumbnail: '{streamerAvatar}',
      footer: '',
      footerURL: '',
    },
  });

  const [streamerDetails, setStreamerDetails] = React.useState({
    streamTitle: 'Play with me!!',
    streamLink: '',
    streamer: 'Bluetick',
    streamerAvatar: '/discord/discord.png',
    streamPreview:
      'https://static1.anpoimages.com/wordpress/wp-content/uploads/2022/08/Twitch-Hero.jpg',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTwitchSearch(e.target.value);
  };

  const handleSearch = async (): Promise<void> => {
    if (twitchSearch === '') {
      toast.error('Cannot search user with empty string');
      return;
    }
    setIsSearching(true);
    try {
      const response = await twitchInstance.get<TwitchUser>(
        `/users/${twitchSearch}`
      );
      if (response.status === 200) {
        setFoundUser(response.data);
      }
    } catch (e) {
      toast.error(`An error happened while trying to search a Twitch user`);
    } finally {
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    if (foundUser) {
      setStreamerDetails({
        streamTitle: 'Stream Title',
        streamLink: `https://twitch.tv/${foundUser.displayName}`,
        streamer: foundUser.displayName,
        streamerAvatar: foundUser.profilePictureUrl,
        streamPreview:
          foundUser.offlinePlaceholderUrl !== ''
            ? foundUser.offlinePlaceholderUrl
            : 'https://static1.anpoimages.com/wordpress/wp-content/uploads/2022/08/Twitch-Hero.jpg',
      });
    }
  }, [foundUser]);

  const [postChannelId, setPostChannelId] = React.useState('');
  const [isRequesting, setIsRequesting] = React.useState(false);

  const handleAddWatcher = async (): Promise<void> => {
    if (!foundUser) {
      toast.error(`Can't find twitch user, please try searching again`);
      return;
    }
    if (loadingGuild || !discordGuild) {
      toast.error(`Guild information is not loaded yet`);
      return;
    }

    if (!postChannelId) {
      toast.error(`You need to select a channel for notifications first.`);
      return;
    }

    setIsRequesting(true);
    try {
      const createDto: CreateTwitchWatcherDto = {
        botID: BLUETICK_BOT_ID,
        guildID: discordGuild.id,
        twitchUserId: foundUser.id,
        postChannelId,
        message,
      };
      const response = await apiInstance.post('/twitch/watchers', createDto);
      if (response.status === 201) {
        toast.success(`Twitch Streamer Watcher Created`, {
          description: `Streamer: ${foundUser.displayName}`,
        });
        refetch();
      } else {
        toast.error(`Failed to create Twitch Streamer Watcher`);
      }
    } catch (e) {
      toast.error(
        `An error happened while trying to add twitch stream watcher`
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          size={'sm'}
          variant={'twitch'}
          className="w-fit"
          disabled={
            twitchSearch === '' ||
            isSearching ||
            isRequesting ||
            twitchSearch.toLowerCase() === foundUser?.name.toLowerCase() ||
            twitchSearch === foundUser?.id
          }
          onClick={() => {
            handleSearch().catch((e) => {});
          }}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Input
          placeholder="Twitch user/id"
          className="w-fit"
          value={twitchSearch}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              twitchSearch !== '' &&
              !isSearching &&
              !isRequesting
            ) {
              handleSearch().catch((e) => {});
            }
          }}
        />
      </div>
      {foundUser && (
        <>
          <div className="max-w-[520px]">
            <TwitchUserDisplay showBgImage={false} {...foundUser} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size={'sm'}
              variant={'twitch'}
              disabled={isRequesting}
              onClick={() => {
                handleAddWatcher().catch((e) => {});
              }}
            >
              Add Watcher
            </Button>
            <EditNotificationDialog
              message={message}
              onSubmit={(msg) => {
                setMessage(msg);
              }}
              placeholders={streamerDetails}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-twitch">Notification Channel</Label>
            <span className="text-sm text-foreground/70">
              This is where the notification messages are sent
            </span>
            {isLoadingChannels || !channels ? (
              <Skeleton className="w-full h-10" />
            ) : (
              <ChannelSelect
                initChannelId={postChannelId}
                options={channels.textChannels}
                onSelect={setPostChannelId}
              />
            )}
          </div>
          {botDetails && (
            <div className="text-white bg-discord py-2 rounded-md">
              <DisplayNotificationMessage
                botDetails={botDetails}
                message={message}
                streamerDetails={streamerDetails}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchAndAdd;
