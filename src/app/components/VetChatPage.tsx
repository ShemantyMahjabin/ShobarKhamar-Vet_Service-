import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { vets } from "../data/vetService";
import { MobileShell } from "./layout/MobileShell";
import { MobileStatusBar } from "./layout/MobileStatusBar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

function getVetInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function VetChatPage() {
  const navigate = useNavigate();
  const { vetId } = useParams();

  const vet = vets.find((item) => String(item.id) === vetId) ?? vets[0];
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Assalamu alaikum doctor, my animal is not eating well today.",
    "Wa alaikum assalam. Please tell me how long this has been happening.",
  ]);

  function sendChatMessage() {
    const trimmed = chatMessage.trim();
    if (!trimmed) {
      return;
    }

    setChatMessages((current) => [...current, trimmed]);
    setChatMessage("");
  }

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="flex min-h-[844px] flex-col px-6 pb-8 pt-2 text-slate-800">
        <Button
          type="button"
          variant="outline"
          className="mb-8 h-14 w-fit rounded-full border-[#d7e3d6] bg-white px-8 text-[18px] font-semibold text-slate-900"
          onClick={() => navigate(`/booking/${vet.id}`)}
        >
          Back
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Chat with Vet</h1>
        </div>

        <Card className="mt-8 rounded-[32px] border-[#d7e3d6] bg-white shadow-none">
          <CardContent className="flex items-center gap-4 p-5">
            <Avatar className="h-16 w-16 bg-[#e6f1ff]">
              <AvatarFallback className="bg-[#dbeafe] text-2xl font-bold text-[#4a72a8]">
                {getVetInitials(vet.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-[18px] font-extrabold text-slate-900">{vet.name}</h2>
              <p className="text-base font-semibold text-slate-500">
                {vet.specialty} • {vet.location}
              </p>
              <p
                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                  vet.onlineStatus === "online"
                    ? "bg-[#E6F7EF] text-[#1E9E6F]"
                    : "bg-[#F5F7F6] text-[#6B7785]"
                }`}
              >
                {vet.onlineStatus === "online" ? "Online now" : "Offline replies later"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 flex-1 rounded-[28px] border-[#d7e3d6] bg-white shadow-none">
          <CardContent className="flex h-full min-h-[420px] flex-col p-5">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message}-${index}`}
                  className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm font-medium ${
                    index % 2 === 0
                      ? "bg-[#e6f7ef] text-slate-900"
                      : "ml-auto bg-[#f4f8f7] text-slate-700"
                  }`}
                >
                  {message}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end gap-3">
              <textarea
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                placeholder="Type your message"
                className="min-h-[96px] flex-1 rounded-[22px] border border-[#d7e3d6] bg-[#f8fcfa] px-4 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={sendChatMessage}
                className="rounded-[20px] bg-[#56a774] px-5 py-3 text-sm font-extrabold text-white"
              >
                Send
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileShell>
  );
}
