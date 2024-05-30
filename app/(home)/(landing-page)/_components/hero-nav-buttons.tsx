"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { useRouter } from "next/navigation";
import { LoginButton } from "../../../../components/bluetick/auth-buttons";
import AnimatedButton from "../../../../components/motions/animated-button";

const NavButtons = (): JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return (
      <>
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </>
    );
  }
  return (
    <>
      {session ? (
        <AnimatedButton
          variant={"red"}
          onClick={() => {
            router.push("/servers");
          }}
        >
          Manage server
        </AnimatedButton>
      ) : (
        <LoginButton animated={true} />
      )}
      <AddBotButton />
    </>
  );
};

const HeroNavButtons = (): JSX.Element => {
  return (
    <div className="flex justify-end gap-2 md:justify-center">
      <NavButtons />
    </div>
  );
};

export default HeroNavButtons;

const AddBotButton = (): JSX.Element => {
  const router = useRouter();
  return (
    <AnimatedButton
      variant={"secondary"}
      onClick={() => {
        router.push("/servers");
      }}
    >
      Add bot
    </AnimatedButton>
  );
};
