import Modules from "@/components/bluetick/modules/modules";

import React from "react";
import GuildInfo from "./_components/guild-info";
import GuildConfig from "./_components/guild-config";

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
