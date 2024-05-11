import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";

export const useCreateMeeting = () => {
    
   const client = useStreamVideoClient();
   const { user } = useUser();
   const [callDetails, setCallDetails] = useState<Call>();
   

   const createMeeting = async (dateTime: Date, id: string,description?: string) => {

      if (!client || !user) throw new Error("client or user is not defined");
      
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      await call.getOrCreate({
         ring: true,
         data: {
            starts_at:
               dateTime.toISOString() ||
               new Date(Date.now()).toISOString(),
            custom: {
               description,
            },
         },
      });

      setCallDetails(call);

      return call.id;
      
   };

   const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

   return { client, callDetails, createMeeting,meetingLink,user };
};