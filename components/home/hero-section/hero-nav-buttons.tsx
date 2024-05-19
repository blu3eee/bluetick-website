"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { useRouter } from "next/navigation";
import { LoginButton } from "../../bluetick/auth-buttons";
import AnimatedButton from "../../motions/animated-button";

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
      variant={"blue"}
      onClick={() => {
        router.push("/servers");
      }}
    >
      Add bot
    </AnimatedButton>
  );
};
