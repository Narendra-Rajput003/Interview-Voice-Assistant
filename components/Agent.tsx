"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { cn } from '@/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';



interface SavedMessage{
    role:"user" | "system" | "assistant",
    content:string;
}
enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
  }

const Agent = ({
    userName,
    userId,
    interviewId,
    feedbackId,
    type,
    questions
}: AgentProps) => {

    const router = useRouter ();

    const [isSpeaking, setIsSpeaking] = useState(false)
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE)

   async function handleCall(){
            setCallStatus(CallStatus.CONNECTING);

            if(type==="generate"){
                await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
                    variableValues:{
                        username:userName,
                        userid:userId
                    }
                });
            }else{
                let formattedQuestions="";
                if(questions){
                    formattedQuestions = questions.map((question)=>`- ${question}`).join("\n");
                }

                await vapi.start(interviewer,{
                    variableValues:{
                        questions:formattedQuestions,
                    }
                })
            };
    }

    function handleDisconnect(){
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    return (
        <>

            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar relative'>
                        <Image
                            src="/ai-avatar.png"
                            alt="profile-image"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak"/>}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {
                messages.length > 0 && (
                    <div className='transcript-border'>
                        <div className='transcript'>
                        <p 
                        key={lastMessage}
                        className={cn(
                            "transition-opacity duration-500 opacity-0",
                            "animate-fadeIn opacity-100"
                        )}

                        >
                            {lastMessage}
                        </p>
                        </div>
                    </div>
                )

            }

            <div className='w-full flex justify-center'>
            {
                callStatus !=="ACTIVE" ? (
                    <button className='relative btn-call ' onClick={()=>handleCall()}>
                        <span
                        className={cn(
                            "absolute animate-ping rounded-full opacity-75",
                            callStatus !== "CONNECTING" && "hidden"
                        )}
                        />
                        <span className='relative'>
                            {callStatus==="INACTIVE"|| callStatus==="FINISHED" ? "Call":"..."}
                        </span>
                    </button>

                ):(
                    <button className='btn-disconnect' onClick={()=>handleDisconnect()}>
                        End
                    </button>
                )
            }
            </div>

        </>
    )
}

export default Agent
