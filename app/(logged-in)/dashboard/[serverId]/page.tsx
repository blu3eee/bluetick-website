import GuildConfig from '@/components/bluetick/dashboard/guild-config';
import { GuildInfo } from '@/components/bluetick/dashboard/guild-info';
import Modules from '@/components/bluetick/modules/modules';

import React from 'react';

const DashboardPage = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <div className="w-full flex flex-col gap-4">
      <GuildInfo />
      <GuildConfig />
      <Modules />
    </div>
  );
};

export default DashboardPage;
