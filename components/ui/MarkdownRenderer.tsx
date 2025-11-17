/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = 'text-gray-700' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ node, ...props }: any) => (
            <h1 className="mt-6 mb-3 text-2xl font-bold" {...props} />
          ),
          h2: ({ node, ...props }: any) => (
            <h2 className="mt-5 mb-2 text-xl font-bold" {...props} />
          ),
          h3: ({ node, ...props }: any) => (
            <h3 className="mt-4 mb-2 text-lg font-bold" {...props} />
          ),
          h4: ({ node, ...props }: any) => (
            <h4 className="mt-3 mb-2 text-base font-bold" {...props} />
          ),
          h5: ({ node, ...props }: any) => (
            <h5 className="mt-2 mb-1 text-sm font-bold" {...props} />
          ),
          h6: ({ node, ...props }: any) => (
            <h6 className="mt-2 mb-1 text-sm font-bold text-gray-600" {...props} />
          ),
          p: ({ node, ...props }: any) => <p className="mb-3 leading-relaxed" {...props} />,
          ul: ({ node, ...props }: any) => (
            <ul className="mb-3 list-inside list-disc space-y-1" {...props} />
          ),
          ol: ({ node, ...props }: any) => (
            <ol className="mb-3 list-inside list-decimal space-y-1" {...props} />
          ),
          li: ({ node, ...props }: any) => <li className="ml-2" {...props} />,
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-red-600"
                  {...props}
                />
              );
            }
            return (
              <code
                className="rounded bg-gray-100 px-3 py-2 font-mono text-sm text-gray-800"
                {...props}
              />
            );
          },
          pre: ({ node, ...props }: any) => (
            <pre
              className="mb-3 overflow-x-auto rounded border border-gray-200 bg-gray-100 p-4"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }: any) => (
            <blockquote
              className="my-3 border-l-4 border-gray-300 pl-4 text-gray-600 italic"
              {...props}
            />
          ),
          a: ({ node, ...props }: any) => (
            <a
              className="text-blue-500 hover:text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          img: ({ node, ...props }: any) => (
            <img className="my-3 h-auto max-w-full rounded" alt="Markdown content" {...props} />
          ),
          table: ({ node, ...props }: any) => (
            <table className="mb-3 w-full border-collapse border border-gray-300" {...props} />
          ),
          thead: ({ node, ...props }: any) => <thead className="bg-gray-100" {...props} />,
          th: ({ node, ...props }: any) => (
            <th className="border border-gray-300 px-3 py-2 text-left font-bold" {...props} />
          ),
          td: ({ node, ...props }: any) => (
            <td className="border border-gray-300 px-3 py-2" {...props} />
          ),
          hr: ({ node, ...props }: any) => <hr className="my-4 border-gray-300" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
