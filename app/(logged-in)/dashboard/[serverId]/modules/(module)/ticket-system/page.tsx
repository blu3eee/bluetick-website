import ModulePageTemplate from '@/components/bluetick/modules/module-page-template';
import { GUILD_MODULES } from '@/config/bluetick';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettings from '@/components/bluetick/modules/tickets/general-settings';
import ReactionPanels from '@/components/bluetick/modules/tickets/reaction-panels';
import MultiReactionsPanels from '@/components/bluetick/modules/tickets/multi-panels';
import SupportTeams from '@/components/bluetick/modules/tickets/support-teams';
import TicketsView from '@/components/bluetick/modules/tickets/tickets';

const TicketSystem = ({
  params,
}: {
  params: {
    serverId: string;
  };
}): JSX.Element => {
  return (
    <ModulePageTemplate flag={GUILD_MODULES.TICKET} label="Ticket System">
      <Tabs defaultValue="settings">
        <TabsList className="flex flex-wrap h-fit w-fit mb-2">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="settings">General Settings</TabsTrigger>
          <TabsTrigger value="panels">Reaction Panels</TabsTrigger>
          <TabsTrigger value="multi-panels">Multi-panels</TabsTrigger>
          <TabsTrigger value="teams">Support teams</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <TicketsView serverId={params.serverId} />
        </TabsContent>
        <TabsContent value="settings">
          <GeneralSettings serverId={params.serverId} />
        </TabsContent>
        <TabsContent value="panels">
          <ReactionPanels serverId={params.serverId} />
        </TabsContent>
        <TabsContent value="multi-panels">
          <MultiReactionsPanels serverId={params.serverId} />
        </TabsContent>
        <TabsContent value="teams">
          <SupportTeams serverId={params.serverId} />
        </TabsContent>
      </Tabs>
    </ModulePageTemplate>
  );
};

export default TicketSystem;
