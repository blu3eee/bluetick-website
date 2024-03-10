import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import React from 'react';

interface NamingSchemeProps {
  initScheme?: string;
  onNamingChange: (newValue: string) => void;
}

export const NamingScheme: React.FC<NamingSchemeProps> = ({
  onNamingChange,
  initScheme,
}) => {
  const [defaultNaming, setDefaultNaming] = React.useState(
    !initScheme || initScheme === 'ticket-{id}'
  );
  const [naming, setNaming] = React.useState(initScheme ?? 'ticket-{id}');

  const handleDefaultSwitch = (): void => {
    if (!defaultNaming) {
      setNaming('ticket-{id}');
    }
    setDefaultNaming(!defaultNaming);
  };

  const [showHelper, setShowHelper] = React.useState(false);

  React.useEffect(() => {
    onNamingChange(naming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naming]);

  return (
    <div className="flex items-center gap-4">
      <Switch checked={defaultNaming} onClick={handleDefaultSwitch} />
      {defaultNaming ? (
        <div className="flex flex-col text-sm">
          <span className="text-gray-500">Use default</span>
          <span className="font-semibold">{'ticker-{id}'}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            placeholder="ticker-{id}"
            value={naming}
            onChange={(e) => {
              setNaming(e.target.value);
            }}
            className="w-fit"
          />
          <Popover open={showHelper} onOpenChange={setShowHelper}>
            <PopoverTrigger asChild>
              <Info
                onMouseEnter={() => {
                  setShowHelper(true);
                }}
                onMouseLeave={() =>
                  setTimeout(() => {
                    setShowHelper(false);
                  }, 500)
                }
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col">
                <span className="uppercase font-bold">Naming helper</span>
                <div>
                  <span className="text-red-400">{'{id}'}</span> - Ticker ID
                </div>
                <div>
                  <span className="text-red-400">{'{username}'}</span> - Ticker
                  opener&apos;s username
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};
