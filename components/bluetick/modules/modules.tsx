"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { ModuleCard, guildModules } from "./module-card";

const Modules = (): JSX.Element => {
  return (
    <div>
      <Label className="uppercase font-bold">Modules</Label>
      <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-2">
        {guildModules.map((guildModule, index) => (
          <ModuleCard key={index} {...guildModule} />
        ))}
      </div>
    </div>
  );
};

export default Modules;
