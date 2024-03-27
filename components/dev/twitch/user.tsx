import ImageWithFallback from '@/components/custom-ui/image-with-fallback';
import type { TwitchUser } from '@/types/twitch';
import React from 'react';

const TwitchUserDisplay: React.FC<TwitchUser & { showBgImage?: boolean }> = ({
  showBgImage = true,
  ...user
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ImageWithFallback
          key={`profile-${user.id}`}
          src={user.profilePictureUrl ?? '/twitch/twitch-bg.jpg'}
          alt="user-profile-image"
          className="rounded-md"
          width={100}
          height={100}
          fallbackSrc="/twitch/twitch-bg.jpg"
        />
        <div className="flex flex-col grow gap-2">
          <div className="text-sm font-medium flex flex-wrap justify-between">
            <span className="text-info">User</span>
            <a
              className="text-twitch border-b"
              href={`https://twitch.tv/${user.displayName}`}
            >
              {user.displayName}
            </a>
          </div>
          <div className="text-sm font-medium flex flex-wrap justify-between">
            <span className="text-info">ID</span>
            <span>{user.id}</span>
          </div>
          <div className="text-sm font-medium flex flex-wrap justify-between">
            <span className="text-info">Creation Date</span>
            <span>
              {new Date(Date.parse(user.creationDate)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {showBgImage && (
        <ImageWithFallback
          key={user.id}
          src={user.offlinePlaceholderUrl ?? '/twitch/twitch-bg.jpg'}
          alt="offline-url"
          className="rounded-md"
          width={1980}
          height={1080}
          fallbackSrc="/twitch/twitch-bg.jpg"
        />
      )}
    </div>
  );
};

export default TwitchUserDisplay;
