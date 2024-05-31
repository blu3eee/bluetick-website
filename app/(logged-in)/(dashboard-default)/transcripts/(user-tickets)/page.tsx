"use client";
import TicketsTable from "@/components/bluetick/modules/tickets/ui/tickets-table";
import { Callout } from "@/components/callout";
import { Skeleton } from "@/components/ui/skeleton";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { useFetchUserTickets } from "@/hooks/api/tickets/tickets";

import { useSession } from "next-auth/react";
import React from "react";

const TranscriptsDashboard = (): React.ReactNode => {
  return (
    <div className="container flex w-full flex-col gap-4 px-4">
      {/* <Callout>Coming soon...</Callout> */}
      <UserTickets />
    </div>
  );
};

export default TranscriptsDashboard;

const UserTickets = (): React.ReactNode => {
  const { data: session, status } = useSession();

  const {
    data: tickets,
    isLoading,
    refetch,
  } = useFetchUserTickets(BLUETICK_BOT_ID, session?.user?.id ?? "");

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full rounded-md" />
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <Skeleton className="h-8 w-full rounded-md" key={index} />
          ))}
      </div>
    );
  }

  if (!tickets) {
    return (
      <div>
        <Callout>Error fetching tickets</Callout>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TicketsTable
        tickets={tickets}
        refetchTickets={async () => {
          refetch().catch((e) => {});
        }}
        fields={["guild", "status"]}
      />
    </div>
  );
};
