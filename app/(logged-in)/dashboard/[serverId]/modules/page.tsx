import Modules from "@/components/bluetick/modules/modules";
import React from "react";

const DashboardModulesPage = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <div>
      <Modules />
    </div>
  );
};

export default DashboardModulesPage;
