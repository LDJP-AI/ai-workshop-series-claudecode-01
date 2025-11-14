'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { addComment } from '@/lib/actions/tickets';
import Button from '@/components/ui/Button';

interface CommentFormProps {
  ticketId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'コメント中...' : 'コメントを追加'}
    </Button>
  );
}

export default function CommentForm({ ticketId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const result = await addComment(ticketId, content);

    if (result.error) {
      setError(result.error);
    } else {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-2">
          コメントを追加
        </label>
        <textarea
          id="comment-content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力してください..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.length} 文字
        </p>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
