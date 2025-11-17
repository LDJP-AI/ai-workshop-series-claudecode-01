import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        className={`resize-vertical w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          error ? 'border-red-500' : ''
        } ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
