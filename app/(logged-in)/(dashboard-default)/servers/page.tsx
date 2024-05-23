import React from "react";
import { MutualServers } from "./_components/mutual-servers";
import UserInfoComponent from "./_components/user-info";

const BotsPage = (): JSX.Element => {
  return (
    <div className="container flex flex-col items-center gap-3">
      <UserInfoComponent />
      <MutualServers />
    </div>
  );
};
export default BotsPage;
