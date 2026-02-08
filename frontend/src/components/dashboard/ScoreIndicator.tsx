"use client";

import { motion } from "framer-motion";

interface ScoreIndicatorProps {
  score: number;
  category: string;
}

export function ScoreIndicator({ score, category }: ScoreIndicatorProps) {
  // Map category to colors
  const getColor = (cat: string) => {
    switch (cat) {
      case "A": return "text-emerald-500 stroke-emerald-500";
      case "B": return "text-lime-500 stroke-lime-500";
      case "C": return "text-amber-500 stroke-amber-500";
      case "D": return "text-orange-500 stroke-orange-500";
      case "E": return "text-red-500 stroke-red-500";
      default: return "text-red-900 stroke-red-900";
    }
  };

  const colorClasses = getColor(category);
  const percentage = score / 1000;
  const circumference = 2 * Math.PI * 45; // radius = 45

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/30 p-8 backdrop-blur-sm">
      <div className="relative h-48 w-48">
        {/* Background Circle */}
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress Circle */}
          <motion.circle
            className={colorClasses}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - percentage) }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        
        {/* Inner Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold tracking-tighter"
          >
            {score}
          </motion.span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
            className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-white ${colorClasses.replace('text-', 'bg-').split(' ')[0]}`}
          >
            {category}
          </motion.div>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-muted uppercase tracking-[0.2em]">Cyber Risk Score</p>
    </div>
  );
}
