"use client";

import { motion } from "framer-motion";
import { SpiderChart } from "@/components/dashboard/SpiderChart";
import { ScoreIndicator } from "@/components/dashboard/ScoreIndicator";
import { RoboCISOInsight } from "@/components/dashboard/RoboCISOInsight";
import { 
  ShieldCheck, 
  Target, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

const spiderData = [
  { name: "Seguranca de Rede", value: 70 },
  { name: "Criptografia", value: 45 },
  { name: "Gestao Vulnerabilidades", value: 60 },
  { name: "Seguranca de E-mail", value: 85 },
  { name: "Controle de Acesso", value: 90 },
  { name: "Monitoramento", value: 55 },
  { name: "Backup e Recup.", value: 100 },
  { name: "Politicas", value: 80 },
  { name: "Pessoas", value: 75 },
  { name: "Resp. Incidentes", value: 40 },
  { name: "Continuidade", value: 95 },
  { name: "Fornecedores", value: 65 },
  { name: "Desenv. Seguro", value: 50 },
  { name: "Compliance/Priv.", value: 88 },
  { name: "Seguranca Fisica", value: 100 },
];

const mockInsights = [
  {
    title: "Banco de Dados MySQL Exposto",
    description: "Detectamos que a porta 3306 do seu banco de dados está acessível publicamente na internet.",
    impact: "Critico. E equivalente a deixar a porta do cofre da empresa aberta na calcada. Atacantes podem tentar forca bruta para acessar seus dados sensiveis.",
    remediation: "Feche a porta 3306 no seu firewall/Security Group e utilize uma VPN ou SSH Tunnel para acesso administrativo.",
  },
  {
    title: "Certificado Self-Signed Detectado",
    description: "O servidor esta usando um certificado SSL assinado por ele mesmo em vez de uma autoridade confiavel.",
    impact: "Alto. Navegadores exibirao avisos de seguranca para os usuarios. Indica falta de maturidade em gestao de infraestrutura.",
    remediation: "Substitua o certificado por um emitido por uma CA confiavel (ex: Let's Encrypt).",
  },
];

const dashboardStats = [
  { label: "Score Tecnico", value: 750, trend: "up", percentage: "+12%" },
  { label: "Score Compliance", value: 838, trend: "down", percentage: "-2%" },
  { label: "Fator Confianca", value: "0.85", trend: "up", percentage: "+5%" },
];

export default function CISOPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8"
    >
      {/* Header with quick stats */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel Cyber Postura</h1>
          </div>
          <p className="mt-1 text-muted">Acompanhe sua pontuação e insights inteligentes do Robo-CISO.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
            Novo Scan Externo
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Score and Spider Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Main Score */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ScoreIndicator score={785} category="B" />
          
          <div className="rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary font-semibold mb-4 text-xs uppercase tracking-widest">
              <Target className="h-4 w-4" />
              Metricas de Peso
            </div>
            <div className="space-y-4">
              {dashboardStats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-muted">{stat.label}</span>
                  <div className="text-right">
                    <p className="text-lg font-bold">{stat.value}</p>
                    <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.percentage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Spider Chart */}
        <div className="lg:col-span-8 h-full">
          <SpiderChart data={spiderData} />
        </div>
      </div>

      {/* Robo-CISO Insights Section */}
      <section className="mt-8">
        <RoboCISOInsight insights={mockInsights} />
      </section>

      {/* Action Footer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/grc/questionarios" className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm hover:border-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Questionarios</h3>
              <p className="text-sm text-muted">Aumente seu score de compliance</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <Link href="/trust/center" className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm hover:border-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Trust Center</h3>
              <p className="text-sm text-muted">Compartilhe sua postura com clientes</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
