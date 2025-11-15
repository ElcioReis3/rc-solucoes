import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import React from "react";

type HoverItem = {
  item: React.ReactNode;
  children: React.ReactNode;
};

export const HoverCardItem = ({ item, children }: HoverItem) => {
  return (
    <>
      <HoverCard>
        <HoverCardTrigger>{children}</HoverCardTrigger>
        <HoverCardContent className="w-72 h-72 ">{item}</HoverCardContent>
      </HoverCard>
    </>
  );
};
