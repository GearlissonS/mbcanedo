import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface NotificationToastProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export function showNotificationToast({
  title,
  description,
  type = 'info',
  duration = 4000
}: NotificationToastProps) {
  const Icon = icons[type];
  const colorClass = colors[type];

  toast(title, {
    description,
    duration,
    icon: <Icon className={`h-4 w-4 ${colorClass}`} />,
    className: 'border-l-4 border-l-current',
  });
}

// Funções de conveniência
export const showSuccess = (title: string, description?: string) => 
  showNotificationToast({ title, description, type: 'success' });

export const showError = (title: string, description?: string) => 
  showNotificationToast({ title, description, type: 'error' });

export const showWarning = (title: string, description?: string) => 
  showNotificationToast({ title, description, type: 'warning' });

export const showInfo = (title: string, description?: string) => 
  showNotificationToast({ title, description, type: 'info' });






