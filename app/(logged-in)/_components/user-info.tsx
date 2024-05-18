"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserAvatarURL } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  className?: string;
}
const UserInfoHeader: React.FC<Props> = ({ className }): React.ReactNode => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex w-fit items-center gap-3">
        <Skeleton className="w-[30px] h-[30px] rounded-full bg-secondary-foreground/10" />
        <Skeleton className="h-[30px] w-[100px] rounded-sm bg-secondary-foreground/10" />
      </div>
    );
  }
  return (
    <Link className="flex gap-2 items-center" href={"/servers"}>
      <Image
        src={getUserAvatarURL(session.user)}
        height={30}
        width={30}
        className="object-cover aspect-square rounded-full"
        alt="user avt"
        priority
      />
      <span className={cn("text-sm font-semibold hidden md:block", className)}>
        {session.user.username}
      </span>
    </Link>
  );
};

export default UserInfoHeader;
