import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, className }: KPICardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #0A1B4D55" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Card
        className={cn(
          "rounded-2xl shadow-lg transition-shadow duration-300 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white",
          className
        )}
        style={{ fontFamily: 'Inter, Poppins, sans-serif' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Icon className="h-10 w-10 text-white drop-shadow-lg" />
            <CardTitle className="text-base font-semibold text-white">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold leading-tight">{value}</div>
          {subtitle && <p className="text-xs text-white/80 mt-1 font-medium">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-semibold flex items-center",
                trend.value > 0 ? "text-green-200" : trend.value < 0 ? "text-red-200" : "text-white/80"
              )}>
                {trend.value > 0 ? "↗" : trend.value < 0 ? "↘" : "→"} {Math.abs(trend.value)}% {trend.label}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}