"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package2, CalendarDays, CalendarPlus } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

const SideNavbar = () => {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  !pathname?.includes("new-event")
                    ? ""
                    : "text-muted-foreground"
                }`}
              >
                <CalendarDays className="h-5 w-5" />
                <span className="sr-only">Events</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Events</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/new-event"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  !pathname?.includes("new-event")
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                <CalendarPlus className="h-5 w-5" />
                <span className="sr-only">New Event</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">New Event</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default SideNavbar;
