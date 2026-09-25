import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Church, CheckCircle2, AlertCircle } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'matriz' | 'ceb' | 'active' | 'inactive' | 'urgent' | 'outline';
  icon?: React.ReactNode;
}

export function Badge({ className, variant = 'default', icon, children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 font-semibold text-xs transition-colors select-none';

  const variants = {
    default: 'px-2.5 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)]',
    matriz: 'px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold uppercase tracking-wide',
    ceb: 'px-2.5 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)]',
    active: 'px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    inactive: 'px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20',
    urgent: 'px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20',
    outline: 'px-2.5 py-0.5 rounded-md border border-[var(--dash-border)] text-[var(--dash-text-secondary)]',
  };

  const defaultIcons = {
    matriz: <ShieldCheck className="w-3.5 h-3.5" />,
    ceb: <Church className="w-3 h-3" />,
    active: <CheckCircle2 className="w-3.5 h-3.5" />,
    inactive: null,
    urgent: <AlertCircle className="w-3.5 h-3.5" />,
    default: null,
    outline: null,
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {icon || defaultIcons[variant]}
      {children}
    </span>
  );
}
