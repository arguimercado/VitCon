import { useToast } from "@/components/ui/use-toast";
import { MeetingDetail } from "@/lib/models/meeting-detail";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useCreateMeeting = (values: MeetingDetail) => {
    
   const client = useStreamVideoClient();
   const { user } = useUser();
   const { toast } = useToast();
   const router = useRouter();
   const [callDetails, setCallDetails] = useState<Call>();

   const createMeeting = async () => {

      if (!client || !user) return;

      try {

         if (!values.dateTime) {
            toast({ title: "Please select date and time" });
            return;
         }
         const id = crypto.randomUUID();
         const call = client.call("default", id);

         if (!call) throw new Error("Failed to create call");

         await call.getOrCreate({
            ring: true,
            data: {
               starts_at:
                  values.dateTime.toISOString() ||
                  new Date(Date.now()).toISOString(),
               custom: {
                  description: values.description || "Instant meeting",
               },
            },
         });

         setCallDetails(call);

         if (!values.description) {
            router.push(`/meeting/${call.id}`);
         }
         toast({ title: "Meeting Created" });
      } catch (error) {
         console.log(error);
         toast({
            title: "Failed to create meeting",
         });
      }
   };

   const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

   return { client, router, toast, callDetails, createMeeting,meetingLink };
};