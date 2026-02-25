import { useEffect, useState } from "react";
import { MessageSquare, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Poruke = () => {
  const { session } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  // Fetch conversations
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const convos = data ?? [];
        setConversations(convos);
        if (convos.length > 0 && !selectedConvoId) setSelectedConvoId(convos[0].id);
        setLoading(false);
      });
  }, [userId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConvoId) return;
    supabase
      .from("poruke")
      .select("*")
      .eq("conversation_id", selectedConvoId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));
  }, [selectedConvoId]);

  // Realtime subscription
  useEffect(() => {
    if (!selectedConvoId) return;
    const channel = supabase
      .channel(`poruke-${selectedConvoId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "poruke",
        filter: `conversation_id=eq.${selectedConvoId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as any]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedConvoId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConvoId || !userId) return;
    const userName = session?.user?.user_metadata?.full_name ?? session?.user?.email ?? "";
    await supabase.from("poruke").insert({
      conversation_id: selectedConvoId,
      sender_id: userId,
      sender_name: userName,
      text: newMessage.trim(),
    });
    setNewMessage("");
  };

  const formatTime = (d: string) => {
    try {
      const date = new Date(d);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch { return ""; }
  };

  if (loading) return <div className="px-6 lg:px-8 py-8"><p className="text-muted-foreground">Učitavanje...</p></div>;

  return (
    <div className="px-6 lg:px-8 py-8 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">Poruke</h2>
        <p className="text-sm text-muted-foreground">Komunicirajte s vašim timom</p>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">Nemate još razgovora.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden grid grid-cols-1 md:grid-cols-[300px_1fr] h-[500px]">
          {/* Conversation list */}
          <div className="border-r border-border/50 overflow-y-auto">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConvoId(convo.id)}
                className={cn(
                  "w-full text-left p-4 border-b border-border/30 transition-colors",
                  selectedConvoId === convo.id ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{convo.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">Nema poruka u ovom razgovoru.</p>
              )}
              {messages.map((msg) => {
                const isOwn = msg.sender_id === userId;
                return (
                  <div key={msg.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    )}>
                      {!isOwn && <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender_name}</p>}
                      <p className="text-sm">{msg.text}</p>
                      <p className={cn("text-[10px] mt-1", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border/50 p-4 flex items-center gap-3">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Napišite poruku..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="rounded-xl"
              />
              <Button size="icon" className="shrink-0 rounded-xl" onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Poruke;
