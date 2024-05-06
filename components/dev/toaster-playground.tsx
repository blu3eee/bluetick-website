"use client";
import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { poppinsFont } from "@/styles/fonts";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const toastTypes = ["default", "success", "info", "warning", "error"] as const;

// Derive the union type from the array
type ToastTypes = (typeof toastTypes)[number];

const ToasterPlayground = (): JSX.Element => {
  const toastContent = {
    title: "Event has been created",
    content: {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => {
          console.log("Undo");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          console.log("Cancel!");
        },
      },
    },
  };

  const [toastType, setToastType] = React.useState<ToastTypes>("error");

  const myPromiseFn = async (time?: number): Promise<{ name: string }> => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: "Custom loader" });
      }, time ?? 3000);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={cn("text-lg font-semibold", poppinsFont.className)}>
        Toast Playground
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground/80 font-medium">
            toast type
          </Label>
          <Select
            defaultValue={toastType}
            onValueChange={(value) => {
              setToastType(value as ToastTypes);
            }}
          >
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue placeholder="toaster type" />
            </SelectTrigger>
            <SelectContent>
              {toastTypes.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={toastType}
            onClick={() => {
              if (toastType === "default") {
                toast(toastContent.title, toastContent.content);
              } else {
                toast[toastType](toastContent.title, toastContent.content);
              }
            }}
            className="w-fit"
          >
            Toast!
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground/80 font-medium">
            toast loading
          </Label>

          <Button
            variant={"secondary"}
            onClick={() => {
              toast.promise(myPromiseFn, {
                loading: "Loading promise...",
                success: (data) => {
                  return `${data.name} toast has been added`;
                },
                error: "Error",
              });
            }}
            className="w-fit gap-2"
          >
            <Loader2 className="animate-spin" />
            Toast with loading!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToasterPlayground;
