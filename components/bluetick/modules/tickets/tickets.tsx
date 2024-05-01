"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ServerIdProps } from "../props";
import { useFetchGuildTickets } from "@/hooks/api/tickets/tickets";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";
import { TICKET_STATUS } from "@/types/bluetick/db/tickets";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runningBotsInstance } from "@/config/running-bots";
import { useSession } from "next-auth/react";
import PaginatePages from "@/components/custom-ui/paginate-pages";
import CloseInactiveTicketsButton from "./ui/inactive-tickets-close";

const limit = 10;

const TicketsView: React.FC<ServerIdProps> = ({ serverId }) => {
  const {
    data: tickets,
    isLoading,
    refetch: refetchTickets,
  } = useFetchGuildTickets(BLUETICK_BOT_ID, serverId);

  React.useEffect(
    () => {
      if (tickets && currentPage > totalPages) {
        setCurrentPage(totalPages > 1 ? totalPages : 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets],
  );

  const [filterStatus, setFilterStatus] = React.useState("");
  const [closingTicketId, setClosingTicketId] = React.useState<number | null>(
    null,
  );

  // pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: session } = useSession();

  if (isLoading || !tickets) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <span className={cn("text-lg font bold", rubikFont.className)}>
          Loading tickets...
        </span>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className={cn("w-full h-12", i % 2 === 0 ?? `w-3/4`)}
          />
        ))}
      </div>
    );
  }

  const info = [
    { label: "Total", value: tickets.length },
    {
      label: "Open",
      value: tickets.filter((ticket) => ticket.status === TICKET_STATUS.OPEN)
        .length,
    },
  ];

  const filterTickets = tickets
    .filter((ticket) =>
      filterStatus !== "" ? ticket.status === filterStatus : true,
    )
    .sort((a, b) => b.id - a.id); // Sort tickets from newest to oldest

  const totalPages = Math.ceil(filterTickets.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const selectedTickets = filterTickets.slice(startIndex, startIndex + limit);

  // Handle clicking on a radio button
  const handleRadioValueChange = (val: string): void => {
    // Check if the clicked value is the same as the current filterStatus
    // If so, clear the filterStatus (deselect). Otherwise, update to the new value.
    setFilterStatus((currentStatus) => (currentStatus === val ? "" : val));
    // Reset the current page to page 1
    setCurrentPage(1);
  };

  const handleCloseTicket = async (id: number): Promise<void> => {
    setClosingTicketId(id); // Set the loading state to the current ticket ID

    try {
      const res = await runningBotsInstance.post<{ message: string }>(
        "/tickets/close",
        {
          botID: BLUETICK_BOT_ID,
          ticketID: id,
          requestedUserID: session?.user?.id ?? "",
        },
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        await refetchTickets();
      } else {
        toast.error(`Failed to close ticket`);
      }
    } catch (e) {
      // console.log(e);
      toast.error(`An error happened while trying to close ticket`);
    } finally {
      setTimeout(() => {
        setClosingTicketId(null); // Reset the loading state regardless of the request outcome
      }, 300);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-secondary p-4 rounded-lg grid grid-cols-3 md:grid-cols-4 gap-4">
        {info.map((field, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <Label className="uppercase text-foreground/70">
              {field.label}:
            </Label>
            <span className="text-blue-500 font-semibold">{field.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-secondary p-2 rounded-lg flex flex-col gap-2">
        <Label className="uppercase text-red-500 font-bold text-lg">
          TICKETS
        </Label>
        <Label className="uppercase text-foreground/70">Filters</Label>
        <div>
          <div className="flex items-center gap-4">
            <Label className="text-blue-500">Ticket Status</Label>
            <RadioGroup
              onValueChange={handleRadioValueChange}
              // Removed defaultValue to rely on filterStatus for controlling the selection
              value={filterStatus} // Assuming RadioGroup supports controlled value
              className="flex flex-wrap gap-4 w-fit "
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Open"
                  id="Open"
                  className="text-green-500"
                />
                <Label htmlFor="Open">Open</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Closed" id="Closed" />
                <Label htmlFor="Closed">Closed</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            size={"sm"}
            variant={"blue"}
            onClick={() => {
              setFilterStatus(``);
            }}
            className="w-fit"
          >
            Clear filter
          </Button>
          <CloseInactiveTicketsButton />
          {/* {filterStatus === 'Open' && (
            <Button
              size={'sm'}
              variant={'red'}
              onClick={() => {}}
              className="w-fit"
            >
              Close all open tickets
            </Button>
          )} */}
        </div>
        <div className="w-full">
          <Table>
            <TableCaption>
              {tickets.length === 0
                ? "No ticket found"
                : "A list of your server ticket."}
            </TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-fit px-0"></TableHead> */}
                <TableHead className="w-[128px]">#</TableHead>
                <TableHead>Opener</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  {/* <TableCell className="px-0 flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ticket.id)}
                      // onChange={() => toggleTicketSelection(ticket.id)}
                    />
                  </TableCell> */}
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.userID}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell className="flex justify-end items-center gap-2">
                    {ticket.status === TICKET_STATUS.CLOSED &&
                      ticket.transcriptMessageID && (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`/transcripts/${ticket.id}`}
                          className="bg-blue-500 text-white rounded-md hover:bg-blue-400"
                        >
                          <Button
                            size={"sm"}
                            variant={"blue"}
                            className="w-fit p-1 h-fit"
                          >
                            Transcript
                          </Button>
                        </a>
                      )}
                    {ticket.status === TICKET_STATUS.OPEN &&
                      ticket.channelID && (
                        <Button
                          size={"sm"}
                          variant={"red"}
                          onClick={() => {
                            handleCloseTicket(ticket.id).catch((e) => {});
                          }}
                          disabled={closingTicketId === ticket.id} // Disable button for the ticket being processed
                          className="w-fit p-1  h-fit"
                        >
                          {closingTicketId === ticket.id ? (
                            "Closing..."
                          ) : (
                            <span>
                              Close{" "}
                              <span className="hidden md:inline-flex">
                                ticket
                              </span>
                            </span>
                          )}
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          <PaginatePages
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketsView;
