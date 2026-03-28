import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  isLoading, 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-cura-primary hover:bg-cura-primary-dark text-white ring-teal-500/20 shadow-teal-500/10',
    outline: 'border-2 border-cura-primary/20 text-cura-primary hover:bg-cura-primary/5 ring-teal-500/10',
    ghost: 'text-cura-text-soft hover:bg-cura-bg hover:text-cura-primary',
    danger: 'bg-red-500 hover:bg-red-600 text-white ring-red-500/20',
    secondary: 'bg-cura-secondary text-white hover:opacity-90 ring-sky-500/20'
  };

  return (
    <button
      className={cn(
        'px-6 py-3 rounded-2xl font-semibold transition-all duration-250 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden ring-4',
        variants[variant],
        isLoading && 'text-transparent pointer-events-none',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className, 
  ...props 
}) => {
  return (
    <div className="w-full space-y-2 group">
      {label && (
        <label className="block text-sm font-semibold text-cura-text-soft transition-colors group-focus-within:text-cura-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-cura-text-soft transition-colors group-focus-within:text-cura-primary">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-white border border-cura-border rounded-2xl px-4 py-3.5 transition-all duration-300 text-cura-text-main placeholder:text-slate-400 focus:border-cura-primary focus:ring-4 focus:ring-cura-primary/5',
            icon && 'pl-11',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/5',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500 font-medium px-2">{error}</p>}
    </div>
  );
};
