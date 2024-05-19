import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

export const CollapsibleFields: React.FC<{
  label: React.ReactNode;
  defaultOpen?: boolean;

  children: React.ReactNode;
}> = ({ label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <div className="mt-2 flex cursor-pointer items-center gap-2 transition-colors hover:text-foreground/50">
            <span className="sr-only">Toggle</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <h4 className="text-sm font-semibold">{label}</h4>
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};
