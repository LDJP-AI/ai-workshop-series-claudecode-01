import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
