import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { GlassCard } from "@/components/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  MapPin,
  Users,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  anonymous_name: string;
  anonymous_icon: string;
  content: string;
  created_at: string;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  radius_km: number;
  is_active: boolean;
}

const ANONYMOUS_NAMES = [
  "Anonymous Fox", "Mysterious Owl", "Silent Wolf", "Hidden Bear", 
  "Secret Panda", "Quiet Tiger", "Stealth Cat", "Shadow Hawk",
  "Ghost Rabbit", "Whisper Deer", "Phantom Koala", "Ninja Penguin"
];

const ANONYMOUS_ICONS = ["🦊", "🦉", "🐺", "🐻", "🐼", "🐯", "🐱", "🦅", "🐰", "🦌", "🐨", "🐧"];

const getRandomIdentity = () => {
  const index = Math.floor(Math.random() * ANONYMOUS_NAMES.length);
  return {
    name: ANONYMOUS_NAMES[index],
    icon: ANONYMOUS_ICONS[index],
  };
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Chat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<"checking" | "allowed" | "denied" | "too-far">("checking");
  const [identity] = useState(getRandomIdentity);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (groupId) {
      checkLocationAndLoadGroup();
    }
  }, [groupId]);

  useEffect(() => {
    if (locationStatus !== "allowed" || !groupId) return;

    // Subscribe to real-time messages
    const channel = supabase
      .channel(`messages:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, locationStatus]);

  const checkLocationAndLoadGroup = async () => {
    // First, fetch the group
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (groupError || !groupData) {
      toast({
        title: "Group not found",
        description: "This group doesn't exist or has been deleted.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (!groupData.is_active) {
      toast({
        title: "Group closed",
        description: "This group is no longer active.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setGroup(groupData);

    // Check location
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          groupData.latitude,
          groupData.longitude
        );

        if (distance <= groupData.radius_km) {
          setLocationStatus("allowed");
          // Fetch existing messages
          const { data: messagesData } = await supabase
            .from("messages")
            .select("*")
            .eq("group_id", groupId)
            .order("created_at", { ascending: true });
          
          setMessages(messagesData || []);
        } else {
          setLocationStatus("too-far");
        }
        setLoading(false);
      },
      () => {
        setLocationStatus("denied");
        setLoading(false);
      }
    );
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      group_id: groupId,
      anonymous_name: identity.name,
      anonymous_icon: identity.icon,
      content: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FloatingOrbs />
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking your location...</p>
        </div>
      </div>
    );
  }

  if (locationStatus === "denied" || locationStatus === "too-far") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <FloatingOrbs />
        <div className="gradient-mesh fixed inset-0 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full relative z-10"
        >
          <GlassCard className="text-center py-12" hover={false}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-20 h-20 mx-auto mb-6 text-destructive" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-4">
              {locationStatus === "denied" ? "Location Required" : "Too Far Away"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {locationStatus === "denied"
                ? "Please enable location access to join this group chat."
                : `You must be within ${group?.radius_km || 5} km of the group location to join.`}
            </p>
            <Link to="/">
              <Button variant="glass-primary">
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FloatingOrbs />
      <div className="gradient-mesh fixed inset-0 pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 p-4"
      >
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(192 60% 45%) 0%, hsl(265 45% 52%) 100%)",
                }}
              >
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">{group?.name}</h1>
                <p className="text-xs text-muted-foreground">5 km radius • Anonymous chat</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground glass-subtle rounded-lg px-3 py-1.5">
              <span className="text-lg">{identity.icon}</span>
              <span className="hidden sm:inline">{identity.name}</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <main className="flex-1 relative z-10 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isMe = message.anonymous_name === identity.name && message.anonymous_icon === identity.icon;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${isMe ? "justify-end" : ""}`}
                  >
                    {!isMe && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ background: "hsl(192 60% 45% / 0.15)" }}
                      >
                        {message.anonymous_icon}
                      </div>
                    )}
                    <div className={`max-w-xs sm:max-w-md ${isMe ? "order-first" : ""}`}>
                      {!isMe && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {message.anonymous_name}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? "rounded-tr-none"
                            : "glass-subtle rounded-tl-none"
                        }`}
                        style={isMe ? { background: "hsl(192 60% 45% / 0.15)" } : undefined}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 opacity-60">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {isMe && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ background: "hsl(265 45% 52% / 0.15)" }}
                      >
                        {message.anonymous_icon}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 p-4"
      >
        <div className="max-w-3xl mx-auto">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              maxLength={500}
            />
            <Button
              type="submit"
              variant="neon"
              size="icon"
              className="shrink-0 w-12 h-12"
              disabled={sending || !newMessage.trim()}
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </motion.footer>
    </div>
  );
};

export default Chat;
