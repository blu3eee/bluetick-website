import ModulePageTemplate from '@/components/bluetick/modules/module-page-template';
import { GUILD_MODULES } from '@/config/bluetick';
import React from 'react';
import WelcomeMessage from '@/components/bluetick/modules/welcome/welcome-message';

const Welcome = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <ModulePageTemplate flag={GUILD_MODULES.WELCOME} label="Welcome">
      <WelcomeMessage serverId={params.serverId} />
    </ModulePageTemplate>
  );
};

export default Welcome;
