<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveStatsProps {
  currentValue: number;
  previousValue: number;
  title: string;
  format?: (value: number) => string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function LiveStats({
  currentValue,
  previousValue,
  title,
  format = (value) => value.toLocaleString('pt-BR'),
  trend,
  className
}: LiveStatsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const percentageChange = previousValue > 0 
    ? ((currentValue - previousValue) / previousValue) * 100 
    : 0;

  const getTrendIcon = () => {
    if (percentageChange > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentageChange < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (percentageChange > 0) return 'text-green-600';
    if (percentageChange < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={cn("transition-all duration-500", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {format(currentValue)}
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs período anterior
              </span>
            </div>
          </div>
          <Badge 
            variant={percentageChange > 0 ? 'default' : percentageChange < 0 ? 'destructive' : 'secondary'}
            className="ml-auto"
          >
            {trend || (percentageChange > 0 ? 'Crescimento' : percentageChange < 0 ? 'Queda' : 'Estável')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

=======
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveStatsProps {
  currentValue: number;
  previousValue: number;
  title: string;
  format?: (value: number) => string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function LiveStats({
  currentValue,
  previousValue,
  title,
  format = (value) => value.toLocaleString('pt-BR'),
  trend,
  className
}: LiveStatsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const percentageChange = previousValue > 0 
    ? ((currentValue - previousValue) / previousValue) * 100 
    : 0;

  const getTrendIcon = () => {
    if (percentageChange > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentageChange < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (percentageChange > 0) return 'text-green-600';
    if (percentageChange < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={cn("transition-all duration-500", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {format(currentValue)}
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs período anterior
              </span>
            </div>
          </div>
          <Badge 
            variant={percentageChange > 0 ? 'default' : percentageChange < 0 ? 'destructive' : 'secondary'}
            className="ml-auto"
          >
            {trend || (percentageChange > 0 ? 'Crescimento' : percentageChange < 0 ? 'Queda' : 'Estável')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

>>>>>>> ff023fd6 (fix: integração Lovable, Vite, Tailwind e PostCSS)
