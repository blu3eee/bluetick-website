"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TICKET_STATUS, type TicketDetails } from "@/types/bluetick/db/tickets";
import { BOTS_API_URL, runningBotsInstance } from "@/config/running-bots";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import PaginatePages from "@/components/custom-ui/paginate-pages";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CloseInactiveTicketsButton from "./inactive-tickets-close";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  tickets: TicketDetails[];
  refetchTickets: () => Promise<void>;
  fields?: Array<keyof TicketDetails>;
  allowedActions?: string[];
  authLevel?: "admin" | "user";
}

const limit = 10;

const TicketsTable: React.FC<Props> = ({
  tickets,
  refetchTickets,
  fields = ["userID", "status"],
  //   allowedActions = ["close"],
  authLevel,
}) => {
  const [filterStatus, setFilterStatus] = React.useState("");
  const [closingTicketId, setClosingTicketId] = React.useState<number | null>(
    null,
  );

  // pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data: session } = useSession();
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

  React.useEffect(
    () => {
      if (tickets && currentPage > totalPages) {
        setCurrentPage(totalPages > 1 ? totalPages : 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets],
  );

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
    console.log(BOTS_API_URL);
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
      console.log(e);
      toast.error(`An error happened while trying to close ticket`);
    } finally {
      setTimeout(() => {
        setClosingTicketId(null); // Reset the loading state regardless of the request outcome
      }, 300);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-secondary p-4 md:grid-cols-4">
        {info.map((field, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <Label className="uppercase text-foreground/70">
              {field.label}:
            </Label>
            <span className="font-semibold text-blue-500">{field.value}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-secondary p-2">
        <Label className="text-lg font-bold uppercase text-red-500">
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
              className="flex w-fit flex-wrap gap-4 "
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
          {authLevel === "admin" && (
            <>
              <CloseInactiveTicketsButton />
              {/* {filterStatus === "Open" && (
                <Button
                  size={"sm"}
                  variant={"red"}
                  onClick={() => {}}
                  className="w-fit"
                >
                  Close all open tickets
                </Button>
              )} */}
            </>
          )}
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
                <TableHead className="w-[128px]">#</TableHead>
                {fields?.map((field, index) => (
                  <TableHead key={index} className="capitalize">
                    {field}
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  {fields?.map((field, index) => (
                    <TableCell key={index}>
                      {field === "guild"
                        ? ticket.guild.guildID
                        : String(ticket[field])}
                    </TableCell>
                  ))}
                  <TableCell className="flex items-center justify-end gap-2">
                    {ticket.status === TICKET_STATUS.CLOSED &&
                      ticket.transcriptMessageID && (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`/transcripts/${ticket.id}`}
                          className="rounded-md bg-blue-500 text-white hover:bg-blue-400"
                        >
                          <Button
                            size={"sm"}
                            variant={"blue"}
                            className="h-fit w-fit p-1"
                          >
                            Transcript
                          </Button>
                        </a>
                      )}

                    {ticket.status === TICKET_STATUS.OPEN &&
                      ticket.channelID && (
                        <>
                          <Button
                            size={"sm"}
                            variant={"red"}
                            onClick={() => {
                              handleCloseTicket(ticket.id).catch((e) => {});
                            }}
                            disabled={closingTicketId === ticket.id}
                            className="h-fit w-fit p-1"
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
                          <Link
                            className={cn(
                              buttonVariants({
                                size: "sm",
                              }),
                              "h-fit w-fit p-1",
                            )}
                            href={`https://discord.com/channels/${ticket.guild.guildID}/${ticket.channelID}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            View
                          </Link>
                        </>
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

export default TicketsTable;
