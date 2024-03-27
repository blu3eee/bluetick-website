'use client';
import TwitchUserDisplay from '@/components/dev/twitch/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { twitchInstance } from '@/config/twitch-service';
import { useFetchTwitchStreamListeners } from '@/hooks/twitch/stream-subs';
import type { TwitchUser } from '@/types/twitch';
import React from 'react';
import { toast } from 'sonner';

const TwitchDev = (): JSX.Element => {
  const {
    data: users,
    status,
    error,
    refetch,
  } = useFetchTwitchStreamListeners();

  const [selected, setSelected] = React.useState<TwitchUser | null>(null);

  const [twitchSearch, setTwitchSearch] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTwitchSearch(e.target.value);
  };

  React.useEffect(
    () => {
      if (users && !selected) {
        setSelected(users[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, status]
  );

  const [foundUser, setFoundUser] = React.useState<TwitchUser | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const handleSearch = async (): Promise<void> => {
    if (twitchSearch === '') {
      toast.error('Cannot search user with empty string');
      return;
    }

    setIsSearching(true);

    try {
      if (users) {
        const exist = users.find(
          (user) =>
            user.displayName.toLowerCase() === twitchSearch.toLowerCase()
        );
        if (exist) {
          setFoundUser(null);
          setSelected(exist);
          return;
        }
      }
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

  const handleWatchUser = async (user: TwitchUser): Promise<void> => {
    try {
      const response = await twitchInstance.post('/streams/watch', {
        userId: user.id,
      });
      if (response.status === 200) {
        await refetch();
        toast.success(`Added Twitch Watcher for User: ${user.displayName}`, {
          description: `Twitch ID: ${user.id}`,
        });
      } else {
        toast.error(
          `Failed to add watcher for twitch user: ${user.displayName}`
        );
      }
    } catch (e) {
      toast.error(`An error happened while trying to add twitch watcher`);
    }
  };

  const handleUnwatchUser = async (user: TwitchUser): Promise<void> => {
    try {
      const response = await twitchInstance.post('/streams/unwatch', {
        userId: user.id,
      });
      if (response.status === 200) {
        await refetch();
        setSelected(null);
        toast.info(`Unwatched Twitch User: ${user.displayName}`);
      } else {
        toast.error(`Failed to unwatch Twitch User: ${user.displayName}`);
      }
    } catch (e) {
      toast.error(`An error happened while trying to unwatch a user`);
    }
  };

  const handleTestGoLive = async (user: TwitchUser): Promise<void> => {
    try {
      const response = await twitchInstance.post('/streams/test/online', {
        userId: user.id ?? '',
      });
      console.log(response.status);
      if (response.status === 200) {
        toast.success('Streamer is live!');
      } else {
        toast.error(`An error happened while trying to go live`);
      }
    } catch (e) {
      console.log('Error testing go live');
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 bg-secondary rounded-lg p-4">
        <Label className="text-twitch uppercase font-semibold">
          Stream Watchers
        </Label>
        {status === 'loading' ? (
          <Skeleton className="w-full h-12" />
        ) : status === 'error' ? (
          <div>Error: {error.message}</div>
        ) : status === 'idle' ? (
          <div>Idling</div>
        ) : users.length === 0 ? (
          <div>No stream has been subscribed</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {users.map((user, index) => (
              <Badge
                key={index}
                className="cursor-pointer border-white"
                variant={selected?.id === user.id ? 'default' : 'outline'}
                onClick={() => {
                  setSelected(selected === user ? null : user);
                }}
              >
                {user.displayName}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 bg-secondary rounded-lg p-4">
        <Button
          size={'sm'}
          variant={'twitch'}
          className="w-fit"
          disabled={twitchSearch === '' || isSearching}
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
            if (e.key === 'Enter' && twitchSearch !== '' && !isSearching) {
              handleSearch().catch((e) => {});
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-4">
        {foundUser && (
          <div className="flex flex-col gap-2 bg-secondary rounded-lg p-4 max-w-[520px]">
            <Label className="text-twitch uppercase font-semibold">
              Twitch User
            </Label>
            <div className="flex flex-wrap items-center">
              <Button
                size={'sm'}
                variant={'twitch'}
                onClick={() => {
                  handleWatchUser(foundUser)
                    .then(() => {
                      setFoundUser(null);
                      setTwitchSearch('');
                    })
                    .catch((e) => {});
                }}
              >
                Watch this user
              </Button>
            </div>
            <TwitchUserDisplay {...foundUser} />
          </div>
        )}
        {selected && (
          <div className="flex flex-col gap-2 bg-secondary rounded-lg p-4 max-w-[520px]">
            <Label className="text-twitch uppercase font-semibold">
              Watching
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={'error'}
                size={'sm'}
                onClick={() => {
                  handleUnwatchUser(selected).catch((e) => {});
                }}
              >
                Unwatch this user
              </Button>
              <Button
                variant={'twitch'}
                size={'sm'}
                onClick={() => {
                  handleTestGoLive(selected).catch((e) => {});
                }}
              >
                Test Go Live!
              </Button>
            </div>
            <TwitchUserDisplay {...selected} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitchDev;
