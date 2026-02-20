import { useState } from "react";
import { MessageSquare, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mockConversations = [
  {
    id: 1,
    name: "Ivan – Voditelj projekta",
    lastMessage: "Pločice su stigle, sutra počinjemo s postavljanjem.",
    time: "Danas, 10:30",
    unread: 1,
  },
  {
    id: 2,
    name: "Ana – Dizajnerica interijera",
    lastMessage: "Šaljem vam vizualizaciju za dnevni boravak.",
    time: "Jučer, 16:45",
    unread: 0,
  },
  {
    id: 3,
    name: "Brick podrška",
    lastMessage: "Vaš zahtjev je primljen. Javimo se uskoro!",
    time: "18.02.2026",
    unread: 0,
  },
];

const mockMessages = [
  { id: 1, sender: "Ivan", text: "Pozdrav! Htio sam vas obavijestiti da smo završili demontažu.", time: "09:15", isOwn: false },
  { id: 2, sender: "Vi", text: "Odlično, hvala na informaciji! Kada krećete s pločicama?", time: "09:20", isOwn: true },
  { id: 3, sender: "Ivan", text: "Pločice su stigle, sutra počinjemo s postavljanjem.", time: "10:30", isOwn: false },
];

const Poruke = () => {
  const [selectedConvo, setSelectedConvo] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="px-6 lg:px-8 py-8 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">Poruke</h2>
        <p className="text-sm text-muted-foreground">Komunicirajte s vašim timom</p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden grid grid-cols-1 md:grid-cols-[300px_1fr] h-[500px]">
        {/* Conversation list */}
        <div className="border-r border-border/50 overflow-y-auto">
          {mockConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className={cn(
                "w-full text-left p-4 border-b border-border/30 transition-colors",
                selectedConvo === convo.id ? "bg-secondary" : "hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{convo.name}</p>
                    {convo.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{convo.lastMessage}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{convo.time}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5",
                    msg.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  )}
                >
                  {!msg.isOwn && (
                    <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender}</p>
                  )}
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn(
                    "text-[10px] mt-1",
                    msg.isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Napišite poruku..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-xl"
            />
            <Button size="icon" className="shrink-0 rounded-xl">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poruke;
