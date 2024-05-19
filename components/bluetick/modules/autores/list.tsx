"use client";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import { useFetchGuildAutoRes } from "@/hooks/api/autores/list";
import type {
  AutoResponseDetails,
  CreateAutoResponseDto,
} from "@/types/bluetick/db/autores";
import React, { useState } from "react";
import MessagePreview from "../../ui/message-preview";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { AddResponseDialog } from "./add-dialog";
import type { MessageInfoDetails } from "@/types/bluetick";
import DeleteDialog from "./delete-dialog";
import EditResponseDialog from "./edit-dialog";
import { toast } from "sonner";

interface AutoResListProps {
  serverId: string;
}

const AutoResList: React.FC<AutoResListProps> = ({ serverId }) => {
  const {
    data: autoResList,
    isLoading,
    refetch,
  } = useFetchGuildAutoRes(BLUETICK_BOT_ID, serverId);

  const [list, setList] = React.useState<AutoResponseDetails[]>([]);

  React.useEffect(() => {
    setList(autoResList ?? []);
  }, [autoResList]);

  const [selected, setSelected] = useState<AutoResponseDetails[]>([]);

  const [selectMode, setSelectMode] = React.useState(false);
  if (isLoading) {
    return <div>loading skeleton</div>;
  }

  if (!autoResList) {
    return <div>failed to fetch auto responses</div>;
  }

  const handleSelectAutoRes = (autoRes: AutoResponseDetails): void => {
    if (selectMode) {
      if (selected.includes(autoRes)) {
        setSelected(selected.filter((e) => e.id !== autoRes.id));
      } else {
        setSelected(selected.concat(autoRes));
      }
    } else {
      if (selected.includes(autoRes)) {
        setSelected([]);
      } else {
        setSelected([autoRes]);
      }
    }
  };

  const handleSelectAll = (): void => {
    setSelectMode(true);
    setSelected(selected.length === autoResList.length ? [] : autoResList);
  };

  const handleAddNewResponse = async (
    trigger: string,
    response: MessageInfoDetails,
  ): Promise<void> => {
    try {
      const dto: CreateAutoResponseDto = {
        trigger,
        response,
        botID: BLUETICK_BOT_ID,
        guildID: serverId,
      };
      await apiInstance.post<{ data: AutoResponseDetails }>(
        `${ROUTES.AUTO_RESPONSE}`,
        dto,
      );
      await refetch();
    } catch (e) {
      console.error("Error adding new autores:", e);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      const { data } = await apiInstance.delete<{ data: { message: string } }>(
        `${ROUTES.AUTO_RESPONSE}/${selected[0].id}`,
      );
      if (data.data.message) {
        toast.success(data.data.message);

        setSelected([]);
      } else {
        toast.error(`Failed to delete`);
        setSelected([]);
      }
      await refetch();
    } catch (e) {
      toast.error("An error happened while trying to delete autores");
    }
  };

  const handleSubmitUpdate = async (
    id: number,
    trigger: string,
    response: MessageInfoDetails,
  ): Promise<void> => {
    try {
      const { data } = await apiInstance.patch<{ data: AutoResponseDetails }>(
        `${ROUTES.AUTO_RESPONSE}/${id}`,
        { trigger, response },
      );
      if (data.data) {
        toast.success(`Auto response updated [trigger: ${data.data.trigger}]`);
      } else {
        toast.error(`Failed to update auto-response`);
      }
      await refetch();
    } catch (e) {
      toast.error("An error happened while trying to update autores");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <AddResponseDialog
          onSubmit={(trigger: string, response: MessageInfoDetails) => {
            handleAddNewResponse(trigger, response).catch(() => {});
          }}
        />
      </div>
      <Separator />
      <div>
        <div className="flex items-center gap-2">
          <Label className="font-semibold uppercase">
            List of Auto-responses (
            <span className="text-blue-500"> {list.length} </span>/ 20 )
          </Label>
          <div className="cursor-pointer p-2 hover:text-blue-500 focus:text-blue-500/90">
            <RefreshCcw size={16} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size={"sm"}
            variant={selectMode ? "destructive" : "outline"}
            onClick={() => {
              setSelectMode(!selectMode);
            }}
            className="rounded-lg border px-2"
          >
            Select
          </Button>
          {selected.length === 1 && (
            <EditResponseDialog
              init={selected[0]}
              onSubmitUpdate={(id, trigger, msg) => {
                handleSubmitUpdate(id, trigger, msg).catch(() => {});
              }}
            />
          )}
          {(selectMode || selected.length > 0) && (
            <>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={handleSelectAll}
                className="rounded-lg px-2"
              >
                {selected.length === list.length ? "Unselect" : "Select"} All
              </Button>
            </>
          )}
          {selected.length === 1 && (
            <DeleteDialog
              selected={selected}
              onDelete={() => {
                handleDelete().catch(() => {});
              }}
            />
          )}
        </div>
        <Label className="text-xs text-gray-500">
          Select item(s) to perform action
        </Label>
      </div>

      <div className="flex flex-wrap gap-4">
        {list.map((autores) => (
          <div
            key={autores.id}
            className={cn(
              "transition-color w-fit cursor-pointer rounded-[12px] border border-blue-500 px-2 py-1 text-sm text-blue-500 duration-500 hover:bg-blue-500 hover:text-white",
              selected.includes(autores)
                ? "bg-blue-500 text-white hover:bg-blue-500/60"
                : "",
            )}
            onClick={() => {
              handleSelectAutoRes(autores);
            }}
          >
            {autores.trigger}
          </div>
        ))}
      </div>
      {selected.length === 1 && selected[0] && (
        <div>
          <MessagePreview
            type={selected[0].response.type ?? "Message"}
            message={selected[0].response}
          />
        </div>
      )}
    </div>
  );
};

export default AutoResList;
