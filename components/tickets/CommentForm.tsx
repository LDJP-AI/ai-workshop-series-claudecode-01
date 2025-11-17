'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Button from '@/components/ui/Button';
import { addComment } from '@/lib/actions/tickets';

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
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="comment-content" className="mb-2 block text-sm font-medium text-gray-700">
          コメントを追加
        </label>
        <textarea
          id="comment-content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力してください..."
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">{content.length} 文字</p>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
