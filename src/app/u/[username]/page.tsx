"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const param = useParams<{ username: string }>();
  const username = param.username;

  const { data: session } = useSession();

  const router = useRouter();

  const [messages, setMessages] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages && messages.length > 0) setIsLoading(true);
    else setIsLoading(false);
  }, [messages]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: messages,
      });
      console.log(response);
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      setMessages("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleNewAccount = async () => {
    try {
      if(session) await signOut();
      // router.replace("/sign-up");
      
      toast({
        title: "Redirected to sign-up page!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to redirect to sign-up page",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded container flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10">Public Profile Link</h1>
      <div className="grid gap-4 md:w-3/5 font-lg w-full mx-10 transition-all duration-300 ">
        <Label htmlFor="message">Send Anonymous Message to @{username}</Label>
        <Textarea
          placeholder="Write your anonymous message here"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          id="message"
        />
      </div>
      <Button
        disabled={!isLoading}
        onClick={handleSendMessage}
        className="my-4"
      >
        Send it
      </Button>

      <hr className="border rounded w-full my-6 mx-10" />
      <div className="flex flex-col items-center">
        <span className="text-lg">Get Your Message Board</span>
        <Link href="/">
          <Button className="my-4" onClick={handleNewAccount}>
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
