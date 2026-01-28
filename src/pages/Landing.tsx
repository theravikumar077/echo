import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { GlassCard } from "@/components/GlassCard";
import { MapPin, MessageCircle, Shield, Zap, Users, Globe } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Connect with people within 5km of your location",
    },
    {
      icon: Shield,
      title: "Anonymous & Private",
      description: "No data stored, no identity revealed",
    },
    {
      icon: Zap,
      title: "Real-Time",
      description: "Instant messaging with live updates",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <FloatingOrbs />
      <div className="gradient-mesh fixed inset-0 pointer-events-none" />
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Anonymous group chats nearby</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Chat with</span>
              <br />
              <span className="text-gradient-cyan text-glow-cyan">Anyone Nearby</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Create location-based group chats. Share a link. Anyone within 5km can join anonymously. 
              No sign-up required for anonymous users.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Users className="w-5 h-5" />
                  Create a Group
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5" />
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-md">
              <GlassCard className="p-0 overflow-hidden" hover={false}>
                <div className="p-4 border-b border-border/30 flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ background: "linear-gradient(135deg, hsl(192 60% 45%) 0%, hsl(265 45% 52%) 100%)" }}
                  />
                  <div>
                    <p className="text-sm font-medium">Downtown Coffee Chat</p>
                    <p className="text-xs text-muted-foreground">12 nearby users</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{ background: "hsl(192 60% 45% / 0.15)" }}
                    >
                      🦊
                    </div>
                    <div className="glass-subtle rounded-xl rounded-tl-none px-4 py-2 max-w-xs">
                      <p className="text-sm">Hey! Anyone at the coffee shop?</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex gap-3 justify-end"
                  >
                    <div 
                      className="rounded-xl rounded-tr-none px-4 py-2 max-w-xs"
                      style={{ background: "hsl(192 60% 45% / 0.15)" }}
                    >
                      <p className="text-sm">Yes! Third table from the window 👋</p>
                    </div>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{ background: "hsl(265 45% 52% / 0.15)" }}
                    >
                      🐱
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex gap-3"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{ background: "hsl(210 65% 50% / 0.2)" }}
                    >
                      🐸
                    </div>
                    <div className="glass-subtle rounded-xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">Joining in 5 mins!</p>
                    </div>
                  </motion.div>
                </div>
              </GlassCard>

              {/* Decorative elements - muted glows */}
              <div 
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl"
                style={{ background: "hsl(192 60% 45% / 0.12)" }}
              />
              <div 
                className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full blur-2xl"
                style={{ background: "hsl(265 45% 52% / 0.1)" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-gradient-cyan">NearbyChat</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for privacy, designed for connection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={feature.title} delay={index * 0.1} glow="cyan">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "hsl(192 60% 45% / 0.12)" }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <GlassCard className="py-12 px-8" hover={false} glow="cyan">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Globe className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your first location-based group and start chatting with people nearby.
              </p>
              <Link to="/signup">
                <Button variant="hero" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border/30">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 NearbyChat. Privacy-first anonymous chat.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
