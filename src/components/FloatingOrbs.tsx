import { motion } from "framer-motion";

export const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main cyan orb - soft, muted glow */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(192 60% 45% / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Purple orb - subtle highlight */}
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(265 45% 52% / 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Blue accent orb */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, hsl(210 65% 50% / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Small accent orb - ambient */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full blur-[60px]"
        style={{
          background: "radial-gradient(circle, hsl(192 55% 48% / 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Bottom corner glow */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          background: "radial-gradient(circle, hsl(240 50% 45% / 0.06) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};
