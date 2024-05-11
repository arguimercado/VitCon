"use client";
import { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { useCreateMeeting } from "@/lib/hooks/useCreateMeeting";
import { MeetingDetail } from "@/lib/models/meeting-detail";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

interface HomeCardItemProps {
   imgSource: string;
   title: string;
   description: string;
   meetingState:
      | "isScheduleMeeting"
      | "isJoiningMeeting"
      | "isInstantMeeting"
      | undefined;
   color: string;
}

const homeCardItems: HomeCardItemProps[] = [
   {
      imgSource: "/icons/add-meeting.svg",
      title: "New Meeting",
      description: "Start an instant meetin",
      meetingState: "isInstantMeeting",
      color: "bg-orange-1",
   },
   {
      imgSource: "/icons/schedule.svg",
      title: "Schedule Meeting",
      description: "Plan your Meeting",
      meetingState: "isScheduleMeeting",
      color: "bg-blue-1",
   },

   {
      imgSource: "/icons/recordings.svg",
      title: "View Recordings",
      description: "Checkout your recordings",
      meetingState: undefined,
      color: "bg-purple-1",
   },

   {
      imgSource: "/icons/join-meeting.svg",
      title: "Join Meeting",
      description: "Via invitation",
      meetingState: "isJoiningMeeting",
      color: "bg-yellow-1",
   },
];

const ScheduleMeetingForm = ({setValues,values} :
   {
      values: MeetingDetail,
      setValues: (value: MeetingDetail) => void
   }
) => {


   return (
      <>
         <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
               Add a Description
            </label>
            <Textarea
               className="bg-dark-3 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
               onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
               }
            />
         </div>
         <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
               Select Date and Time
            </label>
            <ReactDatePicker
               selected={values.dateTime}
               onChange={(date) => setValues({ ...values, dateTime: date! })}
               showTimeSelect={true}
               timeFormat="HH:mm"
               timeIntervals={15}
               timeCaption="Time"
               dateFormat="MMMM d, yyyy h:mm aa"
               className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
         </div>
      </>
   );
};

const MeetingTypeList = () => {

   const [meetingState, setMeetingState] = useState<
      "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
   >();

   const [values, setValues] = useState<MeetingDetail>({
      dateTime: new Date(),
      description: "",
      link: "",
   });

   const {toast} = useToast();
   const router = useRouter();
   const {callDetails, createMeeting, meetingLink } = useCreateMeeting();

   const handleCreateMeeting = async () => {
      try {
         const id =  crypto.randomUUID();
         if (!values.dateTime) {
            toast({ title: "Please select date and time" });
            return;
         }
         const description = values.description || "Instant meeting";
         const callId = await createMeeting(values.dateTime,id,description);
         console.log(callId);

         if (!values.description) {
            router.push(`/meeting/${callId}`);
         }
         toast({ title: "Meeting Created" });
      }catch(error) {
         console.log(error);
         toast({title: "Failed to create meeting",});
      }
   }

   return (
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
         {homeCardItems.map((item, index) => (
            <HomeCard
               key={index}
               img={item.imgSource}
               title={item.title}
               description={item.description}
               onClick={() => {
                  if (item.meetingState !== undefined)
                     setMeetingState(item.meetingState);
                  else router.push("/recordings");
               }}
               className={item.color}
            />
         ))}

         <MeetingModal
            isOpen={meetingState === "isInstantMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Start an instant Meeting"
            className="text-center"
            onClick={handleCreateMeeting}
         />

         <MeetingModal
            isOpen={meetingState === "isJoiningMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Type the Link here"
            className="text-center"
            onClick={() => router.push(values.link)}
         >
            <Input
               placeholder="Meeting Link" 
               className="border-none w-full bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" 
               onChange={(e) => setValues({...values,link: e.target.value})} />
         </MeetingModal>

         {!callDetails ? (
            <MeetingModal
               isOpen={meetingState === "isScheduleMeeting"}
               onClose={() => setMeetingState(undefined)}
               title="Create Meeting"
               buttonText="Schedule Meeting"
               onClick={handleCreateMeeting}
            >
               <ScheduleMeetingForm values={values} setValues={setValues} />
            </MeetingModal>
         ) : (
            <MeetingModal
               isOpen={meetingState === "isScheduleMeeting"}
               onClose={() => setMeetingState(undefined)}
               title="Start Meeting"
               className="text-center"
               onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  toast({ title: "Link copied" });
               }}
               image="/icons/checked.svg"
               buttonIcon="/icons/copy.svg"
               buttonText="Copy Meeting Link"
            />
         )}
      </section>
   );
};

export default MeetingTypeList;
