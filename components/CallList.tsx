//@ts-nocheck

"use client";
import { useGetCalls } from "@/lib/hooks/useGetCalls";
import { CallRecording, useCall, Call } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import LoaderComponent from "./LoaderComponent";
import { useToast } from "./ui/use-toast";


export type CallType = "ended" | "upcoming" | "recordings";

interface IProps {
   type: CallType;
}

const useCallListFunction = (type: CallType) => {

   const { endedCalls, upcomingCalls, isLoading,callRecording } = useGetCalls();
   const [recordings, setRecordings] = useState<CallRecording[]>([]);

   const {toast} = useToast();

   const buttonIcon1Text =
      type === "recordings" ? "/icons/play.svg" : undefined;
   const buttonText = type === "recordings" ? "Play" : "Start";
   const icon =
      type === "ended"
         ? "/icons/previous.svg"
         : type === "upcoming"
         ? "/icons/upcoming.svg"
         : "/icons/recordings.svg";

   const getCalls = () => {
      switch (type) {
         case "ended":
            return endedCalls;
         case "upcoming":
            return upcomingCalls;
         case "recordings":
            return recordings;
         default:
            return [];
      }
   };

   const getNoCallsMessage = () => {
      switch (type) {
         case "ended":
            return "No Previous Calls";
         case "upcoming":
            return "No Upcoming Calls";
         case "recordings":
            return "No Recordings";
         default:
            return "";
      }
   };

   useEffect(() => {
      const fetchRecording = async () => {
         try {
            const callData = await Promise.all(
               callRecording.map((meeting) => meeting.queryRecordings()))
   
            const recordings = callData
                                 .filter(call => call.recordings.length > 0)
                                 .flatMap(call => call.recordings)
   
            setRecordings(recordings);

         }catch(error) {
            toast({title:  'Try again later'})
         }
         
      }
      if(type === "recordings") fetchRecording();
   },[type,callRecording])

   return {
      getNoCallsMessage,
      getCalls,
      isLoading,
      buttonIcon1Text,
      buttonText,
		icon
   };
};

const CallList = ({ type }: IProps) => {
   const router = useRouter();
   const {
      getNoCallsMessage,
      getCalls,
      isLoading,
      buttonIcon1Text,
      buttonText,
		icon
   } = useCallListFunction(type);

   const calls = getCalls();
   const noCallsMessage = getNoCallsMessage();

   if (isLoading) return <LoaderComponent />;

   return (
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
         {calls && calls.length > 0 ? (
            calls.map((meeting: Call | CallRecording) => (
               <MeetingCard
                  key={(meeting as Call)?.id}
                  isPreviousMeeting={type === "ended"}
                  buttonIcon1={buttonIcon1Text}
                  buttonText={buttonText}
                  handleClick={
                     type === "recordings"
                        ? () => router.push(`${meeting.url}`)
                        : () => router.push(`/meeting/${meeting.id}`)
                  }
                  link={
                     type === "recordings"
                        ? meeting.url
                        : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
                  }
                  icon={icon}
                  date={
                     meeting.state?.startsAt.toLocaleString() ||
                     meeting?.start_time.toLocaleString()
                  }
                  title={
                     (meeting as Call).state?.custom.description
                        .substring(0,26) || meeting.filename.substring(0,20) || "No Description"
                  }
               />
            ))
         ) : (
            <h1>{noCallsMessage}</h1>
         )}
      </div>
   );
};

export default CallList;
