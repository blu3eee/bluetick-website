"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { ModuleCard, guildModules } from "./module-card";

const Modules = (): JSX.Element => {
  return (
    <div>
      <Label className="font-bold uppercase">Modules</Label>
      <div className="mt-2 grid w-full  grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {guildModules.map((guildModule, index) => (
          <ModuleCard key={index} {...guildModule} />
        ))}
      </div>
    </div>
  );
};

export default Modules;
