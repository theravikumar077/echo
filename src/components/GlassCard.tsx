import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "purple" | "blue" | "none";
  delay?: number;
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  glow = "none",
  delay = 0,
}: GlassCardProps) => {
  const glowClasses = {
    cyan: "glow-cyan-subtle",
    purple: "glow-purple",
    blue: "glow-blue",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { scale: 1.015, y: -3 } : undefined}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:border-foreground/12",
        glowClasses[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
};
