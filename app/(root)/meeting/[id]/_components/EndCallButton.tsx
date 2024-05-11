import { Button } from "@/components/ui/button";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

const EndCallButton = () => {
	const call = useCall();
	const router = useRouter();

	const {useLocalParticipant} = useCallStateHooks();
	const localParticipant = useLocalParticipant();

	const isMeetingOwner = localParticipant && call?.state.createdBy 
									&& localParticipant.userId === call?.state.createdBy.id;

	if(!isMeetingOwner) return null;


   return (
		<Button variant={"destructive"} onClick={async () => {
			await call.endCall();
			router.push("/")
		}}>
			End call for everyone
		</Button>
	)
};

export default EndCallButton;
