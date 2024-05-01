"use client";

import * as React from "react";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

/**
 * Renders a collection of toast notifications.
 *
 * This component subscribes to the toast state via the `useToast` hook and renders each toast
 * using the `Toast` component from the UI library. It encapsulates each toast's title and
 * description within a `ToastTitle` and `ToastDescription` component respectively, and
 * provides a close button through the `ToastClose` component.
 *
 * All toasts are wrapped within a `ToastProvider` for context provision and a `ToastViewport`
 * to define the area where toasts are displayed. This setup ensures that toast notifications
 * are properly managed and displayed across the application.
 * @returns {JSX.Element} The `Toaster` component that renders active toast notifications.
 */
export function Toaster(): JSX.Element {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
