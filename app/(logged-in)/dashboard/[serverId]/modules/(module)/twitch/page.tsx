import ModulePageTemplate from '@/components/bluetick/modules/module-page-template';
import TwitchComponent from '@/components/bluetick/modules/twitch';
import { GUILD_MODULES } from '@/config/bluetick';
import React from 'react';

const TwitchModule = (): JSX.Element => {
  return (
    <ModulePageTemplate flag={GUILD_MODULES.TWITCH} label="Twitch Watchers">
      <TwitchComponent />
    </ModulePageTemplate>
  );
};

export default TwitchModule;
