import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalClose,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
} from "@/components/custom-ui/responsive-modal";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { runningBotsInstance } from "@/config/running-bots";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { GuildContext } from "@/context/guild-context";

const CloseInactiveTicketsButton = (): JSX.Element => {
  const { data: session } = useSession();
  const { discordGuild, isLoading } = useContext(GuildContext);
  const [days, setDays] = React.useState(14);
  const [open, setOpen] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const handleCloseInactiveTickets = async (): Promise<void> => {
    setProcessing(true);
    try {
      const response = await runningBotsInstance.post<{
        successCount: number;
        failureCount: number;
        total: number;
      }>(`tickets/close-inactive`, {
        botID: BLUETICK_BOT_ID,
        guildID: discordGuild?.id ?? "",
        requestedUserID: session?.user?.id,
        days,
      });

      if (response.status === 200) {
        const { successCount, failureCount, total } = response.data;
        toast.info("Inactive tickets closed", {
          description: `Total: ${total}. Success: ${successCount}. Failed: ${failureCount}`,
        });
      } else {
        toast.error(`Failed to close inactive tickets`);
      }
    } catch (e) {
      toast.error(`An error happened while trying to close inactive tickets`);
    } finally {
      setProcessing(false);
    }
  };
  if (isLoading) {
    return (
      <Button size={"sm"} variant={"red"} disabled>
        Loading
      </Button>
    );
  }
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger>
        <Button size={"sm"} variant={"red"} disabled={processing}>
          {processing ? `Closing tickets` : `Close all inactive tickets`}
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="text-left">
          <ResponsiveModalTitle>Are you sure?</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            This action cannot be undone.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="px-4 md:px-0">
          <div className="flex w-fit flex-col gap-2">
            <Label
              htmlFor="per-user-limit"
              className="text-xs font-bold uppercase text-gray-500"
            >
              CLOSE ALL TICKETS THAT HAS BEEN INACTIVE FOR
            </Label>
            <Input
              id="per-user-limit"
              type="number"
              min={1}
              name="perUserTicketLimit"
              value={days}
              onChange={(event) => {
                const { value } = event.target;

                setDays(Number(value));
              }}
              className="w-fit min-w-[100px]"
            />
          </div>
        </div>
        <ResponsiveModalFooter>
          <ResponsiveModalClose>
            <div className="flex justify-end gap-4">
              <Button variant={"outline"} size={"md"}>
                Cancel
              </Button>
              <Button
                variant={"blue"}
                size={"md"}
                onClick={() => {
                  handleCloseInactiveTickets().catch((e) => {});
                }}
                disabled={processing}
              >
                Close tickets
              </Button>
            </div>
          </ResponsiveModalClose>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default CloseInactiveTicketsButton;
