"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { BluetickProvider } from "@/context/bluetick-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(
    () => {
      if (status === "loading" || !session) {
        return;
      }
      if (!session.developerMode) {
        router.push("/");
        toast.info(`Invalid page request`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, status],
  );

  if (status === "loading" || !session) {
    return <Skeleton className="w-full h-36" />;
  }
  return (
    <BluetickProvider>
      <div className="p-4">{children}</div>
    </BluetickProvider>
  );
};

export default Layout;
