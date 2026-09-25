'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'liturgical' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, icon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-xs active:scale-[0.99]',
      secondary: 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)]/50 border border-[var(--dash-border)] active:scale-[0.99]',
      outline: 'border border-[var(--dash-border)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] active:scale-[0.99]',
      ghost: 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)]',
      liturgical: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-[0.99]',
      destructive: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.99]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
