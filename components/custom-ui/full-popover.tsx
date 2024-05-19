"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

const FullScreenPopover: React.FC<Props> = ({
  children,
  isOpen,
  className,
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay the active state to apply the CSS class after the element is rendered
      requestAnimationFrame(() => {
        setActive(true);
      });
    } else {
      requestAnimationFrame(() => {
        setActive(false);
      });
    }
  }, [isOpen]);

  const rootElement = document.getElementById("root-body");
  if (!rootElement || !isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-secondary transition-opacity duration-300 ease-in-out",
        active ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>,
    rootElement,
  );
};

export default FullScreenPopover;
