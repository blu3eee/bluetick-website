import AutoResList from "@/components/bluetick/modules/autores/list";
import ModulePageTemplate from "@/components/bluetick/modules/module-page-template";

import { GUILD_MODULES } from "@/config/bluetick";
import React from "react";

const AutoResponder = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <ModulePageTemplate
      flag={GUILD_MODULES.AUTO_RESPONSE}
      label="Auto Responder"
    >
      <div className="flex flex-col gap-4">
        <AutoResList serverId={params.serverId} />
      </div>
    </ModulePageTemplate>
  );
};

export default AutoResponder;
