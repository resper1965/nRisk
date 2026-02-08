"use client";

import { motion } from "framer-motion";
import { Bot, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Insight {
  title: string;
  description: string;
  impact: string;
  remediation: string;
}

interface RoboCISOInsightProps {
  insights: Insight[];
}

export function RoboCISOInsight({ insights }: RoboCISOInsightProps) {
  if (insights.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-sm">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        <div>
          <h3 className="font-semibold text-emerald-500">Postura Excelente</h3>
          <p className="text-sm text-emerald-500/80">O Robo-CISO não detectou vulnerabilidades críticas no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Bot className="h-5 w-5" />
        <h2 className="text-lg font-semibold tracking-tight">Insights do Robo-CISO</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm hover:border-primary/50 transition-colors"
          >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-12 translate-y-[-12px] rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground">{insight.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{insight.description}</p>
                
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-xs font-semibold text-red-500/90 leading-relaxed italic">
                      &quot;{insight.impact}&quot;
                    </p>
                  </div>
                  <div className="flex gap-2 rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/10">
                    <Lightbulb className="h-4 w-4 shrink-0 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Sugestão de Remediação</p>
                      <p className="text-xs text-emerald-400 leading-relaxed mt-1">
                        {insight.remediation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
