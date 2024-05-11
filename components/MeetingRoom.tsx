"use client"

import { cn } from "@/lib/utils";
import {
   CallControls,
   CallParticipantsList,
   CallStatsButton,
   CallingState,
   PaginatedGridLayout,
   SpeakerLayout,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Loader, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import EndCallButton from "@/app/(root)/meeting/[id]/_components/EndCallButton";
import LoaderComponent from "./LoaderComponent";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const useCallLayout = () => {
   const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
	const layoutOptions = ["Grid", "Speaker-Left", "Speaker-Right"];

   const CallLayout = () => {
      switch (layout) {
         case "grid":
            return <PaginatedGridLayout />;
         case "speaker-right":
            return <SpeakerLayout participantsBarPosition="left" />;
         default:
            return <SpeakerLayout participantsBarPosition="right" />;
      }
   };

	const handleSelectLayout = (item: any) => setLayout(item as CallLayoutType); 

   return { CallLayout, setLayout,layoutOptions,handleSelectLayout };
};

const MeetingRoom = () => {
	
	
	const { CallLayout, setLayout,layoutOptions,handleSelectLayout } = useCallLayout();
   const [showParticipants, setShowParticipants] = useState(false);
	
	
	const searchParams = useSearchParams();
	const isPersonalRoom = !!searchParams.get('personal');

	const {useCallCallingState} = useCallStateHooks();
	const callingState = useCallCallingState();

	if(callingState !== CallingState.JOINED) return <LoaderComponent />

   return (
      <section className="relative h-screen w-full  overflow-hidden pt-4 text-white">
         <div className="relative flex size-full items-center justify-center">
            <div className="flex size-full max-w-[1000px] items-center">
               <CallLayout />
            </div>
            <div
               className={cn("h-[calc(100vh-86px)] hidden ml-2", {
                  "show-block": showParticipants,
               })}
            >
               <CallParticipantsList
                  onClose={() => setShowParticipants(false)}
               />
            </div>
         </div>
         <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
            <CallControls />
            <DropdownMenu>
               <div className="flex items-center">
                  <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                     <LayoutList size={20} className="text-white" />
                  </DropdownMenuTrigger>
               </div>
               <DropdownMenuContent className="boder-dark-1 text-white">
                  {layoutOptions.map(
                     (item, index) => (
                        <div key={index}>
                           <DropdownMenuItem
                              className="cursor-pointer hover:bg-[#4c535b]"
                              onClick={() => handleSelectLayout(item.toLowerCase())}>
                              {item}
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="border-dark-1" />
                        </div>
                     )
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
            <CallStatsButton />
            <Button
               variant="ghost"
               onClick={() => setShowParticipants((prev) => !prev)}
            >
               <div className="cursor-pointer rounded-2xl   bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                  <Users size={20} className="text-white" />
               </div>
            </Button>
				{!isPersonalRoom && <EndCallButton />}
         </div>
      </section>
   );
};

export default MeetingRoom;
