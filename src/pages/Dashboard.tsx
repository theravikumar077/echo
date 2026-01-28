import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  MapPin,
  Users,
  Clock,
  Link2,
  X,
  Loader2,
  MessageCircle,
  Trash2,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("creator_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching groups",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGroups(data || []);
    }
    setLoading(false);
  };

  const createGroup = async () => {
    if (!newGroup.name.trim()) return;
    setCreating(true);

    // Get user's location
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setCreating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const { data, error } = await supabase.from("groups").insert({
          name: newGroup.name.trim(),
          description: newGroup.description.trim() || null,
          creator_id: user?.id,
          latitude,
          longitude,
          radius_km: 5,
        }).select().single();

        if (error) {
          toast({
            title: "Error creating group",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Group created!",
            description: "Share the link with people nearby.",
          });
          setGroups([data, ...groups]);
          setShowCreateModal(false);
          setNewGroup({ name: "", description: "" });
        }
        setCreating(false);
      },
      (error) => {
        toast({
          title: "Location access denied",
          description: "Please enable location to create a group.",
          variant: "destructive",
        });
        setCreating(false);
      }
    );
  };

  const copyLink = (groupId: string) => {
    const link = `${window.location.origin}/chat/${groupId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Share it with people nearby.",
    });
  };

  const deleteGroup = async (groupId: string) => {
    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    if (error) {
      toast({
        title: "Error deleting group",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGroups(groups.filter((g) => g.id !== groupId));
      toast({ title: "Group deleted" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingOrbs />
      <div className="gradient-mesh fixed inset-0 pointer-events-none" />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Your Groups</h1>
              <p className="text-muted-foreground">Manage your location-based chat rooms</p>
            </div>
            <Button variant="neon" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </motion.div>

          {/* Groups Grid */}
          {groups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="text-center py-16" hover={false}>
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first location-based group chat
                </p>
                <Button variant="neon" onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4" />
                  Create Group
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group, index) => (
                <GlassCard key={group.id} delay={index * 0.05} glow="cyan">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, hsl(192 60% 45%) 0%, hsl(265 45% 52%) 100%)" }}
                    >
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          group.is_active ? "bg-green-500" : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {group.is_active ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-1 truncate">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {group.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(group.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="glass-primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/chat/${group.id}`)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Open
                    </Button>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => copyLink(group.id)}
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGroup(group.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard hover={false} glow="cyan" className="relative">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Create Group</h2>
                  <p className="text-muted-foreground text-sm">
                    Your current location will be used as the group center (5km radius)
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Group Name *
                    </label>
                    <Input
                      placeholder="e.g., Coffee Shop Hangout"
                      value={newGroup.name}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Description (optional)
                    </label>
                    <Input
                      placeholder="What's this group about?"
                      value={newGroup.description}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground glass-subtle rounded-lg p-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>5 km radius from your current location</span>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={createGroup}
                    disabled={creating || !newGroup.name.trim()}
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Group
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
