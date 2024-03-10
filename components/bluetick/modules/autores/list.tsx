'use client';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import { useFetchGuildAutoRes } from '@/hooks/api/autores/list';
import type {
  AutoResponseDetails,
  CreateAutoResponseDto,
} from '@/types/bluetick/db/autores';
import React, { useState } from 'react';
import MessagePreview from '../../ui/message-preview';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RefreshCcw } from 'lucide-react';
import { AddResponseDialog } from './add-dialog';
import type { MessageInfoDetails } from '@/types/bluetick';
import DeleteDialog from './delete-dialog';

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
    response: MessageInfoDetails
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
        dto
      );
      await refetch();
    } catch (e) {
      console.error('Error adding new autores:', e);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await refetch();
    } catch (e) {
      console.error('Error deleting autores objects:', e);
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
          <div className="p-2 hover:text-blue-500 focus:text-blue-500/90 cursor-pointer">
            <RefreshCcw size={16} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size={'sm'}
            variant={selectMode ? 'destructive' : 'outline'}
            onClick={() => {
              setSelectMode(!selectMode);
            }}
            className="px-2 rounded-lg border"
          >
            Select
          </Button>
          {(selectMode || selected.length > 0) && (
            <>
              <Button
                size={'sm'}
                variant={'outline'}
                onClick={handleSelectAll}
                className="px-2 rounded-lg"
              >
                {selected.length === list.length ? 'Unselect' : 'Select'} All
              </Button>
            </>
          )}
          {selected.length > 0 && (
            <DeleteDialog
              selected={selected}
              onDelete={() => {
                handleDelete().catch(() => {});
              }}
            />
          )}
        </div>
        <Label className="text-gray-500 text-xs">
          Select item(s) to perform action
        </Label>
      </div>

      <div className="flex flex-wrap gap-4">
        {list.map((autores) => (
          <div
            key={autores.id}
            className={cn(
              'rounded-[12px] text-sm border w-fit px-2 py-1 text-blue-500 border-blue-500 cursor-pointer transition-color duration-500 hover:text-white hover:bg-blue-500',
              selected.includes(autores)
                ? 'bg-blue-500 text-white hover:bg-blue-500/60'
                : ''
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
            type={selected[0].response.type ?? 'Message'}
            message={selected[0].response}
          />
        </div>
      )}
    </div>
  );
};

export default AutoResList;
