import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card
      className={cn(
        "rounded-2xl shadow-lg transition-shadow duration-300 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white",
        "hover:scale-[1.03]",
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
  );
}