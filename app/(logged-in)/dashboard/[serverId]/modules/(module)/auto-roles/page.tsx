import AutoRolesComponent from '@/components/bluetick/modules/auto-roles/autoroles';
import ModulePageTemplate from '@/components/bluetick/modules/module-page-template';

import { GUILD_MODULES } from '@/config/bluetick';
import React from 'react';

const AutoRoles = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <ModulePageTemplate flag={GUILD_MODULES.AUTOROLES} label="Auto Roles">
      <div className="flex flex-col gap-4">
        <AutoRolesComponent serverId={params.serverId} />
      </div>
    </ModulePageTemplate>
  );
};
export default AutoRoles;
