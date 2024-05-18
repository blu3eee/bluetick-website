import React from "react";
import BluetickHeader from "@/components/bluetick/header";

/**
 * layout for any route that is no dashboard related
 * @param {React.ReactNode} children children page content
 * @returns {React.ReactNode} return the layout for any route that is not dashboard related
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div>
      <BluetickHeader />
      {children}
    </div>
  );
}
