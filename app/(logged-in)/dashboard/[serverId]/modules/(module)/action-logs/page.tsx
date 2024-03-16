import BotLogs from '@/components/bluetick/modules/action-logs/bot-logs';
import ModulePageTemplate from '@/components/bluetick/modules/module-page-template';

import { GUILD_MODULES } from '@/config/bluetick';
import React from 'react';

const ActionLogs = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <ModulePageTemplate flag={GUILD_MODULES.ACTION_LOGS} label="Action Logs">
      <div className="flex flex-col gap-4">
        <BotLogs serverId={params.serverId} />
      </div>
    </ModulePageTemplate>
  );
};
export default ActionLogs;
