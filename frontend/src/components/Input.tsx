import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 glass-input ${
              icon ? 'pl-10' : ''
            } ${
              error ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 glass-input min-h-[120px] resize-y ${
            error ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
